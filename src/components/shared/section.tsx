import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  /** id of the heading that names this section, for screen-reader landmarks. */
  labelledBy?: string;
};

export function Section({ children, className, labelledBy }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={cn("py-16 md:py-28", className)}>
      <Container>{children}</Container>
    </section>
  );
}
