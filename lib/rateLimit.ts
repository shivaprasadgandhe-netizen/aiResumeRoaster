import { prisma } from "@/lib/prisma";

export const DAILY_ROAST_LIMIT = 5;

export interface RateLimitStatus {
  allowed: boolean;
  count: number;
  remaining: number;
  limit: number;
  resetAt: Date;
}

/**
 * Checks per-user daily rate limit (5 roasts per 24 hours) stored directly in Prisma.
 */
export async function checkRateLimit(userId: string): Promise<RateLimitStatus> {
  const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Count roasts created within the rolling 24-hour window
  const count = await prisma.roast.count({
    where: {
      userId,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  const remaining = Math.max(0, DAILY_ROAST_LIMIT - count);
  const allowed = count < DAILY_ROAST_LIMIT;

  // Find the earliest roast in the current window to estimate when quota recovers
  let resetAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  if (count > 0) {
    const oldestInWindow = await prisma.roast.findFirst({
      where: {
        userId,
        createdAt: {
          gte: windowStart,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
      },
    });

    if (oldestInWindow) {
      resetAt = new Date(oldestInWindow.createdAt.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  return {
    allowed,
    count,
    remaining,
    limit: DAILY_ROAST_LIMIT,
    resetAt,
  };
}
