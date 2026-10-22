"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiTriggerProps {
  score: number;
}

export function ConfettiTrigger({ score }: ConfettiTriggerProps) {
  useEffect(() => {
    if (score >= 85) {
      // Fire confetti bursts
      const end = Date.now() + 1500;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#f97316", "#eab308", "#10b981", "#06b6d4"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#f97316", "#eab308", "#10b981", "#06b6d4"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [score]);

  return null;
}
