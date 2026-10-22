"use client";

import React, { useState, useEffect } from "react";
import { Flame, Sparkles } from "lucide-react";

const FUNNY_MESSAGES = [
  "Summoning our most cynical senior recruiter...",
  "Scanning for overused buzzwords like 'spearheaded' and 'synergy'...",
  "Measuring the gap between your bullet points and reality...",
  "Checking if your skills section is just a dictionary of buzzwords...",
  "Calculating ATS robot panic probability score...",
  "Consulting the roast masters for optimal comedic damage...",
  "Detecting that 3-month gap you cleverly disguised as 'independent sabbatical'...",
  "Verifying if you actually 'led a team of 15' or just sat in the meeting...",
  "Translating 'detail-oriented' into 'spotted two typos already'...",
  "Preparing brutal honesty with a side of actionable career advice...",
];

export function LoadingRoast() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated flame glow ring */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-flame-600 via-amber-500 to-red-600 animate-spin flex items-center justify-center shadow-xl shadow-flame-500/30 p-1">
          <div className="w-full h-full rounded-full bg-white dark:bg-charcoal-900 flex items-center justify-center">
            <Flame className="w-10 h-10 text-flame-500 animate-bounce" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
          Roasting Your Resume...
        </h3>
        <p className="text-sm font-medium text-flame-600 dark:text-flame-400 h-12 flex items-center justify-center transition-all animate-pulse">
          &ldquo;{FUNNY_MESSAGES[messageIndex]}&rdquo;
        </p>
      </div>

      {/* Animated indeterminate bar */}
      <div className="w-full max-w-xs bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-flame-500 via-amber-400 to-red-500 rounded-full animate-pulse-slow w-3/4 mx-auto" />
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Google Gemini is performing structured multi-factor critique & ATS keyword analysis.
      </p>
    </div>
  );
}
