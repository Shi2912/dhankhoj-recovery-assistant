/**
 * Privacy & Security Masker
 * Ensures sensitive financial identifiers are masked in responses
 */

export function maskIdentifier(idStr) {
  if (!idStr || typeof idStr !== 'string') return '****';
  const clean = idStr.trim();
  if (clean.length <= 4) return '****';
  const lastFour = clean.slice(-4);
  return `****-****-${lastFour}`;
}

export function maskRecordForPublicDisplay(record) {
  if (!record) return null;
  const clone = { ...record };

  if (clone.accountNumber) {
    clone.accountNumber = maskIdentifier(clone.accountNumber);
  }
  if (clone.folioNumber && !clone.folioNumber.includes('*')) {
    clone.folioNumber = maskIdentifier(clone.folioNumber);
  }
  if (clone.pfNumber && !clone.pfNumber.includes('*')) {
    clone.pfNumber = maskIdentifier(clone.pfNumber);
  }
  if (clone.sourceReference && clone.sourceReference.length > 8) {
    const parts = clone.sourceReference.split('/');
    if (parts.length > 2) {
      parts[parts.length - 1] = '****' + parts[parts.length - 1].slice(-3);
      clone.sourceReference = parts.join('/');
    }
  }

  return clone;
}
