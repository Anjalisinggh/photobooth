"use client";

import { motion } from "framer-motion";
import LayoutSelector from "@/components/LayoutSelector";
import { STICKER_DOODLES } from "@/components/Doodles";
import { STICKERS, type StickerId, type StripCustomization } from "@/types/photobooth";

const BACKGROUNDS = ["#F4ECFF", "#D8F3E7", "#FFDCEA", "#8FD8FF", "#4B2E83", "#2E1A47", "#ffffff"];
const MAX_STICKERS = 3;

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
            initial={{ rotate: -2 }}
            whileHover={{ y: -10, rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative w-full overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-booth"
          >
            {stripDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={stripDataUrl} alt="Your photobooth result" className="w-full rounded-lg" />
            ) : (
              <div className="flex aspect-[3/5] w-full items-center justify-center rounded-lg bg-panel/40 font-hand text-lg text-ink/40">
                developing…
              </div>
            )}
            {isBusy && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cream/60 backdrop-blur-sm">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
              </div>
            )}
          </motion.div>
          <p className="font-hand text-sm text-muted">hover to lift it off the page ✦</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <SectionLabel>Layout</SectionLabel>
          <LayoutSelector value={customization.layout} onChange={(layout) => onChange({ layout })} />
        </section>

        <section>
          <SectionLabel>Background</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Background ${color}`}
                onClick={() => onChange({ background: color })}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  customization.background === color ? "border-cherry scale-110" : "border-ink/15"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Decorate</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {STICKERS.map((s) => {
                const Icon = STICKER_DOODLES[s.id];
                const isActive = customization.stickers.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSticker(s.id)}
                    aria-pressed={isActive}
                    aria-label={s.label}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 p-2 transition ${
                      isActive ? "border-cherry bg-cherry/10 text-cherry" : "border-ink/15 text-ink/60 hover:border-ink/40"
                    }`}
                  >
                    <Icon className="h-full w-full" />
                  </button>
                );
              })}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2.5">
              <span className="tape h-4 w-8 rounded-sm" />
              <span className="font-body text-sm text-ink">Tape</span>
              <input
                type="checkbox"
                checked={customization.tape}
                onChange={(e) => onChange({ tape: e.target.checked })}
                className="h-4 w-4 accent-ink"
              />
            </label>
          </div>
          <p className="mt-2 font-body text-xs text-muted">Pick up to {MAX_STICKERS} — they sit in the corners, never over a face.</p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
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
            <input
              type="checkbox"
              checked={customization.showDate}
              onChange={(e) => onChange({ showDate: e.target.checked })}
              className="h-4 w-4 accent-ink"
            />
          </label>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border-2 border-ink/15 bg-paper px-4 py-3">
            <span className="font-body text-sm text-ink">Film border</span>
            <input
              type="checkbox"
              checked={customization.border}
              onChange={(e) => onChange({ border: e.target.checked })}
              className="h-4 w-4 accent-ink"
            />
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
        </section>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{children}</h3>
  );
}
