"use client";

import React from "react";
import { Flame, Quote } from "lucide-react";

interface RoastCritiqueProps {
  verdict: string;
  roast: string[];
}

export function RoastCritique({ verdict, roast }: RoastCritiqueProps) {
  return (
    <div className="bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
      {/* Verdict Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-flame-500/15 via-amber-500/10 to-red-500/15 border border-flame-500/30">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-flame-600 dark:text-flame-400 mb-1">
          <Flame className="w-4 h-4 text-flame-500 animate-flame-flicker" />
          The Final Verdict
        </div>
        <p className="text-base sm:text-xl font-black text-neutral-900 dark:text-white italic tracking-tight">
          &ldquo;{verdict}&rdquo;
        </p>
      </div>

      {/* Roast Paragraphs */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Quote className="w-4 h-4 text-flame-500" />
          The Roast
        </h3>

        <div className="space-y-4 text-neutral-800 dark:text-neutral-200 text-sm sm:text-base leading-relaxed">
          {roast.map((paragraph, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-neutral-200/70 dark:border-neutral-800/70 hover:border-flame-500/40 transition-colors"
            >
              <p>{paragraph}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
