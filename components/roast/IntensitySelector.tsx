"use client";

import React from "react";
import { RoastIntensity } from "@/types/roast";
import { Flame, Smile, AlertTriangle, Skull } from "lucide-react";

interface IntensitySelectorProps {
  value: RoastIntensity;
  onChange: (intensity: RoastIntensity) => void;
  disabled?: boolean;
}

export function IntensitySelector({ value, onChange, disabled }: IntensitySelectorProps) {
  const options: {
    id: RoastIntensity;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    colorClasses: string;
    badgeClasses: string;
  }[] = [
    {
      id: "Gentle",
      label: "Gentle",
      sublabel: "Constructive & kind mentor",
      icon: <Smile className="w-5 h-5 text-emerald-500" />,
      colorClasses: "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10",
      badgeClasses: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/20",
    },
    {
      id: "Medium",
      label: "Medium",
      sublabel: "Sarcastic & candid recruiter",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      colorClasses: "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10",
      badgeClasses: "text-amber-600 dark:text-amber-400 bg-amber-500/20",
    },
    {
      id: "Brutal",
      label: "Brutal",
      sublabel: "Savage, merciless comedic evisceration",
      icon: <Skull className="w-5 h-5 text-red-500 animate-pulse" />,
      colorClasses: "border-red-500/60 bg-red-500/5 dark:bg-red-500/10 shadow-lg shadow-red-500/10",
      badgeClasses: "text-red-600 dark:text-red-400 bg-red-500/20 font-bold",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-flame-500" />
          Choose Roast Intensity
        </label>
        <span className="text-xs text-neutral-500">Pick your tolerance for emotional damage</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={`relative flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? `${option.colorClasses} ring-2 ring-offset-1 ring-flame-500 dark:ring-offset-charcoal-900`
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-charcoal-850"
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">
                    {option.label}
                  </span>
                </div>
                {isSelected && (
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${option.badgeClasses}`}>
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                {option.sublabel}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
