import {
  readFile,
  readdir,
  mkdir,
  writeFile,
  copyFile,
} from "node:fs/promises";
import { zipSync, strToU8 } from "fflate";
import path from "node:path";
const files = {};
const add = async (name) => {
  files["dotnet-mastery/" + name] = [
    new Uint8Array(await readFile(name)),
    { mtime: new Date("2020-01-01T00:00:00Z") },
  ];
};
const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) await walk(name);
    else await add(name);
  }
};
await mkdir("public", { recursive: true });
await copyFile(
  "node_modules/sql.js/dist/sql-wasm.wasm",
  "public/sql-wasm.wasm",
);
for (const name of [
  "package.json",
  "package-lock.json",
  "index.html",
  "README.md",
  "vercel.json",
  "vite.config.js",
  "playwright.config.js",
  ".gitignore",
])
  await add(name);
for (const dir of ["src", "scripts", "tests"]) await walk(dir);
await add("public/favicon.svg");
await add("public/sql-wasm.wasm");
files["dotnet-mastery/SOURCE-NOTES.txt"] = strToU8(
  "This bundle is generated from the current reviewed source. No credentials, hosting identity, student notes, node_modules or .git history are included. Run npm ci, then npm run dev.",
);
const zip = zipSync(files, { level: 6 });
await writeFile("public/dotnet-mastery-react.zip", zip);
console.log(
  `Source bundle ready: ${Object.keys(files).length} files, ${zip.length} bytes.`,
);
