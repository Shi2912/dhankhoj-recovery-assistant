import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.records = [];
    this.history = [];
    this.auditLogs = [];
    this.isLoaded = false;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.records = data.records || [];
        this.history = data.history || [];
        this.auditLogs = data.auditLogs || [];
      } else {
        this.seedFromDemo();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to load database file, reseeding from demo:', err);
      this.seedFromDemo();
    }
  }

  seedFromDemo() {
    const demoDir = path.join(DATA_DIR, 'demo');
    const records = [];

    const files = [
      'rbi_unclaimed_deposits.json',
      'iepf_unclaimed_shares.json',
      'epfo_unclaimed_pf.json',
    ];

    for (const file of files) {
      const filePath = path.join(demoDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          if (Array.isArray(content)) {
            records.push(...content);
          }
        } catch (e) {
          console.error(`Error reading demo file ${file}:`, e);
        }
      }
    }

    this.records = records;
    this.history = [
      {
        id: 'hist-demo-001',
        searchedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        queryName: 'Mohammed Iqbal',
        criteria: {
          name: 'Mohammed Iqbal',
          bank: 'State Bank of India',
          location: 'Chennai',
          year: '1998'
        },
        matchesCount: 4,
        highestScore: 88,
        searchMode: 'text'
      }
    ];
    this.auditLogs = [
      {
        id: 'log-001',
        timestamp: new Date().toISOString(),
        action: 'DATABASE_INITIALIZED',
        details: `Loaded ${records.length} demo records across RBI, IEPF, EPFO`
      }
    ];

    this.persist();
  }

  persist() {
    try {
      const data = {
        records: this.records,
        history: this.history,
        auditLogs: this.auditLogs,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  getAllRecords() {
    return [...this.records];
  }

  getRecordById(id) {
    return this.records.find((r) => r.id === id) || null;
  }

  getRecordsBySource(source) {
    if (!source) return this.getAllRecords();
    return this.records.filter((r) => r.source.toLowerCase() === source.toLowerCase());
  }

  insertRecord(record) {
    this.records.push(record);
    this.persist();
    return record;
  }

  insertRecords(records) {
    this.records.push(...records);
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'DATASET_IMPORTED',
      details: `Imported ${records.length} new records`
    });
    this.persist();
    return records.length;
  }

  saveSearchHistory(item) {
    const entry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      searchedAt: new Date().toISOString(),
      ...item
    };
    this.history.unshift(entry);
    if (this.history.length > 50) this.history.pop();
    this.persist();
    return entry;
  }

  getSearchHistory() {
    return [...this.history];
  }

  clearSearchHistory() {
    this.history = [];
    this.persist();
    return true;
  }

  getStats() {
    const sources = {};
    const assetTypes = {};
    let totalAmount = 0;

    for (const r of this.records) {
      sources[r.source] = (sources[r.source] || 0) + 1;
      assetTypes[r.assetType] = (assetTypes[r.assetType] || 0) + 1;
      totalAmount += Number(r.amount) || 0;
    }

    const totalSearches = this.history.length;
    const avgScore = totalSearches > 0
      ? Math.round(this.history.reduce((acc, h) => acc + (h.highestScore || 0), 0) / totalSearches)
      : 0;

    return {
      totalRecords: this.records.length,
      isDemoData: true,
      datasetLabel: 'Demo Dataset — Not Government Records',
      sources,
      assetTypes,
      totalAmount,
      totalSearches,
      avgConfidenceScore: avgScore,
      auditLogs: this.auditLogs.slice(0, 10),
      lastUpdated: new Date().toISOString()
    };
  }
}

export const db = new Database();
