import React from "react";

export default function LoadingRoastPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="h-16 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        <div className="lg:col-span-2 h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      </div>

      <div className="h-56 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      </div>
    </div>
  );
}
