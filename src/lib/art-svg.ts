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

type Attrs = Record<string, string | number>;
const attrs = (a: Attrs) =>
  Object.entries(a)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  extra: Attrs = {},
) => `<rect${attrs({ x, y, width, height, fill, ...extra })}/>`;
const circle = (cx: number, cy: number, r: number, fill: string) =>
  `<circle${attrs({ cx, cy, r, fill })}/>`;
const range = (count: number) => Array.from({ length: count }, (_, i) => i);

/*
 * Every scene keeps its subject inside x 175-625 and y 75-525 of the 800x600 canvas. The image is
 * cropped with "slice" (object-fit: cover) to fit portrait, square and 16:9 frames, and that central
 * region is what survives all of them.
 */
function scene(variant: ArtVariant, c: Palette): string[] {
  switch (variant) {
    case "volumes":
      return [
        circle(545, 130, 38, c.accent),
        rect(175, 270, 290, 210, c.mass1),
        rect(250, 160, 250, 120, c.mass2),
        rect(520, 220, 100, 260, c.mass3),
        rect(205, 345, 90, 14, c.sky),
        rect(300, 200, 130, 14, c.sky),
      ];
    case "facade":
      return [
        rect(175, 90, 450, 390, c.mass1),
        ...range(5).flatMap((col) =>
          range(4).map((row) =>
            rect(197 + col * 84, 125 + row * 85, 52, 55, (col + row) % 4 === 0 ? c.accent : c.sky),
          ),
        ),
        rect(175, 440, 450, 40, c.mass2),
      ];
    case "section":
      return [
        rect(175, 110, 450, 370, c.mass3),
        rect(175, 110, 450, 14, c.mass2),
        rect(175, 230, 320, 12, c.mass2),
        rect(175, 350, 450, 12, c.mass2),
        rect(481, 124, 14, 356, c.mass2),
        `<polygon${attrs({ points: "495,350 625,350 625,480 555,480", fill: c.mass1 })}/>`,
        rect(250, 262, 70, 88, c.accent),
      ];
    case "arches":
      return [
        rect(175, 130, 450, 350, c.mass3),
        ...range(3).map(
          (i) =>
            `<path${attrs({
              d: `M${200 + i * 135},480 V340 A50,50 0 0 1 ${300 + i * 135},340 V480 Z`,
              fill: i % 2 === 0 ? c.mass1 : c.mass2,
            })}/>`,
        ),
        rect(175, 130, 450, 22, c.mass2),
        circle(400, 95, 22, c.accent),
      ];
    case "stairs":
      return [
        ...range(5).map((i) =>
          rect(175 + i * 80, 440 - i * 62, 130, 160 + i * 62, i % 2 === 0 ? c.mass1 : c.mass2),
        ),
        rect(450, 100, 170, 14, c.accent),
      ];
    case "plan": {
      const line = (x1: number, y1: number, x2: number, y2: number) =>
        `<line${attrs({ x1, y1, x2, y2, stroke: c.ink, "stroke-width": 8 })}/>`;
      return [
        rect(175, 100, 450, 400, c.mass3, { stroke: c.ink, "stroke-width": 10 }),
        line(420, 100, 420, 330),
        line(175, 330, 500, 330),
        circle(295, 215, 48, c.mass1),
        rect(470, 170, 130, 80, c.accent),
        rect(520, 330, 105, 170, c.mass1, { opacity: 0.6 }),
      ];
    }
  }
}

/** A standalone SVG document for one placeholder artwork. */
export function artSvg(variant: ArtVariant, tone: ArtTone): string {
  const c = palettes[tone];
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">`,
    rect(0, 0, 800, 600, c.sky),
    rect(0, 480, 800, 120, c.mass2, { opacity: 0.22 }),
    ...scene(variant, c),
    `</svg>`,
  ].join("");
}
