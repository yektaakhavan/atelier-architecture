import { render, screen } from "@testing-library/react";
import { ArtImage } from "./art-image";

describe("ArtImage", () => {
  it("points at the generated artwork file for its variant and tone", () => {
    render(<ArtImage variant="stairs" tone="night" alt="Stairs" />);
    expect(screen.getByRole("img", { name: "Stairs" })).toHaveAttribute(
      "src",
      "/art/stairs-night.svg",
    );
  });

  it("is decorative without an alt text", () => {
    const { container } = render(<ArtImage variant="plan" tone="stone" />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("lazy-loads by default and loads eagerly with high priority when it is the hero", () => {
    const { rerender } = render(<ArtImage variant="plan" tone="stone" alt="x" />);
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");

    rerender(<ArtImage variant="plan" tone="stone" alt="x" priority />);
    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
    expect(screen.getByRole("img")).toHaveAttribute("fetchpriority", "high");
  });
});
