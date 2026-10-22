"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UploadCloud, FileText, X, Flame, ShieldAlert, ArrowRight, Lock } from "lucide-react";
import { IntensitySelector } from "./IntensitySelector";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { LoadingRoast } from "./LoadingRoast";
import { RoastIntensity } from "@/types/roast";
import Link from "next/link";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function UploadDropzone() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [intensity, setIntensity] = useState<RoastIntensity>("Medium");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    // Check MIME and extension
    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Invalid file format. Please upload a PDF resume (.pdf).");
      return false;
    }

    // Check size limit
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(
        `File size too large (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`
      );
      return false;
    }

    setFile(selectedFile);
    toast.success(`Selected "${selectedFile.name}" (${(selectedFile.size / 1024).toFixed(0)} KB)`);
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in first to roast your resume!");
      router.push("/auth/signin");
      return;
    }

    if (!file) {
      toast.error("Please select a PDF resume to roast.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("intensity", intensity);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const res = await fetch("/api/roast", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate resume roast");
      }

      toast.success("Resume roasted successfully! Directing to results...");
      router.push(`/roast/${data.roastId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong while roasting.";
      toast.error(msg, { duration: 6000 });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-charcoal-850 border border-flame-500/40 rounded-2xl shadow-2xl p-6 sm:p-10">
        <LoadingRoast />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-charcoal-850 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Unauthenticated notice banner if user isn't logged in */}
      {status !== "loading" && !session?.user && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-flame-500/10 border border-flame-500/30 gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-flame-800 dark:text-flame-300">
            <Lock className="w-4 h-4 text-flame-500 shrink-0" />
            <span>Sign in with Google, GitHub, or Demo account to enable resume roasting.</span>
          </div>
          <Link
            href="/auth/signin"
            className="shrink-0 px-4 py-1.5 text-xs font-bold rounded-lg bg-flame-500 hover:bg-flame-600 text-white shadow-sm transition-all"
          >
            Sign In Now
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone Container */}
        <div>
          <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-2">
            Upload Your PDF Resume
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
            id="resume-pdf-input"
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-flame-500 bg-flame-500/10 scale-[1.01]"
                  : "border-neutral-300 dark:border-neutral-700 hover:border-flame-500/80 bg-neutral-50/50 dark:bg-charcoal-900/40 hover:bg-neutral-100/50 dark:hover:bg-charcoal-900/80"
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-flame-500/20 to-amber-500/20 border border-flame-500/30 flex items-center justify-center mx-auto mb-4 text-flame-500 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-1">
                Drag and drop your PDF resume here, or{" "}
                <span className="text-flame-500 underline decoration-flame-500/50">browse files</span>
              </h4>

              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                PDF format only. Maximum 5 MB. Evaluated strictly in-memory without persistent disk storage.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border border-flame-500/40 bg-flame-500/5 dark:bg-flame-500/10">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-lg bg-flame-500 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for review
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Intensity Selector */}
        <IntensitySelector value={intensity} onChange={setIntensity} disabled={isLoading} />

        {/* Target Job Description Input */}
        <JobDescriptionInput
          value={jobDescription}
          onChange={setJobDescription}
          disabled={isLoading}
        />

        {/* Submit Roast Button */}
        <button
          type="submit"
          disabled={!file || isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-flame-600 via-flame-500 to-amber-500 hover:from-flame-700 hover:to-amber-600 text-white font-extrabold text-base shadow-xl shadow-flame-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          <Flame className="w-5 h-5 animate-bounce" />
          <span>Roast My Resume Now</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
          <span>Your PDF is parsed in memory and never stored on disk. Daily limit: 5 roasts.</span>
        </div>
      </form>
    </div>
  );
}
