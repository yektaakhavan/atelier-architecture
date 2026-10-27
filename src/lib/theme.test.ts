import { resolveTheme, themeInitScript, THEME_STORAGE_KEY } from "./theme";

function stubMatchMedia(prefersDark: boolean) {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: prefersDark }));
}

describe("resolveTheme", () => {
  it("prefers a stored choice over the system setting", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to the system setting when nothing valid is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme("sepia", false)).toBe("light");
  });
});

describe("themeInitScript", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.style.colorScheme = "";
  });

  afterEach(() => vi.unstubAllGlobals());

  const run = () => window.eval(themeInitScript);

  it("applies the stored theme", () => {
    stubMatchMedia(false);
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    run();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("uses the system preference on a first visit", () => {
    stubMatchMedia(true);
    run();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("agrees with resolveTheme for every combination", () => {
    for (const stored of [null, "light", "dark", "invalid"]) {
      for (const prefersDark of [true, false]) {
        stubMatchMedia(prefersDark);
        localStorage.clear();
        if (stored) localStorage.setItem(THEME_STORAGE_KEY, stored);
        run();
        expect(document.documentElement.dataset.theme).toBe(resolveTheme(stored, prefersDark));
      }
    }
  });

  it("does not throw when storage is unavailable", () => {
    stubMatchMedia(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(run).not.toThrow();
    vi.restoreAllMocks();
  });
});
