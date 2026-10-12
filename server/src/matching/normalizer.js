/**
 * Indian Name and Text Normalizer
 * Designed specifically for Indian administrative and financial records
 */

const HONORIFICS = new Set([
  'shri', 'sri', 'smt', 'shrimati', 'srimati', 'late', 'mr', 'mrs', 'ms',
  'dr', 'prof', 'master', 'kumari', 'kum', 'adv', 'er', 'pandit', 'pt'
]);

const ABBREVIATION_MAP = {
  mohd: 'mohammed',
  md: 'mohammed',
  mohamed: 'mohammed',
  muhammad: 'mohammed',
  mohamad: 'mohammed',
  kr: 'kumar',
  k: 'kumar', // handled contextually if single token in compound
  prsd: 'prasad',
  prs: 'prasad',
  chndr: 'chandra',
  chander: 'chandra',
  chandra: 'chandra',
  narayanan: 'narayan',
  narayana: 'narayan',
  sree: 'shri',
  shree: 'shri',
  sngh: 'singh',
  sing: 'singh',
  varma: 'verma',
  sarma: 'sharma',
  rao: 'rao',
  reddy: 'reddy',
  deshmukh: 'deshmukh',
  patel: 'patel',
  gupta: 'gupta',
  mkrj: 'mukherjee',
  mukherji: 'mukherjee',
  banerji: 'banerjee',
  chatterji: 'chatterjee'
};

const PHONETIC_REPLACEMENTS = [
  [/laxmi/g, 'lakshmi'],
  [/sh/g, 's'], // soft sibilant tolerance
  [/ph/g, 'f'],
  [/v/g, 'w'],
  [/ee/g, 'i'],
  [/oo/g, 'u'],
  [/th/g, 't'],
  [/bh/g, 'b'],
  [/dh/g, 'd'],
  [/gh/g, 'g'],
  [/kh/g, 'k']
];

export function cleanString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes an Indian name by stripping titles, expanding abbreviations,
 * and extracting tokens and initials.
 */
export function normalizeName(name) {
  if (!name || typeof name !== 'string') {
    return {
      raw: '',
      clean: '',
      tokens: [],
      initials: [],
      canonical: '',
      phonetic: ''
    };
  }

  const raw = name.trim();
  const cleaned = cleanString(raw);
  const words = cleaned.split(' ').filter(Boolean);

  // Filter out known honorifics
  const nonHonorifics = words.filter((w) => !HONORIFICS.has(w));
  const finalWords = nonHonorifics.length > 0 ? nonHonorifics : words;

  // Expand standard Indian abbreviations
  const expandedTokens = finalWords.map((token) => {
    if (ABBREVIATION_MAP[token]) {
      return ABBREVIATION_MAP[token];
    }
    return token;
  });

  const initials = expandedTokens
    .filter((t) => t.length === 1)
    .map((t) => t.toUpperCase());

  const canonical = expandedTokens.join(' ');

  // Generate lightweight phonetic key for high-tolerance transliteration
  let phonetic = canonical;
  for (const [pattern, replacement] of PHONETIC_REPLACEMENTS) {
    phonetic = phonetic.replace(pattern, replacement);
  }
  phonetic = phonetic.replace(/\s+/g, ' ').trim();

  return {
    raw,
    clean: cleaned,
    tokens: expandedTokens,
    initials,
    canonical,
    phonetic
  };
}

/**
 * Normalizes an institution name (bank, corporation, fund)
 * Handles standard Indian banking acronyms (SBI, PNB, BOB, HDFC, ICICI, etc.)
 */
const BANK_ACRONYMS = {
  sbi: 'state bank of india',
  pnb: 'punjab national bank',
  bob: 'bank of baroda',
  boi: 'bank of india',
  canara: 'canara bank',
  union: 'union bank of india',
  ubi: 'union bank of india',
  iob: 'indian overseas bank',
  ib: 'indian bank',
  cb: 'central bank of india',
  cbi: 'central bank of india',
  psb: 'punjab and sind bank',
  uco: 'uco bank',
  hdfc: 'hdfc bank',
  icici: 'icici bank',
  axis: 'axis bank',
  kotak: 'kotak mahindra bank',
  ril: 'reliance industries limited',
  reliance: 'reliance industries limited',
  tml: 'tata motors limited',
  tata: 'tata motors limited',
  itc: 'itc limited',
  lt: 'larsen and toubro limited',
  hul: 'hindustan unilever limited',
  epfo: 'employees provident fund organisation',
  pf: 'employees provident fund organisation',
  iepf: 'investor education and protection fund'
};

export function normalizeInstitution(inst) {
  if (!inst) return '';
  const cleaned = cleanString(inst);
  const words = cleaned.split(' ');

  if (BANK_ACRONYMS[cleaned]) {
    return BANK_ACRONYMS[cleaned];
  }

  const mappedWords = words.map((w) => BANK_ACRONYMS[w] || w);
  return mappedWords.join(' ');
}

/**
 * Normalizes location / city / state
 */
export function normalizeLocation(loc) {
  if (!loc) return '';
  return cleanString(loc)
    .replace(/\b(dist|district|city|state|st|road|rd|branch)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
