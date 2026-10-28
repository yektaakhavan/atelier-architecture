import { Section } from "@/components/shared/section";
import { ButtonLink } from "@/components/ui/link";

type CtaBandProps = { id: string; title: string; text: string; button: string; href?: string };

export function CtaBand({ id, title, text, button, href = "/contact" }: CtaBandProps) {
  return (
    <Section labelledBy={id} className="pb-0">
      <div className="flex flex-col gap-8 bg-foreground p-8 text-background md:flex-row md:items-end md:justify-between md:p-16">
        <div className="flex max-w-2xl flex-col gap-5">
          <h2 id={id} className="text-headline font-medium text-balance">
            {title}
          </h2>
          <p className="text-lg text-background/75">{text}</p>
        </div>
        <ButtonLink href={href} variant="accent" size="lg" className="shrink-0">
          {button}
        </ButtonLink>
      </div>
    </Section>
  );
}
