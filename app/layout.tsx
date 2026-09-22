import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Photobooth — Step Inside",
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

          Four-role type system: Poppins (a plain, highly legible geometric
          sans for display headlines — "Step inside.", stamp numbers — that
          stays easy to read at small phone sizes, no small-caps or display
          tricks), Space Grotesk (nav, buttons, badges and all other UI
          chrome), Caveat (handwritten captions & sticker notes), DM Sans
          (body copy).
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
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
            "--font-body": "'DM Sans', system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
