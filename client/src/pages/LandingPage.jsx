import React from 'react';
import { Search, Sparkles, ArrowRight, ShieldCheck, FileText, CheckCircle2, Landmark, HelpCircle, Users, ExternalLink, Award } from 'lucide-react';
import TrustBanner from '../components/TrustBanner';
import SampleScenariosBar from '../components/SampleScenariosBar';

export default function LandingPage({ setActivePage, onSelectPreset }) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* GovTech Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-3 duration-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AI Discovery Engine for India's ₹1.4+ Lakh Crore Unclaimed Assets</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Find Money You May Have <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-700">Forgotten.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            DhanKhoj searches public unclaimed-asset records and helps you understand whether money may be waiting to be claimed.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('search')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/25 hover:from-saffron-600 hover:to-saffron-700 active:scale-98 transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Find My Money</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('upload')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-base font-semibold bg-white text-slate-800 border border-slate-300 shadow-sm hover:bg-slate-50 active:scale-98 transition-all"
            >
              <FileText className="w-5 h-5 text-saffron-600" />
              <span>Upload Old Document / Passbook</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Designed for senior citizens & families • No registration fee • No banking passwords
          </p>
        </div>
      </section>

      {/* Interactive Hackathon Judge Demo Presets */}
      <section>
        <SampleScenariosBar onSelectPreset={onSelectPreset} />
      </section>

      {/* Trust & Safety Banner */}
      <section>
        <TrustBanner />
      </section>

      {/* How It Works (Senior Citizen Friendly) */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How DhanKhoj Works
          </h2>
          <p className="text-sm text-slate-500">
            Simple 3-step process designed for ordinary citizens who don't remember exact account numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:border-saffron-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-saffron-100 text-saffron-800 font-extrabold flex items-center justify-center text-base">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Tell us what you remember
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Type or speak in Hindi, Tamil, or English. You can also upload a photo of an old passbook, dividend warrant, or PF slip.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:border-saffron-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-base">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Fuzzy AI matches Indian names
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Handles abbreviations like Mohd, MD, or Kumar, spelling variations, and initials across RBI, IEPF, and EPFO records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:border-saffron-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-base">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Get official claim guidance & PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand why a record matched, print a customized document checklist, and follow step-by-step instructions for the official claim.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-Authority Registry Coverage */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Datasets Covered by DhanKhoj Engine
          </h2>
          <p className="text-xs text-slate-500">
            Modular architecture designed for official government portal integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Central Banking</span>
              <h4 className="text-sm font-bold text-slate-900">RBI DEA Fund (UDGAM)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unclaimed savings deposits, term deposits, and dormant inoperative bank balances over 10 years old.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Corporate Affairs</span>
              <h4 className="text-sm font-bold text-slate-900">IEPF Authority (MCA)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unclaimed company dividends, matured debentures, and equity shares transferred under Section 124(6).
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Labour & Employment</span>
              <h4 className="text-sm font-bold text-slate-900">EPFO Inoperative Accounts</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provident fund accounts where employment ceased and no contributions were made for 36 months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-br from-fintech-darkBlue to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to search for your family's forgotten assets?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Start with a simple sentence or document upload. DhanKhoj takes care of the complex name normalization and fuzzy search.
        </p>
        <button
          onClick={() => setActivePage('search')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-saffron-500 text-white hover:bg-saffron-600 transition-all shadow-md active:scale-95"
        >
          <Search className="w-4 h-4" />
          <span>Launch Search Assistant</span>
        </button>
      </section>
    </div>
  );
}
