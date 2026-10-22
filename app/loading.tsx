import React from "react";
import { Flame } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-flame-600 to-amber-500 flex items-center justify-center shadow-lg shadow-flame-500/30 animate-bounce">
        <Flame className="w-8 h-8 text-white animate-flame-flicker" />
      </div>
      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
        Loading Resume Roaster...
      </p>
    </div>
  );
}
