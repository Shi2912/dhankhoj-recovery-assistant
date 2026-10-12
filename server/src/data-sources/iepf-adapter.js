import { BaseDataSourceAdapter } from './base-adapter.js';

export class IepfDataSourceAdapter extends BaseDataSourceAdapter {
  constructor() {
    super(
      'IEPF',
      'IEPF Authority (Shares & Dividends)',
      'Investor Education and Protection Fund Authority / Ministry of Corporate Affairs'
    );
  }

  getPortalUrl() {
    return 'https://www.iepf.gov.in';
  }

  search(criteria, records = []) {
    return records.filter((r) => {
      const isIepf = r.source === 'IEPF' ||
        (r.assetType && (r.assetType.includes('Dividend') || r.assetType.includes('Shares')));
      return isIepf;
    });
  }

  normalize(rawRecord) {
    const base = super.normalize(rawRecord);
    return {
      ...base,
      sharesCount: rawRecord.sharesCount || null,
      folioNumber: rawRecord.folioNumber || 'FOLIO-****'
    };
  }
}
