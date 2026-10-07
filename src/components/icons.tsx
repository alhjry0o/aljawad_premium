import { memo, type ReactElement } from 'react';
import type { ServiceIconKey } from '../data/services';

export type GlyphName =
  | ServiceIconKey
  | 'home'
  | 'grid'
  | 'receipt'
  | 'layers'
  | 'menu'
  | 'phone'
  | 'whatsapp'
  | 'mail'
  | 'pin'
  | 'quote'
  | 'inspect'
  | 'search'
  | 'arrow'
  | 'check'
  | 'close'
  | 'globe'
  | 'sun'
  | 'moon'
  | 'spark'
  | 'shield'
  | 'camera'
  | 'calendar'
  | 'user';

/** 24×24 line glyphs — optically balanced, 1.5 stroke. */
const GLYPHS: Record<GlyphName, ReactElement> = {
  cleaning: (
    <>
      <path d="M12 3.5c2.8 3.4 4.6 5.9 4.6 8.2A4.6 4.6 0 0 1 12 16.3a4.6 4.6 0 0 1-4.6-4.6c0-2.3 1.8-4.8 4.6-8.2Z" />
      <path d="M18.5 17.5 20 19M5.5 18.5 4 20M12 19v2" />
    </>
  ),
  facade: (
    <>
      <path d="M5 21V5.5L13 3v18" />
      <path d="M13 9h6v12" />
      <path d="M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1" />
    </>
  ),
  industrial: (
    <>
      <path d="M3 20h18" />
      <path d="M4 20V9l5 3V9l5 3V6l6 4v10" />
      <path d="M7 16h2M12 16h2M17 16h1" />
    </>
  ),
  pools: (
    <>
      <path d="M3 15c1.8 0 1.8 1.5 3.6 1.5S8.4 15 10.2 15s1.8 1.5 3.6 1.5S15.6 15 17.4 15s1.8 1.5 3.6 1.5" />
      <path d="M3 19c1.8 0 1.8 1.5 3.6 1.5S8.4 19 10.2 19s1.8 1.5 3.6 1.5S15.6 19 17.4 19s1.8 1.5 3.6 1.5" />
      <path d="M7 15V5a2 2 0 0 1 4 0M13 15V5a2 2 0 0 1 4 0" />
    </>
  ),
  pest: (
    <>
      <path d="M12 3 5 6v5.5c0 4 3 7.3 7 8.5 4-1.2 7-4.5 7-8.5V6l-7-3Z" />
      <path d="M12 9.5v4M10 11.5h4" />
    </>
  ),
  insulation: (
    <>
      <path d="m12 3 8 4.2-8 4.2-8-4.2L12 3Z" />
      <path d="m4 12 8 4.2 8-4.2M4 16.3l8 4.2 8-4.2" />
    </>
  ),
  mep: (
    <>
      <path d="M13 3 6 13h5l-1 8 7-10h-5l1-8Z" />
    </>
  ),
  manpower: (
    <>
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
      <path d="M16.5 11.5a2.5 2.5 0 1 0 0-5M17 15c2.4.5 4 2.3 4 5" />
    </>
  ),
  facilities: (
    <>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 14a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7.9 18l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3.7a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 5 5.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10.8 2v-.2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.4 1Z" />
    </>
  ),
  equipment: (
    <>
      <path d="M4 20h16" />
      <path d="M6 20V4h12" />
      <path d="M18 4v5M18 9h-5v4" />
      <path d="M11 13h4v4h-4z" />
    </>
  ),
  construction: (
    <>
      <path d="M3 19h18" />
      <path d="M5 19 12 5l7 14" />
      <path d="M8.5 13h7" />
    </>
  ),
  home: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  grid: (
    <>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </>
  ),
  phone: (
    <>
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4Z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12Z" />
      <path d="M9.2 9c.3 2.2 2.4 4.4 4.7 4.8l1-1.3 1.6.8c-.2 1.1-1.3 1.6-2.3 1.4-2.8-.5-5.4-3.1-5.9-5.9-.2-1 .4-2 1.4-2.2l.8 1.6L9.2 9Z" />
    </>
  ),
  mail: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </>
  ),
  quote: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  inspect: (
    <>
      <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
      <path d="m20 20-3.8-3.8" />
      <path d="M8.5 11h5M11 8.5v5" />
    </>
  ),
  search: (
    <>
      <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
      <path d="m20 20-3.8-3.8" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  check: (
    <>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  globe: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="M3.5 9h17M3.5 15h17" />
      <path d="M12 3c2.5 2.6 3.7 5.6 3.7 9S14.5 18.4 12 21c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z" />
    </>
  ),
  sun: (
    <>
      <path d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </>
  ),
  moon: (
    <>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5 10.2 12.6 4.5 10.8 10.2 9 12 3.5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7.3 7 8.5 4-1.2 7-4.5 7-8.5V6l-7-3Z" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3.5L9 6h6l1.5 2H20v11H4z" />
      <path d="M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    </>
  ),
  calendar: (
    <>
      <path d="M4 6h16v15H4z" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
  user: (
    <>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
    </>
  ),
};

export const Glyph = memo(function Glyph({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.5,
}: {
  name: GlyphName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name]}
    </svg>
  );
});

