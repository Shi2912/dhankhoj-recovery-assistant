import React from 'react';
import { ShieldCheck, ExternalLink, AlertTriangle, Landmark, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="indian-flag-strip w-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center text-white font-bold">
                DK
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DhanKhoj</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian families to uncover forgotten bank deposits, matured insurance, unclaimed dividends, and inoperative PF funds through accessible AI discovery.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-slate-800 text-amber-300 border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Free Public Utility Initiative</span>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://udgam.rbi.org.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  <span>RBI UDGAM (Unclaimed Deposits)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.iepf.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  <span>IEPF Authority (Shares & Dividends)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.epfindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  <span>EPFO Member Portal (Provident Fund)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://scores.sebi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  <span>SEBI SCORES Grievance Redressal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              DhanKhoj Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('search')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Conversational Search Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('upload')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Passbook & Document OCR
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('trust')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Trust, Safety & Anti-Fraud Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('admin')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Admin & Dataset Management
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Mandatory Legal Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Statutory Disclaimer</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              DhanKhoj does NOT hold, transfer, collect, or guarantee recovery of funds. DhanKhoj acts solely as an informational discovery and guidance tool. All claims must be verified and completed directly through the relevant official banking institution or government authority.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DhanKhoj. Built for National Financial Empowerment.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Designed with care for Indian citizens</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
