"use client";

import type { RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Countdown from "@/components/Countdown";
import FilmGrainOverlay from "@/components/FilmGrainOverlay";
import StampFrame from "@/components/StampFrame";
import type { CameraStatus } from "@/hooks/useCamera";
import type { SessionStage } from "@/hooks/usePhotobooth";
import { getFilter } from "@/types/photobooth";
import type { FilterId } from "@/types/photobooth";

interface CameraProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  isMirrored: boolean;
  onRetryPermission: () => void;
  filter: FilterId;
  canFlip: boolean;
  onFlip: () => void;
  flashEnabled: boolean;
  onToggleFlash: () => void;
  stage: SessionStage;
  countdown: number | null;
  photoIndex: number;
  totalPhotos: number;
  showCounter: boolean;
  latestPhotoUrl?: string;
}

export default function Camera({
  videoRef,
  status,
  errorMessage,
  isMirrored,
  onRetryPermission,
  filter,
  canFlip,
  onFlip,
  flashEnabled,
  onToggleFlash,
  stage,
  countdown,
  photoIndex,
  totalPhotos,
  showCounter,
  latestPhotoUrl,
}: CameraProps) {
  const cssFilter = getFilter(filter).cssFilter;
  const frameNumber = String(photoIndex + 1).padStart(2, "0");
  const totalLabel = String(totalPhotos).padStart(2, "0");

  return (
    <div className="relative mx-auto w-full max-w-xl px-0 sm:px-6">
      {/* film-strip sprocket rails */}
      <SprocketRail side="left" />
      <SprocketRail side="right" />

      <motion.div
        animate={stage === "flash" ? { x: [0, -6, 6, -4, 4, 0], y: [0, 3, -3, 2, -2, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative aspect-square w-full overflow-hidden rounded-[28px] border-4 border-ink bg-ink shadow-booth sm:rounded-[32px]"
      >
        {status === "ready" && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover transition-[filter] duration-300"
            style={{
              filter: cssFilter,
              transform: isMirrored ? "scaleX(-1)" : "none",
            }}
          />
        )}

        {status !== "ready" && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center text-cream">
            {status === "requesting" && (
              <>
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                <p className="font-body text-sm text-cream/80">Asking for camera access…</p>
              </>
            )}
            {status === "denied" && (
              <>
                <p className="font-display text-lg">Camera access needed</p>
                <p className="font-body text-sm text-cream/70">{errorMessage}</p>
                <button
                  onClick={onRetryPermission}
                  className="rounded-full border-2 border-cream bg-cream px-5 py-2 font-label text-xs font-semibold uppercase text-ink shadow-stamp-sm transition hover:bg-white"
                >
                  Try again
                </button>
              </>
            )}
            {status === "unavailable" && (
              <>
                <p className="font-display text-lg">No camera found</p>
                <p className="font-body text-sm text-cream/70">{errorMessage}</p>
              </>
            )}
            {status === "idle" && <p className="font-body text-sm text-cream/70">Starting camera…</p>}
          </div>
        )}

        {status === "ready" && <FilmGrainOverlay opacity={0.03} />}
        {status === "ready" && <Countdown stage={stage} countdown={countdown} photoIndex={photoIndex} />}

        {status === "ready" && stage === "flash" && flashEnabled && (
          <div className="pointer-events-none absolute inset-0 z-40 animate-flash bg-white" />
        )}

        <AnimatePresence>
          {status === "ready" && stage === "captured" && latestPhotoUrl && (
            <motion.div
              key={latestPhotoUrl}
              initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -3 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-ink/30"
            >
              <div className="w-40 sm:w-48">
                <StampFrame>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={latestPhotoUrl} alt="Just captured" className="aspect-square w-full object-cover" />
                </StampFrame>
                <p className="mt-1 text-center font-hand text-sm text-ink/70">frame {frameNumber}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === "ready" && showCounter && (
          <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-md border border-dashed border-cream/50 bg-ink/55 px-3 py-1 font-label text-[11px] font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cherry" />
            frame {frameNumber}/{totalLabel}
          </div>
        )}

        {status === "ready" && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 bg-gradient-to-t from-ink/70 to-transparent p-4">
            {canFlip && (
              <ControlButton label="Flip camera" onClick={onFlip}>
                <FlipIcon />
              </ControlButton>
            )}
            <ControlButton label="Toggle flash" onClick={onToggleFlash} active={flashEnabled}>
              <FlashIcon />
            </ControlButton>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SprocketRail({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-1/2 hidden w-3 -translate-y-1/2 flex-col items-center gap-3 sm:flex ${
        side === "left" ? "left-0" : "right-0"
      }`}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <span key={i} className="h-2.5 w-2.5 rounded-[2px] bg-ink/20" />
      ))}
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 backdrop-blur-sm transition ${
        active ? "border-ink bg-cream text-ink" : "border-cream/40 bg-cream/15 text-cream hover:bg-cream/25"
      }`}
    >
      {children}
    </motion.button>
  );
}

function FlipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.5 9A8 8 0 0119.8 7.5M19.5 15A8 8 0 014.2 16.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}
