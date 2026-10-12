import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function ConfidenceBadge({ score = 0, tier, label }) {
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  let Icon = HelpCircle;
  let text = label || 'Weak Match';

  if (score >= 90) {
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    Icon = CheckCircle2;
    text = label || 'Strong Possible Match';
  } else if (score >= 75) {
    badgeColor = 'bg-blue-50 text-blue-800 border-blue-300';
    Icon = CheckCircle2;
    text = label || 'Likely Possible Match';
  } else if (score >= 60) {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
    Icon = AlertCircle;
    text = label || 'Possible Match';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor} shadow-sm`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{score}% {text}</span>
    </span>
  );
}
