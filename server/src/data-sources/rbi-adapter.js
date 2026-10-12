import { BaseDataSourceAdapter } from './base-adapter.js';

export class RbiDataSourceAdapter extends BaseDataSourceAdapter {
  constructor() {
    super(
      'RBI_UDGAM',
      'RBI UDGAM Portal (DEA Fund)',
      'Reserve Bank of India / Depositor Education and Awareness Fund'
    );
  }

  getPortalUrl() {
    return 'https://udgam.rbi.org.in';
  }

  search(criteria, records = []) {
    return records.filter((r) => {
      const isRbi = r.source === 'RBI_UDGAM' || (r.assetType && r.assetType.includes('Deposit'));
      return isRbi;
    });
  }

  normalize(rawRecord) {
    const base = super.normalize(rawRecord);
    return {
      ...base,
      assetType: 'Unclaimed Bank Deposit',
      branch: rawRecord.branch || 'Main Branch',
      accountType: rawRecord.accountType || 'Savings Bank Account'
    };
  }
}
