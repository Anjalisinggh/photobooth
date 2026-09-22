"use client";

import { FILTERS, type FilterId } from "@/types/photobooth";

interface FilterSelectorProps {
  value: FilterId;
  onChange: (id: FilterId) => void;
  stream: MediaStream | null;
  mirror: boolean;
}

/** Attaches the shared camera stream to a small preview <video> so each filter tile shows a live thumbnail. */
function attachStream(stream: MediaStream | null) {
  return (el: HTMLVideoElement | null) => {
    if (el && stream && el.srcObject !== stream) {
      el.srcObject = stream;
    }
  };
}

export default function FilterSelector({ value, onChange, stream, mirror }: FilterSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-7 sm:gap-3">
      {FILTERS.map((f) => {
        const isActive = value === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            aria-pressed={isActive}
            className="group flex flex-col items-center gap-1.5"
          >
            <span
              className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 transition ${
                isActive ? "border-cherry shadow-stamp-sm" : "border-ink/15 group-hover:border-ink/40"
              }`}
            >
              {stream ? (
                <video
                  ref={attachStream(stream)}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  style={{ filter: f.cssFilter, transform: mirror ? "scaleX(-1)" : "none" }}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-panel/50 font-label text-[9px] uppercase text-ink/30">
                  {f.label}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                  <span className="rounded-full bg-cream/90 px-1.5 py-0.5 font-label text-[9px] font-semibold text-ink">
                    ✓
                  </span>
                </span>
              )}
            </span>
            <span
              className={`font-label text-[10px] font-semibold uppercase tracking-wide ${
                isActive ? "text-cherry" : "text-ink/55"
              }`}
            >
              {f.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
