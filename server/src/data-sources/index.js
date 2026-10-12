import { RbiDataSourceAdapter } from './rbi-adapter.js';
import { IepfDataSourceAdapter } from './iepf-adapter.js';
import { EpfoDataSourceAdapter } from './epfo-adapter.js';

export const adapters = {
  rbi: new RbiDataSourceAdapter(),
  iepf: new IepfDataSourceAdapter(),
  epfo: new EpfoDataSourceAdapter()
};

export function getAllAdapters() {
  return Object.values(adapters);
}

export function getSourcesInfo() {
  return Object.values(adapters).map((adapter) => adapter.getSourceInfo());
}

export function searchAllSources(criteria, allRecords = []) {
  const matchingRecords = [];
  const selectedSource = criteria.source ? criteria.source.toLowerCase() : null;

  for (const [key, adapter] of Object.entries(adapters)) {
    if (selectedSource && selectedSource !== 'all' && selectedSource !== key && selectedSource !== adapter.sourceId.toLowerCase()) {
      continue;
    }
    const found = adapter.search(criteria, allRecords);
    matchingRecords.push(...found.map((r) => adapter.normalize(r)));
  }

  // Deduplicate by record ID
  const seen = new Set();
  const deduped = [];
  for (const rec of matchingRecords) {
    if (!seen.has(rec.id)) {
      seen.add(rec.id);
      deduped.push(rec);
    }
  }

  return deduped;
}
