import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full border border-foreground/30 bg-transparent px-4 py-3 text-base transition-colors placeholder:text-muted hover:border-foreground focus-visible:border-foreground aria-[invalid=true]:border-accent-ink";

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, "min-h-40 resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(controlClass, "appearance-none pe-12", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
