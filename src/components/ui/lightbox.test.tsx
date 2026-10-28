import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { Lightbox } from "./lightbox";

const slides = ["One", "Two", "Three"].map((name) => ({
  id: name,
  caption: `Caption ${name}`,
  content: <p>{`Slide ${name}`}</p>,
}));
const labels = { dialog: "Viewer", close: "Close", previous: "Previous", next: "Next" };

function Harness({
  onClose = () => {},
  startOpen = true,
}: {
  onClose?: () => void;
  startOpen?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(startOpen);
  return (
    <>
      <button onClick={() => setOpen(true)}>open</button>
      <Lightbox
        slides={slides}
        index={index}
        open={open}
        onIndexChange={setIndex}
        onClose={() => {
          setOpen(false);
          onClose();
        }}
        labels={labels}
        counterLabel={(current, total) => `${current} of ${total}`}
      />
    </>
  );
}

describe("Lightbox", () => {
  it("shows only the current slide with its caption and position", () => {
    renderWithIntl(<Harness />);

    expect(screen.getByRole("dialog", { name: "Viewer" })).toBeInTheDocument();
    expect(screen.getByText("Slide One")).toBeInTheDocument();
    expect(screen.queryByText("Slide Two")).not.toBeInTheDocument();
    expect(screen.getByText("Caption One")).toBeInTheDocument();
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("moves with the buttons and wraps around at both ends", async () => {
    renderWithIntl(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText("Slide Three")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Slide One")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Slide Two")).toBeInTheDocument();
  });

  it("follows the arrow keys left-to-right in English", () => {
    renderWithIntl(<Harness />);
    const dialog = screen.getByRole("dialog");

    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(screen.getByText("Slide Two")).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(screen.getByText("Slide One")).toBeInTheDocument();
  });

  it("reverses the arrow keys on right-to-left pages", () => {
    renderWithIntl(<Harness />, { locale: "fa" });
    const dialog = screen.getByRole("dialog");

    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(screen.getByText("Slide Two")).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(screen.getByText("Slide One")).toBeInTheDocument();
  });

  it("closes from the close button, the backdrop and the native close event (Escape)", async () => {
    const onClose = vi.fn();
    renderWithIntl(<Harness onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "open" }));
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(2);

    await userEvent.click(screen.getByRole("button", { name: "open" }));
    fireEvent(screen.getByRole("dialog"), new Event("close"));
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("locks page scrolling only while open", async () => {
    renderWithIntl(<Harness />);
    expect(document.documentElement.style.overflow).toBe("hidden");

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("hides the navigation buttons when there is a single slide", () => {
    renderWithIntl(
      <Lightbox
        slides={slides.slice(0, 1)}
        index={0}
        open
        onIndexChange={() => {}}
        onClose={() => {}}
        labels={labels}
        counterLabel={() => "1 of 1"}
      />,
    );
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });
});
