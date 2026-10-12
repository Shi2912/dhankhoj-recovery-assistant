import React, { useState } from 'react';
import { FileText, Sparkles, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import DocumentUploader from '../components/DocumentUploader';
import ExtractedChipsEditor from '../components/ExtractedChipsEditor';

export default function DocumentUploadPage({ onStartSearch, setActivePage }) {
  const [extractedData, setExtractedData] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [criteria, setCriteria] = useState({
    name: '',
    bank: '',
    approximateYear: '',
    location: '',
    assetType: 'All',
    relation: 'myself'
  });

  const handleOcrSuccess = (extracted, title) => {
    setDocTitle(title);
    setExtractedData(extracted);
    setCriteria({
      name: extracted.name || '',
      bank: extracted.bank || extracted.company || '',
      approximateYear: extracted.approximateYear || '',
      location: extracted.location || '',
      assetType: extracted.assetType || 'All',
      relation: 'myself'
    });
  };

  const handleProceedSearch = () => {
    onStartSearch({
      ...criteria,
      mode: 'ocr',
      docTitle
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Local Document OCR</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Scan Old Passbook or Financial Certificate
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Upload an image of an old physical document or choose one of the preloaded demo samples to extract details automatically.
        </p>
      </div>

      {/* Uploader Card */}
      <DocumentUploader onOcrSuccess={handleOcrSuccess} />

      {/* Extracted Fields Review (Appears once OCR finishes or sample selected) */}
      {extractedData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Information Extracted from: {docTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Please verify or correct any extracted field below before running the search.
                </p>
              </div>
            </div>
          </div>

          <ExtractedChipsEditor criteria={criteria} setCriteria={setCriteria} />

          <div className="flex justify-end pt-2">
            <button
              onClick={handleProceedSearch}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/25 hover:from-saffron-600 hover:to-saffron-700 active:scale-95 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Search With Extracted Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
