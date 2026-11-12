import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
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
});
const { allLessons, loadChapter } = await import(
  "data:text/javascript;base64," +
    Buffer.from(result.outputFiles[0].text).toString("base64")
);
const unique = new Map();
for (const lesson of allLessons) {
  const chapter = await loadChapter(lesson);
  for (const [index, example] of chapter.examples.entries())
    if (example.kind === "Console example") {
      const hash = createHash("sha256").update(example.code).digest("hex");
      if (!unique.has(hash))
        unique.set(hash, {
          topic: lesson.topic,
          index,
          code: example.code,
          hash,
        });
    }
}
const samples = [...unique.values()];
const root = path.resolve("work/csharp-validation");
await mkdir(root, { recursive: true });
const command = process.env.DOTNET_BIN || "dotnet";
const env = {
  ...process.env,
  DOTNET_CLI_HOME: path.resolve("work/dotnet-state"),
  DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1",
  DOTNET_CLI_TELEMETRY_OPTOUT: "1",
  NUGET_PACKAGES: path.resolve("work/nuget"),
};
function run(args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env });
    let output = "";
    const timeout = setTimeout(() => child.kill("SIGTERM"), 120000);
    child.stdout.on("data", (v) => (output += v));
    child.stderr.on("data", (v) => (output += v));
    child.on("error", (error) => {
      clearTimeout(timeout);
      resolve({
        code: 1,
        output: error.message + " — install a .NET 8+ SDK or set DOTNET_BIN.",
      });
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      resolve({ code, output });
    });
  });
}
const available = await run(["--version"], process.cwd());
if (available.code) throw new Error(available.output);
let next = 0,
  passed = 0;
const failures = [];
const expected = {
  "Binary Search:0": ["1", "4", "5"],
  "Sliding Window:0": ["Best=9 at 2"],
  "Prefix Sum:0": ["4", "0"],
  "Heap / Priority Queue:0": ["8,9,10"],
  "Dynamic Programming:0": ["2"],
  "Graphs: BFS and DFS:0": ["0 -> 1 -> 3"],
  "Topological Sort:0": ["0,1,2,3"],
  "Thread Safety:0": ["(50, 50)"],
};
let executed = 0;
async function worker() {
  while (next < samples.length) {
    const sample = samples[next++];
    const dir = path.join(root, sample.hash.slice(0, 12));
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, "Example.csproj"),
      '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable></PropertyGroup></Project>',
    );
    await writeFile(path.join(dir, "Program.cs"), sample.code);
    const built = await run(["build", "--nologo", "--verbosity", "quiet"], dir);
    if (built.code) {
      failures.push({
        topic: sample.topic,
        index: sample.index,
        output: built.output,
      });
      continue;
    }
    passed++;
    const wanted = expected[sample.topic + ":" + sample.index];
    if (wanted) {
      const tested = await run(
        [path.join(dir, "bin/Debug/net8.0/Example.dll")],
        dir,
      );
      if (tested.code || !wanted.every((text) => tested.output.includes(text)))
        failures.push({
          topic: sample.topic,
          index: sample.index,
          output: "Output check failed: " + tested.output,
        });
      else executed++;
    }
  }
}
await Promise.all([worker(), worker()]);
const summary = {
  compiled: passed,
  total: samples.length,
  outputChecks: executed,
  failures,
};
await writeFile(
  path.join(root, "results.json"),
  JSON.stringify(summary, null, 2),
);
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 1;
