import React from 'react';
import { ShieldCheck, AlertTriangle, Lock, EyeOff, FileText, CheckCircle2, ExternalLink, AlertOctagon, HeartHandshake } from 'lucide-react';

export default function TrustSafetyPage() {
  const safetyRules = [
    { title: 'Zero Passwords or Credentials', desc: 'DhanKhoj will never ask for your net banking password, ATM PIN, or UPI credentials.' },
    { title: 'Zero OTP Requests', desc: 'We never send or ask for One-Time Passwords (OTPs) under any circumstances.' },
    { title: 'Zero Recovery Fees or Commissions', desc: 'DhanKhoj is 100% free. We never charge processing charges, advance fees, or cuts.' },
    { title: 'Masked Public Identifiers', desc: 'Account numbers, Demat folios, and PF identifiers are always masked (e.g. ****-9821).' },
    { title: 'No Permanent Document Storage', desc: 'Uploaded passbooks and receipts are processed in memory for OCR and discarded immediately.' },
    { title: 'Possibility, Not Legal Guarantee', desc: 'Matches are algorithmic indicators of similarity, not definitive certificates of legal title.' },
    { title: 'Official Settlement Only', desc: 'Approved funds are transferred directly from the bank/EPFO to your bank account via NEFT/RTGS.' },
    { title: 'Transparent Explainability', desc: 'Every match shows the mathematical breakdown of name, bank, year, and location factors.' },
    { title: 'No Fabricated Government Data', desc: 'Demo records are explicitly flagged. We never fabricate live official databases.' },
    { title: 'Open Extensible Architecture', desc: 'Built to connect with official government APIs (RBI UDGAM, IEPF, EPFO) as open feeds.' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Security & Anti-Fraud Center</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Trust & Citizen Protection
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Unclaimed asset discovery is an area where scammers frequently prey on ordinary citizens. Here is how DhanKhoj safeguards you.
        </p>
      </div>

      {/* High-Alert Anti-Scam Callout */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-rose-800 font-extrabold text-base sm:text-lg">
          <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
          <span>CRITICAL ANTI-FRAUD WARNING</span>
        </div>
        <p className="text-sm text-rose-950 font-semibold leading-relaxed">
          Beware of anyone calling, messaging, or emailing you asking to pay an "advance fee", "stamp duty", or share an OTP to recover an unclaimed asset.
        </p>
        <p className="text-xs text-rose-800 leading-relaxed">
          Government agencies like the Reserve Bank of India (RBI), Ministry of Corporate Affairs (IEPF), and EPFO <strong>NEVER</strong> employ private recovery agents to demand advance fees or OTPs. All legitimate payouts are deposited directly into your verified bank account.
        </p>
      </div>

      {/* 10 Core Rules Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            DhanKhoj's 10 Core Safety Guarantees
          </h3>
          <p className="text-xs text-slate-500">
            Engineered from first principles to protect vulnerable citizens and senior citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safetyRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center justify-center">
                  {idx + 1}
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  {rule.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Official Government Portals Directory
        </h3>
        <p className="text-xs text-slate-500">
          Always verify claim procedures on official `.gov.in` and `.rbi.org.in` domains:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <a
            href="https://udgam.rbi.org.in"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-saffron-500 transition-all group block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-saffron-600">RBI UDGAM</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">udgam.rbi.org.in</p>
          </a>

          <a
            href="https://www.iepf.gov.in"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-saffron-500 transition-all group block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-saffron-600">IEPF Authority</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">www.iepf.gov.in</p>
          </a>

          <a
            href="https://www.epfindia.gov.in"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-saffron-500 transition-all group block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-saffron-600">EPFO Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">www.epfindia.gov.in</p>
          </a>
        </div>
      </div>
    </div>
  );
}
