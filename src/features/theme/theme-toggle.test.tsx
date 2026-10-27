import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeToggle } from "./theme-toggle";

const labels = { switchToLight: "Switch to light", switchToDark: "Switch to dark" };

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
  });

  it("offers to switch to dark while the theme is light", () => {
    render(<ThemeToggle labels={labels} />);
    expect(screen.getByRole("button", { name: labels.switchToDark })).toBeInTheDocument();
  });

  it("switches the theme, updates its label and persists the choice", async () => {
    render(<ThemeToggle labels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: labels.switchToDark }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(screen.getByRole("button", { name: labels.switchToLight })).toBeInTheDocument();
  });

  it("switches back to light", async () => {
    render(<ThemeToggle labels={labels} />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("still switches when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<ThemeToggle labels={labels} />);
    await userEvent.click(screen.getByRole("button"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    vi.restoreAllMocks();
  });
});
