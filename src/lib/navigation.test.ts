import { isActivePath } from "./navigation";

describe("isActivePath", () => {
  it("matches the exact path", () => {
    expect(isActivePath("/projects", "/projects")).toBe(true);
  });

  it("matches nested pages", () => {
    expect(isActivePath("/projects/casa-olivo", "/projects")).toBe(true);
  });

  it("does not match a different path sharing a prefix", () => {
    expect(isActivePath("/projects-archive", "/projects")).toBe(false);
  });

  it("does not match other sections", () => {
    expect(isActivePath("/about", "/projects")).toBe(false);
  });
});
