import React from "react";
import { UploadDropzone } from "@/components/roast/UploadDropzone";
import { Flame, ShieldCheck, Zap, Bot, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-flame-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-flame-500/10 border border-flame-500/25 text-flame-600 dark:text-flame-400 text-xs sm:text-sm font-bold tracking-tight">
          <Flame className="w-4 h-4 animate-flame-flicker" />
          <span>The Brutally Honest AI Resume Critic</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          Your Resume Is Probably Boring.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-flame-600 via-amber-500 to-red-600">
            Let&apos;s Roast It.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Upload your PDF for a side-splitting, recruitment-grade roast powered by Google Gemini.
          Uncover missing ATS keywords, spot empty buzzwords, and get actionable fixes to land interviews.
        </p>

        {/* Upload Dropzone Container */}
        <div className="pt-4">
          <UploadDropzone />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
            Why Standard Resume Checkers Fail You
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto">
            Generic automated scanners give polite, useless feedback. ResumeRoaster gives you the unfiltered recruiter reaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-charcoal-850 space-y-4 hover:border-flame-500/40 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-flame-500/10 text-flame-500 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              3 Roast Intensities
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Pick between Gentle (supportive mentor), Medium (sarcastic tech recruiter), or Brutal (unforgiving roast master general).
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-charcoal-850 space-y-4 hover:border-cyan-500/40 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Target Job Matching
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Paste a specific job description to evaluate keyword alignment, gap severity, and role competitiveness percentage.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-charcoal-850 space-y-4 hover:border-emerald-500/40 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              In-Memory Privacy First
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Your uploaded PDF is parsed strictly in server RAM and never saved to disk or permanent file storage. Your career data remains yours.
            </p>
          </div>
        </div>
      </section>

      {/* Sample Roasts Teaser */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-neutral-50 to-white dark:from-charcoal-850 dark:to-charcoal-900 p-8 sm:p-12 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-flame-500 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" /> Real Gemini Output Sample
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                &ldquo;You claimed to &apos;synergize multi-platform paradigm shifts&apos; — was that code for answering Slack messages?&rdquo;
              </h3>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <span className="text-3xl font-black text-red-500">42/100</span>
              <p className="text-xs text-neutral-400">Average Buzzword Casualty</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Actionable Fix:</strong> Replace vague phrases with concrete metrics (e.g. &ldquo;Reduced API latency by 38%&rdquo;).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>ATS Detection:</strong> Uncover high-value omissions like Docker, CI/CD, or PostgreSQL.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
