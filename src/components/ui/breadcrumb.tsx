import { ChevronRight } from "lucide-react";
import { Link } from "./link";

export type BreadcrumbItem = { label: string; href?: string };

/** The last item (no href) is the current page. */
export function Breadcrumb({ items, label }: { items: BreadcrumbItem[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 ? <ChevronRight aria-hidden className="size-3.5 rtl:-scale-x-100" /> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
