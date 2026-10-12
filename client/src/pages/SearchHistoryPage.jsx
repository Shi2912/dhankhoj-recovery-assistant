import React, { useState, useEffect } from 'react';
import { History, Trash2, Search, ArrowRight, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { getHistory, clearHistory } from '../services/api';
import ConfidenceBadge from '../components/ConfidenceBadge';

export default function SearchHistoryPage({ onRerunSearch }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setIsLoading(true);
    getHistory()
      .then((res) => {
        setHistoryItems(res.history || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your local search history?')) {
      try {
        await clearHistory();
        setHistoryItems([]);
      } catch (err) {
        alert('Failed to clear history');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 mb-2">
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Search Audit Log</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recent Searches
          </h2>
          <p className="text-xs text-slate-500">
            Stored locally on your browser/session. Uploaded documents and financial passwords are never saved.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Search History</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {historyItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3 shadow-sm">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No recent searches yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you search for unclaimed assets, a local summary log of the name and matches will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {item.queryName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {item.searchMode || 'text'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>
                    {new Date(item.searchedAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span>•</span>
                  <span>{item.matchesCount} possible matches</span>
                  {item.criteria?.bank && (
                    <>
                      <span>•</span>
                      <span>{item.criteria.bank}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                {item.highestScore > 0 && (
                  <ConfidenceBadge score={item.highestScore} label="Top Match" />
                )}

                <button
                  onClick={() => onRerunSearch(item.criteria || { name: item.queryName })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-saffron-600" />
                  <span>Re-search</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
