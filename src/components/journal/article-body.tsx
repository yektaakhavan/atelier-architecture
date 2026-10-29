import type { ArticleBlock } from "@/types/content";

export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((block, index) =>
        block.type === "heading" ? (
          <h2 key={index} className="mt-14 text-2xl font-medium text-balance first:mt-0">
            {block.text}
          </h2>
        ) : (
          <p key={index} className="mt-5 text-lg leading-relaxed text-muted first:mt-0">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}
