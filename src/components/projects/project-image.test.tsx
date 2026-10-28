import { render, screen } from "@testing-library/react";
import { ProjectImage } from "./project-image";

describe("ProjectImage", () => {
  it("falls back to the placeholder artwork without a source", () => {
    render(<ProjectImage image={{ art: "arches", tone: "brick" }} alt="Courtyard" />);
    expect(screen.getByRole("img", { name: "Courtyard" }).tagName.toLowerCase()).toBe("svg");
  });

  it("uses a real photo once a source is provided", () => {
    render(
      <ProjectImage
        image={{ art: "arches", tone: "brick", src: "/images/courtyard.jpg" }}
        alt="Courtyard"
      />,
    );
    const image = screen.getByRole("img", { name: "Courtyard" });
    expect(image.tagName.toLowerCase()).toBe("img");
    expect(image.getAttribute("src")).toContain("courtyard.jpg");
  });
});
