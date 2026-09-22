# The Photobooth

A real, browser-based digital photobooth — designed to feel like a little scrapbook
photo studio rather than a generic camera utility. Built with Next.js (App Router),
TypeScript, React, Tailwind CSS and Framer Motion. Everything runs on the client: the
camera feed, filters, photo capture, strip generation and storage all happen in the
browser — nothing is ever uploaded anywhere.

## Design direction

A pastel Y2K / vaporwave digital-desktop aesthetic. Every page's background is the
actual supplied wallpaper image (`public/bg/wallpaper.png` — a purple-to-pink gradient
scattered with chunky bubble-letter stickers and thick dark-outlined desktop icons:
cassette tapes, polaroids, folders), used directly rather than redrawn, with page content
laid out to sit in its clear middle rather than over its corner artwork. Typography is a
90s-retro-photobooth pairing: Lilita One — chunky, playful, nostalgic — for display
headlines, Space Grotesk for all other UI chrome (labels, badges, buttons, nav) to keep
the interface clean and usable with a slightly retro-futuristic edge, Caveat for
handwritten captions/stickers, and DM Sans for body copy. That, and a
lavender/pink/mint/butter-yellow palette with a deep indigo-purple ink carry the same
feel through the rest of the app (camera screen, result screen, "The Wall"), alongside
hand-drawn doodle stickers, washi tape, film sprockets, and tactile stamp-style buttons
that visibly lift on hover and press flat on click.

## Features

- Live camera preview via `navigator.mediaDevices.getUserMedia`, with front/rear camera
  switching where the device supports it, live-filtered contact-sheet preview tiles, and
  a proper film-frame chrome (sprocket rails, frame counter stamp).
- 7 film styles (Original, B&W, Vintage, Warm, Y2K, Flash, Dreamy) applied as canvas
  filters, non-destructively — the original frame is never altered by a later choice.
- A full session flow: pick a style &rarr; 3-second countdown with rotating playful
  microcopy &rarr; screen flash + camera shake &rarr; capture, repeated for 4 photos,
  with a shutter click and completion chime synthesized with the Web Audio API (no audio
  files to ship), and each capture briefly appears as a physical print before settling
  into the film-frame progress tray.
- 4 output layouts: classic vertical strip ("4 Cut"), 2&times;2 grid, polaroid stack, and
  a tall Instagram Story layout — all composed client-side on `<canvas>`.
- A "Decorate" scrapbook mode: pick up to 3 doodle stickers (star, heart, flower,
  sparkle, smiley, squiggle) that scatter into the corners without ever covering a face,
  an optional washi-tape strip, a handwritten caption baked in the Caveat typeface, plus
  background color, film border, date stamp and photo spacing.
- The result strip tilts and lifts physically on hover (Framer Motion), rather than
  sitting in a flat card.
- "My Photos" ("The Wall"): a local library of past sessions stored in **IndexedDB**,
  rendered as a scrapbook wall of taped prints with a stable per-card tilt, a detail view,
  per-photo and strip downloads, and delete / clear-all.
- Fully responsive; the mobile camera view drops the outer gutters for a near
  full-bleed, immersive capture screen.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The dev server needs to run
over `http://localhost` (or HTTPS) for camera access to work — that's a browser security
requirement, and localhost is exempted from it automatically.

To build for production:

```bash
npm run build
npm run start
```

## Camera permissions

The first time you click **Enter the Booth**, your browser will prompt for camera
access. If you accidentally block it, the app shows a "Camera access needed" screen with
a **Try again** button — clicking it re-requests permission. To actually change the
answer, you'll usually need to reset the site's camera permission in your browser's
address-bar site settings (the padlock/info icon) and reload.

If no camera is detected, or another app is already using it, the app shows a clear
error message instead of a blank preview.

## Local photo storage

Photos and generated strips are stored **only** in your browser's IndexedDB
(`photobooth-db`), scoped to this site's origin on this device. Nothing is sent to a
server — there's no backend in this project at all. That means:

- Photos persist across refreshes and browser restarts, but are specific to the browser
  profile and device you used.
- Clearing site data / browsing data for this site will delete them.
- "Download" always produces a real JPG file via a standard browser download — that's
  the supported way to get a copy off the device, since a web page cannot silently write
  files into arbitrary folders on your computer.

## Project structure

```
photobooth/
├── app/
│   ├── layout.tsx           Root layout, the four-font type system, metadata
│   ├── page.tsx              Landing page ("Step inside.")
│   ├── globals.css           Tailwind entry + paper texture, tape, imperfect-edge utilities
│   ├── photobooth/
│   │   └── page.tsx          The full camera → countdown → capture → result flow
│   └── photos/
│       └── page.tsx          "The Wall" / My Photos library page
├── components/
│   ├── Camera.tsx             Live preview, film-frame chrome, controls, capture reveal
│   ├── Countdown.tsx          3-2-1-FLASH overlay with rotating microcopy
│   ├── PhotoPreview.tsx       Film-frame capture progress tray
│   ├── PhotoboothStrip.tsx    Result preview + layout/background/decorate controls
│   ├── FilterSelector.tsx     Live-preview filter contact sheet
│   ├── LayoutSelector.tsx     Strip / grid / polaroid / story picker
│   ├── PhotoControls.tsx      Download / Save / Retake / Create Another
│   ├── PhotoLibrary.tsx       Scrapbook-wall gallery + session detail modal
│   ├── TactileButton.tsx      The stamp-style physical button used throughout
│   ├── Doodles.tsx            Hand-drawn sticker/doodle SVG set
│   └── FilmGrainOverlay.tsx   Decorative animated grain layer
├── hooks/
│   ├── useCamera.ts           Camera stream lifecycle (start/stop/flip, permission state)
│   └── usePhotobooth.ts       The session state machine (countdown, capture, strip gen)
├── lib/
│   ├── camera.ts               getUserMedia wrapper + typed errors
│   ├── photoProcessing.ts      Canvas capture + the 4 layout compositors + stickers/tape
│   ├── storage.ts              IndexedDB wrapper (save/get/delete/clear sessions)
│   └── sound.ts                 Web Audio shutter click + completion chime
├── types/
│   └── photobooth.ts           Shared types, filter/layout/sticker definitions
└── public/
    └── bg/
        └── wallpaper.png      The site's background image, used directly on every page
```

## Notes on the "Flash" control

Browsers don't provide a reliable, cross-device API to fire a webcam's physical flash
(most laptop/phone front cameras don't have one anyway). The **Flash** toggle in the
camera controls turns the on-screen white flash animation on the capture moment on or
off — it's a stylistic effect, not a hardware control.

## Tech stack

Next.js 16 (App Router) &middot; React 19 &middot; TypeScript &middot; Tailwind CSS
&middot; Framer Motion &middot; MediaDevices/WebRTC &middot; Canvas 2D &middot; IndexedDB
&middot; Web Audio API. No image upload service, no backend, no external storage of any
kind.
