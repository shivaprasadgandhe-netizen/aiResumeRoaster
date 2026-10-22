/**
 * In-memory PDF text extraction using pdf-parse.
 * Imports from pdf-parse/lib/pdf-parse.js to avoid the default package's test-stub bug in Next.js bundlers.
 */

// @ts-expect-error pdf-parse internal lib lacks direct TypeScript declaration
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export class PdfParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfParseError";
  }
}

/**
 * Extracts plain text from an in-memory PDF Buffer.
 * Validates that the text contains at least 200 characters of readable text.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    const rawText = data?.text || "";
    const cleanedText = rawText.replace(/\s+/g, " ").trim();

    if (cleanedText.length < 200) {
      throw new PdfParseError(
        "This PDF does not appear to have selectable text (fewer than 200 characters detected). It may be a scanned image or empty. Please upload an export with readable text."
      );
    }

    return cleanedText;
  } catch (error) {
    if (error instanceof PdfParseError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Failed to extract text from PDF";
    throw new PdfParseError(`PDF parsing failed: ${message}`);
  }
}
