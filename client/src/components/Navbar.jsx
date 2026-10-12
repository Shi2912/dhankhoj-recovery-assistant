import React from 'react';
import { Search, FileText, History, ShieldCheck, Database, Landmark, Sparkles } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'search', label: 'Search Assistant', icon: Search },
    { id: 'upload', label: 'Document OCR', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'trust', label: 'Trust & Safety', icon: ShieldCheck },
    { id: 'admin', label: 'Admin Portal', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="indian-flag-strip w-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActivePage('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fintech-darkBlue to-slate-900 flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 text-saffron-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Dhan<span className="text-saffron-600">Khoj</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  Demo Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AI Recovery Assistant for India's Unclaimed Wealth
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 shadow-inner'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('search')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-sm hover:from-saffron-600 hover:to-saffron-700 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find My Money</span>
            </button>
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
