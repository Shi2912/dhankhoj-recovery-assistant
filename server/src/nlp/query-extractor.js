/**
 * Indian Financial Query NLP Entity Extractor
 * Parses conversational natural-language input into structured search criteria
 */

const RELATION_MAP = {
  grandfather: 'grandparent',
  dada: 'grandparent',
  nana: 'grandparent',
  grandmother: 'grandparent',
  dadi: 'grandparent',
  nani: 'grandparent',
  father: 'parent',
  dad: 'parent',
  papa: 'parent',
  pitaji: 'parent',
  mother: 'parent',
  mom: 'parent',
  mummy: 'parent',
  mataji: 'parent',
  spouse: 'spouse',
  husband: 'spouse',
  wife: 'spouse',
  pati: 'spouse',
  patni: 'spouse',
  uncle: 'relative',
  chacha: 'relative',
  mama: 'relative',
  aunt: 'relative',
  chachi: 'relative',
  mami: 'relative',
  brother: 'sibling',
  bhai: 'sibling',
  sister: 'sibling',
  behen: 'sibling',
  myself: 'myself',
  me: 'myself',
  self: 'myself'
};

const BANK_NAMES = [
  'state bank of india', 'sbi', 'punjab national bank', 'pnb', 'bank of baroda', 'bob',
  'canara bank', 'canara', 'union bank', 'ubi', 'indian overseas bank', 'iob',
  'indian bank', 'central bank', 'cbi', 'punjab & sind bank', 'psb', 'uco bank', 'uco',
  'hdfc bank', 'hdfc', 'icici bank', 'icici', 'axis bank', 'axis', 'kotak mahindra', 'kotak',
  'tata motors', 'reliance industries', 'reliance', 'itc limited', 'itc',
  'larsen & toubro', 'l&t', 'infosys', 'hindustan unilever', 'hul', 'tata steel'
];

const CITIES = [
  'chennai', 'madras', 'delhi', 'new delhi', 'mumbai', 'bombay', 'bengaluru', 'bangalore',
  'kolkata', 'calcutta', 'hyderabad', 'pune', 'lucknow', 'kanpur', 'ahmedabad',
  'jaipur', 'madurai', 'coimbatore', 'chandigarh', 'amritsar', 'gurugram', 'gurgaon',
  'noida', 'vellore', 'patna', 'bhopal', 'indore', 'varanasi', 'nagpur', 'surat'
];

export function extractEntitiesFromQuery(text) {
  if (!text || typeof text !== 'string') {
    return {
      name: '',
      alternate_names: [],
      bank: '',
      company: '',
      approximate_year: '',
      location: '',
      asset_type: '',
      relative_name: '',
      relation: 'myself',
      rawText: ''
    };
  }

  const rawText = text.trim();
  const lower = rawText.toLowerCase();

  let relation = 'myself';
  let relative_name = '';

  for (const [relWord, normalizedRel] of Object.entries(RELATION_MAP)) {
    const relRegex = new RegExp(`\\b${relWord}\\b`, 'i');
    if (relRegex.test(lower)) {
      relation = normalizedRel;
      break;
    }
  }

  // 1. Extract 4-digit year (between 1950 and 2026)
  let approximate_year = '';
  const yearMatch = lower.match(/\b(19\d{2}|20[0-2]\d)\b/);
  if (yearMatch) {
    approximate_year = yearMatch[1];
  }

  // 2. Extract Bank / Company
  let institution = '';
  for (const bank of BANK_NAMES) {
    const bankRegex = new RegExp(`\\b${bank.replace('&', '\\&')}\\b`, 'i');
    if (bankRegex.test(lower)) {
      institution = bank.toUpperCase();
      break;
    }
  }

  // 3. Extract Location / City
  let location = '';
  for (const city of CITIES) {
    const cityRegex = new RegExp(`\\b${city}\\b`, 'i');
    if (cityRegex.test(lower)) {
      location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // 4. Extract Asset Type
  let asset_type = 'All';
  if (/deposit|savings|account|fd|fixed deposit|bank account/i.test(lower)) {
    asset_type = 'Unclaimed Bank Deposit';
  } else if (/shares|stock|equity|portfolio/i.test(lower)) {
    asset_type = 'Unclaimed Shares';
  } else if (/dividend|dividends/i.test(lower)) {
    asset_type = 'Unclaimed Dividend';
  } else if (/pf|provident|epf|epfo|pension/i.test(lower)) {
    asset_type = 'Provident Fund';
  }

  // 5. Extract Person's Name
  let extractedName = '';

  const verbStopWords = /\s+(?:had|has|held|worked|opened|maintained|living|around|in|near|with|who|having|for|at|an|a|the)\b.*/i;

  const relationPrefixMatch = rawText.match(
    /(?:my\s+(?:late\s+)?(?:grandfather|father|mother|grandmother|dada|dadi|nana|nani|uncle|aunt|brother|sister|spouse|husband|wife)\s+)(.+)/i
  );

  if (relationPrefixMatch) {
    let candidate = relationPrefixMatch[1].replace(verbStopWords, '').trim();
    // Keep words that look like a name
    const nameWords = candidate.split(/\s+/).filter(w => /^[A-Z][a-zA-Z.'-]*$/i.test(w)).slice(0, 4);
    if (nameWords.length > 0) {
      extractedName = nameWords.join(' ');
    }
  }

  if (!extractedName) {
    const namedMatch = rawText.match(
      /(?:named|name is|belonging to|account of)\s+([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*){1,3})/i
    );
    if (namedMatch) {
      extractedName = namedMatch[1].replace(verbStopWords, '').trim();
    } else {
      // Fallback: look for 2 or 3 capitalized words not matching stop words
      const words = rawText.split(/\s+/);
      const capClusters = [];
      let currentCluster = [];

      const stopWords = new Set([
        'My', 'The', 'In', 'At', 'Around', 'Near', 'Looking', 'Had', 'An', 'A',
        'Bank', 'Account', 'Chennai', 'Delhi', 'Mumbai', 'SBI', 'PNB', 'PF',
        'Deposit', 'Share', 'Dividend', 'Uncle', 'Father', 'Mother', 'Grandfather'
      ]);

      for (const w of words) {
        const cleanW = w.replace(/[^a-zA-Z]/g, '');
        if (/^[A-Z][a-z]+$/.test(cleanW) && !stopWords.has(cleanW)) {
          currentCluster.push(cleanW);
        } else {
          if (currentCluster.length >= 2) {
            capClusters.push(currentCluster.join(' '));
          }
          currentCluster = [];
        }
      }
      if (currentCluster.length >= 2) {
        capClusters.push(currentCluster.join(' '));
      }

      if (capClusters.length > 0) {
        extractedName = capClusters[0];
      }
    }
  }

  // If still empty and sentence has 1-3 words, entire input might be a name
  if (!extractedName && rawText.split(/\s+/).length <= 4 && !/account|bank|deposit/i.test(rawText)) {
    extractedName = rawText;
  }

  return {
    name: extractedName,
    alternate_names: [],
    bank: institution,
    company: institution,
    approximate_year,
    location,
    asset_type,
    relative_name,
    relation,
    rawText
  };
}
