import { createWorker } from 'tesseract.js';
import fs from 'fs';
import path from 'path';

/**
 * Optical Character Recognition (OCR) Engine
 * Processes bank passbooks, PF slips, share certificates, and deposit receipts
 */

// Sample demo documents metadata for instant 1-click test scenarios
export const SAMPLE_DOCUMENTS = [
  {
    id: 'sample-sbi-passbook',
    title: 'Vintage SBI Savings Passbook (1998)',
    type: 'passbook',
    description: 'State Bank of India passbook for Mohammed Iqbal, George Town Branch, Chennai',
    mockExtracted: {
      name: 'Mohammed Iqbal',
      bank: 'State Bank of India',
      accountNumberMasked: 'SBIN-****-9821',
      approximateYear: '1998',
      location: 'Chennai',
      assetType: 'Unclaimed Bank Deposit',
      branch: 'George Town Branch',
      confidence: 96
    }
  },
  {
    id: 'sample-pnb-fd',
    title: 'PNB Fixed Deposit Receipt (1995)',
    type: 'fd_receipt',
    description: 'Punjab National Bank term deposit receipt for Suresh Kumar Sharma, New Delhi',
    mockExtracted: {
      name: 'Suresh Kumar Sharma',
      bank: 'Punjab National Bank',
      accountNumberMasked: 'PUNB-****-6540',
      approximateYear: '1995',
      location: 'Delhi',
      assetType: 'Unclaimed Bank Deposit',
      branch: 'Connaught Place Branch',
      confidence: 94
    }
  },
  {
    id: 'sample-iepf-dividend',
    title: 'Tata Motors Dividend Warrant (1999)',
    type: 'dividend_warrant',
    description: 'Physical dividend warrant voucher for Tata Motors Limited, Folio TML-7712',
    mockExtracted: {
      name: 'Mohammed Iqbal',
      company: 'Tata Motors Limited',
      bank: 'Tata Motors Limited',
      accountNumberMasked: 'FOLIO-****-7712',
      approximateYear: '1999',
      location: 'Mumbai',
      assetType: 'Unclaimed Dividend',
      branch: 'Registrar & Share Transfer Office',
      confidence: 92
    }
  },
  {
    id: 'sample-epfo-slip',
    title: 'EPFO Inoperative PF Account Slip (1998)',
    type: 'pf_slip',
    description: 'Annual PF slip issued by Regional PF Commissioner Chennai for Ashok Leyland Ltd',
    mockExtracted: {
      name: 'Mohammed Iqbal',
      company: "Employees' Provident Fund Organisation",
      bank: 'Ashok Leyland Limited',
      accountNumberMasked: 'TN/MAS/****/19283',
      approximateYear: '1998',
      location: 'Chennai',
      assetType: 'Provident Fund',
      branch: 'Regional Office Chennai',
      confidence: 91
    }
  }
];

export async function processDocumentBuffer(buffer, mimeType) {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const { data } = await worker.recognize(buffer);
    const rawText = data.text || '';

    const extracted = parseExtractedText(rawText);
    return {
      success: true,
      rawText,
      confidence: Math.round(data.confidence || 85),
      extracted
    };
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    // Graceful fallback with pattern heuristics
    return {
      success: false,
      error: 'OCR processing encountered an issue. You can manually enter or use a sample document.',
      extracted: {
        name: '',
        bank: '',
        accountNumberMasked: '',
        approximateYear: '',
        location: '',
        assetType: 'All'
      }
    };
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        // cleanup ignore
      }
    }
  }
}

/**
 * Parses raw OCR text into structured financial record fields
 */
export function parseExtractedText(rawText) {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const text = rawText.toLowerCase();

  let name = '';
  let bank = '';
  let accountNumber = '';
  let year = '';
  let location = '';
  let assetType = 'Unclaimed Bank Deposit';

  // Extract Year
  const yearMatch = text.match(/\b(19\d{2}|20[0-2]\d)\b/);
  if (yearMatch) {
    year = yearMatch[1];
  }

  // Extract Bank / Entity
  if (/state bank of india|sbi/i.test(text)) bank = 'State Bank of India';
  else if (/punjab national bank|pnb/i.test(text)) bank = 'Punjab National Bank';
  else if (/bank of baroda|bob/i.test(text)) bank = 'Bank of Baroda';
  else if (/canara bank/i.test(text)) bank = 'Canara Bank';
  else if (/indian bank/i.test(text)) bank = 'Indian Bank';
  else if (/tata motors/i.test(text)) bank = 'Tata Motors Limited';
  else if (/reliance/i.test(text)) bank = 'Reliance Industries Limited';
  else if (/itc/i.test(text)) bank = 'ITC Limited';
  else if (/provident fund|epfo/i.test(text)) {
    bank = "Employees' Provident Fund Organisation";
    assetType = 'Provident Fund';
  }

  // Extract Location
  const cities = ['chennai', 'delhi', 'mumbai', 'bengaluru', 'kolkata', 'hyderabad', 'pune', 'lucknow', 'gurugram'];
  for (const c of cities) {
    if (text.includes(c)) {
      location = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Extract Account / Folio / PF Number
  const accMatch = rawText.match(/(?:a\/c|acct|account|folio|pf\s*no)[\s.:#-]*([a-zA-Z0-9\/-]{5,20})/i);
  if (accMatch) {
    accountNumber = accMatch[1];
  }

  // Extract Name heuristic (lines with "Name:" or "Shri/Smt" or "A/c Holder")
  for (const line of lines) {
    const holderMatch = line.match(/(?:name|holder|shri|smt|mr|mrs)[\s.:]+([a-zA-Z\s]{4,30})/i);
    if (holderMatch) {
      name = holderMatch[1].trim();
      break;
    }
  }

  // Fallback name if still blank
  if (!name && lines.length > 0) {
    for (const l of lines) {
      if (/^[A-Za-z\s]{4,25}$/.test(l) && !/bank|branch|date|account|rupees|amount/i.test(l)) {
        name = l.trim();
        break;
      }
    }
  }

  // Determine Asset Type
  if (/dividend|shares|equity/i.test(text)) {
    assetType = /shares/i.test(text) ? 'Unclaimed Shares' : 'Unclaimed Dividend';
  } else if (/pf|provident|epf/i.test(text)) {
    assetType = 'Provident Fund';
  }

  // Mask account number
  let accountNumberMasked = '';
  if (accountNumber) {
    accountNumberMasked = accountNumber.length > 4
      ? `****${accountNumber.slice(-4)}`
      : '****-****';
  }

  return {
    name,
    bank,
    company: bank,
    accountNumberMasked,
    approximateYear: year,
    location,
    assetType
  };
}
