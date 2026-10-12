import React from 'react';
import { User, Landmark, Calendar, MapPin, Tag, Users, Edit3 } from 'lucide-react';

export default function ExtractedChipsEditor({ criteria, setCriteria }) {
  const handleChange = (field, value) => {
    setCriteria((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-saffron-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Extracted Information (Editable Chips)
          </h4>
        </div>
        <span className="text-[11px] text-slate-500">
          Click any field below to edit before searching
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {/* Name */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-saffron-500 focus-within:ring-1 focus-within:ring-saffron-500 transition-all">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            <User className="w-3 h-3 text-saffron-600" />
            <span>Name</span>
          </label>
          <input
            type="text"
            value={criteria.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Mohammed Iqbal"
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
          />
        </div>

        {/* Bank / Company */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-saffron-500 focus-within:ring-1 focus-within:ring-saffron-500 transition-all">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            <Landmark className="w-3 h-3 text-saffron-600" />
            <span>Bank / Company</span>
          </label>
          <input
            type="text"
            value={criteria.bank || ''}
            onChange={(e) => handleChange('bank', e.target.value)}
            placeholder="e.g. State Bank of India / SBI"
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
          />
        </div>

        {/* Approx Year */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-saffron-500 focus-within:ring-1 focus-within:ring-saffron-500 transition-all">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            <Calendar className="w-3 h-3 text-saffron-600" />
            <span>Approx. Year</span>
          </label>
          <input
            type="text"
            value={criteria.approximateYear || ''}
            onChange={(e) => handleChange('approximateYear', e.target.value)}
            placeholder="e.g. 1998"
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
          />
        </div>

        {/* Location */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-saffron-500 focus-within:ring-1 focus-within:ring-saffron-500 transition-all">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-saffron-600" />
            <span>Location / City</span>
          </label>
          <input
            type="text"
            value={criteria.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Chennai, Tamil Nadu"
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
          />
        </div>

        {/* Asset Category */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-saffron-500 focus-within:ring-1 focus-within:ring-saffron-500 transition-all">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            <Tag className="w-3 h-3 text-saffron-600" />
            <span>Asset Category</span>
          </label>
          <select
            value={criteria.assetType || 'All'}
            onChange={(e) => handleChange('assetType', e.target.value)}
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
          >
            <option value="All">All Categories (Bank, Shares, PF)</option>
            <option value="Unclaimed Bank Deposit">Unclaimed Bank Deposit</option>
            <option value="Unclaimed Dividend">Unclaimed Dividend</option>
            <option value="Unclaimed Shares">Unclaimed Shares</option>
            <option value="Provident Fund">Provident Fund (EPFO)</option>
          </select>
        </div>

        {/* Relative / Family */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-saffron-500 focus-within:ring-1 focus-within:ring-saffron-500 transition-all">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            <Users className="w-3 h-3 text-saffron-600" />
            <span>Searching For</span>
          </label>
          <select
            value={criteria.relation || 'myself'}
            onChange={(e) => handleChange('relation', e.target.value)}
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
          >
            <option value="myself">Myself</option>
            <option value="parent">Parent (Father / Mother)</option>
            <option value="grandparent">Grandparent (Dada / Nana)</option>
            <option value="spouse">Spouse (Husband / Wife)</option>
            <option value="other">Other Relative</option>
          </select>
        </div>
      </div>
    </div>
  );
}
