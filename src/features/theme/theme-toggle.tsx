"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./use-theme";

type ThemeToggleProps = {
  labels: { switchToLight: string; switchToDark: string };
  className?: string;
};

export function ThemeToggle({ labels, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label={isDark ? labels.switchToLight : labels.switchToDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Both icons are rendered and swapped with CSS, so the icon is right on first paint. */}
      <Moon aria-hidden className="size-5 dark:hidden" />
      <Sun aria-hidden className="hidden size-5 dark:block" />
    </Button>
  );
}
