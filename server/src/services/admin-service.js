import { db } from '../db/database.js';
import { normalizeName } from '../matching/normalizer.js';
import fs from 'fs';
import path from 'path';

/**
 * Admin Service: stats aggregation, CSV dataset parsing and validation
 */

export function getAdminDashboardStats() {
  const stats = db.getStats();
  const searchHistory = db.getSearchHistory();

  return {
    ...stats,
    recentSearches: searchHistory.slice(0, 8),
    systemStatus: {
      ocrEngine: 'Tesseract.js Ready',
      matchingEngine: 'Fuzzy Rapid-TokenScorer Active',
      dataAdapters: ['RBI DEA Fund', 'IEPF Authority', 'EPFO Provident Fund'],
      environment: process.env.NODE_ENV || 'development'
    }
  };
}

export function importCsvRecords(csvString, source = 'RBI_UDGAM') {
  if (!csvString || typeof csvString !== 'string') {
    throw new Error('CSV content must be non-empty string');
  }

  const lines = csvString.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row');
  }

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  const parsedRecords = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (rawCols.length < 2) continue;

    const rowObj = {};
    header.forEach((colName, idx) => {
      rowObj[colName] = rawCols[idx] || '';
    });

    const holderName = rowObj.holdername || rowObj.name || rowObj.account_holder || 'Unknown';
    const norm = normalizeName(holderName);

    const record = {
      id: rowObj.id || `IMPORT-${source.substring(0, 3)}-${Date.now()}-${i}`,
      source: rowObj.source || source,
      holderName,
      normalizedName: norm.canonical,
      alternateNames: rowObj.alternatenames ? rowObj.alternatenames.split(';').map((s) => s.trim()) : [],
      institution: rowObj.institution || rowObj.bank || rowObj.company || 'Financial Institution',
      assetType: rowObj.assettype || 'Unclaimed Financial Asset',
      approximateYear: parseInt(rowObj.approximateyear || rowObj.year, 10) || new Date().getFullYear(),
      location: rowObj.location || rowObj.city || 'India',
      amount: parseFloat(rowObj.amount) || 0,
      status: rowObj.status || 'Unclaimed',
      sourceReference: rowObj.sourcereference || `IMPORT-REF-${Date.now()}-${i}`,
      claimAuthority: rowObj.claimauthority || 'Official Regulatory Authority',
      isDemo: false,
      datasetLabel: 'Imported Dataset'
    };

    parsedRecords.push(record);
  }

  if (parsedRecords.length === 0) {
    throw new Error('No valid records could be parsed from the CSV');
  }

  db.insertRecords(parsedRecords);

  return {
    success: true,
    recordsImported: parsedRecords.length,
    sampleRecord: parsedRecords[0]
  };
}
