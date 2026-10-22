"use client";

import React, { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 180, strokeWidth = 14 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // 1.2s animation
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine score color scheme
  let colorClass = "text-red-500 stroke-red-500";
  let bgGradient = "from-red-500/10 to-red-500/5";
  let label = "Needs Immediate CPR";

  if (score >= 85) {
    colorClass = "text-emerald-500 stroke-emerald-500";
    bgGradient = "from-emerald-500/10 to-emerald-500/5";
    label = "Top-Tier Heavyweight";
  } else if (score >= 70) {
    colorClass = "text-cyan-500 stroke-cyan-500";
    bgGradient = "from-cyan-500/10 to-cyan-500/5";
    label = "Competitive Contender";
  } else if (score >= 50) {
    colorClass = "text-amber-500 stroke-amber-500";
    bgGradient = "from-amber-500/10 to-amber-500/5";
    label = "Lukewarm Average";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative flex items-center justify-center rounded-full p-2 bg-gradient-to-b ${bgGradient}`}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-neutral-200 dark:text-neutral-800"
            fill="transparent"
          />
          {/* Dynamic progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-300 ease-out`}
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
            {animatedScore}
          </span>
          <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">
            / 100
          </span>
        </div>
      </div>

      <span className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
        {label}
      </span>
    </div>
  );
}
