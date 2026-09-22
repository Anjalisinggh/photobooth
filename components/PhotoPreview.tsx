"use client";

import { motion } from "framer-motion";
import type { CapturedPhoto } from "@/types/photobooth";

interface PhotoPreviewProps {
  photos: CapturedPhoto[];
  total: number;
}

/** A tiny contact-sheet strip: four film frames that fill in as photos are captured. */
export default function PhotoPreview({ photos, total }: PhotoPreviewProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: total }).map((_, i) => {
          const photo = photos[i];
          return (
            <div key={i} className="relative">
              <div
                className={`relative h-16 w-16 overflow-hidden rounded-md border-2 bg-panel/40 shadow-film transition-colors duration-300 sm:h-20 sm:w-20 ${
                  photo ? "border-ink" : "border-dashed border-ink/25"
                }`}
              >
                {photo ? (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    src={photo.dataUrl}
                    alt={`Photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-label text-xs text-ink/30">
                    {i + 1}
                  </div>
                )}
              </div>
              <span
                className={`absolute -bottom-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-ink transition-colors ${
                  photo ? "bg-cherry" : "bg-transparent"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
