import express from 'express';
import multer from 'multer';
import { executeSearch } from '../services/search-service.js';
import { extractEntitiesFromQuery } from '../nlp/query-extractor.js';
import { processDocumentBuffer, SAMPLE_DOCUMENTS } from '../ocr/ocr-service.js';
import { generateClaimGuidance } from '../services/claim-guidance-service.js';
import { getAdminDashboardStats, importCsvRecords } from '../services/admin-service.js';
import { getSourcesInfo } from '../data-sources/index.js';
import { db } from '../db/database.js';
import { maskRecordForPublicDisplay } from '../utils/masker.js';

const router = express.Router();

// Configure Multer for memory storage (documents are NOT permanently persisted)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * System Health Endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'DhanKhoj Recovery Assistant API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Natural Language Query Entity Extractor
 */
router.post('/extract-query', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text query is required' });
    }
    const extracted = extractEntitiesFromQuery(text);
    res.json({ success: true, extracted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Multi-Source Fuzzy Search
 */
router.post('/search', async (req, res) => {
  try {
    const results = await executeSearch(req.body);
    res.json(results);
  } catch (err) {
    console.error('Search API error:', err);
    res.status(500).json({ error: 'Search processing failed: ' + err.message });
  }
});

/**
 * OCR Document Upload Processing
 */
router.post('/ocr', upload.single('document'), async (req, res) => {
  try {
    // If user selected a sample document preset
    if (req.body.sampleId) {
      const sample = SAMPLE_DOCUMENTS.find((s) => s.id === req.body.sampleId);
      if (sample) {
        return res.json({
          success: true,
          isSample: true,
          sampleTitle: sample.title,
          confidence: sample.mockExtracted.confidence,
          extracted: sample.mockExtracted,
          rawText: `[Sample Document OCR Extracted Text: ${sample.title}]`
        });
      }
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image or PDF document, or choose a sample' });
    }

    const ocrResult = await processDocumentBuffer(req.file.buffer, req.file.mimetype);
    res.json(ocrResult);
  } catch (err) {
    console.error('OCR API error:', err);
    res.status(500).json({ error: 'OCR processing failed: ' + err.message });
  }
});

/**
 * Get Available Sample Documents for quick testing
 */
router.get('/ocr/samples', (req, res) => {
  res.json({ samples: SAMPLE_DOCUMENTS });
});

/**
 * Get Single Result Details
 */
router.get('/results/:id', (req, res) => {
  const record = db.getRecordById(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }
  const masked = maskRecordForPublicDisplay(record);
  res.json({ record: masked });
});

/**
 * Get Data Sources Info
 */
router.get('/sources', (req, res) => {
  const sources = getSourcesInfo();
  res.json({ sources });
});

/**
 * Get Step-by-Step Claim Guidance and Dynamic Checklist
 */
router.get('/guidance/:id', (req, res) => {
  const record = db.getRecordById(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }
  const relation = req.query.relation || 'myself';
  const isDeceased = req.query.isDeceased === 'true';

  const guidance = generateClaimGuidance(record, relation, isDeceased);
  res.json({ guidance });
});

/**
 * Search History APIs
 */
router.get('/history', (req, res) => {
  const history = db.getSearchHistory();
  res.json({ history });
});

router.delete('/history', (req, res) => {
  db.clearSearchHistory();
  res.json({ success: true, message: 'Search history cleared' });
});

/**
 * Admin Dashboard Stats
 */
router.get('/admin/stats', (req, res) => {
  try {
    const stats = getAdminDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin CSV Dataset Import
 */
router.post('/admin/import', express.text({ type: ['text/csv', 'text/plain'], limit: '5mb' }), (req, res) => {
  try {
    const source = req.query.source || 'RBI_UDGAM';
    const csvContent = typeof req.body === 'string' ? req.body : req.body.csv;
    if (!csvContent) {
      return res.status(400).json({ error: 'CSV data string required in request body' });
    }
    const result = importCsvRecords(csvContent, source);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Admin Reset Demo Data
 */
router.post('/admin/reset-demo', (req, res) => {
  db.seedFromDemo();
  res.json({ success: true, message: 'Database reset to demo datasets' });
});

export default router;
