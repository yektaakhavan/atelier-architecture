import { render, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import { LegalDocument } from "./legal-document";

describe("LegalDocument", () => {
  it("renders the title as h1 and each section as an h2 with its text", () => {
    const sections = [1, 2, 3, 4, 5].map((n) => ({
      title: en.Legal.privacy[`s${n}Title` as "s1Title"],
      text: en.Legal.privacy[`s${n}Text` as "s1Text"],
    }));
    render(<LegalDocument eyebrow="Legal" title="Privacy" intro="Intro" sections={sections} />);

    expect(screen.getByRole("heading", { level: 1, name: "Privacy" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(5);
    expect(screen.getByText(sections[0]!.text)).toBeInTheDocument();
  });
});
