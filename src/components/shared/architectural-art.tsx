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

function Scene({ variant, c }: { variant: ArtVariant; c: Palette }) {
  switch (variant) {
    case "volumes":
      return (
        <>
          <circle cx="650" cy="120" r="42" fill={c.accent} />
          <rect x="120" y="260" width="320" height="220" fill={c.mass1} />
          <rect x="240" y="150" width="270" height="120" fill={c.mass2} />
          <rect x="530" y="210" width="110" height="270" fill={c.mass3} />
          <rect x="160" y="340" width="100" height="14" fill={c.sky} />
          <rect x="300" y="190" width="140" height="14" fill={c.sky} />
        </>
      );
    case "facade":
      return (
        <>
          <rect x="130" y="90" width="540" height="390" fill={c.mass1} />
          {range(5).flatMap((col) =>
            range(4).map((row) => (
              <rect
                key={`${col}-${row}`}
                x={170 + col * 100}
                y={125 + row * 85}
                width="60"
                height="55"
                fill={(col + row) % 4 === 0 ? c.accent : c.sky}
              />
            )),
          )}
          <rect x="130" y="440" width="540" height="40" fill={c.mass2} />
        </>
      );
    case "section":
      return (
        <>
          <rect x="150" y="110" width="500" height="370" fill={c.mass3} />
          <rect x="150" y="110" width="500" height="14" fill={c.mass2} />
          <rect x="150" y="230" width="360" height="12" fill={c.mass2} />
          <rect x="150" y="350" width="500" height="12" fill={c.mass2} />
          <rect x="500" y="124" width="14" height="356" fill={c.mass2} />
          <polygon points="514,350 650,350 650,480 560,480" fill={c.mass1} />
          <rect x="250" y="262" width="70" height="88" fill={c.accent} />
        </>
      );
    case "arches":
      return (
        <>
          <rect x="90" y="120" width="620" height="360" fill={c.mass3} />
          {range(4).map((i) => (
            <path
              key={i}
              d={`M${130 + i * 150},480 V330 A50,50 0 0 1 ${230 + i * 150},330 V480 Z`}
              fill={i % 2 === 0 ? c.mass1 : c.mass2}
            />
          ))}
          <rect x="90" y="120" width="620" height="22" fill={c.mass2} />
          <circle cx="400" cy="90" r="26" fill={c.accent} />
        </>
      );
    case "stairs":
      return (
        <>
          {range(6).map((i) => (
            <rect
              key={i}
              x={90 + i * 100}
              y={440 - i * 62}
              width="140"
              height={160 + i * 62}
              fill={i % 2 === 0 ? c.mass1 : c.mass2}
            />
          ))}
          <rect x="520" y="100" width="170" height="14" fill={c.accent} />
        </>
      );
    case "plan":
      return (
        <>
          <rect
            x="130"
            y="100"
            width="540"
            height="400"
            fill={c.mass3}
            stroke={c.ink}
            strokeWidth="10"
          />
          <line x1="400" y1="100" x2="400" y2="330" stroke={c.ink} strokeWidth="8" />
          <line x1="130" y1="330" x2="540" y2="330" stroke={c.ink} strokeWidth="8" />
          <circle cx="270" cy="215" r="48" fill={c.mass1} />
          <rect x="470" y="170" width="140" height="80" fill={c.accent} />
          <rect x="560" y="330" width="110" height="170" fill={c.mass1} opacity="0.6" />
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
