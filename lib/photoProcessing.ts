import { FilterDefinition, StickerId, StripCustomization, getFilter, getSticker } from "@/types/photobooth";

/** Loads a data URL into an HTMLImageElement. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/**
 * Best-effort wait for the custom webfonts used when baking text onto <canvas> —
 * without this, a caption can render in a fallback font on the very first composite.
 */
async function ensureFontsReady(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load("600 32px 'Poppins'"),
      document.fonts.load("700 32px 'Poppins'"),
      document.fonts.load("500 32px 'Space Grotesk'"),
      document.fonts.load("600 32px 'Space Grotesk'"),
      document.fonts.load("700 32px 'Space Grotesk'"),
      document.fonts.load("600 32px 'Caveat'"),
    ]);
    await document.fonts.ready;
  } catch {
    // Best-effort — canvas falls back to system fonts if these aren't ready in time.
  }
}

function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");
  return { canvas, ctx };
}

/** Adds a light procedural film-grain layer on top of whatever is currently drawn. */
function applyGrain(ctx: CanvasRenderingContext2D, w: number, h: number, intensity = 0.05): void {
  const { canvas: noiseCanvas, ctx: noiseCtx } = makeCanvas(w, h);
  const imageData = noiseCtx.createImageData(w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255 * intensity;
  }
  noiseCtx.putImageData(imageData, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.drawImage(noiseCanvas, 0, 0);
  ctx.restore();
}

/**
 * Captures the current video frame onto a canvas with the given filter baked in,
 * returning a JPEG data URL. Mirrors the frame when the front camera is used so the
 * export matches what the user saw in the live preview.
 */
export function capturePhotoFromVideo(
  video: HTMLVideoElement,
  filter: FilterDefinition,
  mirror: boolean
): string {
  const w = video.videoWidth || 1280;
  const h = video.videoHeight || 1280;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.save();
  ctx.filter = filter.cssFilter;
  if (mirror) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, w, h);
  ctx.restore();

  if (filter.overlay) {
    ctx.fillStyle = filter.overlay;
    ctx.fillRect(0, 0, w, h);
  }
  if (filter.grain) {
    applyGrain(ctx, w, h, 0.06);
  }

  return canvas.toDataURL("image/jpeg", 0.92);
}

