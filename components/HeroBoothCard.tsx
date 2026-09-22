"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { HeartDoodle, SparkleDoodle, StarDoodle } from "@/components/Doodles";

const FRAME_PHOTOS = ["/hero/frame-1.svg", "/hero/frame-2.svg", "/hero/frame-3.svg", "/hero/frame-4.svg"];

/**
 * The landing page's centerpiece: a physical-feeling photobooth strip that
 * tilts gently toward the cursor and lifts on hover — the "little world of
 * its own" the visitor sees before they even start a session.
 */
export default function HeroBoothCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex w-full max-w-sm items-center justify-center py-6"
      style={{ perspective: 1000 }}
    >
      {/* floating decorations */}
      <span
        className="absolute -left-6 top-2 h-9 w-9 animate-float text-cherry sm:-left-10"
        style={{ "--rot": "-10deg" } as React.CSSProperties}
      >
        <StarDoodle className="h-full w-full" />
      </span>
      <span
        className="absolute -right-4 top-16 h-7 w-7 animate-float text-sage [animation-delay:0.6s] sm:-right-8"
        style={{ "--rot": "14deg" } as React.CSSProperties}
      >
        <SparkleDoodle className="h-full w-full" />
      </span>
      <span
        className="absolute -left-8 bottom-8 h-8 w-8 animate-float text-pink [animation-delay:1.2s] sm:-left-12"
        style={{ "--rot": "8deg" } as React.CSSProperties}
      >
        <HeartDoodle className="h-full w-full" />
      </span>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -8, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative w-64 rotate-[-2deg] rounded-[26px] border-4 border-ink bg-cocoa p-3 shadow-booth sm:w-72"
      >
        <span className="tape absolute left-1/2 top-[-14px] z-20 h-7 w-28 -translate-x-1/2 -rotate-3 rounded-sm" />
        <div className="relative overflow-hidden rounded-2xl bg-ink/85">
          <div className="grid grid-rows-4 gap-1.5 p-1.5">
            {FRAME_PHOTOS.map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Sample photobooth frame ${i + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 animate-hero-flash bg-white" />
        </div>
        <div className="mt-3 flex items-center justify-between px-1 pb-1">
          <p className="font-hand text-lg text-cream/85">the photobooth ✦</p>
          <p className="font-label text-[10px] uppercase tracking-widest text-cream/45">4 CUT</p>
        </div>
      </motion.div>

      <div className="absolute -right-5 -top-5 flex h-14 w-14 animate-pulse-soft items-center justify-center rounded-full border-[3px] border-ink bg-butter shadow-stamp-sm sm:h-16 sm:w-16">
        <div className="h-7 w-7 rounded-full border-[3px] border-ink/70 sm:h-8 sm:w-8" />
      </div>
    </div>
  );
}
