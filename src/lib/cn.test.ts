import { cn } from "./cn";

describe("cn", () => {
  it("merges conflicting Tailwind classes, keeping the last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