/** Draws `img` into the rect (x, y, w, h), cropping to cover (like CSS object-fit: cover). */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  const imgRatio = img.width / img.height;
  const rectRatio = w / h;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;

  if (imgRatio > rectRatio) {
    sw = img.height * rectRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / rectRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function formatDate(ts: number): string {
  return new Date(ts)
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

/** A short rotated strip of "washi tape" across the top edge of the composition. */
function drawTape(ctx: CanvasRenderingContext2D, w: number): void {
  const tapeW = Math.min(230, w * 0.42);
  const tapeH = 30;

  ctx.save();
  ctx.translate(w / 2, tapeH * 0.1);
  ctx.rotate((-3.5 * Math.PI) / 180);

  ctx.save();
  ctx.beginPath();
  ctx.rect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
  ctx.clip();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "#D2A15A";
  ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
  ctx.fillStyle = "#8A2A2E";
  const stripe = 9;
  for (let x = -tapeW; x < tapeW; x += stripe * 2) {
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate((32 * Math.PI) / 180);
    ctx.fillRect(-stripe / 2, -tapeH * 2, stripe, tapeH * 4);
    ctx.restore();
  }
  ctx.restore();

  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(46,26,71,0.18)";
  ctx.lineWidth = 1;
  ctx.strokeRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
  ctx.restore();
}

/** Scatters up to 3 stickers around the outer corners of the composition — never over a photo's center. */
function drawStickers(ctx: CanvasRenderingContext2D, w: number, h: number, footerTop: number, stickers: StickerId[]): void {
  if (!stickers.length) return;
  const size = Math.max(30, Math.round(w * 0.085));
  const anchors: { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline; rot: number }[] = [
    { x: size * 0.55, y: size * 0.55, align: "center", baseline: "middle", rot: -12 },
    { x: w - size * 0.55, y: size * 0.6, align: "center", baseline: "middle", rot: 14 },
    { x: size * 0.6, y: footerTop - size * 0.55, align: "center", baseline: "middle", rot: 10 },
    { x: w - size * 0.6, y: footerTop - size * 0.55, align: "center", baseline: "middle", rot: -14 },
  ];
  const colors = ["#8A2A2E", "#5A3625", "#8FA06B"];

  stickers.slice(0, 3).forEach((id, i) => {
    const sticker = getSticker(id);
    const anchor = anchors[i % anchors.length];
    ctx.save();
    ctx.translate(anchor.x, anchor.y);
    ctx.rotate((anchor.rot * Math.PI) / 180);
    ctx.font = `${size}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = anchor.align;
    ctx.textBaseline = anchor.baseline;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillText(sticker.glyph, 0, 0);
    ctx.restore();
  });
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  w: number,
  y: number,
  height: number,
  customization: StripCustomization,
  ink: string
): void {
  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const captionSize = Math.round(height * 0.44);
  const dateSize = Math.round(height * 0.18);

  if (customization.caption) {
    ctx.font = `600 ${captionSize}px "Caveat", cursive`;
    ctx.fillText(customization.caption, w / 2, y + height * 0.44, w - 40);
  }
  if (customization.showDate) {
    ctx.font = `600 ${dateSize}px "Space Grotesk", system-ui, sans-serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(formatDate(Date.now()), w / 2, y + height * 0.8, w - 40);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

const CELL = 560;

function inkFor(background: string): string {
  // Cheap luminance check so caption text stays legible on dark backgrounds.
  const hex = background.replace("#", "");
  if (hex.length !== 6) return "#2B211B";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#2B211B" : "#FBF5E9";
}

async function composeStripLayout(images: HTMLImageElement[], c: StripCustomization): Promise<HTMLCanvasElement> {
  const pad = c.border ? 26 : 12;
  const spacing = c.spacing;
  const footer = 108;
  const w = CELL + pad * 2;
  const h = pad * 2 + images.length * CELL + (images.length - 1) * spacing + footer;
  const { canvas, ctx } = makeCanvas(w, h);
  const ink = inkFor(c.background);

  ctx.fillStyle = c.background;
  ctx.fillRect(0, 0, w, h);

  images.forEach((img, i) => {
    const y = pad + i * (CELL + spacing);
    if (c.border) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, pad - 6, y - 6, CELL + 12, CELL + 12, 6);
      ctx.fill();
      ctx.restore();
    }
    roundRect(ctx, pad, y, CELL, CELL, c.border ? 4 : 10);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, img, pad, y, CELL, CELL);
    ctx.restore();
  });

  if (c.tape) drawTape(ctx, w);
  drawStickers(ctx, w, h, h - footer, c.stickers);
  drawFooter(ctx, w, h - footer, footer, c, ink);
  return canvas;
}

async function composeGridLayout(images: HTMLImageElement[], c: StripCustomization): Promise<HTMLCanvasElement> {
  const pad = c.border ? 26 : 12;
  const spacing = c.spacing;
  const footer = 108;
  const cellW = CELL * 0.82;
  const w = pad * 2 + cellW * 2 + spacing;
  const h = pad * 2 + cellW * 2 + spacing + footer;
  const { canvas, ctx } = makeCanvas(w, h);
  const ink = inkFor(c.background);

  ctx.fillStyle = c.background;
  ctx.fillRect(0, 0, w, h);

  images.slice(0, 4).forEach((img, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = pad + col * (cellW + spacing);
    const y = pad + row * (cellW + spacing);
    if (c.border) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.16)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, x - 5, y - 5, cellW + 10, cellW + 10, 6);
      ctx.fill();
      ctx.restore();
    }
    roundRect(ctx, x, y, cellW, cellW, c.border ? 4 : 10);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, img, x, y, cellW, cellW);
    ctx.restore();
  });

  if (c.tape) drawTape(ctx, w);
  drawStickers(ctx, w, h, h - footer, c.stickers);
  drawFooter(ctx, w, h - footer, footer, c, ink);
  return canvas;
}

