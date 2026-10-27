import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/features/theme/theme-toggle";

// Temporary design-system preview; replaced by the real home page in stage 5.
export default function HomePage() {
  return (
    <Container as="main" className="flex min-h-screen flex-col justify-center gap-10 py-16">
      <div className="flex items-start justify-between gap-6">
        <SectionHeading
          level={1}
          eyebrow="Design system"
          title="ATELIER — Architecture & Living"
          description="Tokens, typography and base components, previewed in both themes."
        />
        <ThemeToggle
          labels={{ switchToLight: "Switch to light theme", switchToDark: "Switch to dark theme" }}
        />
      </div>
      <p className="text-display font-medium">
        Quiet <em className="font-serif font-normal text-accent-ink">spaces</em>
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </Container>
  );
}
