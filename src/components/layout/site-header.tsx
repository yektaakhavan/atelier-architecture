"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { navItems } from "@/config/site";
import { LanguageSwitcher } from "@/features/localization/language-switcher";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { usePathname } from "@/i18n/navigation";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cn } from "@/lib/cn";
import { isActivePath } from "@/lib/navigation";
import { Logo } from "./logo";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollLock(menuOpen);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  const linkClass = (href: string) =>
    cn(
      "text-sm transition-colors hover:text-foreground",
      isActivePath(pathname, href) ? "text-foreground" : "text-muted",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Logo />

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navItems.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className={linkClass(href)}
                  aria-current={isActivePath(pathname, href) ? "page" : undefined}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("openMenu")}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={openMenu}
          >
            <Menu aria-hidden className="size-5" />
          </Button>
        </div>
      </div>

      {/* Native <dialog>: focus trapping, Escape to close and focus return come from the browser. */}
      <dialog
        ref={dialogRef}
        id={menuId}
        aria-label={t("menu")}
        onClose={() => setMenuOpen(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col bg-background p-0 text-foreground open:flex"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5 sm:px-8">
          <Logo />
          <Button variant="ghost" size="icon" aria-label={t("closeMenu")} onClick={closeMenu}>
            <X aria-hidden className="size-5" />
          </Button>
        </div>
        <nav aria-label={t("primary")} className="flex-1 overflow-y-auto px-5 py-8 sm:px-8">
          <ul className="flex flex-col">
            {navItems.map(({ key, href }) => (
              <li key={key} className="border-b border-line">
                <Link
                  href={href}
                  onClick={closeMenu}
                  aria-current={isActivePath(pathname, href) ? "page" : undefined}
                  className={cn(
                    "block py-5 text-headline font-medium hover:no-underline",
                    isActivePath(pathname, href) ? "text-accent-ink" : "text-foreground",
                  )}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line px-5 py-4 sm:px-8">
          <LanguageSwitcher />
        </div>
      </dialog>
    </header>
  );
}