async function composePolaroidLayout(images: HTMLImageElement[], c: StripCustomization): Promise<HTMLCanvasElement> {
  const cardW = CELL * 0.72;
  const photoH = cardW;
  const cardPad = 22;
  const cardBottom = 64;
  const cardH = photoH + cardPad * 2 + cardBottom;
  const overlap = cardH * 0.62;
  const w = cardW + 160;
  const h = cardPad + cardH + overlap * (images.length - 1) + 90;
  const { canvas, ctx } = makeCanvas(w, h);
  const ink = inkFor(c.background);

  ctx.fillStyle = c.background;
  ctx.fillRect(0, 0, w, h);

  const rotations = [-4, 3, -3, 4, -2, 2];

  images.forEach((img, i) => {
    const x = (w - cardW) / 2;
    const y = 30 + i * overlap;
    const angle = (rotations[i % rotations.length] * Math.PI) / 180;

    ctx.save();
    ctx.translate(x + cardW / 2, y + cardH / 2);
    ctx.rotate(angle);
    ctx.translate(-cardW / 2, -cardH / 2);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, 0, 0, cardW, cardH, 4);
    ctx.fill();
    ctx.restore();

    roundRect(ctx, cardPad, cardPad, cardW - cardPad * 2, photoH - cardPad, 2);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, img, cardPad, cardPad, cardW - cardPad * 2, photoH - cardPad);
    ctx.restore();

    ctx.fillStyle = "#2B211B";
    ctx.font = `600 20px "Space Grotesk", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText(`#${i + 1}`, cardW / 2, photoH + cardPad + 30);

    ctx.restore();
  });

  if (c.tape) drawTape(ctx, w);

  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = `600 34px "Caveat", cursive`;
  ctx.fillText(c.caption || "the photobooth", w / 2, h - 32);
  ctx.restore();

  drawStickers(ctx, w, h, h, c.stickers);
  return canvas;
}

async function composeStoryLayout(images: HTMLImageElement[], c: StripCustomization): Promise<HTMLCanvasElement> {
  const w = 1080;
  const h = 1920;
  const { canvas, ctx } = makeCanvas(w, h);
  const ink = inkFor(c.background);

  ctx.fillStyle = c.background;
  ctx.fillRect(0, 0, w, h);

  if (c.tape) drawTape(ctx, w);

  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = `700 64px "Poppins", system-ui, sans-serif`;
  ctx.fillText((c.caption || "the photobooth").toUpperCase(), w / 2, 170);
  ctx.restore();

  const gridPad = 90;
  const spacing = c.spacing + 12;
  const cell = (w - gridPad * 2 - spacing) / 2;
  const gridTop = 260;

  images.slice(0, 4).forEach((img, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = gridPad + col * (cell + spacing);
    const y = gridTop + row * (cell + spacing);
    if (c.border) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, x - 8, y - 8, cell + 16, cell + 16, 8);
      ctx.fill();
      ctx.restore();
    }
    roundRect(ctx, x, y, cell, cell, c.border ? 6 : 14);
    ctx.save();
    ctx.clip();
    drawImageCover(ctx, img, x, y, cell, cell);
    ctx.restore();
  });

  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = `600 40px "Caveat", cursive`;
  if (c.showDate) ctx.fillText(formatDate(Date.now()), w / 2, gridTop + (cell + spacing) * 2 + 70);
  ctx.restore();

  drawStickers(ctx, w, h, h, c.stickers);
  return canvas;
}

/** Composes the final photobooth output image for the given layout + customization. */
export async function composeStrip(photoDataUrls: string[], customization: StripCustomization): Promise<string> {
  const [images] = await Promise.all([Promise.all(photoDataUrls.map(loadImage)), ensureFontsReady()]);
  let canvas: HTMLCanvasElement;

  switch (customization.layout) {
    case "grid":
      canvas = await composeGridLayout(images, customization);
      break;
    case "polaroid":
      canvas = await composePolaroidLayout(images, customization);
      break;
    case "story":
      canvas = await composeStoryLayout(images, customization);
      break;
    case "strip":
    default:
      canvas = await composeStripLayout(images, customization);
      break;
  }

  return canvas.toDataURL("image/jpeg", 0.95);
}

/** Convenience helper to re-derive a filter's live-preview CSS filter string. */
export function previewFilterStyle(filterId: string): string {
  return getFilter(filterId as never).cssFilter;
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
