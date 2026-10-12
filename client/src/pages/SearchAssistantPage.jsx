import React, { useState } from 'react';
import { Search, Sparkles, UserPlus, FileUp, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';
import VoiceInputButton from '../components/VoiceInputButton';
import ExtractedChipsEditor from '../components/ExtractedChipsEditor';
import SampleScenariosBar from '../components/SampleScenariosBar';
import { extractQuery } from '../services/api';

export default function SearchAssistantPage({ onStartSearch, setActivePage, initialCriteria = null }) {
  const [conversationalInput, setConversationalInput] = useState(
    initialCriteria?.rawQuery || ''
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [criteria, setCriteria] = useState(
    initialCriteria || {
      name: '',
      bank: '',
      approximateYear: '',
      location: '',
      assetType: 'All',
      relation: 'myself',
      isDeceased: false
    }
  );

  const handleTextChange = async (e) => {
    const text = e.target.value;
    setConversationalInput(text);

    // Auto extract when query looks like a full sentence or on space/blur
    if (text.length > 15) {
      try {
        const res = await extractQuery(text);
        if (res.success && res.extracted) {
          setCriteria((prev) => ({
            ...prev,
            name: res.extracted.name || prev.name,
            bank: res.extracted.bank || prev.bank,
            approximateYear: res.extracted.approximate_year || prev.approximateYear,
            location: res.extracted.location || prev.location,
            assetType: res.extracted.asset_type !== 'All' ? res.extracted.asset_type : prev.assetType,
            relation: res.extracted.relation !== 'myself' ? res.extracted.relation : prev.relation,
          }));
        }
      } catch (err) {
        // silent fallback
      }
    }
  };

  const handleVoiceTranscript = async (transcript) => {
    setConversationalInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    try {
      setIsExtracting(true);
      const res = await extractQuery(transcript);
      setIsExtracting(false);
      if (res.success && res.extracted) {
        setCriteria((prev) => ({
          ...prev,
          name: res.extracted.name || prev.name,
          bank: res.extracted.bank || prev.bank,
          approximateYear: res.extracted.approximate_year || prev.approximateYear,
          location: res.extracted.location || prev.location,
          assetType: res.extracted.asset_type || prev.assetType,
          relation: res.extracted.relation || prev.relation,
        }));
      }
    } catch (e) {
      setIsExtracting(false);
    }
  };

  const handleApplyPreset = (presetData) => {
    setConversationalInput(presetData.rawQuery);
    setCriteria({
      name: presetData.name,
      bank: presetData.bank,
      approximateYear: presetData.approximateYear,
      location: presetData.location,
      assetType: presetData.assetType || 'All',
      relation: presetData.relation || 'myself',
      isDeceased: Boolean(presetData.isDeceased)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCriteria = {
      ...criteria,
      rawQuery: conversationalInput,
      name: criteria.name || conversationalInput
    };
    if (!finalCriteria.name && !finalCriteria.bank) {
      alert('Please enter at least a name or institution.');
      return;
    }
    onStartSearch(finalCriteria);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
          <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
          <span>Conversational Search Assistant</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          What do you remember?
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Tell us about an old account in plain language or use the microphone. You don't need exact details.
        </p>
      </div>

      {/* Preset Bar for Quick Testing */}
      <SampleScenariosBar onSelectPreset={handleApplyPreset} />

      {/* Main Search Input Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Tell us in your own words:
            </label>
            <VoiceInputButton
              onTranscript={handleVoiceTranscript}
              onRecordingChange={() => {}}
            />
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={conversationalInput}
              onChange={handleTextChange}
              placeholder='e.g. "My grandfather Mohammed Iqbal had an SBI account around 1998 in Chennai."'
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 focus:outline-none transition-all resize-none font-medium leading-relaxed"
            />
            {isExtracting && (
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-xs text-saffron-600 bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting details...</span>
              </div>
            )}
          </div>
        </div>

        {/* Family / Deceased Relation Context */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-saffron-600" />
              <span className="text-xs font-bold text-slate-800">
                Searching for a family member or deceased relative?
              </span>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.isDeceased}
                onChange={(e) => setCriteria((prev) => ({ ...prev, isDeceased: e.target.checked }))}
                className="w-4 h-4 rounded text-saffron-600 focus:ring-saffron-500 border-slate-300"
              />
              <span>Account holder is deceased (Legal Heir Guidance)</span>
            </label>
          </div>
        </div>

        {/* Extracted Structured Chips (Editable) */}
        <ExtractedChipsEditor criteria={criteria} setCriteria={setCriteria} />

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => setActivePage('upload')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <FileUp className="w-4 h-4 text-saffron-600" />
            <span>Have an old passbook photo? Upload for OCR</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/25 hover:from-saffron-600 hover:to-saffron-700 active:scale-95 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search Unclaimed Asset Registries</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
