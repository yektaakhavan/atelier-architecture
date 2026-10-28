import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: string;
  /** Lets a parent <section> reference this heading with aria-labelledby. */
  id?: string;
  eyebrow?: string;
  description?: string;
  /** Visual size is independent of the level, which should follow the page outline. */
  level?: 1 | 2 | 3;
  className?: string;
};

export function SectionHeading({
  title,
  id,
  eyebrow,
  description,
  level = 2,
  className,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;

  return (
    <div className={cn("flex max-w-3xl flex-col gap-5", className)}>
      {eyebrow ? (
        <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-accent-ink">
          <span aria-hidden className="h-px w-10 bg-current" />
          {eyebrow}
        </p>
      ) : null}
      <Heading id={id} className="text-headline font-medium text-balance">
        {title}
      </Heading>
      {description ? <p className="max-w-2xl text-lg text-muted">{description}</p> : null}
    </div>
  );
}
