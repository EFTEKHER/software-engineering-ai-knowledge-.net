// Compiles every C# console and ASP.NET Core example (with its NuGet packages)
// and runs console examples that declare expectedOutput, comparing the output.
// Usage: DOTNET_BIN=/path/to/dotnet node scripts/verify-examples.mjs [moduleIds]
import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";

const only = (process.argv[2] || "").split(",").filter(Boolean).map(Number);
const result = await build({
  stdin: {
    contents:
      'export{allLessons}from"./src/content/lessons.js";export{loadChapter}from"./src/content/reference/index.js";',
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  loader: { ".json": "json" },
});
const { allLessons, loadChapter } = await import(
  "data:text/javascript;base64," +
    Buffer.from(result.outputFiles[0].text).toString("base64")
);

const samples = new Map();
for (const lesson of allLessons) {
  if (only.length && !only.includes(lesson.module.id)) continue;
  const chapter = await loadChapter(lesson);
  for (const ex of chapter.examples) {
    if (ex.language !== "csharp") continue;
    const web = ex.kind === "ASP.NET Core program";
    if (ex.kind !== "Console example" && !web) continue;
    const packages = [...(ex.commands || "").matchAll(/package (\S+)( --prerelease)?/g)].map((m) => ({ name: m[1], pre: !!m[2] }));
    const hash = createHash("sha256").update(ex.code).digest("hex").slice(0, 12);
    samples.set(hash, { where: `${lesson.module.id}/${lesson.index} ${lesson.topic} · ${ex.title}`, web, packages, code: ex.code, expected: ex.expectedOutput, hash });
  }
}

const command = process.env.DOTNET_BIN || "dotnet";
const root = path.resolve("work/verify");
const env = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1", DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1" };
function run(args, cwd, ms = 180000) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env });
    let output = "";
    const t = setTimeout(() => child.kill("SIGKILL"), ms);
    child.stdout.on("data", (v) => (output += v));
    child.stderr.on("data", (v) => (output += v));
    child.on("error", (e) => { clearTimeout(t); resolve({ code: 1, output: e.message }); });
    child.on("close", (code) => { clearTimeout(t); resolve({ code, output }); });
  });
}
const list = [...samples.values()];
let next = 0;
const failures = [];
let built = 0, ran = 0;
async function worker() {
  while (next < list.length) {
    const s = list[next++];
    const dir = path.join(root, s.hash);
    await mkdir(dir, { recursive: true });
    const refs = s.packages.map((p) => `<PackageReference Include="${p.name}" Version="${p.pre ? "*-*" : "*"}" />`).join("");
    await writeFile(path.join(dir, "Example.csproj"),
      `<Project Sdk="Microsoft.NET.Sdk${s.web ? ".Web" : ""}"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net9.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable><NoWarn>CS8618;CS1998;CS8602;CS8600;CS8604;CS0168;CS0219;ASP0000;EXTEXP0018</NoWarn></PropertyGroup><ItemGroup>${refs}</ItemGroup></Project>`);
    await writeFile(path.join(dir, "Program.cs"), s.code);
    const b = await run(["build", "-v", "q", "-clp:ErrorsOnly"], dir);
    if (b.code) { failures.push({ where: s.where, kind: "build", output: b.output.split("\n").filter((l) => /error/.test(l)).slice(0, 4).join("\n") }); continue; }
    built++;
    if (!s.web && s.expected) {
      const r = await run(["run", "--no-build"], dir, 60000);
      const got = r.output.replace(/\r/g, "").trim();
      if (got !== s.expected.trim()) failures.push({ where: s.where, kind: "output", output: `EXPECTED:\n${s.expected.trim()}\nGOT:\n${got}` });
      else ran++;
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
const summary = { total: list.length, built, outputMatched: ran, failures };
await writeFile(path.join(root, "results.json"), JSON.stringify(summary, null, 2));
console.log(`total=${list.length} built=${built} outputMatched=${ran} failures=${failures.length}`);
for (const f of failures) console.log(`--- ${f.kind}: ${f.where}\n${f.output}`);
