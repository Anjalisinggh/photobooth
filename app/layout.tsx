import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "the photobooth — today's mood",
  description:
    "A digital photobooth in your browser. Take a few photos, pick a style, and make a memory — processed entirely on your device.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Loaded as runtime <link> tags rather than next/font/google so that
          `npm run build`/`npm run dev` never depend on reaching Google's font
          CDN (some networks/CI environments block it at build time). The
          browser fetches these normally when a page loads.

          Five-role type system: Yellowtail (the big brush-script "today
          mood" style headline — used sparingly, once per page, for the one
          line that should feel hand-lettered), Poppins (a plain, legible
          geometric sans for secondary headings and stamp numbers), Space
          Grotesk (nav, buttons, badges and all other UI chrome), Caveat
          (small handwritten captions & sticker notes), DM Sans (body copy).
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Yellowtail&family=Poppins:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-body"
        style={
          {
            "--font-display": "'Poppins', system-ui, sans-serif",
            "--font-label": "'Space Grotesk', system-ui, sans-serif",
            "--font-hand": "'Caveat', cursive",
            "--font-script": "'Yellowtail', cursive",
            "--font-body": "'DM Sans', system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
