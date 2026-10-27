import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

const containerVariants = cva("mx-auto w-full px-5 sm:px-8 lg:px-12", {
  variants: {
    size: {
      narrow: "max-w-3xl",
      default: "max-w-[90rem]",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "default" },
});

type ContainerProps = ComponentProps<"div"> &
  VariantProps<typeof containerVariants> & { as?: ElementType };

export function Container({ as: Tag = "div", size, className, ...props }: ContainerProps) {
  return <Tag className={cn(containerVariants({ size }), className)} {...props} />;
}
