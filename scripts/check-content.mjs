import assert from "node:assert/strict";
import { build } from "esbuild";
const result = await build({
  stdin: {
    contents:
      'export {allLessons} from "./src/content/lessons.js"; export {loadChapter} from "./src/content/reference/index.js";',
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
assert.equal(allLessons.length, 385);
assert.equal(new Set(allLessons.map((l) => l.id)).size, 385);
for (const lesson of allLessons) {
  assert.ok(
    lesson.en.length > 30,
    lesson.id + " needs specific English theory",
  );
  assert.match(
    lesson.bn,
    /[ঀ-৿]/,
    lesson.id + " needs Bangla theory",
  );
  assert.ok(
    lesson.lines.length && lesson.lines.every((l) => l.text && l.en && l.bn),
    lesson.id + " missing a code explanation",
  );
  assert.ok(lesson.flow.length >= 4, lesson.id + " missing diagram nodes");
  assert.ok(
    lesson.caution && lesson.deep && lesson.context.terms.length >= 4,
    lesson.id + " missing study material",
  );
  assert.ok(new URL(lesson.docs[1]).protocol === "https:");
}
assert.match(allLessons.find((l) => l.id === "3-5").code, /while \(lo <= hi\)/);
assert.equal(allLessons.find((l) => l.id === "13-13").lang, "csharp");
console.log(
  "PASS: 385 lessons; bilingual theory; all code lines annotated; diagrams, prerequisites, glossary, limitations and references present.",
);

let exampleCount = 0,
  codeLines = 0;
const languages = new Set([
  "csharp",
  "bash",
  "sql",
  "sql-reference",
  "yaml",
  "javascript",
  "json",
  "nginx",
  "dockerfile",
  "promql",
  "hcl",
  "logstash",
  "html",
  "http",
  "python",
  "markdown",
]);
for (const lesson of allLessons) {
  const chapter = await loadChapter(lesson);
  assert.ok(
    chapter.examples.length >= 2,
    lesson.id + " needs multiple additional examples",
  );
  for (const section of chapter.sections) {
    assert.ok(
      section.en.length >= 80,
      lesson.id + " needs expanded English theory",
    );
    assert.match(
      section.bn,
      /[ঀ-৿]/,
      lesson.id + " needs expanded Bangla theory",
    );
  }
  for (const example of chapter.examples) {
    assert.ok(
      languages.has(example.language),
      lesson.id + " invalid code language: " + example.language,
    );
    assert.ok(
      example.code.split("\n").length >= 4,
      lesson.id + " example too short",
    );
    assert.ok(
      example.title && example.kind,
      lesson.id + " missing example context",
    );
  }
  exampleCount += chapter.examples.length;
  codeLines += chapter.codeLines;
}
console.log(
  "PASS: " +
    allLessons.length +
    " expanded reference chapters, " +
    exampleCount +
    " additional examples, " +
    codeLines +
    " added code lines.",
);
