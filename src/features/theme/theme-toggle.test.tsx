import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
  });

  it("offers to switch to dark while the theme is light", () => {
    renderWithIntl(<ThemeToggle />);
    expect(screen.getByRole("button", { name: en.Theme.switchToDark })).toBeInTheDocument();
  });

  it("switches the theme, updates its label and persists the choice", async () => {
    renderWithIntl(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: en.Theme.switchToDark }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(screen.getByRole("button", { name: en.Theme.switchToLight })).toBeInTheDocument();
  });

  it("switches back to light", async () => {
    renderWithIntl(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("still switches when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    renderWithIntl(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    vi.restoreAllMocks();
  });

  it("labels the button in Persian", () => {
    renderWithIntl(<ThemeToggle />, { locale: "fa" });
    expect(screen.getByRole("button", { name: fa.Theme.switchToDark })).toBeInTheDocument();
  });
});
