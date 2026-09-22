"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const MotionLink = motion(Link);

type Variant = "primary" | "secondary" | "ghost";

interface TactileButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-ink text-paper border-ink",
  secondary: "bg-paper text-ink border-ink",
  ghost: "bg-transparent text-ink border-transparent shadow-none",
};

const press = {
  rest: { x: 0, y: 0, boxShadow: "3px 3px 0 0 #2E1A47" },
  hover: { x: -1, y: -1, boxShadow: "4px 4px 0 0 #2E1A47" },
  tap: { x: 3, y: 3, boxShadow: "0px 0px 0 0 #2E1A47" },
};

/**
 * A button that feels like a stamped, physical control — it lifts a little on
 * hover and presses flat on click, rather than just fading like a typical
 * SaaS button.
 */
export default function TactileButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: TactileButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full border-2 px-7 py-3.5 font-label text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-default disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`;

  const motionProps =
    variant === "ghost"
      ? {}
      : {
          variants: press,
          initial: "rest",
          whileHover: disabled ? undefined : "hover",
          whileTap: disabled ? undefined : "tap",
          transition: { type: "spring" as const, stiffness: 500, damping: 25 },
        };

  if (href) {
    return (
      <MotionLink href={href} onClick={onClick} aria-label={ariaLabel} className={base} {...motionProps}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={base}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
