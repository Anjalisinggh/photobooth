"use client";

import { motion } from "framer-motion";

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  "aria-label"?: string;
}

/** A small iOS-style toggle whose knob slides with a spring, instead of a bare checkbox. */
export default function Switch({ checked, onChange, "aria-label": ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors ${
        checked ? "border-ink bg-ink" : "border-ink/25 bg-ink/10"
      }`}
    >
      <motion.span
        animate={{ left: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-cream shadow-sm"
      />
    </button>
  );
}
