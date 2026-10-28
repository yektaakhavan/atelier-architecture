import { routing } from "@/i18n/routing";
import { getDirection, localeDirection, localeNames } from "./locales";

describe("locale config", () => {
  it("renders English left-to-right and Persian right-to-left", () => {
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("fa")).toBe("rtl");
  });

  it("defines a direction and a name for every routed locale", () => {
    for (const locale of routing.locales) {
      expect(localeDirection[locale]).toBeDefined();
      expect(localeNames[locale]).toBeTruthy();
    }
  });

  it("uses English as the default locale", () => {
    expect(routing.defaultLocale).toBe("en");
  });
});
