/**
 * Base Data Source Adapter
 * Standard contract for Indian unclaimed asset authorities (RBI, IEPF, EPFO, etc.)
 */

export class BaseDataSourceAdapter {
  constructor(sourceId, name, authority) {
    this.sourceId = sourceId;
    this.name = name;
    this.authority = authority;
  }

  getSourceInfo() {
    return {
      id: this.sourceId,
      name: this.name,
      authority: this.authority,
      status: 'ACTIVE_DEMO',
      disclaimer: 'Demonstration dataset. Not an official live government API feed.',
      officialPortalUrl: this.getPortalUrl()
    };
  }

  getPortalUrl() {
    return 'https://rbi.org.in';
  }

  /**
   * Search adapter records based on criteria
   * @param {Object} criteria
   * @param {Array} records - Records from database
   */
  search(criteria, records = []) {
    throw new Error('search() method must be implemented by concrete adapter');
  }

  /**
   * Normalizes an individual record into the canonical DhanKhoj record model
   */
  normalize(rawRecord) {
    return {
      id: rawRecord.id,
      source: this.sourceId,
      holderName: rawRecord.holderName || rawRecord.name || '',
      normalizedName: rawRecord.normalizedName || '',
      alternateNames: rawRecord.alternateNames || [],
      institution: rawRecord.institution || rawRecord.bank || '',
      assetType: rawRecord.assetType || 'Unclaimed Financial Asset',
      approximateYear: rawRecord.approximateYear || rawRecord.year || null,
      location: rawRecord.location || '',
      amount: rawRecord.amount || 0,
      status: rawRecord.status || 'Unclaimed',
      sourceReference: rawRecord.sourceReference || 'REF-N/A',
      claimAuthority: this.authority,
      isDemo: true,
      datasetLabel: 'Demo Dataset — Not Government Records'
    };
  }
}
