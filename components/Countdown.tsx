"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SessionStage } from "@/hooks/usePhotobooth";

const COUNT_MICROCOPY: Record<number, string> = {
  3: "get ready…",
  2: "fix your hair ✦",
  1: "give us your best pose",
};

interface CountdownProps {
  stage: SessionStage;
  countdown: number | null;
  photoIndex: number;
}

export default function Countdown({ stage, countdown, photoIndex }: CountdownProps) {
  if (stage !== "countdown" && stage !== "flash") return null;

  const microcopy = countdown ? COUNT_MICROCOPY[countdown] : undefined;
  const secondPass = photoIndex > 0 && countdown === 3;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-ink/40 backdrop-blur-[2px]">
      <AnimatePresence mode="wait">
        {stage === "flash" ? (
          <motion.span
            key="flash-text"
            initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0 }}
            className="font-display text-6xl font-semibold text-white [text-shadow:0_0_30px_rgba(255,255,255,0.8)] sm:text-7xl"
          >
            ✦ FLASH ✦
          </motion.span>
        ) : (
          <motion.span
            key={countdown}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="font-display text-[7rem] font-semibold leading-none text-white [text-shadow:0_0_40px_rgba(255,255,255,0.55)] sm:text-[9rem]"
          >
            {countdown}
          </motion.span>
        )}
      </AnimatePresence>
      {stage === "countdown" && microcopy && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-hand text-xl text-white/85"
        >
          {secondPass ? "okay, one more…" : microcopy}
        </motion.span>
      )}
    </div>
  );
}
