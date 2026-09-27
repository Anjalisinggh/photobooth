"use client";

import type { ReactNode } from "react";

interface StampFrameProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Wraps a photo in a white postage-stamp mat: a solid mat with a ring of
 * small circular "bites" punched along each edge. The bites are painted the
 * surrounding page colour (`--stamp-bg`, set in globals.css) rather than
 * truly clipped, so it renders reliably everywhere the frame sits on a flat
 * cream/paper surface — which is every place it's used in this app.
 */
export default function StampFrame({ children, className = "", contentClassName = "" }: StampFrameProps) {
  return (
    <div className={`stamp-frame ${className}`}>
      <span className="stamp-frame__edge stamp-frame__edge--t" aria-hidden />
      <span className="stamp-frame__edge stamp-frame__edge--b" aria-hidden />
      <span className="stamp-frame__edge stamp-frame__edge--l" aria-hidden />
      <span className="stamp-frame__edge stamp-frame__edge--r" aria-hidden />
      <div className={`stamp-frame__content ${contentClassName}`}>{children}</div>
    </div>
  );
}
