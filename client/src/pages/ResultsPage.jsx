import React, { useState } from 'react';
import { Landmark, ArrowLeft, Filter, CheckCircle2, ChevronRight, HelpCircle, AlertTriangle, ArrowUpDown, ShieldCheck } from 'lucide-react';
import ConfidenceBadge from '../components/ConfidenceBadge';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';

export default function ResultsPage({ searchResponse, onSelectResult, onBackToSearch }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [modalResult, setModalResult] = useState(null);

  const results = searchResponse?.results || [];
  const query = searchResponse?.query || {};

  // Filter categories
  const filteredResults = results.filter((r) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Bank Deposits') return r.assetType.includes('Deposit');
    if (selectedFilter === 'Shares') return r.assetType.includes('Shares');
    if (selectedFilter === 'Dividends') return r.assetType.includes('Dividend');
    if (selectedFilter === 'PF') return r.assetType.includes('Provident') || r.assetType.includes('PF');
    return true;
  });

  const categories = ['All', 'Bank Deposits', 'Shares', 'Dividends', 'PF'];

  return (
    <div className="space-y-8">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToSearch}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Search Query</span>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {results.length} possible {results.length === 1 ? 'match' : 'matches'} found
            </h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              Demo Dataset
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Searched across RBI DEA Fund, IEPF Authority & EPFO datasets for: <strong className="text-slate-800">"{query.name || query.rawQuery}"</strong>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Zero Results State */}
      {filteredResults.length === 0 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            We couldn't find a strong possible match using the information provided.
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adding an older spelling, approximate location, bank name, or a family member's name. You can also upload an old passbook or check back as more official portals are linked.
          </p>
          <button
            onClick={onBackToSearch}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Adjust Search Details
          </button>
        </div>
      )}

      {/* Results Cards List */}
      <div className="space-y-4">
        {filteredResults.map((result) => {
          const reasons = result.matchAnalysis?.reasons || [];
          return (
            <div
              key={result.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-lg hover:border-slate-300 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <ConfidenceBadge
                    score={result.confidenceScore}
                    label={result.confidenceLabel}
                  />
                  <span className="text-xs font-bold text-slate-400">
                    ID: {result.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalResult(result)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 decoration-slate-300"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-saffron-600" />
                    <span>How was this calculated?</span>
                  </button>
                </div>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Account Holder Name
                  </p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {result.holderName}
                  </p>
                  {result.alternateNames && result.alternateNames.length > 0 && (
                    <p className="text-[11px] text-slate-500">
                      Variants: {result.alternateNames.join(', ')}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Institution & Asset Type
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {result.institution}
                  </p>
                  <p className="text-xs text-saffron-700 font-semibold">
                    {result.assetType}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Estimated Value & Timeline
                  </p>
                  <p className="text-lg font-extrabold text-emerald-700">
                    ₹{Number(result.amount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-slate-500">
                    Approx. Year: {result.approximateYear || 'N/A'} • {result.location || 'India'}
                  </p>
                </div>
              </div>

              {/* Explainable AI "Why this may match" Section */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Why this may match:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {reasons.slice(0, 4).map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Authority: {result.claimAuthority}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectResult(result)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
                >
                  <span>View Details & Claim Guidance</span>
                  <ChevronRight className="w-4 h-4 text-saffron-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explainable AI Modal */}
      <ScoreBreakdownModal
        isOpen={Boolean(modalResult)}
        onClose={() => setModalResult(null)}
        result={modalResult}
      />
    </div>
  );
}
