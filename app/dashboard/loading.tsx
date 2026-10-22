import React from "react";

export default function LoadingDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="h-14 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        ))}
      </div>

      <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      <div className="h-72 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
    </div>
  );
}
