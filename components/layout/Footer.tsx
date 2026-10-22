import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Cpu, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-charcoal-900/60 text-neutral-600 dark:text-neutral-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-flame-500 flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-neutral-900 dark:text-white tracking-tight text-lg">
                AI Resume <span className="text-flame-500">Roaster</span>
              </span>
            </div>
            <p className="text-sm max-w-md text-neutral-600 dark:text-neutral-400">
              A brutally honest, comedic, yet constructive resume roasting engine powered by Next.js 14,
              Google Gemini, and Supabase PostgreSQL. Built for the Finlatics Full-Stack Engineering Program.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> In-Memory Privacy (Zero Disk Storage)
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-4 h-4 text-flame-500" /> Gemini Structured Output
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-flame-500 transition-colors">
                  Upload & Roast
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-flame-500 transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-flame-500 transition-colors">
                  Sign In / Demo Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech stack badges */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
              Powered By
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Next.js 14 App Router
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Google Gemini API
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Supabase + Prisma
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> NextAuth.js v4
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} AI Resume Roaster • Finlatics Course Project</p>
          <p className="flex items-center gap-1">
            Built with <Flame className="w-3.5 h-3.5 text-flame-500" /> & TypeScript for brutal career clarity.
          </p>
        </div>
      </div>
    </footer>
  );
}
