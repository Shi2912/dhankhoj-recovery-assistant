import { computeNameSimilarity, jaroWinkler, tokenSetRatio } from './fuzzy.js';
import { normalizeInstitution, normalizeLocation } from './normalizer.js';

/**
 * Calculates similarity between query year and record approximateYear
 */
export function computeYearScore(queryYear, recordYear) {
  if (!queryYear || !recordYear) return 50; // neutral prior if unknown

  const qY = parseInt(queryYear, 10);
  const rY = parseInt(recordYear, 10);

  if (isNaN(qY) || isNaN(rY)) return 50;

  const diff = Math.abs(qY - rY);
  if (diff === 0) return 100;
  if (diff === 1) return 90;
  if (diff === 2) return 80;
  if (diff <= 4) return 65;
  if (diff <= 7) return 40;
  if (diff <= 10) return 20;
  return 0;
}

/**
 * Calculates similarity between query institution and record institution
 */
export function computeInstitutionScore(queryInst, recordInst) {
  if (!queryInst) return 50; // neutral prior if not specified
  if (!recordInst) return 0;

  const qNorm = normalizeInstitution(queryInst);
  const rNorm = normalizeInstitution(recordInst);

  if (qNorm === rNorm) return 100;

  // Direct substring inclusion (e.g. "SBI" or "State Bank" inside "State Bank of India")
  if (rNorm.includes(qNorm) || qNorm.includes(rNorm)) {
    return 95;
  }

  const setRatio = tokenSetRatio(qNorm, rNorm);
  const jw = jaroWinkler(qNorm, rNorm);

  return Math.round(Math.max(setRatio * 100, jw * 100));
}

/**
 * Calculates similarity between query location and record location
 */
export function computeLocationScore(queryLoc, recordLoc) {
  if (!queryLoc) return 50; // neutral prior if not specified
  if (!recordLoc) return 0;

  const qNorm = normalizeLocation(queryLoc);
  const rNorm = normalizeLocation(recordLoc);

  if (qNorm === rNorm) return 100;

  // Check if city/state is contained
  if (rNorm.includes(qNorm) || qNorm.includes(rNorm)) {
    return 90;
  }

  const setRatio = tokenSetRatio(qNorm, rNorm);
  return Math.round(setRatio * 100);
}

/**
 * Calculates similarity for asset type
 */
export function computeAssetTypeScore(queryType, recordType) {
  if (!queryType) return 50;
  if (!recordType) return 0;

  const q = queryType.toLowerCase();
  const r = recordType.toLowerCase();

  if (q === r || r.includes(q) || q.includes(r)) return 100;

  if (
    (q.includes('deposit') || q.includes('bank') || q.includes('account')) &&
    r.includes('deposit')
  ) {
    return 100;
  }

  if (
    (q.includes('share') || q.includes('dividend') || q.includes('stock')) &&
    (r.includes('share') || r.includes('dividend'))
  ) {
    return 85;
  }

  if (
    (q.includes('pf') || q.includes('provident') || q.includes('epfo')) &&
    r.includes('provident')
  ) {
    return 100;
  }

  return 20;
}

/**
 * Calculates relative / family information score bonus
 */
export function computeRelativeScore(queryRelative, queryRelation) {
  if (!queryRelative && !queryRelation) return 50;
  if (queryRelative || queryRelation) return 80;
  return 50;
}

/**
 * Classifies confidence score into standard GovTech transparent tiers
 */
export function getConfidenceTier(score) {
  if (score >= 90) {
    return {
      tier: 'STRONG',
      label: 'Strong possible match',
      color: 'emerald',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }
  if (score >= 75) {
    return {
      tier: 'LIKELY',
      label: 'Likely possible match',
      color: 'blue',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
    };
  }
  if (score >= 60) {
    return {
      tier: 'POSSIBLE',
      label: 'Possible match',
      color: 'amber',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  }
  return {
    tier: 'WEAK',
    label: 'Weak match',
    color: 'slate',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300'
  };
}

/**
 * Full Weighted Matching Scorer
 * Name: 50%
 * Institution: 15%
 * Location: 10%
 * Year: 10%
 * Asset Type: 10%
 * Relative: 5%
 */
export function scoreMatch(query, record) {
  const nameScore = computeNameSimilarity(
    query.name,
    record.holderName,
    record.alternateNames
  );

  const institutionScore = computeInstitutionScore(
    query.bank || query.company || query.institution,
    record.institution
  );

  const locationScore = computeLocationScore(
    query.location || query.city || query.state,
    record.location
  );

  const yearScore = computeYearScore(
    query.approximateYear || query.year,
    record.approximateYear
  );

  const assetTypeScore = computeAssetTypeScore(
    query.assetType || query.asset_type,
    record.assetType
  );

  const relativeScore = computeRelativeScore(
    query.relative_name || query.relativeName,
    query.relation
  );

  // Compute weighted composite score
  const weightedScore = Math.round(
    nameScore * 0.50 +
    institutionScore * 0.15 +
    locationScore * 0.10 +
    yearScore * 0.10 +
    assetTypeScore * 0.10 +
    relativeScore * 0.05
  );

  const finalScore = Math.min(100, Math.max(0, weightedScore));
  const tierInfo = getConfidenceTier(finalScore);

  // Generate plain-language, transparent AI explanations
  const reasons = [];

  if (nameScore >= 90) {
    reasons.push(`Name similarity is very high (${nameScore}% match with "${record.holderName}")`);
  } else if (nameScore >= 70) {
    reasons.push(`Name closely resembles "${record.holderName}" (${nameScore}% fuzzy match including spelling variants)`);
  } else if (nameScore >= 50) {
    reasons.push(`Name shares common tokens with "${record.holderName}" (${nameScore}%)`);
  }

  if (institutionScore >= 80) {
    reasons.push(`Institution matched with registered authority (${record.institution})`);
  } else if (institutionScore >= 50 && query.bank) {
    reasons.push(`Institution partially aligned with ${query.bank}`);
  }

  if (locationScore >= 80) {
    reasons.push(`Location matches region (${record.location})`);
  }

  if (yearScore >= 80) {
    reasons.push(`Approximate year (${record.approximateYear}) closely matches timeline`);
  } else if (yearScore >= 60) {
    reasons.push(`Year (${record.approximateYear}) falls within expected historical range`);
  }

  if (assetTypeScore >= 80) {
    reasons.push(`Asset category matches (${record.assetType})`);
  }

  if (query.relation && query.relation !== 'myself') {
    reasons.push(`Family search indicated relationship: ${query.relation}`);
  }

  const verbalSummary = reasons.length > 0
    ? reasons.join('. ') + '.'
    : 'Partial attributes match historical records.';

  return {
    score: finalScore,
    tier: tierInfo.tier,
    tierLabel: tierInfo.label,
    badgeClass: tierInfo.badgeClass,
    breakdown: {
      name: nameScore,
      institution: institutionScore,
      location: locationScore,
      year: yearScore,
      assetType: assetTypeScore,
      relative: relativeScore
    },
    weights: {
      name: '50%',
      institution: '15%',
      location: '10%',
      year: '10%',
      assetType: '10%',
      relative: '5%'
    },
    reasons,
    verbalSummary,
    disclaimer: 'This is a potential algorithmic match based on public record similarity, not proof of legal entitlement or ownership.'
  };
}
