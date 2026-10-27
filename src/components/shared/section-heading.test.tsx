import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders an h2 by default", () => {
    render(<SectionHeading title="Selected work" />);
    expect(screen.getByRole("heading", { level: 2, name: "Selected work" })).toBeInTheDocument();
  });

  it("uses the requested heading level", () => {
    render(<SectionHeading level={1} title="Studio" />);
    expect(screen.getByRole("heading", { level: 1, name: "Studio" })).toBeInTheDocument();
  });

  it("shows eyebrow and description only when provided", () => {
    const { rerender } = render(<SectionHeading title="T" />);
    expect(screen.queryByText("Eyebrow")).not.toBeInTheDocument();

    rerender(<SectionHeading title="T" eyebrow="Eyebrow" description="Details" />);
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
});
