import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATELIER — Architecture & Living",
  description: "A fictional contemporary architecture studio — portfolio project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
