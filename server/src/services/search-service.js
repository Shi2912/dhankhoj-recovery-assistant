import { db } from '../db/database.js';
import { searchAllSources } from '../data-sources/index.js';
import { scoreMatch } from '../matching/scorer.js';
import { extractEntitiesFromQuery } from '../nlp/query-extractor.js';
import { maskRecordForPublicDisplay } from '../utils/masker.js';

export async function executeSearch(params) {
  const startTime = Date.now();

  let query = { ...params };

  // If conversational query text is provided without explicit name, extract entities
  if (query.rawQuery && !query.name) {
    const extracted = extractEntitiesFromQuery(query.rawQuery);
    query = {
      ...query,
      ...extracted,
      name: extracted.name || query.rawQuery
    };
  }

  const allRecords = db.getAllRecords();

  // 1. Filter candidates through data-source adapters
  const candidatePool = searchAllSources(query, allRecords);

  // 2. Score candidates using fuzzy matching engine
  const scoredResults = [];

  for (const record of candidatePool) {
    const matchAnalysis = scoreMatch(query, record);

    // Keep candidate if score is above weak threshold or if explicitly filtered
    if (matchAnalysis.score >= 35) {
      const publicRecord = maskRecordForPublicDisplay(record);
      scoredResults.push({
        ...publicRecord,
        matchAnalysis,
        confidenceScore: matchAnalysis.score,
        confidenceTier: matchAnalysis.tier,
        confidenceLabel: matchAnalysis.tierLabel,
        badgeClass: matchAnalysis.badgeClass
      });
    }
  }

  // 3. Sort descending by confidence score
  scoredResults.sort((a, b) => b.confidenceScore - a.confidenceScore);

  const durationMs = Date.now() - startTime;
  const highestScore = scoredResults.length > 0 ? scoredResults[0].confidenceScore : 0;

  // 4. Save to local search history
  if (query.name || query.rawQuery) {
    db.saveSearchHistory({
      queryName: query.name || query.rawQuery || 'Custom Search',
      criteria: {
        name: query.name,
        bank: query.bank || query.institution,
        year: query.approximateYear || query.year,
        location: query.location,
        assetType: query.assetType,
        relation: query.relation
      },
      matchesCount: scoredResults.length,
      highestScore,
      searchMode: query.mode || 'text',
      durationMs
    });
  }

  return {
    query,
    totalRecordsSearched: allRecords.length,
    matchesFound: scoredResults.length,
    highestConfidenceScore: highestScore,
    durationMs,
    results: scoredResults,
    isDemoDataset: true,
    datasetLabel: 'Demo Dataset — Not Government Records'
  };
}
