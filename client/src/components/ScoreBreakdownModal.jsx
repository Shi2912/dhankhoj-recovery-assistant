import React from 'react';
import { X, CheckCircle2, Info, HelpCircle, ShieldAlert } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

export default function ScoreBreakdownModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  const { matchAnalysis, holderName, institution, assetType, confidenceScore } = result;
  const breakdown = matchAnalysis?.breakdown || {};
  const reasons = matchAnalysis?.reasons || [];

  const factors = [
    { label: 'Name Similarity', weight: '50%', score: breakdown.name || 0, desc: 'Evaluates Levenshtein, Jaro-Winkler, Token Sort & phonetic variants (e.g. Mohd. vs Mohammed)' },
    { label: 'Institution Alignment', weight: '15%', score: breakdown.institution || 0, desc: 'Compares bank/company name with registered nodal authority records' },
    { label: 'Approximate Year Range', weight: '10%', score: breakdown.year || 0, desc: 'Proximity of specified year against the year transferred to DEA/IEPF/EPFO fund' },
    { label: 'Location / State Proximity', weight: '10%', score: breakdown.location || 0, desc: 'Matches district, city, or regional office jurisdiction' },
    { label: 'Asset Type Matching', weight: '10%', score: breakdown.assetType || 0, desc: 'Validates financial instrument (Bank Deposit vs Dividend vs Shares vs PF)' },
    { label: 'Family & Context Prior', weight: '5%', score: breakdown.relative || 0, desc: 'Account holder relation indicators' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron-400">
                Explainable AI Engine
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              How was this {confidenceScore}% confidence score calculated?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Record Evaluated</p>
              <p className="text-base font-bold text-slate-900">{holderName}</p>
              <p className="text-xs text-slate-600">{institution} • {assetType}</p>
            </div>
            <div>
              <ConfidenceBadge score={confidenceScore} label={result.confidenceLabel} />
            </div>
          </div>

          {/* Transparent Factors Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Factor Breakdown (Transparent Weighted Formula)
            </h4>
            <div className="space-y-3">
              {factors.map((f) => (
                <div key={f.label} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{f.label}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({f.weight} weight)</span>
                    </span>
                    <span className="font-extrabold text-slate-900">{f.score}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        f.score >= 80 ? 'bg-emerald-500' : f.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${f.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet Reasons */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Key Algorithmic Evidence</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Caveat */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Important:</strong> A high confidence score indicates algorithmic similarity across public record metadata. It does NOT constitute legal confirmation of title or entitlement. Final verification is handled exclusively by the nodal authority.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
}
