const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function searchAssets(criteria) {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Search request failed');
  }
  return res.json();
}

export async function extractQuery(text) {
  const res = await fetch(`${API_BASE}/extract-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Query extraction failed');
  }
  return res.json();
}

export async function processOcr(formData) {
  const res = await fetch(`${API_BASE}/ocr`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'OCR processing failed');
  }
  return res.json();
}

export async function getOcrSamples() {
  const res = await fetch(`${API_BASE}/ocr/samples`);
  if (!res.ok) throw new Error('Failed to fetch OCR samples');
  return res.json();
}

export async function getResultDetails(id) {
  const res = await fetch(`${API_BASE}/results/${id}`);
  if (!res.ok) throw new Error('Failed to fetch result details');
  return res.json();
}

export async function getClaimGuidance(id, relation = 'myself', isDeceased = false) {
  const url = `${API_BASE}/guidance/${id}?relation=${encodeURIComponent(relation)}&isDeceased=${isDeceased}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch claim guidance');
  return res.json();
}

export async function getSources() {
  const res = await fetch(`${API_BASE}/sources`);
  if (!res.ok) throw new Error('Failed to fetch sources');
  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function clearHistory() {
  const res = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear history');
  return res.json();
}

export async function getAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function importCsv(csvString, source = 'RBI_UDGAM') {
  const res = await fetch(`${API_BASE}/admin/import?source=${encodeURIComponent(source)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/csv' },
    body: csvString
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to import CSV');
  }
  return res.json();
}

export async function resetDemoData() {
  const res = await fetch(`${API_BASE}/admin/reset-demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset demo data');
  return res.json();
}
