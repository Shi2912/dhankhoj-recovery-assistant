import React, { useState, useEffect } from 'react';
import { Database, Upload, RefreshCw, CheckCircle2, AlertCircle, FileText, Server, BarChart3, Activity } from 'lucide-react';
import { getAdminStats, importCsv, resetDemoData } from '../services/api';

const SAMPLE_CSV = `name,institution,assetType,approximateYear,location,amount,claimAuthority
Vikramaditya Rao,State Bank of India,Unclaimed Bank Deposit,1997,Hyderabad,78400,Reserve Bank of India / SBI
Shalini Mehra,Tata Steel Limited,Unclaimed Dividend,2002,Jamshedpur,23100,IEPF Authority / MCA
Kailash Nath Verma,Employees' Provident Fund Organisation,Provident Fund,1996,Kanpur,61200,EPFO / Ministry of Labour`;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csvContent, setCsvContent] = useState(SAMPLE_CSV);
  const [selectedSource, setSelectedSource] = useState('RBI_UDGAM');
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setIsLoading(true);
    getAdminStats()
      .then((res) => {
        setStats(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!csvContent.trim()) {
      alert('Please provide CSV data');
      return;
    }
    setIsImporting(true);
    setImportStatus(null);
    try {
      const res = await importCsv(csvContent, selectedSource);
      setImportStatus({
        success: true,
        message: `Successfully imported ${res.recordsImported} records into ${selectedSource} registry!`
      });
      loadStats();
    } catch (err) {
      setImportStatus({
        success: false,
        message: err.message || 'Import failed'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset database to original demo records?')) {
      try {
        await resetDemoData();
        loadStats();
        alert('Database restored to original demo datasets.');
      } catch (err) {
        alert('Failed to reset demo data');
      }
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="w-8 h-8 mx-auto border-3 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading admin statistics & registry health...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white mb-2">
            <Database className="w-3.5 h-3.5 text-saffron-400" />
            <span>Admin & Data Management Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registry Health & Datasets
          </h2>
          <p className="text-xs text-slate-500">
            Monitor records count, run CSV dataset ingestion, and inspect audit activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Reset to Demo Records
          </button>
          <button
            onClick={loadStats}
            className="p-2 rounded-xl text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Records Indexed</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalRecords}</p>
          <p className="text-[11px] text-amber-700 font-medium">Demo Mode Dataset</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Unclaimed Sum</p>
          <p className="text-2xl font-extrabold text-emerald-700">₹{(stats.totalAmount / 100000).toFixed(2)} L</p>
          <p className="text-[11px] text-slate-500">In sample datasets</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Queries Handled</p>
          <p className="text-2xl font-extrabold text-blue-700">{stats.totalSearches}</p>
          <p className="text-[11px] text-slate-500">Fuzzy pipeline queries</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Confidence Score</p>
          <p className="text-2xl font-extrabold text-saffron-700">{stats.avgConfidenceScore}%</p>
          <p className="text-[11px] text-slate-500">Across search history</p>
        </div>
      </div>

      {/* Sources & Asset Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Records by Regulatory Source</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.sources || {}).map(([sourceKey, count]) => (
              <div key={sourceKey} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">{sourceKey}</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-white text-slate-700 border border-slate-300">
                  {count} records
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Records by Asset Category</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.assetTypes || {}).map(([typeKey, count]) => (
              <div key={typeKey} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">{typeKey}</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-white text-slate-700 border border-slate-300">
                  {count} records
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSV Dataset Ingestion Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-saffron-600" />
            <h3 className="text-lg font-bold text-slate-900">
              CSV Dataset Ingestion & Column Mapping
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Import new public unclaimed records in bulk. The importer normalizes Indian names automatically for fuzzy matching.
          </p>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-bold text-slate-700">Target Authority Adapter:</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-saffron-500"
            >
              <option value="RBI_UDGAM">RBI UDGAM (Unclaimed Deposits)</option>
              <option value="IEPF">IEPF Authority (Shares & Dividends)</option>
              <option value="EPFO">EPFO Inoperative Accounts (PF)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">CSV Raw Content:</label>
            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-500"
            />
          </div>

          {importStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                importStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              {importStatus.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isImporting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4 text-saffron-400" />
              <span>{isImporting ? 'Ingesting records...' : 'Ingest CSV Dataset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
