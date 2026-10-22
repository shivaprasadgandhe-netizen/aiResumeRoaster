import { z } from "zod";

export const RoastIntensitySchema = z.enum(["Gentle", "Medium", "Brutal"]);
export type RoastIntensity = z.infer<typeof RoastIntensitySchema>;

export const SectionScoresSchema = z.object({
  formatting: z.number().min(0).max(100),
  content: z.number().min(0).max(100),
  impact: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
});

export const JobMatchSchema = z
  .object({
    score: z.number().min(0).max(100),
    summary: z.string(),
  })
  .optional();

export const RoastResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  verdict: z.string().min(3),
  roast: z.array(z.string()).min(2).max(8),
  strengths: z.array(z.string()).min(2).max(6),
  improvements: z.array(z.string()).min(2).max(8),
  atsKeywordsMissing: z.array(z.string()),
  sections: SectionScoresSchema,
  jobMatch: JobMatchSchema,
});

export type RoastResult = z.infer<typeof RoastResultSchema>;

export interface RoastRecord {
  id: string;
  userId: string;
  fileName: string;
  overallScore: number;
  resultJson: RoastResult;
  createdAt: string | Date;
}
