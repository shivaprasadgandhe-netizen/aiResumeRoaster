import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, DAILY_ROAST_LIMIT } from "@/lib/rateLimit";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ScoreHistoryChart, ScoreDataPoint } from "@/components/dashboard/ScoreHistoryChart";
import { RoastHistoryTable } from "@/components/dashboard/RoastHistoryTable";
import { RoastRecord } from "@/types/roast";
import { LayoutDashboard, Flame } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const userId = session.user.id;

  // Fetch all user roasts
  const roasts = await prisma.roast.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Check rolling 24-hour rate limit
  const rateLimit = await checkRateLimit(userId);

  // Compute metrics
  const totalRoasts = roasts.length;
  const averageScore =
    totalRoasts > 0
      ? roasts.reduce((sum, r) => sum + r.overallScore, 0) / totalRoasts
      : 0;
  const bestScore = totalRoasts > 0 ? Math.max(...roasts.map((r) => r.overallScore)) : 0;

  // Prepare chronological data points for Recharts (oldest to newest)
  const chartData: ScoreDataPoint[] = [...roasts]
    .reverse()
    .map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      score: r.overallScore,
      fileName: r.fileName,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-flame-500 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            Candidate Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            Welcome back, {session.user.name?.split(" ")[0] || "Candidate"}!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Track your resume iterations, review past Gemini critiques, and benchmark your score improvement.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-flame-500 hover:bg-flame-600 text-white font-extrabold text-sm shadow-md shadow-flame-500/20 transition-all self-start sm:self-center"
        >
          <Flame className="w-4 h-4" />
          Roast New Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsOverview
        totalRoasts={totalRoasts}
        averageScore={averageScore}
        bestScore={bestScore}
        remainingQuota={rateLimit.remaining}
        maxDailyQuota={DAILY_ROAST_LIMIT}
      />

      {/* Progress Chart */}
      <ScoreHistoryChart data={chartData} />

      {/* Past Roasts History Table */}
      <RoastHistoryTable roasts={roasts as unknown as RoastRecord[]} />
    </div>
  );
}
