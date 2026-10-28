import { notFound } from "next/navigation";

// Unmatched URLs under a locale render [locale]/not-found.tsx inside the locale layout.
export default function CatchAllPage() {
  notFound();
}
