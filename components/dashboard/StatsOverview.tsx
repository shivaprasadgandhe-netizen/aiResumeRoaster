"use client";

import React from "react";
import { Flame, Award, BarChart3, Clock } from "lucide-react";

interface StatsOverviewProps {
  totalRoasts: number;
  averageScore: number;
  bestScore: number;
  remainingQuota: number;
  maxDailyQuota: number;
}

export function StatsOverview({
  totalRoasts,
  averageScore,
  bestScore,
  remainingQuota,
  maxDailyQuota,
}: StatsOverviewProps) {
  const cards = [
    {
      label: "Total Roasts",
      value: totalRoasts,
      sublabel: "Resumes roasted to date",
      icon: <Flame className="w-5 h-5 text-flame-500" />,
      colorClass: "border-flame-500/20 bg-flame-500/5",
    },
    {
      label: "Average Score",
      value: `${averageScore.toFixed(0)}/100`,
      sublabel: totalRoasts > 0 ? "Overall competitiveness" : "No evaluations yet",
      icon: <BarChart3 className="w-5 h-5 text-cyan-500" />,
      colorClass: "border-cyan-500/20 bg-cyan-500/5",
    },
    {
      label: "Personal Best",
      value: `${bestScore}/100`,
      sublabel: bestScore >= 85 ? "High-ranking benchmark" : "Keep refining metrics",
      icon: <Award className="w-5 h-5 text-emerald-500" />,
      colorClass: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      label: "Daily Quota",
      value: `${remainingQuota} left`,
      sublabel: `Out of ${maxDailyQuota} daily roasts`,
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      colorClass: "border-purple-500/20 bg-purple-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-4 sm:p-5 rounded-2xl border ${card.colorClass} bg-white dark:bg-charcoal-850 shadow-sm space-y-2`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {card.label}
            </span>
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {card.icon}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              {card.value}
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              {card.sublabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
