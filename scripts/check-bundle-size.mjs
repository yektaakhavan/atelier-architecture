// Reports (and enforces a budget on) the JavaScript each page loads, gzip-compressed, which is
// what visitors download from any host that compresses responses. Run after `npm run build`.
import { gzipSync } from "node:zlib";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DEFAULT_BUDGET_KB = Number(process.env.JS_BUDGET_KB ?? 220);
// Pages that legitimately need more. The contact page ships React Hook Form and Zod.
const budgetOverrides = [[/\/contact$/, 260]];
const budgetFor = (route) =>
  budgetOverrides.find(([pattern]) => pattern.test(route))?.[1] ?? DEFAULT_BUDGET_KB;
const appDir = ".next/server/app";

if (!existsSync(appDir)) {
  console.error("No build found. Run `npm run build` first.");
  process.exit(2);
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "art" || name.startsWith("_")) continue;
      yield* htmlFiles(path);
    } else if (name.endsWith(".html")) yield path;
  }
}

const gzipCache = new Map();
function gzipKb(src) {
  const file = join(".next", src.replace(/^\/_next\//, "").split("?")[0]);
  if (!gzipCache.has(file)) gzipCache.set(file, gzipSync(readFileSync(file)).length / 1024);
  return gzipCache.get(file);
}

const rows = [];
for (const file of htmlFiles(appDir)) {
  const route = "/" + relative(appDir, file).replace(/\.html$/, "");
  if (!/^\/(en|fa)(\/|$)/.test(route)) continue;
  const scripts = new Set(
    [...readFileSync(file, "utf8").matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]),
  );
  rows.push({
    route,
    files: scripts.size,
    kb: [...scripts].reduce((sum, src) => sum + gzipKb(src), 0),
  });
}

rows.sort((a, b) => b.kb - a.kb);
console.log(`First-load JavaScript per page (gzip), default budget ${DEFAULT_BUDGET_KB} KB\n`);
for (const { route, files, kb } of rows) {
  console.log(
    `${kb > budgetFor(route) ? "OVER" : "ok  "} ${kb.toFixed(1).padStart(6)} KB  ${String(files).padStart(2)} files  ${route}`,
  );
}

const over = rows.filter((row) => row.kb > budgetFor(row.route));
if (over.length) {
  console.error(`\n${over.length} page(s) exceed their JavaScript budget.`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} pages are within budget.`);
