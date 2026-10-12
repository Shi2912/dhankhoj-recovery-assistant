import { BaseDataSourceAdapter } from './base-adapter.js';

export class EpfoDataSourceAdapter extends BaseDataSourceAdapter {
  constructor() {
    super(
      'EPFO',
      'EPFO Inoperative Accounts Desk',
      "Employees' Provident Fund Organisation / Ministry of Labour & Employment"
    );
  }

  getPortalUrl() {
    return 'https://www.epfindia.gov.in';
  }

  search(criteria, records = []) {
    return records.filter((r) => {
      const isEpfo = r.source === 'EPFO' ||
        (r.assetType && (r.assetType.includes('Provident') || r.assetType.includes('PF')));
      return isEpfo;
    });
  }

  normalize(rawRecord) {
    const base = super.normalize(rawRecord);
    return {
      ...base,
      establishmentName: rawRecord.establishmentName || 'Registered Establishment',
      pfNumber: rawRecord.pfNumber || 'PF-****'
    };
  }
}
