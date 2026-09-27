"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import StampFrame from "@/components/StampFrame";

const FRAME_PHOTOS = ["/hero/frame-1.svg", "/hero/frame-2.svg", "/hero/frame-3.svg", "/hero/frame-4.svg"];
const CYCLE_MS = 2600;

/**
 * The landing page's centerpiece: a little photo printer that feeds out a
 * fresh postage-stamp photo every couple seconds — the "get your photos in
 * here" moment from the moodboard, replayed as a small looping scene.
 */
export default function HeroBoothCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % FRAME_PHOTOS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[280px] flex-col items-center">
      {/* the printer body */}
      <div className="relative z-10 w-full">
        <div className="h-9 w-full rounded-t-[10px] rounded-b-[3px] border-2 border-ink bg-panel shadow-stamp-sm" />
        <div className="absolute inset-x-3 top-3 h-4 rounded-[3px] border border-ink/50 bg-ink/85" />
        {/* feet teeth along the underside, like a receipt printer's slot */}
        <div className="flex justify-center gap-[3px] px-2">
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-b-full border-2 border-t-0 border-ink bg-panel" />
          ))}
        </div>
      </div>

      {/* the photo currently sliding out, one at a time */}
      <div className="relative z-0 -mt-1 h-64 w-[190px] overflow-visible">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ y: -70, opacity: 0, rotate: -1 }}
            animate={{ y: 0, opacity: 1, rotate: -2.5 }}
            exit={{ y: 40, opacity: 0, rotate: 4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 mx-auto w-[170px]"
          >
            <StampFrame>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FRAME_PHOTOS[index]}
                alt="Sample photobooth frame"
                className="aspect-[4/5] w-full object-cover"
                draggable={false}
              />
            </StampFrame>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* floating decorations */}
      <span className="absolute -left-9 top-6 h-8 w-8 animate-float text-butter sm:-left-12" style={{ "--rot": "-10deg" } as React.CSSProperties}>
        <svg viewBox="0 0 40 44" fill="none" aria-hidden className="h-full w-full">
          <path d="M11 14h18l-1.6 20.5A4 4 0 0 1 23.4 38H16.6a4 4 0 0 1-4-3.5Z" fill="#D2A15A" stroke="#2B211B" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M9 14h22" stroke="#2B211B" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse cx="20" cy="8" rx="5.5" ry="2.4" fill="#FFFDF7" stroke="#2B211B" strokeWidth="1.1" />
        </svg>
      </span>
      <span className="absolute -right-6 top-24 h-7 w-7 animate-float text-cherry [animation-delay:0.6s] sm:-right-10" style={{ "--rot": "14deg" } as React.CSSProperties}>
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden className="h-full w-full">
          <path d="M16 2c.8 5 2.3 9 5 11.5S27 16 30 16c-3 .9-6.7 2-9 4.5S17 26 16 30c-.8-4-2.3-8-5-10.5S4 16.9 2 16c3-.6 6.3-1.7 9-4S15.2 6 16 2Z" />
        </svg>
      </span>
      <span className="absolute -bottom-6 -left-7 font-hand text-2xl text-cherry [animation-delay:1.2s] sm:-left-10">xoxo</span>
    </div>
  );
}
