import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromPdf, PdfParseError } from "@/lib/pdf";
import { generateResumeRoast } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";
import { RoastIntensity, RoastIntensitySchema } from "@/types/roast";
import { Prisma } from "@prisma/client";

export const maxDuration = 60; // Allow sufficient execution window for AI inference

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    // 1. Session verification
    const session = await getAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in with Google, GitHub, or a test account to roast your resume." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Rolling 24-hour rate limit check (5 roasts/day)
    const rateLimit = await checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Daily quota exceeded! You have used ${rateLimit.count} of ${rateLimit.limit} roasts in the last 24 hours. Next slot frees up at ${rateLimit.resetAt.toLocaleTimeString()}.`,
          rateLimit,
        },
        { status: 429 }
      );
    }

    // 3. Parse and validate multipart form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No resume file was uploaded. Please select a valid PDF resume." },
        { status: 400 }
      );
    }

    // Validate MIME type and extension
    const isPdfType = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfType) {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF files (.pdf) are supported." },
        { status: 400 }
      );
    }

    // Validate size limit (max 5 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.` },
        { status: 400 }
      );
    }

    // Extract intensity and optional job description
    const rawIntensity = formData.get("intensity");
    const parsedIntensity = RoastIntensitySchema.safeParse(rawIntensity);
    const intensity: RoastIntensity = parsedIntensity.success ? parsedIntensity.data : "Medium";

    const jobDescription = (formData.get("jobDescription") as string | null)?.trim() || undefined;

    // 4. In-memory text extraction from PDF (no disk persistence)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = "";
    try {
      resumeText = await extractTextFromPdf(buffer);
    } catch (parseErr) {
      if (parseErr instanceof PdfParseError) {
        return NextResponse.json({ error: parseErr.message }, { status: 400 });
      }
      return NextResponse.json(
        { error: "Failed to read text from your PDF. Please ensure the file is not password-protected or corrupted." },
        { status: 400 }
      );
    }

    // 5. Generate structured roast critique via Google Gemini
    const roastResult = await generateResumeRoast({
      resumeText,
      intensity,
      jobDescription,
    });

    // 6. Save roast result into Prisma Supabase database
    const savedRoast = await prisma.roast.create({
      data: {
        userId,
        fileName: file.name,
        overallScore: roastResult.overallScore,
        resultJson: roastResult as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      {
        success: true,
        roastId: savedRoast.id,
        data: roastResult,
        quota: {
          remaining: rateLimit.remaining - 1,
          limit: rateLimit.limit,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API /api/roast error:", error);
    const message = error instanceof Error ? error.message : "Internal server error occurred while processing roast.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rateLimit = await checkRateLimit(userId);

    const recentRoasts = await prisma.roast.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      rateLimit,
      roasts: recentRoasts,
    });
  } catch (error) {
    console.error("API GET /api/roast error:", error);
    return NextResponse.json({ error: "Failed to fetch user roasts" }, { status: 500 });
  }
}
