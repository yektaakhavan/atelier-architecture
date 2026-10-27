import { render, screen } from "@testing-library/react";
import { Container } from "./container";

describe("Container", () => {
  it("renders the requested element", () => {
    render(<Container as="main">content</Container>);
    expect(screen.getByRole("main")).toHaveTextContent("content");
  });

  it("applies the narrow size", () => {
    render(
      <Container size="narrow" data-testid="c">
        x
      </Container>,
    );
    expect(screen.getByTestId("c")).toHaveClass("max-w-3xl");
  });
});
