"use client";

import { AnimatePresence, motion } from "framer-motion";
import LayoutSelector from "@/components/LayoutSelector";
import StampFrame from "@/components/StampFrame";
import Switch from "@/components/Switch";
import { SparkleDoodle, STICKER_DOODLES } from "@/components/Doodles";
import { STICKERS, type StickerId, type StripCustomization } from "@/types/photobooth";

const BACKGROUNDS = ["#F2E8D8", "#EAD9C4", "#F1D6C9", "#8FA6B0", "#5A3625", "#2B211B", "#ffffff"];
const MAX_STICKERS = 3;

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 26, delay: i * 0.06 },
  }),
};

interface PhotoboothStripProps {
  stripDataUrl: string | null;
  customization: StripCustomization;
  onChange: (patch: Partial<StripCustomization>) => void;
  isBusy?: boolean;
}

export default function PhotoboothStrip({ stripDataUrl, customization, onChange, isBusy }: PhotoboothStripProps) {
  function toggleSticker(id: StickerId) {
    const has = customization.stickers.includes(id);
    if (has) {
      onChange({ stickers: customization.stickers.filter((s) => s !== id) });
    } else if (customization.stickers.length < MAX_STICKERS) {
      onChange({ stickers: [...customization.stickers, id] });
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr]">
      <div className="mx-auto w-full max-w-[320px]">
        <div className="sticky top-6 flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -14, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            whileHover={{ y: -10, rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative w-full"
          >
            <StampFrame>
              <AnimatePresence mode="wait">
                {stripDataUrl ? (
                  <motion.img
                    key={stripDataUrl}
                    initial={{ opacity: 0, filter: "blur(10px) brightness(0.65) saturate(0.7)" }}
                    animate={{ opacity: 1, filter: "blur(0px) brightness(1) saturate(1)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    src={stripDataUrl}
                    alt="Your photobooth result"
                    className="w-full"
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex aspect-[3/5] w-full items-center justify-center bg-panel/40 font-hand text-lg text-ink/40"
                  >
                    developing…
                  </motion.div>
                )}
              </AnimatePresence>
            </StampFrame>
            {isBusy && (
              <div className="absolute inset-0 flex items-center justify-center bg-cream/60 backdrop-blur-sm">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
              </div>
            )}
            <SparkleDoodle className="pointer-events-none absolute -right-3 -top-3 h-6 w-6 animate-sparkle text-cherry" />
          </motion.div>
          <p className="font-hand text-sm text-muted">hover to lift it off the page ✦</p>
        </div>
      </div>

      <div className="space-y-5">
        <Panel index={0}>
          <SectionLabel>Layout</SectionLabel>
          <LayoutSelector value={customization.layout} onChange={(layout) => onChange({ layout })} />
        </Panel>

        <Panel index={1}>
          <SectionLabel>Background</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {BACKGROUNDS.map((color) => {
              const isActive = customization.background === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Background ${color}`}
                  onClick={() => onChange({ background: color })}
                  className="relative h-10 w-10 shrink-0"
                >
                  {isActive && (
                    <motion.span
                      layoutId="bg-active-ring"
                      className="absolute -inset-[5px] rounded-full border-2 border-cherry"
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    />
                  )}
                  <motion.span
                    animate={{ scale: isActive ? 1.06 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="absolute inset-0 rounded-full border-2 border-ink/15"
                    style={{ backgroundColor: color }}
                  />
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel index={2}>
          <SectionLabel>Decorate</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {STICKERS.map((s) => {
                const Icon = STICKER_DOODLES[s.id];
                const isActive = customization.stickers.includes(s.id);
                return (
                  <motion.button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSticker(s.id)}
                    aria-pressed={isActive}
                    aria-label={s.label}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 p-2 transition-colors ${
                      isActive ? "border-cherry bg-cherry/10 text-cherry" : "border-ink/15 text-ink/60 hover:border-ink/40"
                    }`}
                  >
                    <Icon className="h-full w-full" />
                  </motion.button>
                );
              })}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2.5">
              <span className="tape h-4 w-8 rounded-sm" />
              <span className="font-body text-sm text-ink">Tape</span>
              <Switch checked={customization.tape} onChange={(v) => onChange({ tape: v })} aria-label="Tape" />
            </label>
          </div>
          <p className="mt-3 font-body text-xs text-muted">
            Pick up to {MAX_STICKERS} — they sit in the corners, never over a face.
          </p>
        </Panel>

        <Panel index={3}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <SectionLabel>Handwritten caption</SectionLabel>
              <input
                type="text"
                maxLength={28}
                value={customization.caption}
                onChange={(e) => onChange({ caption: e.target.value })}
                placeholder="the photobooth"
                className="w-full rounded-xl border-2 border-ink/15 bg-paper px-4 py-2.5 font-hand text-lg text-ink placeholder:text-ink/30 focus:border-ink/40 focus:outline-none"
              />
            </div>
            <label className="flex h-fit items-center justify-between rounded-xl border-2 border-ink/15 bg-paper px-4 py-3">
              <span className="font-body text-sm text-ink">Show date stamp</span>
              <Switch checked={customization.showDate} onChange={(v) => onChange({ showDate: v })} aria-label="Show date stamp" />
            </label>
          </div>
        </Panel>

        <Panel index={4}>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-xl border-2 border-ink/15 bg-paper px-4 py-3">
              <span className="font-body text-sm text-ink">Film border</span>
              <Switch checked={customization.border} onChange={(v) => onChange({ border: v })} aria-label="Film border" />
            </label>
            <div>
              <h3 className="mb-2 flex items-center justify-between font-label text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
                <span>Spacing</span>
                <span className="font-body text-xs normal-case tracking-normal text-ink/40">{customization.spacing}px</span>
              </h3>
              <input
                type="range"
                min={0}
                max={36}
                step={2}
                value={customization.spacing}
                onChange={(e) => onChange({ spacing: Number(e.target.value) })}
                className="w-full accent-ink"
              />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <motion.section
      custom={index}
      initial="hidden"
      animate="show"
      variants={panelVariants}
      className="rounded-3xl border-2 border-ink/10 bg-cream/70 p-5 shadow-film"
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{children}</h3>
  );
}
