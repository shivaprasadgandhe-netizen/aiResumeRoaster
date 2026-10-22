"use client";

import React from "react";
import { Layout, FileText, TrendingUp, Eye } from "lucide-react";

interface SectionScoresProps {
  sections: {
    formatting: number;
    content: number;
    impact: number;
    clarity: number;
  };
}

export function SectionScores({ sections }: SectionScoresProps) {
  const items = [
    {
      key: "formatting",
      label: "Visual Formatting & Structure",
      score: sections.formatting,
      icon: <Layout className="w-4 h-4 text-purple-500" />,
      colorClass: "bg-purple-500",
    },
    {
      key: "content",
      label: "Experience Relevance & Content",
      score: sections.content,
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      colorClass: "bg-blue-500",
    },
    {
      key: "impact",
      label: "Quantifiable Impact & Metrics",
      score: sections.impact,
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      colorClass: "bg-emerald-500",
    },
    {
      key: "clarity",
      label: "Clarity & Buzzword Resistance",
      score: sections.clarity,
      icon: <Eye className="w-4 h-4 text-amber-500" />,
      colorClass: "bg-amber-500",
    },
  ];

  return (
    <div className="bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Section Breakdown
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {item.score}/100
              </span>
            </div>
            <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.colorClass} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(100, Math.max(5, item.score))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
