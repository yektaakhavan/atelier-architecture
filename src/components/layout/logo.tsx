import { Link } from "@/components/ui/link";

export function Logo({ className }: { className?: string }) {
  return (
    // lang="en": the wordmark is Latin in every locale and keeps its letter-spacing in Persian pages.
    <Link href="/" lang="en" className={className} aria-label="ATELIER">
      <span className="text-lg font-semibold tracking-[0.28em]">ATELIER</span>
    </Link>
  );
}
