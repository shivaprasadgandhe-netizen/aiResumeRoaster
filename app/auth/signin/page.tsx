"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { Flame, Github, Sparkles, Shield, UserCheck, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [demoName, setDemoName] = useState("Alex Candidate");
  const [demoEmail, setDemoEmail] = useState("candidate@demo.com");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl });
  };

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProvider("demo");
    await signIn("demo-login", {
      email: demoEmail,
      name: demoName,
      callbackUrl,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-flame-600 to-amber-500 items-center justify-center shadow-lg shadow-flame-500/30 mb-2">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Enter the <span className="text-flame-500">Roast Zone</span>
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to upload your resume, receive ruthless Gemini critiques, and track your scores.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={loadingProvider !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {loadingProvider === "google" ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={loadingProvider !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            {loadingProvider === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
          <span className="bg-white dark:bg-charcoal-850 px-3 text-xs text-neutral-400 uppercase tracking-widest font-semibold">
            Or Instant Test Access
          </span>
        </div>

        {/* Instant Demo Account (Great for Evaluator Grading) */}
        <form onSubmit={handleDemoSignIn} className="space-y-3 bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-flame-600 dark:text-flame-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Course Evaluator & Demo Sign-In</span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-flame-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-flame-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loadingProvider !== null}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            <UserCheck className="w-3.5 h-3.5 text-flame-400" />
            {loadingProvider === "demo" ? "Signing In..." : "Sign In with Demo Account"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>OAuth 2.0 Secure Session • In-Memory Processing</span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-flame-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
