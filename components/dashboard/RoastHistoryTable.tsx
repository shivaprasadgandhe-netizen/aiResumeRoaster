"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, Share2, Calendar, Award } from "lucide-react";
import { RoastRecord } from "@/types/roast";

interface RoastHistoryTableProps {
  roasts: RoastRecord[];
}

export function RoastHistoryTable({ roasts }: RoastHistoryTableProps) {
  if (!roasts || roasts.length === 0) {
    return (
      <div className="bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-flame-500/10 text-flame-500 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-neutral-900 dark:text-white">
          No Resumes Roasted Yet
        </h4>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          Upload your resume from the home page to see your roast feedback and track improvements here.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-flame-500 hover:bg-flame-600 text-white text-xs font-bold transition-all shadow-md shadow-flame-500/20"
        >
          Roast Your First Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-flame-500" />
          Past Roast Reports
        </h3>
        <span className="text-xs text-neutral-500">{roasts.length} Total</span>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {roasts.map((roast) => {
          const dateStr = new Date(roast.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const score = roast.overallScore;
          let scoreBadgeColor = "text-red-600 bg-red-500/10 border-red-500/20";
          if (score >= 85) scoreBadgeColor = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
          else if (score >= 70) scoreBadgeColor = "text-cyan-600 bg-cyan-500/10 border-cyan-500/20";
          else if (score >= 50) scoreBadgeColor = "text-amber-600 bg-amber-500/10 border-amber-500/20";

          return (
            <div
              key={roast.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${scoreBadgeColor}`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    {score}/100
                  </span>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {roast.fileName}
                  </p>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 italic line-clamp-1">
                  &ldquo;{roast.resultJson?.verdict}&rdquo;
                </p>
                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {dateStr}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  href={`/share/${roast.id}`}
                  className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                  title="View Public Share Card"
                >
                  <Share2 className="w-4 h-4" />
                </Link>
                <Link
                  href={`/roast/${roast.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-flame-600 dark:hover:bg-flame-400 dark:hover:text-white text-xs font-bold transition-all"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
