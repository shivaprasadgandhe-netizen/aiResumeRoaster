import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RoastResult } from "@/types/roast";
import { ScoreRing } from "@/components/roast/ScoreRing";
import { SectionScores } from "@/components/roast/SectionScores";
import { RoastCritique } from "@/components/roast/RoastCritique";
import { FeedbackCards } from "@/components/roast/FeedbackCards";
import { ConfettiTrigger } from "@/components/roast/ConfettiTrigger";
import { Flame, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "./ShareButton";

interface SharePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const roast = await prisma.roast.findUnique({
    where: { id: params.id },
    select: {
      overallScore: true,
      resultJson: true,
    },
  });

  if (!roast) {
    return {
      title: "Roast Not Found • AI Resume Roaster",
      description: "The requested resume roast report does not exist.",
    };
  }

  const result = roast.resultJson as unknown as RoastResult;

  const title = `Scored ${roast.overallScore}/100: "${result.verdict}" • AI Resume Roaster`;
  const description = `Read the brutally hilarious Gemini critique: ${result.roast?.[0]?.slice(0, 150)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "AI Resume Roaster",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ShareRoastPage({ params }: SharePageProps) {
  const roast = await prisma.roast.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      overallScore: true,
      resultJson: true,
      createdAt: true,
      // NOTE: user email is deliberately NOT selected to maintain strict user privacy
    },
  });

  if (!roast) {
    notFound();
  }

  const resultData = roast.resultJson as unknown as RoastResult;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Confetti Trigger for score >= 85 */}
      <ConfettiTrigger score={resultData.overallScore} />

      {/* Share header banner */}
      <div className="bg-gradient-to-r from-flame-600 via-flame-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Public Roast Card
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Anonymous Resume Roast
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-md">
            Someone put their resume through the Gemini roasting machine. Here is the unvarnished verdict.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <ShareButton roastId={roast.id} />
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-flame-600 hover:bg-neutral-100 font-extrabold text-sm shadow-lg transition-transform active:scale-95"
          >
            <Flame className="w-4 h-4 text-flame-500" />
            Roast Mine Now
          </Link>
        </div>
      </div>

      {/* Score and breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 mb-2">
            Final Score
          </h2>
          <ScoreRing score={resultData.overallScore} />
        </div>

        <div className="md:col-span-2">
          <SectionScores sections={resultData.sections} />
        </div>
      </div>

      {/* The Roast & Verdict */}
      <RoastCritique verdict={resultData.verdict} roast={resultData.roast} />

      {/* Strengths & Actionable Fixes */}
      <FeedbackCards
        strengths={resultData.strengths}
        improvements={resultData.improvements}
      />

      {/* Sticky Bottom Call to Action */}
      <div className="text-center p-8 bg-neutral-50 dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-flame-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-flame-500/30">
          <Flame className="w-6 h-6 animate-flame-flicker" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
          Think your resume would score higher?
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Upload your PDF for free, discover your missing ATS keywords, and find out if you can survive the roast.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-flame-500 hover:bg-flame-600 text-white font-extrabold text-sm shadow-xl shadow-flame-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <span>Roast Your Resume For Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
