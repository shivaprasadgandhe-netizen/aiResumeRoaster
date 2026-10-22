"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Flame, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-flame-500/10 text-flame-500 flex items-center justify-center mx-auto">
          <Flame className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-neutral-900 dark:text-white">
          Something Went Off Rails
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          {error.message || "An unexpected error occurred while rendering this page."}
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-flame-500 hover:bg-flame-600 text-white text-xs font-bold transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
