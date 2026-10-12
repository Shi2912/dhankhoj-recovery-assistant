/**
 * High-performance Fuzzy Matching Algorithms
 * Includes Levenshtein, Jaro-Winkler, Token Sort Ratio, and Token Set Ratio
 */

import { normalizeName } from './normalizer.js';

/**
 * Standard Levenshtein Distance
 */
export function levenshteinDistance(s1, s2) {
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  const d = [];
  for (let i = 0; i <= s1.length; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return d[s1.length][s2.length];
}

/**
 * Levenshtein Similarity Ratio (0.0 to 1.0)
 */
export function levenshteinRatio(s1, s2) {
  if (!s1 && !s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  if (s1 === s2) return 1.0;

  const dist = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Jaro-Winkler Similarity Metric (0.0 to 1.0)
 * Highly effective for common prefixes and typos
 */
export function jaroWinkler(s1, s2) {
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;

  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  const s1Matches = new Array(s1.length).fill(false);
  const s2Matches = new Array(s2.length).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, s2.length);

    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  let k = 0;
  for (let i = 0; i < s1.length; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  const jaro =
    (matches / s1.length +
      matches / s2.length +
      (matches - transpositions / 2) / matches) /
    3.0;

  // Winkler prefix scaling (up to 4 chars)
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(s1.length, s2.length)); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }

  const p = 0.1; // scaling factor
  return Math.min(1.0, jaro + prefix * p * (1.0 - jaro));
}

/**
 * Token Sort Ratio (handles word-order permutations)
 */
export function tokenSortRatio(s1, s2) {
  const sorted1 = s1.split(/\s+/).filter(Boolean).sort().join(' ');
  const sorted2 = s2.split(/\s+/).filter(Boolean).sort().join(' ');
  return levenshteinRatio(sorted1, sorted2);
}

/**
 * Token Set Ratio (handles subsets, e.g. "Mohammed Iqbal" vs "Mohd Iqbal" or initials)
 */
export function tokenSetRatio(s1, s2) {
  const set1 = new Set(s1.split(/\s+/).filter(Boolean));
  const set2 = new Set(s2.split(/\s+/).filter(Boolean));

  const intersection = [];
  const diff1 = [];
  const diff2 = [];

  for (const token of set1) {
    if (set2.has(token)) {
      intersection.push(token);
    } else {
      diff1.push(token);
    }
  }

  for (const token of set2) {
    if (!set1.has(token)) {
      diff2.push(token);
    }
  }

  const sortedIntersect = intersection.sort().join(' ');
  const sortedDiff1 = diff1.sort().join(' ');
  const sortedDiff2 = diff2.sort().join(' ');

  const t0 = sortedIntersect;
  const t1 = [sortedIntersect, sortedDiff1].filter(Boolean).join(' ');
  const t2 = [sortedIntersect, sortedDiff2].filter(Boolean).join(' ');

  if (!t0) {
    return tokenSortRatio(s1, s2);
  }

  const r01 = levenshteinRatio(t0, t1);
  const r02 = levenshteinRatio(t0, t2);
  const r12 = levenshteinRatio(t1, t2);

  return Math.max(r01, r02, r12, tokenSortRatio(s1, s2));
}

/**
 * Checks initial-to-name compatibility (e.g. "M." with "Mohammed", "S.K." with "Suresh Kumar")
 */
export function matchInitials(tokens1, tokens2) {
  if (!tokens1.length || !tokens2.length) return 0;

  let initialMatches = 0;
  let totalInitials = 0;

  for (const t1 of tokens1) {
    if (t1.length === 1) {
      totalInitials++;
      const char = t1.toLowerCase();
      const hasMatch = tokens2.some((t2) => t2.toLowerCase().startsWith(char));
      if (hasMatch) initialMatches++;
    }
  }

  for (const t2 of tokens2) {
    if (t2.length === 1) {
      totalInitials++;
      const char = t2.toLowerCase();
      const hasMatch = tokens1.some((t1) => t1.toLowerCase().startsWith(char));
      if (hasMatch) initialMatches++;
    }
  }

  if (totalInitials === 0) return 0;
  return initialMatches / totalInitials;
}

/**
 * High-fidelity composite name similarity for Indian names
 * Returns a score between 0 and 100
 */
export function computeNameSimilarity(nameA, nameB, alternateNames = []) {
  if (!nameA || !nameB) return 0;

  const normA = normalizeName(nameA);
  const normB = normalizeName(nameB);

  // Check direct canonical match
  if (normA.canonical === normB.canonical) {
    return 100;
  }

  // Primary fuzzy metrics on canonical strings
  const levRatio = levenshteinRatio(normA.canonical, normB.canonical);
  const jwRatio = jaroWinkler(normA.canonical, normB.canonical);
  const tsRatio = tokenSortRatio(normA.canonical, normB.canonical);
  const setRatio = tokenSetRatio(normA.canonical, normB.canonical);

  // Phonetic fallback metric
  const phonRatio = levenshteinRatio(normA.phonetic, normB.phonetic);

  // Initials matching bonus
  const initialsBonus = matchInitials(normA.tokens, normB.tokens) * 0.15;

  // Composite calculation
  let baseScore =
    (0.30 * setRatio +
     0.25 * tsRatio +
     0.25 * jwRatio +
     0.10 * levRatio +
     0.10 * phonRatio +
     initialsBonus) * 100;

  // Check alternate names if provided (take best match)
  if (Array.isArray(alternateNames) && alternateNames.length > 0) {
    for (const alt of alternateNames) {
      const altNorm = normalizeName(alt);
      const altSetRatio = tokenSetRatio(normA.canonical, altNorm.canonical);
      const altJwRatio = jaroWinkler(normA.canonical, altNorm.canonical);
      const altScore = ((altSetRatio * 0.6) + (altJwRatio * 0.4)) * 100;
      if (altScore > baseScore) {
        baseScore = altScore;
      }
    }
  }

  return Math.min(100, Math.round(baseScore));
}
