import React, { useState } from 'react';
import { ArrowLeft, Landmark, ShieldCheck, CheckCircle2, AlertTriangle, FileText, ArrowRight, HelpCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import ConfidenceBadge from '../components/ConfidenceBadge';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';

export default function ResultDetailPage({ result, onBackToResults, onStartGuidance }) {
  const [showScoreModal, setShowScoreModal] = useState(false);

  if (!result) return null;

  const {
    id,
    holderName,
    alternateNames,
    institution,
    assetType,
    approximateYear,
    location,
    amount,
    status,
    sourceReference,
    claimAuthority,
    confidenceScore,
    confidenceLabel,
    matchAnalysis
  } = result;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <button
          onClick={onBackToResults}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Record ID: {id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Demo Dataset
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {holderName}
            </h2>
            {alternateNames && alternateNames.length > 0 && (
              <p className="text-xs text-slate-500">
                Registered name variations: {alternateNames.join(', ')}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <ConfidenceBadge score={confidenceScore} label={confidenceLabel} />
            <button
              onClick={() => setShowScoreModal(true)}
              className="text-xs text-saffron-700 font-semibold hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>View 6-factor calculation</span>
            </button>
          </div>
        </div>

        {/* Financial Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Amount</p>
            <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
              ₹{Number(amount || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Asset Category</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{assetType}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Institution / Bank</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{institution}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Approx. Year</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{approximateYear || 'N/A'}</p>
          </div>
        </div>

        {/* Official Authority & Reference Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-400 uppercase text-[10px]">Claim Authority</p>
            <p className="font-semibold text-slate-900">{claimAuthority}</p>
            <p className="text-slate-500 text-[11px]">Regulatory nodal body overseeing claims for this asset class</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-400 uppercase text-[10px]">Source Reference (Masked)</p>
            <p className="font-mono font-bold text-slate-800">{sourceReference || 'REF-N/A'}</p>
            <p className="text-slate-500 text-[11px]">Keep this reference handy when submitting official claim inquiries</p>
          </div>
        </div>

        {/* Explainable AI: "Why did DhanKhoj find this?" */}
        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
              Why did DhanKhoj find this?
            </h3>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            {matchAnalysis?.verbalSummary || 'The record details closely correspond to the historical query parameters.'}
          </p>
          <ul className="space-y-1.5 text-xs text-emerald-800 pt-1">
            {matchAnalysis?.reasons?.map((r, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prominent Legal Disclaimer */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important: This is a possible match, not proof of ownership.</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              DhanKhoj does not guarantee that this asset belongs to you. Recovery requires fulfilling the KYC, physical document verification, and claim criteria of {institution}.
            </p>
          </div>
        </div>

        {/* Next Step CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Ready to proceed? Get the step-by-step claim instructions and document checklist.
          </div>

          <button
            onClick={() => onStartGuidance(result)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/25 hover:from-saffron-600 hover:to-saffron-700 active:scale-95 transition-all"
          >
            <span>Proceed to Claim Guidance Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <ScoreBreakdownModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        result={result}
      />
    </div>
  );
}
