import { cn } from "./cn";

describe("cn", () => {
  it("merges conflicting Tailwind classes, keeping the last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("keeps the custom type-scale classes when a text colour follows", () => {
    expect(cn("text-headline", "text-foreground")).toBe("text-headline text-foreground");
    expect(cn("text-display", "text-accent-ink")).toBe("text-display text-accent-ink");
  });

  it("still lets a later font size replace an earlier one", () => {
    expect(cn("text-sm", "text-headline")).toBe("text-headline");
    expect(cn("text-headline", "text-display")).toBe("text-display");
  });
});
