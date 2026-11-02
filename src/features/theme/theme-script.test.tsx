import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeScript } from "./theme-script";

function stubMatchMedia(prefersDark: boolean) {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: prefersDark }));
}

describe("ThemeScript", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    stubMatchMedia(false);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("is part of the server-rendered HTML, where it can run before first paint", () => {
    const html = renderToString(<ThemeScript />);
    expect(html).toContain("<script>");
    expect(html).toContain(THEME_STORAGE_KEY);
  });

  it("creates no script element when rendered only in the browser", () => {
    const { container } = render(<ThemeScript />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("applies the saved theme when the page was rendered only in the browser", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    render(<ThemeScript />);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("falls back to the system preference without a saved choice", () => {
    stubMatchMedia(true);
    render(<ThemeScript />);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("leaves a theme that the inline script already applied alone", () => {
    document.documentElement.dataset.theme = "light";
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    render(<ThemeScript />);
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
