import en from "./en.json";
import fa from "./fa.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string"
      ? { ...acc, [path]: value }
      : { ...acc, ...flatten(value, path) };
  }, {});
}

const placeholders = (message: string) => [...message.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort();

const english = flatten(en);
const persian = flatten(fa);

describe("translation files", () => {
  it("define exactly the same keys in both languages", () => {
    expect(Object.keys(persian).sort()).toEqual(Object.keys(english).sort());
  });

  it("have no empty messages", () => {
    for (const [key, value] of [...Object.entries(english), ...Object.entries(persian)]) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("use the same ICU placeholders in both languages", () => {
    for (const key of Object.keys(english)) {
      expect(placeholders(persian[key] ?? ""), key).toEqual(placeholders(english[key] ?? ""));
    }
  });
});
