import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoastResult } from "@/types/roast";
import { ScoreRing } from "@/components/roast/ScoreRing";
import { SectionScores } from "@/components/roast/SectionScores";
import { RoastCritique } from "@/components/roast/RoastCritique";
import { FeedbackCards } from "@/components/roast/FeedbackCards";
import { AtsKeywords } from "@/components/roast/AtsKeywords";
import { ReportActions } from "@/components/roast/ReportActions";
import { ConfettiTrigger } from "@/components/roast/ConfettiTrigger";
import { FileText, Calendar, ShieldCheck, Flame } from "lucide-react";

interface RoastPageProps {
  params: {
    id: string;
  };
}

export default async function RoastDetailsPage({ params }: RoastPageProps) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=/roast/${params.id}`);
  }

  const roast = await prisma.roast.findUnique({
    where: { id: params.id },
  });

  if (!roast) {
    notFound();
  }

  // Ensure only the owner can view this private roast page
  if (roast.userId !== session.user.id) {
    // If not owner, redirect to the public sanitized share view
    redirect(`/share/${params.id}`);
  }

  const resultData = roast.resultJson as unknown as RoastResult;

  const formattedDate = new Date(roast.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Confetti Trigger for score >= 85 */}
      <ConfettiTrigger score={resultData.overallScore} />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-flame-500">
            <Flame className="w-4 h-4" />
            Resume Roast Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-flame-500" />
            {roast.fileName}
          </h1>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Private Evaluation
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="self-start sm:self-center">
          <ReportActions roastId={roast.id} fileName={roast.fileName} data={resultData} />
        </div>
      </div>

      {/* Main Grid: Score summary & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left Column: Overall Score Ring */}
        <div className="lg:col-span-1 bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 mb-2">
            Overall Competitiveness
          </h2>
          <ScoreRing score={resultData.overallScore} />
        </div>

        {/* Right Column: Section Scores Breakdown */}
        <div className="lg:col-span-2">
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

      {/* Missing ATS Keywords & Job Match */}
      <AtsKeywords
        keywords={resultData.atsKeywordsMissing}
        jobMatch={resultData.jobMatch}
      />

      {/* Bottom Actions */}
      <ReportActions roastId={roast.id} fileName={roast.fileName} data={resultData} />
    </div>
  );
}
