import type { ComponentProps } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonVariants, type ButtonProps } from "./button";

/** Locale-aware link: the locale prefix is added automatically. */
export function Link({ className, ...props }: ComponentProps<typeof IntlLink>) {
  return (
    <IntlLink
      className={cn("underline-offset-4 transition-colors hover:underline", className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof IntlLink> & Pick<ButtonProps, "variant" | "size">) {
  return <IntlLink className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