const ACCENTS: Record<string, { a: string; b: string; light: string }> = {
  green: { a: '#1fa36a', b: '#0b3f2b', light: '#7df0bb' },
  navy: { a: '#2f5fa8', b: '#0b1c38', light: '#9cc4ff' },
  blue: { a: '#3b82f6', b: '#0d2452', light: '#a9c9ff' },
  teal: { a: '#17a8a0', b: '#07332f', light: '#8df0e8' },
};

/**
 * Material-based 3D icon.
 * A machined, matte-metal tile with beveled edges, controlled specular
 * highlight and a recessed brand glyph. Pure SVG — no heavy assets.
 */
export const MaterialIcon3D = memo(function MaterialIcon3D({
  name,
  accent = 'green',
  size = 72,
  className = '',
}: {
  name: GlyphName;
  accent?: 'green' | 'navy' | 'blue' | 'teal';
  size?: number;
  className?: string;
}) {
  const c = ACCENTS[accent] ?? ACCENTS.green;
  const uid = `${name}-${accent}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`body-${uid}`} x1="16%" y1="0%" x2="84%" y2="100%">
          <stop offset="0%" stopColor="#1a2724" />
          <stop offset="42%" stopColor="#0c1512" />
          <stop offset="100%" stopColor="#050908" />
        </linearGradient>
        <linearGradient id={`edge-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="38%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor={c.a} stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="30%" cy="22%" r="80%">
          <stop offset="0%" stopColor={c.light} stopOpacity="0.4" />
          <stop offset="55%" stopColor={c.a} stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glyph-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="100%" stopColor={c.a} />
        </linearGradient>
        <linearGradient id={`floor-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.a} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.a} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grounded shadow */}
      <ellipse cx="50" cy="90" rx="30" ry="5" fill={`url(#floor-${uid})`} />

      {/* extruded base edge (depth) */}
      <rect x="14" y="20" width="72" height="66" rx="22" fill="#000" opacity="0.65" />
      <rect x="13" y="15" width="74" height="68" rx="23" fill={`url(#edge-${uid})`} />
      <rect x="15" y="17" width="70" height="64" rx="21" fill={`url(#body-${uid})`} />
      <rect x="15" y="17" width="70" height="64" rx="21" fill={`url(#glow-${uid})`} />

      {/* specular sweep */}
      <path d="M22 17h22L26 81h-4a7 7 0 0 1-7-7V24a7 7 0 0 1 7-7Z" fill="#ffffff" opacity="0.045" />
      <path d="M15 34c14-9 42-14 70-11v-6a21 21 0 0 0-4-4H20a7 7 0 0 0-5 6Z" fill="#ffffff" opacity="0.05" />

      {/* recessed glyph */}
      <g transform="translate(28 30) scale(1.85)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="#000" strokeOpacity="0.6" strokeWidth="1.7" transform="translate(0.35 0.5)">
          {GLYPHS[name]}
        </g>
        <g stroke={`url(#glyph-${uid})`} strokeWidth="1.5">
          {GLYPHS[name]}
        </g>
      </g>
    </svg>
  );
});

/** Monogram brand mark — placeholder until the official logo is supplied. */
export function BrandMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <g
        transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
        stroke="none"
      >
        <path d="M3710 7470 c-530 -5 -504 -3 -579 -66 -30 -25 -501 -799 -501 -823 0 -6 -3 -11 -8 -11 -4 0 -19 -21 -32 -47 -14 -27 -27 -50 -30 -53 -8 -8 -29 -43 -42 -70 -7 -14 -25 -44 -40 -67 -15 -23 -28 -45 -28 -48 0 -4 -8 -19 -19 -33 -28 -40 -71 -115 -78 -134 -3 -10 -9 -18 -14 -18 -5 0 -9 -9 -9 -20 0 -11 -4 -20 -10 -20 -5 0 -10 -6 -10 -14 0 -8 -3 -16 -7 -18 -5 -1 -19 -24 -32 -50 -13 -27 -28 -48 -33 -48 -4 0 -8 -9 -8 -20 0 -11 -3 -20 -8 -20 -4 0 -7 -378 -7 -840 0 -462 3 -840 6 -840 3 0 17 -21 30 -47 13 -27 26 -50 29 -53 3 -3 12 -18 20 -35 8 -16 17 -32 20 -35 3 -3 11 -16 18 -29 8 -13 22 -38 32 -56 10 -18 24 -43 32 -56 7 -13 15 -26 18 -29 3 -3 11 -15 18 -27 6 -13 18 -33 25 -45 6 -13 14 -25 17 -28 3 -3 11 -16 18 -29 8 -13 22 -39 33 -57 10 -19 29 -51 40 -71 12 -21 30 -50 40 -65 11 -14 19 -28 19 -31 0 -3 23 -42 50 -87 28 -45 50 -84 50 -86 0 -3 14 -25 30 -49 17 -24 30 -46 30 -48 0 -9 292 -492 316 -525 25 -32 96 -74 144 -85 14 -3 600 -7 1303 -9 1379 -3 1312 -6 1285 46 -11 21 -357 578 -431 694 -22 35 -51 71 -64 79 -21 14 -110 15 -801 11 -594 -4 -788 -2 -825 7 -55 14 -94 48 -139 120 -42 68 -90 146 -105 170 -22 37 -347 572 -458 755 -326 535 -313 510 -291 583 12 41 72 142 456 772 100 165 234 386 298 490 148 246 146 243 207 272 l53 23 626 -2 c610 -3 626 -3 645 -23 16 -16 211 -331 211 -340 0 -3 39 -67 129 -213 28 -46 51 -86 51 -88 0 -9 63 -99 74 -106 6 -4 248 -8 539 -8 438 0 527 2 527 14 0 7 -64 119 -141 247 -78 129 -147 243 -153 254 -6 11 -24 39 -39 62 -15 24 -27 45 -27 48 0 4 -12 25 -27 48 -16 23 -33 51 -40 62 -6 11 -128 212 -269 448 l-258 427 -695 -2 c-383 -2 -914 -5 -1181 -8z" />
        <path d="M4710 5191 l-95 -6 0 -348 c0 -191 2 -347 5 -347 3 0 11 -15 19 -32 8 -18 17 -35 20 -38 10 -8 42 -64 48 -82 3 -10 8 -18 12 -18 4 0 13 -16 21 -35 8 -19 17 -35 21 -35 4 0 9 -8 12 -17 4 -10 20 -40 37 -68 17 -27 33 -58 37 -67 3 -10 9 -18 13 -18 4 0 10 -8 13 -17 4 -10 20 -40 37 -68 17 -27 35 -60 41 -72 6 -12 21 -24 33 -27 25 -7 1046 -8 1046 -1 0 2 -50 88 -111 189 -63 104 -109 192 -107 203 3 17 20 18 273 21 316 4 310 5 366 -91 144 -249 417 -711 604 -1022 121 -203 243 -407 269 -452 77 -131 7 -118 619 -118 502 0 532 1 535 18 4 17 -35 85 -302 522 -224 366 -614 1006 -787 1290 -71 116 -164 269 -207 340 -44 72 -112 184 -152 250 -39 66 -81 128 -92 138 -19 16 -83 17 -1077 15 -581 -1 -1099 -4 -1151 -7z" />
        <path d="M5963 3450 c-116 -3 -214 -7 -216 -10 -3 -3 -7 -40 -8 -82 -3 -63 0 -82 14 -98 9 -11 17 -25 17 -30 0 -9 7 -23 60 -115 11 -19 30 -52 41 -72 12 -21 33 -58 48 -83 14 -25 35 -61 46 -81 89 -159 142 -240 160 -244 11 -2 252 -6 536 -9 432 -5 519 -4 528 8 9 11 -9 47 -88 172 -54 88 -162 260 -239 384 -77 124 -149 235 -160 248 -21 22 -23 22 -274 20 -139 -1 -348 -5 -465 -8z" />
      </g>
    </svg>
  );
}
