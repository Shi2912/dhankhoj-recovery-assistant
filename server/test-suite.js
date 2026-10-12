import { executeSearch } from './src/services/search-service.js';
import { extractEntitiesFromQuery } from './src/nlp/query-extractor.js';
import { SAMPLE_DOCUMENTS } from './src/ocr/ocr-service.js';
import { generateClaimGuidance } from './src/services/claim-guidance-service.js';
import { getAdminDashboardStats, importCsvRecords } from './src/services/admin-service.js';
import { db } from './src/db/database.js';

console.log('--- STARTING DHANKHOJ VERIFICATION TEST SUITE ---');

// Test 1: Database records & stats
console.log('\n[TEST 1] Database Initialization & Seeding');
const stats = db.getStats();
console.log(`✓ Records loaded: ${stats.totalRecords}`);
console.log(`✓ Demo Dataset Flag: ${stats.isDemoData}`);
if (stats.totalRecords < 15) throw new Error('Expected at least 15 demo records');

// Test 2: NLP Entity Extractor
console.log('\n[TEST 2] Conversational NLP Entity Extraction');
const queryText = 'My grandfather Mohammed Iqbal had an SBI account around 1998 in Chennai.';
const extracted = extractEntitiesFromQuery(queryText);
console.log('✓ Extracted Name:', extracted.name);
console.log('✓ Extracted Bank:', extracted.bank);
console.log('✓ Extracted Year:', extracted.approximate_year);
console.log('✓ Extracted Location:', extracted.location);
console.log('✓ Extracted Relation:', extracted.relation);
if (!extracted.name.includes('Iqbal')) throw new Error('Name extraction failed');
if (extracted.approximate_year !== '1998') throw new Error('Year extraction failed');

// Test 3: Fuzzy Matching & Ranking Engine
console.log('\n[TEST 3] Multi-Source Fuzzy Search & Rapid-TokenScorer');
const searchResult = await executeSearch({
  name: 'Mohammed Iqbal',
  bank: 'SBI',
  approximateYear: '1998',
  location: 'Chennai'
});
console.log(`✓ Matches found: ${searchResult.matchesFound}`);
console.log(`✓ Highest confidence: ${searchResult.highestConfidenceScore}%`);
const topMatch = searchResult.results[0];
console.log(`✓ Top Match Holder: "${topMatch.holderName}", Bank: "${topMatch.institution}", Score: ${topMatch.confidenceScore}% (${topMatch.confidenceLabel})`);
console.log('✓ Reasons:', topMatch.matchAnalysis.reasons.join(' | '));
if (topMatch.confidenceScore < 85) throw new Error('Top match score lower than expected for close match');

// Test 4: Spelling Variation / Initials Matching
console.log('\n[TEST 4] Indian Name Variant & Initials Matching');
const variantResult = await executeSearch({
  name: 'S.K. Sharma',
  bank: 'PNB',
  approximateYear: '1995',
  location: 'Delhi'
});
console.log(`✓ S.K. Sharma Matches found: ${variantResult.matchesFound}`);
const sharmaTop = variantResult.results[0];
console.log(`✓ Matched against: "${sharmaTop.holderName}", Score: ${sharmaTop.confidenceScore}% (${sharmaTop.confidenceLabel})`);
if (!variantResult.results.some(r => r.holderName.includes('Suresh Kumar Sharma') || r.holderName.includes('S.K. Sharma'))) {
  throw new Error('S.K. Sharma failed to match Suresh Kumar Sharma record');
}

// Test 5: OCR Sample Documents
console.log('\n[TEST 5] OCR Document Presets');
console.log(`✓ Available Sample Presets: ${SAMPLE_DOCUMENTS.length}`);
SAMPLE_DOCUMENTS.forEach(s => {
  console.log(`  - ${s.title}: Holder "${s.mockExtracted.name}", Bank "${s.mockExtracted.bank}"`);
});

// Test 6: Dynamic Claim Guidance & Deceased Legal Heir Checklist
console.log('\n[TEST 6] Claim Guidance Roadmap & Legal Heir Checklist');
const testRec = db.getRecordById('RBI-DEP-00101');
const guidance = generateClaimGuidance(testRec, 'grandparent', true);
console.log(`✓ Guidance Steps: ${guidance.steps.length}`);
console.log(`✓ Standard KYC Docs: ${guidance.checklists.standardKyc.length}`);
console.log(`✓ Legal Heir Docs: ${guidance.checklists.legalHeirSpecific.length}`);
if (guidance.checklists.legalHeirSpecific.length === 0) {
  throw new Error('Legal heir checklist missing for deceased relation');
}

// Test 7: CSV Dataset Import & Normalization
console.log('\n[TEST 7] Admin CSV Dataset Ingestion');
const testCsv = `name,institution,assetType,approximateYear,location,amount,claimAuthority
Arun Kumar Gupta,State Bank of India,Unclaimed Bank Deposit,2001,Varanasi,45000,Reserve Bank of India / SBI`;
const importRes = importCsvRecords(testCsv, 'RBI_UDGAM');
console.log(`✓ Records Imported: ${importRes.recordsImported}`);
const afterImportStats = db.getStats();
console.log(`✓ Total Records now: ${afterImportStats.totalRecords}`);

console.log('\n--- ALL TEST SUITE ASSERTIONS PASSED PERFECTLY! ---');
