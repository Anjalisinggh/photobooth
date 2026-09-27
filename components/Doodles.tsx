"use client";

/**
 * A small hand-drawn-feeling doodle set used to decorate the landing page and
 * result screen. Pure inline SVG (no image assets) so it stays crisp at any
 * size and inherits color via `currentColor`.
 */

type DoodleProps = { className?: string };

export function StarDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path
        d="M20 3c1 6 2 10.5 5.5 14S33 20.8 37 22c-5 1.4-10 2.6-13 6S20.6 36 20 37c-.7-5-2-10-5.5-13.5S6 20.6 3 20c5-1 9.7-2.4 13-5.7S19.4 6 20 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 34" fill="none" className={className} aria-hidden>
      <path
        d="M20 31C9 24 3 17.8 3 11.5 3 6.6 6.8 3 11.3 3c3 0 6 1.7 8.7 5.6C22.7 4.7 25.7 3 28.7 3 33.2 3 37 6.6 37 11.5 37 17.8 31 24 20 31Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SquiggleDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 20" fill="none" className={className} aria-hidden>
      <path
        d="M2 14c4-9 8-9 12 0s8 9 12 0 8-9 12 0 8 9 12 0 8-9 10-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SparkleDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 2c.8 5 2.3 9 5 11.5S27 16 30 16c-3 .9-6.7 2-9 4.5S17 26 16 30c-.8-4-2.3-8-5-10.5S4 16.9 2 16c3-.6 6.3-1.7 9-4S15.2 6 16 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FlowerDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <ellipse cx="20" cy="11" rx="6" ry="8" />
        <ellipse cx="20" cy="29" rx="6" ry="8" />
        <ellipse cx="11" cy="20" rx="8" ry="6" />
        <ellipse cx="29" cy="20" rx="8" ry="6" />
      </g>
      <circle cx="20" cy="20" r="4.5" fill="currentColor" />
    </svg>
  );
}

export function SmileyDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="17" r="1.8" fill="currentColor" />
      <circle cx="26" cy="17" r="1.8" fill="currentColor" />
      <path d="M12 24c2.5 4 6 6 8 6s5.5-2 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FilmFrameDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 56" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="36" height="52" rx="3" stroke="currentColor" strokeWidth="1.6" />
      {[6, 14, 22, 30, 38, 46].map((y) => (
        <rect key={y} x="-1" y={y} width="4" height="3" fill="currentColor" />
      ))}
      {[6, 14, 22, 30, 38, 46].map((y) => (
        <rect key={`r${y}`} x="37" y={y} width="4" height="3" fill="currentColor" />
      ))}
    </svg>
  );
}

export function CameraDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 44 36" fill="none" className={className} aria-hidden>
      <path
        d="M4 11c0-1.7 1.3-3 3-3h6l2.5-4h13L31 8h6c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="21" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="22" cy="21" r="3" fill="currentColor" />
    </svg>
  );
}

export const STICKER_DOODLES: Record<string, (props: DoodleProps) => React.JSX.Element> = {
  star: StarDoodle,
  heart: HeartDoodle,
  flower: FlowerDoodle,
  sparkle: SparkleDoodle,
  smiley: SmileyDoodle,
  squiggle: SquiggleDoodle,
};

/* ------------------------------------------------------------------------ */
/* Y2K desktop stickers — chunky, flat-colored, thick-outlined icons in the  */
/* site's own palette, used to decorate page corners like an old desktop.   */
/* ------------------------------------------------------------------------ */

export function CassetteDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 44" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="60" height="40" rx="7" fill="#D2A15A" stroke="#2B211B" strokeWidth="3" />
      <rect x="9" y="10" width="46" height="13" rx="3" fill="#FBF5E9" stroke="#2B211B" strokeWidth="2.5" />
      <circle cx="20" cy="16.5" r="5" fill="#9C7E6B" stroke="#2B211B" strokeWidth="2.5" />
      <circle cx="44" cy="16.5" r="5" fill="#9C7E6B" stroke="#2B211B" strokeWidth="2.5" />
      <rect x="14" y="30" width="36" height="5" rx="2.5" fill="#2B211B" />
      <circle cx="9" cy="37" r="2.6" fill="#2B211B" />
      <circle cx="55" cy="37" r="2.6" fill="#2B211B" />
    </svg>
  );
}

