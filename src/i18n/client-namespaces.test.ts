import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import en from "@/messages/en.json";
import { CLIENT_NAMESPACES } from "./client-namespaces";

// Which message namespaces can reach the browser? Everything imported (transitively) by a file that
// starts with "use client" is part of the client bundle, so any useTranslations() in that set needs its
// namespace in CLIENT_NAMESPACES. A missing one is not a build error: it logs MISSING_MESSAGE and
// renders raw keys, which unit tests (that render with every message) can never notice.

const SRC = resolve(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) && !name.endsWith(".d.ts")
      ? [path]
      : [];
  });
}

function resolveImport(from: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? join(SRC, specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(dirname(from), specifier)
      : null;
  if (!base) return null;
  return (
    [".ts", ".tsx", "/index.ts", "/index.tsx"].map((ext) => base + ext).find(existsSync) ?? null
  );
}

function importsOf(file: string, text: string) {
  return [...text.matchAll(/(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g)]
    .map((m) => resolveImport(file, m[1]!))
    .filter((path): path is string => path !== null);
}

function namespacesUsedByClientCode() {
  const files = new Map(sourceFiles(SRC).map((file) => [file, readFileSync(file, "utf8")]));
  const queue = [...files]
    .filter(([, text]) => /^\s*["']use client["']/.test(text))
    .map(([file]) => file);
  const reached = new Set<string>();

  while (queue.length) {
    const file = queue.pop()!;
    if (reached.has(file) || !files.has(file)) continue;
    reached.add(file);
    queue.push(...importsOf(file, files.get(file)!));
  }

  const used = new Map<string, string[]>();
  for (const file of reached) {
    for (const match of files.get(file)!.matchAll(/useTranslations\(\s*["'`]([A-Za-z]+)/g)) {
      used.set(match[1]!, [...(used.get(match[1]!) ?? []), file.replace(SRC, "src")]);
    }
  }
  return used;
}

describe("client message namespaces", () => {
  const used = namespacesUsedByClientCode();

  it("find the client code that uses translations", () => {
    // A sanity check that the scan works at all: these are known client-side users.
    expect([...used.keys()]).toEqual(
      expect.arrayContaining(["Theme", "Nav", "Journal", "Contact"]),
    );
  });

  it("include every namespace that client code reads", () => {
    const missing = [...used].filter(
      ([namespace]) => !(CLIENT_NAMESPACES as readonly string[]).includes(namespace),
    );
    expect(
      missing.map(([namespace, files]) => `${namespace} (used in ${files.join(", ")})`),
      "add these to CLIENT_NAMESPACES",
    ).toEqual([]);
  });

  it("do not ship namespaces that no client code reads", () => {
    const unused = CLIENT_NAMESPACES.filter((namespace) => !used.has(namespace));
    expect(unused, "remove these from CLIENT_NAMESPACES to keep the payload small").toEqual([]);
  });

  it("only name namespaces that exist in the messages", () => {
    for (const namespace of CLIENT_NAMESPACES) expect(en).toHaveProperty(namespace);
  });
});
