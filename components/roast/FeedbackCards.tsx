"use client";

import React from "react";
import { CheckCircle2, Zap } from "lucide-react";

interface FeedbackCardsProps {
  strengths: string[];
  improvements: string[];
}

export function FeedbackCards({ strengths, improvements }: FeedbackCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths Card */}
      <div className="bg-white dark:bg-charcoal-850 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Redeeming Strengths</span>
        </div>

        <ul className="space-y-3">
          {strengths.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actionable Improvements Card */}
      <div className="bg-white dark:bg-charcoal-850 border border-flame-500/30 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-flame-600 dark:text-flame-400 font-extrabold text-sm uppercase tracking-wider">
          <Zap className="w-5 h-5 text-flame-500" />
          <span>Actionable Fixes (High ROI)</span>
        </div>

        <ul className="space-y-3">
          {improvements.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-flame-500 mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
