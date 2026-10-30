import { cn } from "@/lib/cn";
import type { ArtTone, ArtVariant } from "@/types/content";

type Palette = {
  sky: string;
  mass1: string;
  mass2: string;
  mass3: string;
  accent: string;
  ink: string;
};

// Fixed colours on purpose: the artwork reads the same in both themes, like a photograph would.
const palettes: Record<ArtTone, Palette> = {
  olive: {
    sky: "#dde0d0",
    mass1: "#737b60",
    mass2: "#59614a",
    mass3: "#a9b08f",
    accent: "#b66a4a",
    ink: "#252723",
  },
  brick: {
    sky: "#eadbcf",
    mass1: "#b66a4a",
    mass2: "#94502f",
    mass3: "#d9a58a",
    accent: "#737b60",
    ink: "#252723",
  },
  stone: {
    sky: "#e4e1d8",
    mass1: "#b9b5a8",
    mass2: "#8c897d",
    mass3: "#d3d0c5",
    accent: "#b66a4a",
    ink: "#252723",
  },
  night: {
    sky: "#2a2d27",
    mass1: "#4a4f42",
    mass2: "#373b31",
    mass3: "#6b7160",
    accent: "#d9926f",
    ink: "#f0efe8",
  },
};

const range = (count: number) => Array.from({ length: count }, (_, i) => i);

/*
 * Every scene keeps its subject inside x 175-625 and y 75-525 of the 800x600 canvas. The SVG is
 * cropped with "slice" to fit portrait, square and 16:9 frames, and that central region is what
 * survives all of them.
 */
function Scene({ variant, c }: { variant: ArtVariant; c: Palette }) {
  switch (variant) {
    case "volumes":
      return (
        <>
          <circle cx="545" cy="130" r="38" fill={c.accent} />
          <rect x="175" y="270" width="290" height="210" fill={c.mass1} />
          <rect x="250" y="160" width="250" height="120" fill={c.mass2} />
          <rect x="520" y="220" width="100" height="260" fill={c.mass3} />
          <rect x="205" y="345" width="90" height="14" fill={c.sky} />
          <rect x="300" y="200" width="130" height="14" fill={c.sky} />
        </>
      );
    case "facade":
      return (
        <>
          <rect x="175" y="90" width="450" height="390" fill={c.mass1} />
          {range(5).flatMap((col) =>
            range(4).map((row) => (
              <rect
                key={`${col}-${row}`}
                x={197 + col * 84}
                y={125 + row * 85}
                width="52"
                height="55"
                fill={(col + row) % 4 === 0 ? c.accent : c.sky}
              />
            )),
          )}
          <rect x="175" y="440" width="450" height="40" fill={c.mass2} />
        </>
      );
    case "section":
      return (
        <>
          <rect x="175" y="110" width="450" height="370" fill={c.mass3} />
          <rect x="175" y="110" width="450" height="14" fill={c.mass2} />
          <rect x="175" y="230" width="320" height="12" fill={c.mass2} />
          <rect x="175" y="350" width="450" height="12" fill={c.mass2} />
          <rect x="481" y="124" width="14" height="356" fill={c.mass2} />
          <polygon points="495,350 625,350 625,480 555,480" fill={c.mass1} />
          <rect x="250" y="262" width="70" height="88" fill={c.accent} />
        </>
      );
    case "arches":
      return (
        <>
          <rect x="175" y="130" width="450" height="350" fill={c.mass3} />
          {range(3).map((i) => (
            <path
              key={i}
              d={`M${200 + i * 135},480 V340 A50,50 0 0 1 ${300 + i * 135},340 V480 Z`}
              fill={i % 2 === 0 ? c.mass1 : c.mass2}
            />
          ))}
          <rect x="175" y="130" width="450" height="22" fill={c.mass2} />
          <circle cx="400" cy="95" r="22" fill={c.accent} />
        </>
      );
    case "stairs":
      return (
        <>
          {range(5).map((i) => (
            <rect
              key={i}
              x={175 + i * 80}
              y={440 - i * 62}
              width="130"
              height={160 + i * 62}
              fill={i % 2 === 0 ? c.mass1 : c.mass2}
            />
          ))}
          <rect x="450" y="100" width="170" height="14" fill={c.accent} />
        </>
      );
    case "plan":
      return (
        <>
          <rect
            x="175"
            y="100"
            width="450"
            height="400"
            fill={c.mass3}
            stroke={c.ink}
            strokeWidth="10"
          />
          <line x1="420" y1="100" x2="420" y2="330" stroke={c.ink} strokeWidth="8" />
          <line x1="175" y1="330" x2="500" y2="330" stroke={c.ink} strokeWidth="8" />
          <circle cx="295" cy="215" r="48" fill={c.mass1} />
          <rect x="470" y="170" width="130" height="80" fill={c.accent} />
          <rect x="520" y="330" width="105" height="170" fill={c.mass1} opacity="0.6" />
        </>
      );
  }
}

type ArchitecturalArtProps = {
  variant: ArtVariant;
  tone: ArtTone;
  /** Accessible description; without it the artwork is treated as decorative. */
  label?: string;
  className?: string;
};

export function ArchitecturalArt({ variant, tone, label, className }: ArchitecturalArtProps) {
  const palette = palettes[tone];

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block", className)}
    >
      <rect width="800" height="600" fill={palette.sky} />
      <rect y="480" width="800" height="120" fill={palette.mass2} opacity="0.22" />
      <Scene variant={variant} c={palette} />
    </svg>
  );
}