export function PolaroidHeartDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 52 62" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="48" height="58" rx="4" fill="#FFFDF7" stroke="#2B211B" strokeWidth="3" />
      <rect x="8" y="8" width="36" height="36" rx="2" fill="#C98A82" stroke="#2B211B" strokeWidth="2.5" />
      <path
        d="M26 37c-8-5-12-9.4-12-14 0-3.4 2.6-6 6-6 2.2 0 4.2 1.1 6 3.6 1.8-2.5 3.8-3.6 6-3.6 3.4 0 6 2.6 6 6 0 4.6-4 9-12 14Z"
        fill="#FBF5E9"
        stroke="#2B211B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <rect x="16" y="19" width="4.5" height="2.6" rx="1" fill="#9C7E6B" />
      <rect x="8" y="0" width="18" height="9" rx="2" fill="#8FA6B0" stroke="#2B211B" strokeWidth="2" transform="rotate(-8 8 0)" />
    </svg>
  );
}

export function FolderHeartDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 56 46" fill="none" className={className} aria-hidden>
      <path
        d="M3 9c0-2.2 1.8-4 4-4h13l4 5h25c2.2 0 4 1.8 4 4v26c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4Z"
        fill="#D2A15A"
        stroke="#2B211B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M3 16h50" stroke="#2B211B" strokeWidth="2.2" opacity="0.35" />
      <path
        d="M28 33c-6-3.8-9.5-7-9.5-10.6 0-2.6 2-4.6 4.6-4.6 1.7 0 3.2 0.9 4.9 2.9 1.7-2 3.2-2.9 4.9-2.9 2.6 0 4.6 2 4.6 4.6 0 3.6-3.5 6.8-9.5 10.6Z"
        fill="#C98A82"
        stroke="#2B211B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchBarDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 96 32" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="92" height="28" rx="14" fill="#FFFDF7" stroke="#2B211B" strokeWidth="3" />
      <rect x="2" y="2" width="34" height="28" rx="14" fill="#8FA06B" stroke="#2B211B" strokeWidth="3" />
      <circle cx="18" cy="16" r="6" fill="none" stroke="#2B211B" strokeWidth="2.6" />
      <path d="M22.4 20.4 26 24" stroke="#2B211B" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="46" y="14" width="34" height="4" rx="2" fill="#2B211B" opacity="0.25" />
    </svg>
  );
}

export function BrowserStickerDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 160 130" fill="none" className={className} aria-hidden>
      <rect x="4" y="4" width="152" height="122" rx="12" fill="#FBF5E9" stroke="#2B211B" strokeWidth="4" />
      <path d="M4 30h152" stroke="#2B211B" strokeWidth="4" />
      <rect x="4" y="4" width="152" height="26" rx="12" fill="#9C7E6B" stroke="#2B211B" strokeWidth="4" />
      <circle cx="20" cy="17" r="5" fill="#C98A82" stroke="#2B211B" strokeWidth="2" />
      <circle cx="36" cy="17" r="5" fill="#D2A15A" stroke="#2B211B" strokeWidth="2" />
      <circle cx="52" cy="17" r="5" fill="#8FA06B" stroke="#2B211B" strokeWidth="2" />
      <text
        x="80"
        y="60"
        textAnchor="middle"
        fontFamily="'Poppins', sans-serif"
        fontWeight={700}
        fontSize="26"
        fill="#FFFDF7"
        stroke="#2B211B"
        strokeWidth="3"
        paintOrder="stroke"
      >
        PHOTO
      </text>
      <text
        x="80"
        y="92"
        textAnchor="middle"
        fontFamily="'Poppins', sans-serif"
        fontWeight={700}
        fontSize="26"
        fill="#FFFDF7"
        stroke="#2B211B"
        strokeWidth="3"
        paintOrder="stroke"
      >
        BOOTH
      </text>
    </svg>
  );
}

export function DotsRowDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 16" fill="none" className={className} aria-hidden>
      {[8, 30, 52].map((x) => (
        <circle key={x} cx={x} cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2.4" />
      ))}
    </svg>
  );
}

