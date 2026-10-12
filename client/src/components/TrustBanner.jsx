import React from 'react';
import { ShieldCheck, Lock, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function TrustBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-fintech-darkBlue to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/50 my-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
            <ShieldCheck className="w-4 h-4 text-saffron-400" />
            <span>Citizen Trust Commitment</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            "Your money. Your rights. Your decision."
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            DhanKhoj does not hold, transfer, or guarantee recovery of funds. Final verification and claims are completed directly through the relevant official institution.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-slate-200">Zero Passwords or OTPs</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-slate-200">100% Free Service</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-slate-200">Masked Privacy</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-medium text-slate-200">Official Settlement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
