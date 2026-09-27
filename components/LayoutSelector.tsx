"use client";

import { motion } from "framer-motion";
import { LAYOUTS, type LayoutId } from "@/types/photobooth";

interface LayoutSelectorProps {
  value: LayoutId;
  onChange: (id: LayoutId) => void;
}

export default function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {LAYOUTS.map((l) => {
        const isActive = value === l.id;
        return (
          <motion.button
            key={l.id}
            type="button"
            onClick={() => onChange(l.id)}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border-2 px-3 py-4 transition-colors ${
              isActive ? "border-ink text-cream" : "border-ink/15 bg-paper text-ink hover:border-ink/40"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="layout-active-pill"
                className="absolute inset-0 bg-ink shadow-stamp-sm"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center gap-2">
              <LayoutGlyph id={l.id} active={isActive} />
              <span className="font-label text-[11px] font-semibold tracking-wide">[ {l.tag} ]</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function LayoutGlyph({ id, active }: { id: LayoutId; active: boolean }) {
  const tone = active ? "bg-cream/80" : "bg-ink/25";
  if (id === "strip") {
    return (
      <div className="flex h-10 w-7 flex-col gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`flex-1 rounded-[2px] ${tone}`} />
        ))}
      </div>
    );
  }
  if (id === "grid") {
    return (
      <div className="grid h-9 w-9 grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`rounded-[2px] ${tone}`} />
        ))}
      </div>
    );
  }
  if (id === "polaroid") {
    return (
      <div className="relative h-10 w-9">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`absolute left-1/2 top-0 h-7 w-8 -translate-x-1/2 rounded-[2px] border ${
              active ? "border-cream/40 bg-cream/70" : "border-ink/10 bg-ink/20"
            }`}
            style={{ transform: `translate(-50%, ${i * 5}px) rotate(${(i - 1) * 6}deg)` }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={`h-10 w-6 rounded-[3px] ${tone} grid grid-cols-2 gap-0.5 p-0.5`}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`rounded-[1px] ${active ? "bg-ink/30" : "bg-paper/60"}`} />
      ))}
    </div>
  );
}
