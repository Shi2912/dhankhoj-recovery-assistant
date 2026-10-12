import React, { useState, useEffect } from 'react';
import { Cpu, Search, CheckCircle2, ShieldCheck, Database, Sparkles } from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Understanding what you told us...', detail: 'Extracting named entities, relation keywords, and banking details' },
  { id: 2, label: 'Normalizing names & Indian honorifics...', detail: 'Expanding Mohd/Md/Kumar, stripping Sri/Smt/Late, token re-ordering' },
  { id: 3, label: 'Searching available records...', detail: 'Querying RBI UDGAM, IEPF Authority & EPFO datasets' },
  { id: 4, label: 'Comparing possible matches with Rapid-TokenScorer...', detail: 'Calculating Jaro-Winkler, Levenshtein & phonetic similarity' },
  { id: 5, label: 'Preparing explainable results & confidence scores...', detail: 'Assembling weighted criteria breakdown & claim advice' }
];

export default function ProcessingAnimation({ onComplete, duration = 2800 }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const stageDuration = duration / STAGES.length;
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return prev;
        }
      });
    }, stageDuration);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="bg-white rounded-3xl p-8 max-w-xl mx-auto border border-slate-200 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full bg-saffron-100 animate-ping opacity-60"></div>
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-saffron-500 to-saffron-600 flex items-center justify-center text-white shadow-lg">
          <Cpu className="w-10 h-10 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
          <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
          <span>AI Discovery Engine Active</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Searching Unclaimed Asset Registries
        </h3>
        <p className="text-sm text-slate-500">
          Please wait while DhanKhoj searches across multiple public authority datasets.
        </p>
      </div>

      <div className="space-y-3 text-left pt-2">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : isDone
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-600'
                  : 'bg-slate-50/40 border-slate-200/60 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                )}
                <div>
                  <p className={`text-xs font-bold ${isCurrent ? 'text-amber-950' : isDone ? 'text-emerald-950' : 'text-slate-600'}`}>
                    {stage.label}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {stage.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
