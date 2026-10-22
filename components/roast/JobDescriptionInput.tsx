"use client";

import React, { useState } from "react";
import { Briefcase, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function JobDescriptionInput({ value, onChange, disabled }: JobDescriptionInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-charcoal-850/60 transition-all">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-flame-500" />
          <span>Compare Against Target Job Description</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-flame-500/10 text-flame-600 dark:text-flame-400">
            Optional
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span>{isOpen ? "Hide" : "Add JD"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 pt-0 border-t border-neutral-200/60 dark:border-neutral-800/60 space-y-2 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Gemini will calculate a match percentage and pinpoint missing ATS skills required for this specific role.
            </span>
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Paste the job title, requirements, and responsibilities here (e.g. Senior Full Stack Engineer at Fintech startup)..."
            rows={4}
            className="w-full text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-transparent transition-all"
          />
        </div>
      )}
    </div>
  );
}
