import { render, screen } from "@testing-library/react";
import { artTones, artVariants } from "@/types/content";
import { ArchitecturalArt } from "./architectural-art";

describe("ArchitecturalArt", () => {
  it("is exposed as an image only when a label is given", () => {
    const { rerender } = render(
      <ArchitecturalArt variant="plan" tone="stone" label="Floor plan" />,
    );
    expect(screen.getByRole("img", { name: "Floor plan" })).toBeInTheDocument();

    rerender(<ArchitecturalArt variant="plan" tone="stone" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it.each(artVariants)("renders the %s composition in every tone", (variant) => {
    for (const tone of artTones) {
      const { container, unmount } = render(<ArchitecturalArt variant={variant} tone={tone} />);
      expect(container.querySelectorAll("svg > :not(rect:first-child)").length).toBeGreaterThan(1);
      unmount();
    }
  });
});
