import localFont from "next/font/local";

export const latinSans = localFont({
  src: "../assets/fonts/inter-tight-latin-wght-normal.woff2",
  variable: "--font-latin-sans",
  weight: "100 900",
  display: "swap",
});

export const latinSerif = localFont({
  src: "../assets/fonts/fraunces-latin-wght-italic.woff2",
  variable: "--font-latin-serif",
  style: "italic",
  weight: "100 900",
  display: "swap",
});

export const persian = localFont({
  src: "../assets/fonts/vazirmatn-arabic-wght-normal.woff2",
  variable: "--font-persian",
  // Needed only for Persian text; skip the English-page preload and let the browser fetch it on demand.
  preload: false,
  weight: "100 900",
  display: "swap",
});

export const fontVariables = [latinSans, latinSerif, persian].map((f) => f.variable).join(" ");
