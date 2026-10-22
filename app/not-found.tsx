import React from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-flame-500/10 text-flame-500 flex items-center justify-center mx-auto">
          <Flame className="w-8 h-8 animate-flame-flicker" />
        </div>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
          404 - Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          This resume roast or page appears to have vanished, or was never generated in the first place.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-flame-500 hover:bg-flame-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
