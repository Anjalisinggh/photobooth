// Synthesizes a small photobooth "shutter click" purely with the Web Audio API,
// so no binary audio asset needs to ship with the app.

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedContext) sharedContext = new Ctor();
  return sharedContext;
}

/** Plays a short two-part "click-clack" shutter sound. Safe to call even if audio is blocked. */
export function playShutterSound(): void {
  try {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    playClick(ctx, now, 1400, 0.22);
    playClick(ctx, now + 0.05, 900, 0.16);
  } catch {
    // Audio is a nice-to-have; never let it break the capture flow.
  }
}

/** Plays a soft rising chime used when a whole session finishes. */
export function playCompletionChime(): void {
  try {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const start = now + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.09, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  } catch {
    // ignore
  }
}

function playClick(ctx: AudioContext, start: number, frequency: number, duration: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const noise = createNoiseBurst(ctx, duration * 0.6);

  osc.type = "square";
  osc.frequency.setValueAtTime(frequency, start);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, start + duration);

  gain.gain.setValueAtTime(0.2, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);

  if (noise) {
    noise.start(start);
  }
}

function createNoiseBurst(ctx: AudioContext, duration: number): AudioBufferSourceNode | null {
  try {
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    source.buffer = buffer;
    source.connect(gain).connect(ctx.destination);
    return source;
  } catch {
    return null;
  }
}
