import { writeFile } from "node:fs/promises";
const groups = [
  "commands",
  "sql",
  "algorithms",
  "design",
  "backend",
  "security",
  "systems",
  "foundations",
  "cloud",
  "operations",
  "ai",
];
const manifest = {};
for (const group of groups) {
  const { default: entries } = await import(
    new URL(`../src/content/reference/${group}.js`, import.meta.url)
  );
  manifest[group] = Object.keys(entries);
}
await writeFile(
  "src/content/reference/manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  "Reference index updated:",
  Object.values(manifest).reduce((n, a) => n + a.length, 0),
  "canonical chapters.",
);
