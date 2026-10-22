"use client";

import React from "react";
import { Tag, Target, CheckCircle } from "lucide-react";

interface AtsKeywordsProps {
  keywords: string[];
  jobMatch?: {
    score: number;
    summary: string;
  };
}

export function AtsKeywords({ keywords, jobMatch }: AtsKeywordsProps) {
  const hasJobMatch = Boolean(jobMatch && jobMatch.summary && jobMatch.summary !== "N/A");

  return (
    <div className="space-y-6">
      {/* Job Description Match Card (if requested) */}
      {hasJobMatch && jobMatch && (
        <div className="bg-white dark:bg-charcoal-850 border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm uppercase tracking-wider">
              <Target className="w-5 h-5 text-blue-500" />
              <span>Target Role Fit</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {jobMatch.score}% Match
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {jobMatch.summary}
          </p>
        </div>
      )}

      {/* Missing ATS Keywords Tag Cloud */}
      <div className="bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-extrabold text-sm uppercase tracking-wider">
            <Tag className="w-4 h-4 text-flame-500" />
            <span>Missing ATS Keywords & Skills</span>
          </div>
          <span className="text-[11px] text-neutral-500">Add to bypass screening bots</span>
        </div>

        {keywords && keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
              >
                <span>+</span>
                <span>{kw}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-500 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            No glaring ATS keyword gaps detected.
          </p>
        )}
      </div>
    </div>
  );
}
