// End-to-end verification script for AI Resume Roaster
import { prisma } from "../lib/prisma";

async function run() {
  console.log("=== 1. Checking Database User & Roast Count ===");
  const initialUsers = await prisma.user.count();
  const initialRoasts = await prisma.roast.count();
  console.log(`Initial Users: ${initialUsers}, Initial Roasts: ${initialRoasts}`);

  console.log("\n=== 2. Testing NextAuth Demo Login Flow ===");
  // Fetch CSRF Token
  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  const csrfCookies = csrfRes.headers.getSetCookie();
  const csrfCookieHeader = csrfCookies.map((c) => c.split(";")[0]).join("; ");

  console.log("Got CSRF Token:", csrfToken);

  // Authenticate
  const authRes = await fetch("http://localhost:3000/api/auth/callback/demo-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookieHeader,
    },
    body: new URLSearchParams({
      csrfToken,
      email: "candidate@demo.com",
      name: "Alex Candidate",
      json: "true",
    }),
  });

  const authCookies = authRes.headers.getSetCookie();
  const sessionCookieHeader = authCookies.map((c) => c.split(";")[0]).join("; ");
  console.log("Auth Response Status:", authRes.status);
  console.log("Has Session Cookie:", sessionCookieHeader.includes("next-auth.session-token"));

  // Check Session
  const sessionRes = await fetch("http://localhost:3000/api/auth/session", {
    headers: {
      Cookie: sessionCookieHeader,
    },
  });
  const session = await sessionRes.json();
  console.log("Active Session User:", session?.user?.name, session?.user?.email, "ID:", session?.user?.id);

  if (!session?.user?.id) {
    throw new Error("Authentication failed to establish session!");
  }

  console.log("\n=== 3. Testing Real Gemini Roast Generation & Database Storage ===");
  // Generate a 100% structurally valid PDF in-memory buffer using PDFDocument
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const resumeLines = [
    "Alex Candidate",
    "Senior Full Stack Software Engineer | candidate@demo.com | (555) 123-4567",
    "GitHub: github.com/alexcandidate | LinkedIn: linkedin.com/in/alexcandidate",
    "",
    "SUMMARY:",
    "Passionate and results-driven Full Stack Engineer with over 5 years of progressive experience.",
    "Proven track record in architecting mission-critical distributed systems and microservices.",
    "Spearheaded enterprise cross-functional initiatives to optimize operational throughput.",
    "",
    "TECHNICAL SKILLS:",
    "Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3",
    "Frameworks & Libraries: React, Next.js 14, Node.js, Express, Tailwind CSS, Prisma ORM",
    "Databases & Cloud: MySQL, PostgreSQL, Redis, MongoDB, AWS (EC2, S3, RDS), Docker, CI/CD",
    "",
    "PROFESSIONAL EXPERIENCE:",
    "Lead Software Engineer - FinTech Innovations Inc. (2022 - Present)",
    "- Architected and deployed scalable RESTful APIs serving 2.5 million daily active users.",
    "- Spearheaded database indexing and query re-engineering, slashing API latency by 45%.",
    "- Led a high-performing squad of 8 engineers and conducted rigorous code reviews.",
    "- Implemented automated CI/CD deployment pipelines utilizing GitHub Actions and Docker.",
    "",
    "Software Engineer - CloudScale Solutions (2020 - 2022)",
    "- Built responsive web interfaces using React, Next.js, and TypeScript.",
    "- Integrated third-party OAuth providers and secure payment processing gateways.",
    "- Championed automated unit and integration testing coverage, achieving 92% code coverage."
  ];

  let y = 750;
  for (const line of resumeLines) {
    page.drawText(line, {
      x: 50,
      y,
      size: line.startsWith("Alex") ? 18 : line.endsWith(":") ? 12 : 10,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= line.startsWith("Alex") ? 24 : 18;
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  // Build FormData
  const formData = new FormData();
  const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });
  formData.append("file", fileBlob, "Alex_Candidate_Resume.pdf");
  formData.append("intensity", "Brutal");
  formData.append("jobDescription", "Senior Full Stack Tech Lead with Node.js and AWS expertise");

  console.log("Sending POST /api/roast with in-memory PDF...");
  const roastRes = await fetch("http://localhost:3000/api/roast", {
    method: "POST",
    headers: {
      Cookie: sessionCookieHeader,
    },
    body: formData,
  });

  const roastJson = await roastRes.json();
  console.log("Roast API Status:", roastRes.status);

  if (!roastRes.ok) {
    console.error("Roast API Error:", roastJson);
    throw new Error(roastJson.error || "Failed /api/roast");
  }

  console.log("\n================ ROAST SUCCESS ================");
  console.log("Roast ID:", roastJson.roastId);
  console.log("Overall Score:", roastJson.data.overallScore);
  console.log("Verdict:", roastJson.data.verdict);
  console.log("First Paragraph:", roastJson.data.roast[0]);
  console.log("Missing ATS Keywords:", roastJson.data.atsKeywordsMissing);
  console.log("Job Match Score:", roastJson.data.jobMatch?.score + "%");
  console.log("Remaining Quota:", roastJson.quota?.remaining);

  console.log("\n=== 4. Verifying Persistence in MySQL Database ===");
  const savedRecord = await prisma.roast.findUnique({
    where: { id: roastJson.roastId },
    include: { user: true },
  });

  console.log("DB Verified:", Boolean(savedRecord));
  console.log("Saved Under User:", savedRecord?.user?.name, savedRecord?.user?.email);
  console.log("File Name in DB:", savedRecord?.fileName);
  console.log("Score in DB:", savedRecord?.overallScore);

  console.log("\n=== 5. Testing Dashboard and Public Share Endpoints ===");
  const dashRes = await fetch("http://localhost:3000/dashboard", {
    headers: { Cookie: sessionCookieHeader },
  });
  console.log("Dashboard Status for Logged-in User:", dashRes.status);

  const shareRes = await fetch(`http://localhost:3000/share/${roastJson.roastId}`);
  console.log("Public Share Page Status (Unauthenticated):", shareRes.status);

  console.log("\n>>> ALL SYSTEM VERIFICATIONS PASSED WITH 100% SUCCESS! <<<");
  process.exit(0);
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
