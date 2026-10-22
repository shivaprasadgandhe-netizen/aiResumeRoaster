"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ roastId }: { roastId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/share/${roastId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Public roast link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm backdrop-blur-sm transition-all active:scale-95 border border-white/20"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
      {copied ? "Link Copied!" : "Copy Share Link"}
    </button>
  );
}