export function ZigzagDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 26 46" fill="none" className={className} aria-hidden>
      {[0, 9, 18].map((x) => (
        <path
          key={x}
          d={`M${x + 8} 2 L${x} 15 L${x + 8} 22 L${x} 35`}
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* "Today mood" moodboard doodles — thin maroon line-art scattered around    */
/* the cream page, plus one small filled coffee cup for a spot of colour.   */
/* ------------------------------------------------------------------------ */

export function CoffeeCupDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className={className} aria-hidden>
      <path d="M11 16h18l-1.6 22.5a4 4 0 0 1-4 3.7H16.6a4 4 0 0 1-4-3.7Z" fill="#8A2A2E" />
      <path
        d="M11 16h18l-1.6 22.5a4 4 0 0 1-4 3.7H16.6a4 4 0 0 1-4-3.7Z"
        stroke="#2B211B"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 16h22" stroke="#2B211B" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="20" cy="9.5" rx="5.5" ry="2.6" fill="#FFFDF7" stroke="#2B211B" strokeWidth="1.2" />
      <path d="M17.5 8c0-3 4.8-3.4 4.8-6.4" stroke="#2B211B" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function BowDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 52 34" fill="none" className={className} aria-hidden>
      <path
        d="M25 17c-3-6-10-11-16.5-9.4C3 9 2.4 15 8 17c-5.6 2-5 8 1.5 9.4C16 28 22 23 25 17Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M27 17c3-6 10-11 16.5-9.4C49 9 49.6 15 44 17c5.6 2 5 8-1.5 9.4C36 28 30 23 27 17Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M22 14.5 26 17l-4 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M26 17c1 4-1 10-3.5 14M26 17c-1 4 1 10 3.5 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CatFaceDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 44 34" fill="none" className={className} aria-hidden>
      <path
        d="M9 6 4 20c7-4 10-4 12-2.5M35 6l5 14c-7-4-10-4-12-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 30c9 0 14-6.5 14-13.5S31 5 22 5 8 9.5 8 16.5 13 30 22 30Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M18 17.5c0 1.2-.7 2-1.5 2s-1.5-.8-1.5-2 .7-2 1.5-2 1.5.8 1.5 2Z" fill="currentColor" />
      <path d="M28 17.5c0 1.2-.7 2-1.5 2s-1.5-.8-1.5-2 .7-2 1.5-2 1.5.8 1.5 2Z" fill="currentColor" />
      <path d="M20.5 22c.7.8 2.3.8 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function BunnyDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 46" fill="none" className={className} aria-hidden>
      <path
        d="M14 20c-3-6-4.5-13-1.5-16S18 3 17 10M26 20c3-6 4.5-13 1.5-16S22 3 23 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 38c9 0 13-5.6 13-12.5S28.2 15 20 15 7 18.6 7 25.5 11 38 20 38Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="25" r="1.6" fill="currentColor" />
      <circle cx="24" cy="25" r="1.6" fill="currentColor" />
      <path d="M17.5 29.5c.9 1 3.9 1 4.8 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CroissantDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 46 30" fill="none" className={className} aria-hidden>
      <path
        d="M4 20c4-11 13-17 19-16 6 1 3 8-1 9-4 1-2 6 2 5s9-6 14-3c4 2.4 2 9-6 10.5C22 27.5 6 27 4 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 12c2 2 2 5 1 8M22 10.5c2 2.5 2.5 6 1 9.5M30 12c2 2 2.5 5.5 1.5 8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function SpiralDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 27c-6 0-11-4.5-11-10S9.5 6 15 6s9 4 9 8-3 6.5-7 6.5-6-2.5-6-5 2-4.5 4.5-4.5 3.6 1.6 3.6 3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function XoxoDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 104 24" fill="none" className={className} aria-hidden>
      <path d="M3 4l14 16M17 4 3 20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="35" cy="12" r="9" stroke="currentColor" strokeWidth="2.6" />
      <path d="M57 4l14 16M71 4 57 20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="91" cy="12" r="9" stroke="currentColor" strokeWidth="2.6" />
    </svg>
  );
}

export function TeddyBearDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 90" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="64" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="34" r="24" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="31" cy="32" r="1.6" fill="currentColor" />
      <circle cx="49" cy="32" r="1.6" fill="currentColor" />
      <ellipse cx="40" cy="41" rx="6" ry="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M37 41h6M40 38v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d="M14 58c0-9 11-16 26-16s26 7 26 16c0 12-10 22-26 22S14 70 14 58Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 62c-5 3-9 1.5-9-4s5-9 9-6M70 62c5 3 9 1.5 9-4s-5-9-9-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 80c-4 3-6 7-4 9s7 0 9-4M58 80c4 3 6 7 4 9s-7 0-9-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 55c3 3 13 3 16 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 5v6M34 6.5l3 4.5M46 6.5l-3 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ShellDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 34" fill="none" className={className} aria-hidden>
      <path
        d="M20 3C10 3 3 12 3 22c0 4 2 7 4.5 7 1.3 0 2-2 2.4-6 .5 4.3 1.3 6.4 2.8 6.4s2.2-2 2.5-6.6c.4 4.6 1.2 6.6 2.7 6.6s2.3-2 2.7-6.6c.3 4.6 1.2 6.6 2.6 6.6s2.3-2.1 2.8-6.4c.4 4 1.1 6 2.4 6 2.5 0 4.5-3 4.5-7C37 12 30 3 20 3Z"
        fill="#8FA6B0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
