import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Download, ShieldCheck, AlertCircle, ExternalLink, Printer, Landmark } from 'lucide-react';
import { getClaimGuidance } from '../services/api';
import { generateClaimSummaryPdf } from '../services/pdfGenerator';

export default function ClaimGuidancePage({ result, query, onBackToDetail }) {
  const [guidance, setGuidance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    if (result) {
      const relation = query?.relation || 'myself';
      const isDeceased = Boolean(query?.isDeceased);
      getClaimGuidance(result.id, relation, isDeceased)
        .then((res) => {
          setGuidance(res.guidance);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [result, query]);

  const toggleDoc = (id) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    try {
      generateClaimSummaryPdf({
        query,
        record: result,
        matchAnalysis: result.matchAnalysis,
        guidance
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF document');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  if (isLoading || !guidance) {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="w-8 h-8 mx-auto border-3 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Generating customized claim guidance & checklist...</p>
      </div>
    );
  }

  const { steps, checklists, isFamilyClaim } = guidance;
  const allDocList = [
    ...(checklists?.standardKyc || []),
    ...(checklists?.categorySpecific || []),
    ...(checklists?.legalHeirSpecific || [])
  ];

  const totalDocs = allDocList.length;
  const collectedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToDetail}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Record Overview</span>
        </button>

        {/* Primary PDF Download Button */}
        <button
          onClick={handleDownloadPdf}
          disabled={isPdfGenerating}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 text-saffron-400" />
          <span>{isPdfGenerating ? 'Generating PDF...' : 'Download Official Claim Summary (PDF)'}</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">
              Claim Recovery Roadmap
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Claim Guidance for {result.institution}
            </h2>
            <p className="text-xs text-slate-500">
              Asset: {result.assetType} • Holder: {result.holderName} • Approx. ₹{Number(result.amount || 0).toLocaleString('en-IN')}
            </p>
          </div>

          {isFamilyClaim && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Deceased / Legal Heir Claim Mode</span>
            </span>
          )}
        </div>

        {/* 5 Step Wizard Journey */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            5-Step Official Claim Journey
          </h3>

          <div className="space-y-3">
            {steps.map((st) => (
              <div
                key={st.stepNumber}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-saffron-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {st.stepNumber}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {st.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-700 pl-10 leading-relaxed">
                  {st.action}
                </p>

                <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 ml-10 inline-block">
                  💡 Tip: {st.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Interactive Document Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Document Checklist Commonly Requested
            </h3>
            <p className="text-xs text-slate-500">
              Check off the documents you have already located ({collectedCount} of {totalDocs} ready)
            </p>
          </div>

          <div className="w-36 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(collectedCount / totalDocs) * 100}%` }}
            />
          </div>
        </div>

        {/* Section 1: Standard Claimant KYC */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Identity & Bank Details (Mandatory KYC)
          </p>
          <div className="space-y-2">
            {checklists?.standardKyc?.map((doc) => (
              <label
                key={doc.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedDocs[doc.id])}
                  onChange={() => toggleDoc(doc.id)}
                  className="mt-0.5 w-4 h-4 rounded text-saffron-600 focus:ring-saffron-500 border-slate-300"
                />
                <div className="text-xs">
                  <p className={`font-bold ${checkedDocs[doc.id] ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{doc.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Asset Specific */}
        {checklists?.categorySpecific?.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Asset-Specific Instruments ({result.assetType})
            </p>
            <div className="space-y-2">
              {checklists.categorySpecific.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checkedDocs[doc.id])}
                    onChange={() => toggleDoc(doc.id)}
                    className="mt-0.5 w-4 h-4 rounded text-saffron-600 focus:ring-saffron-500 border-slate-300"
                  />
                  <div className="text-xs">
                    <p className={`font-bold ${checkedDocs[doc.id] ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{doc.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Legal Heir / Deceased Holder */}
        {checklists?.legalHeirSpecific?.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
              3. Succession & Legal Heir Documents (Deceased Holder)
            </p>
            <div className="space-y-2">
              {checklists.legalHeirSpecific.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checkedDocs[doc.id])}
                    onChange={() => toggleDoc(doc.id)}
                    className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-300"
                  />
                  <div className="text-xs">
                    <p className={`font-bold ${checkedDocs[doc.id] ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{doc.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Caution Notice */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            {guidance.disclaimer}
          </p>
        </div>

        {/* Bottom Download CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Generate and print a summary packet to carry when visiting the branch.
          </p>
          <button
            onClick={handleDownloadPdf}
            disabled={isPdfGenerating}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-saffron-400" />
            <span>Generate Claim Summary PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
