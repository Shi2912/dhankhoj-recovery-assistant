import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import { processOcr, getOcrSamples } from '../services/api';

export default function DocumentUploader({ onOcrSuccess, onDirectSearch }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState('');

  useEffect(() => {
    getOcrSamples()
      .then((data) => setSamples(data.samples || []))
      .catch((err) => console.error('Failed to load sample docs:', err));
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setErrorMsg('File size must be under 10MB.');
        return;
      }
      setFile(selected);
      setSelectedSampleId('');
      setErrorMsg('');
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSampleSelect = async (sample) => {
    setSelectedSampleId(sample.id);
    setFile(null);
    setPreviewUrl(null);
    setErrorMsg('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('sampleId', sample.id);
      const res = await processOcr(formData);
      setIsLoading(false);
      if (res.success && res.extracted) {
        if (onOcrSuccess) {
          onOcrSuccess(res.extracted, sample.title);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Sample processing failed');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file && !selectedSampleId) {
      setErrorMsg('Please select a file or choose one of the preloaded sample documents.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      if (file) {
        formData.append('document', file);
      } else if (selectedSampleId) {
        formData.append('sampleId', selectedSampleId);
      }

      const res = await processOcr(formData);
      setIsLoading(false);

      if (res.success && res.extracted) {
        if (onOcrSuccess) {
          onOcrSuccess(res.extracted, file ? file.name : 'Sample Document');
        }
      } else {
        setErrorMsg(res.error || 'Failed to extract financial data from the document');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error processing document with OCR');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Optical Character Recognition (OCR)</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Upload Old Passbook, Receipt, or PF Slip
          </h3>
          <p className="text-sm text-slate-500">
            DhanKhoj extracts names, account references, and institutions so you don't have to type them.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Documents are never stored permanently</span>
        </div>
      </div>

      {/* Preset Sample Documents for Fast Hackathon Evaluation */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>Or Choose a Sample Document Preset (Instant 1-Click Evaluation):</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {samples.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSampleSelect(s)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSampleId === s.id
                  ? 'bg-saffron-50 border-saffron-500 ring-2 ring-saffron-500/20 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className={`w-4 h-4 ${selectedSampleId === s.id ? 'text-saffron-600' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-900 truncate">
                  {s.title}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-2">
                {s.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-slate-300 hover:border-saffron-500 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-slate-50/50">
        <input
          type="file"
          id="fileUpload"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="fileUpload" className="cursor-pointer space-y-3 block">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-saffron-600">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {file ? (
                <span className="text-saffron-600 font-bold">{file.name}</span>
              ) : (
                'Drop passbook / receipt image here, or browse files'
              )}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPG, PNG, and PDF documents (Max 10MB)
            </p>
          </div>
        </label>
      </div>

      {/* Preview if image */}
      {previewUrl && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <img
            src={previewUrl}
            alt="Upload preview"
            className="w-16 h-16 object-cover rounded-lg border border-slate-300"
          />
          <div className="text-xs">
            <p className="font-semibold text-slate-800">{file?.name}</p>
            <p className="text-slate-500">{((file?.size || 0) / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submit OCR Button */}
      <button
        type="button"
        onClick={handleUploadSubmit}
        disabled={isLoading || (!file && !selectedSampleId)}
        className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-saffron-400" />
            <span>Scanning document with Tesseract OCR...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-saffron-400" />
            <span>Extract Information with OCR</span>
          </>
        )}
      </button>
    </div>
  );
}
