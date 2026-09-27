// Core domain types shared across the photobooth app.

export type FilterId =
  | "original"
  | "blackwhite"
  | "vintage"
  | "warm"
  | "cool"
  | "flash"
  | "dreamy";

export interface FilterDefinition {
  id: FilterId;
  label: string;
  description: string;
  /** CSS filter string applied to the live preview + baked into captured frames. */
  cssFilter: string;
  /** Optional flat color wash applied on top of the frame (rgba string) for stylistic looks. */
  overlay?: string;
  /** Whether a subtle grain/vignette should be layered on top of this filter. */
  grain?: boolean;
}

export type LayoutId = "strip" | "grid" | "polaroid" | "story";

export interface LayoutDefinition {
  id: LayoutId;
  label: string;
  tag: string;
  description: string;
}

export type CameraFacing = "user" | "environment";

export interface CapturedPhoto {
  id: string;
  /** JPEG data URL of the raw captured frame (filter baked in, not destructive to nothing else). */
  dataUrl: string;
  takenAt: number;
}

export type SessionStage =
  | "idle"
  | "requesting-permission"
  | "permission-denied"
  | "style-select"
  | "countdown"
  | "flashing"
  | "captured"
  | "reviewing-strip"
  | "customizing";

/** A small fixed set of decorative stickers users can scatter around (never over) their photos. */
export type StickerId = "star" | "heart" | "flower" | "sparkle" | "smiley" | "squiggle";

export interface StickerDefinition {
  id: StickerId;
  glyph: string;
  label: string;
}

export const STICKERS: StickerDefinition[] = [
  { id: "star", glyph: "☆", label: "Star" },
  { id: "heart", glyph: "♡", label: "Heart" },
  { id: "flower", glyph: "❀", label: "Flower" },
  { id: "sparkle", glyph: "✦", label: "Sparkle" },
  { id: "smiley", glyph: "☺", label: "Smiley" },
  { id: "squiggle", glyph: "〰", label: "Squiggle" },
];

export function getSticker(id: StickerId): StickerDefinition {
  return STICKERS.find((s) => s.id === id) ?? STICKERS[0];
}

export interface StripCustomization {
  layout: LayoutId;
  filter: FilterId;
  background: string;
  border: boolean;
  caption: string;
  showDate: boolean;
  /** Up to 3 stickers scattered around the corners of the composition. */
  stickers: StickerId[];
  /** A short strip of washi tape across the top of the composition. */
  tape: boolean;
  spacing: number;
}

export interface PhotoboothSession {
  id: string;
  createdAt: number;
  filter: FilterId;
  layout: LayoutId;
  photos: CapturedPhoto[];
  stripDataUrl: string;
  customization: StripCustomization;
}

export const PHOTOS_PER_SESSION = 4;

export const FILTERS: FilterDefinition[] = [
  {
    id: "original",
    label: "Original",
    description: "Natural colors, clean editorial look",
    cssFilter: "contrast(1.03) saturate(1.02)",
  },
  {
    id: "blackwhite",
    label: "B&W",
    description: "Black & white, high contrast, traditional booth",
    cssFilter: "grayscale(1) contrast(1.25) brightness(1.02)",
    grain: true,
  },
  {
    id: "vintage",
    label: "Vintage",
    description: "Warm tones, soft faded colors, film grain",
    cssFilter: "sepia(0.35) saturate(1.2) contrast(0.95) brightness(1.05)",
    overlay: "rgba(196,64,44,0.08)",
    grain: true,
  },
  {
    id: "warm",
    label: "Warm",
    description: "Golden-hour warmth, cozy and inviting",
    cssFilter: "saturate(1.25) contrast(1.05) brightness(1.06) hue-rotate(-6deg)",
    overlay: "rgba(244,196,82,0.1)",
  },
  {
    id: "cool",
    label: "Y2K",
    description: "Chrome-blue point-and-shoot flash energy",
    cssFilter: "saturate(1.2) contrast(1.15) brightness(1.05) hue-rotate(10deg)",
    overlay: "rgba(169,199,216,0.14)",
  },
  {
    id: "flash",
    label: "Flash",
    description: "Direct-flash aesthetic, dark background, high contrast",
    cssFilter: "contrast(1.35) brightness(1.12) saturate(1.1)",
    overlay: "rgba(10,10,10,0.18)",
  },
  {
    id: "dreamy",
    label: "Dreamy",
    description: "Soft highlights, gentle glow, pastel appearance",
    cssFilter: "brightness(1.1) contrast(0.9) saturate(0.95) blur(0.3px)",
    overlay: "rgba(255,255,255,0.12)",
  },
];

export const LAYOUTS: LayoutDefinition[] = [
  { id: "strip", label: "Classic Strip", tag: "4 CUT", description: "Vertical 4-photo photobooth strip" },
  { id: "grid", label: "Grid", tag: "GRID", description: "Even square collage" },
  { id: "polaroid", label: "Polaroid", tag: "POLAROID", description: "Stacked polaroid-style frames" },
  { id: "story", label: "Story", tag: "FILM", description: "Tall layout made for Instagram Stories" },
];

export function getFilter(id: FilterId): FilterDefinition {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}

export function getLayout(id: LayoutId): LayoutDefinition {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

export function defaultCustomization(overrides?: Partial<StripCustomization>): StripCustomization {
  return {
    layout: "strip",
    filter: "original",
    background: "#F2E8D8",
    border: true,
    caption: "the photobooth",
    showDate: true,
    stickers: ["sparkle"],
    tape: true,
    spacing: 14,
    ...overrides,
  };
}
