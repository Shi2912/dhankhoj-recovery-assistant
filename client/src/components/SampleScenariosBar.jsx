import React from 'react';
import { Sparkles, FileText, UserCheck, ShieldAlert } from 'lucide-react';

export const DEMO_PRESETS = [
  {
    id: 'demo-iqbal',
    title: 'Scenario 1: Mohammed Iqbal',
    badge: 'Fuzzy Name Test',
    description: 'SBI, 1998, Chennai (matches Mohd, Muhammad, M. Iqbal)',
    data: {
      rawQuery: 'My grandfather Mohammed Iqbal had an SBI account around 1998 in Chennai.',
      name: 'Mohammed Iqbal',
      bank: 'State Bank of India',
      approximateYear: '1998',
      location: 'Chennai',
      assetType: 'Unclaimed Bank Deposit',
      relation: 'grandparent'
    }
  },
  {
    id: 'demo-sharma',
    title: 'Scenario 2: Suresh Kumar Sharma',
    badge: 'Initials & Deceased',
    description: 'PNB, 1995, Delhi (matches S.K. Sharma & legal heir flow)',
    data: {
      rawQuery: 'Searching for my late father Suresh Kumar Sharma who had a PNB account in Delhi around 1995',
      name: 'Suresh Kumar Sharma',
      bank: 'Punjab National Bank',
      approximateYear: '1995',
      location: 'Delhi',
      assetType: 'Unclaimed Bank Deposit',
      relation: 'parent',
      isDeceased: true
    }
  },
  {
    id: 'demo-narayan',
    title: 'Scenario 3: Lakshmi Narayanan',
    badge: 'Phonetic Spelling',
    description: 'Canara Bank, 2002, Bengaluru (matches Laxmi Narayan)',
    data: {
      rawQuery: 'Lakshmi Narayanan had a Canara Bank deposit around 2002 in Bengaluru',
      name: 'Lakshmi Narayanan',
      bank: 'Canara Bank',
      approximateYear: '2002',
      location: 'Bengaluru',
      assetType: 'Unclaimed Bank Deposit',
      relation: 'myself'
    }
  },
  {
    id: 'demo-sunita',
    title: 'Scenario 4: Sunita Devi',
    badge: 'Multi-Source EPFO + Shares',
    description: 'Gurugram, 2008 (finds EPFO Inoperative PF and IEPF Dividends)',
    data: {
      rawQuery: 'Sunita Devi had an EPFO PF account and Hindustan Unilever shares in Gurugram around 2008',
      name: 'Sunita Devi',
      bank: 'Hindustan Unilever Limited',
      approximateYear: '2008',
      location: 'Gurugram',
      assetType: 'All',
      relation: 'myself'
    }
  }
];

export default function SampleScenariosBar({ onSelectPreset }) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
            Judge & Hackathon Demo Scenarios
          </h4>
        </div>
        <span className="text-[11px] text-amber-800 font-medium">
          Click any preset below for instant end-to-end evaluation:
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.data)}
            className="text-left bg-white p-3 rounded-xl border border-amber-200/70 hover:border-saffron-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 group-hover:text-saffron-600 transition-colors">
                {preset.title}
              </span>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                {preset.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              {preset.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
