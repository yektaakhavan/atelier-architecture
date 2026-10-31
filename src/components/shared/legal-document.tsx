import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
};

export function LegalDocument({ eyebrow, title, intro, sections }: LegalDocumentProps) {
  return (
    <Container size="narrow" className="flex flex-col gap-14 py-12 md:py-20">
      <SectionHeading level={1} eyebrow={eyebrow} title={title} description={intro} />
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.title} className="border-t border-line pt-6">
            <h2 className="mb-3 text-xl font-medium">{section.title}</h2>
            <p className="text-lg text-muted">{section.text}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
