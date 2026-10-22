import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { RoastIntensity, RoastResult, RoastResultSchema } from "@/types/roast";

const geminiResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    overallScore: {
      type: SchemaType.INTEGER,
      description: "Overall resume score from 0 to 100",
    },
    verdict: {
      type: SchemaType.STRING,
      description: "One punchy, hilarious, memorable one-line verdict summarizing this candidate",
    },
    roast: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3 to 6 funny, entertaining, comedic paragraphs roasting the resume's flaws, clichés, and exaggerations",
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "2 to 4 genuinely positive strengths or standout elements in the resume",
    },
    improvements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3 to 6 practical, actionable, highly specific improvements the candidate should execute",
    },
    atsKeywordsMissing: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Important industry, technology, or role-specific ATS keywords missing from the resume",
    },
    sections: {
      type: SchemaType.OBJECT,
      properties: {
        formatting: { type: SchemaType.INTEGER, description: "Visual structure, layout & readability (0-100)" },
        content: { type: SchemaType.INTEGER, description: "Relevance and depth of experience (0-100)" },
        impact: { type: SchemaType.INTEGER, description: "Quantifiable metrics, business outcomes & action verbs (0-100)" },
        clarity: { type: SchemaType.INTEGER, description: "Conciseness and avoidance of fluff/buzzwords (0-100)" },
      },
      required: ["formatting", "content", "impact", "clarity"],
    },
    jobMatch: {
      type: SchemaType.OBJECT,
      properties: {
        score: { type: SchemaType.INTEGER, description: "Match percentage 0 to 100 with the provided target job description" },
        summary: { type: SchemaType.STRING, description: "Concise analysis of fit, missing required skills, and alignment" },
      },
      required: ["score", "summary"],
    },
  },
  required: [
    "overallScore",
    "verdict",
    "roast",
    "strengths",
    "improvements",
    "atsKeywordsMissing",
    "sections",
  ],
};

function buildSystemInstruction(intensity: RoastIntensity, hasJobDescription: boolean): string {
  let toneInstruction = "";
  switch (intensity) {
    case "Gentle":
      toneInstruction = `Tone: Warm, empathetic, and lighthearted mentor. Offer gentle teasing and mild constructive banter, keeping encouragement high while pointing out honest weaknesses.`;
      break;
    case "Medium":
      toneInstruction = `Tone: Witty, sarcastic, and candid tech recruiter. You've reviewed 10,000 generic CVs today and you call out corporate jargon, vague bullet points, and cliché 'passionate team players' with sharp wit.`;
      break;
    case "Brutal":
    default:
      toneInstruction = `Tone: Merciless, brutally hilarious roast master general. Deliver side-splitting, razor-sharp comedy eviscerating corporate buzzwords, empty metrics ("assisted in doing X"), outdated tech stacks, and exaggerated claims. Do NOT hold back punches, but keep the critique focused strictly on the resume content (never discriminate on protected traits).`;
      break;
  }

  return `You are "AI Resume Roaster", a world-class career critic, executive headhunter, and stand-up comedian.
Your mission is to roast the candidate's resume with high-energy humor, comedic metaphors, and pinpoint observations, while simultaneously providing undeniably high-value, actionable career advice.

${toneInstruction}

Guidelines:
1. "overallScore": Integer between 0 and 100 reflecting overall resume competitiveness. Poor resumes score 20-55, average resumes score 55-75, exceptional resumes score 75-95.
2. "verdict": Exactly ONE punchy line that cuts straight to the soul of this resume.
3. "roast": An array of 3 to 6 laugh-out-loud paragraphs dissecting specific bullet points, formatting sins, buzzwords, and career trajectory.
4. "strengths": 2 to 4 genuine compliments identifying real skills, clean choices, or good achievements.
5. "improvements": 3 to 6 tangible, actionable changes the user can make immediately to improve interview call-back rates.
6. "atsKeywordsMissing": 4 to 8 crucial domain/industry keywords or certifications that an ATS screening bot would penalize them for omitting.
7. "sections": Ratings (0-100) for formatting, content, impact, clarity.
${
  hasJobDescription
    ? `8. The user provided a target Job Description. Compare the resume against it, calculate a realistic "jobMatch.score" (0-100), and write "jobMatch.summary" highlighting what skills they match and what gaps are fatal.`
    : `8. No specific job description was provided. You may omit jobMatch or provide score: 0 and summary: "N/A".`
}

Respond strictly in valid JSON matching the requested schema.`;
}

export interface GenerateRoastOptions {
  resumeText: string;
  intensity?: RoastIntensity;
  jobDescription?: string;
}

export async function generateResumeRoast({
  resumeText,
  intensity = "Medium",
  jobDescription,
}: GenerateRoastOptions): Promise<RoastResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in process.env. Please add it to .env.local to generate roasts."
    );
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const genAI = new GoogleGenerativeAI(apiKey);

  const hasJobDescription = Boolean(jobDescription && jobDescription.trim().length > 20);
  const systemInstruction = buildSystemInstruction(intensity, hasJobDescription);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema,
      temperature: intensity === "Brutal" ? 0.9 : intensity === "Medium" ? 0.7 : 0.5,
    },
  });

  const promptContent = `
=== RESUME CONTENT ===
${resumeText}

${
  hasJobDescription
    ? `=== TARGET JOB DESCRIPTION ===
${jobDescription?.trim()}
`
    : ""
}
`;

  // Implement retry logic (max 2 attempts)
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(promptContent);
      const text = result.response.text();

      if (!text) {
        throw new Error("Received empty response from Gemini API");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Failed to parse Gemini response as JSON: ${(jsonErr as Error).message}`);
      }

      // Validate with Zod
      const validated = RoastResultSchema.parse(parsed);
      return validated;
    } catch (err) {
      lastError = err;
      if (attempt < 2) {
        // Brief exponential backoff before retry
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }
  }

  const errorMessage = lastError instanceof Error ? lastError.message : "Unknown Gemini generation error";
  throw new Error(`Resume roast generation failed after retries: ${errorMessage}`);
}
