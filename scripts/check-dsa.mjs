// Runs every DSA pattern trace and checks: correct answer, valid C# line tags,
// and bilingual (English + বাংলা) captions and explanations.
import assert from "node:assert/strict";
import { dsaPatterns } from "../src/content/dsa/index.js";

assert.equal(dsaPatterns.length, 30);
const bn = /[ঀ-৿।]/;
for (const p of dsaPatterns) {
  const { frames, result } = p.trace();
  assert.ok(
    p.check(result),
    `${p.name}: wrong answer ${JSON.stringify(result)}`,
  );
  assert.ok(frames.length > 3, `${p.name}: too few steps`);
  for (const f of frames) {
    assert.ok(p.code.tags[f.line], `${p.name}: unknown code tag "${f.line}"`);
    assert.ok(
      Array.isArray(f.say) && bn.test(f.say[1]),
      `${p.name}: caption needs English + Bangla`,
    );
  }
  for (const t of [p.idea, p.analogy, ...p.signals, ...p.mistakes])
    assert.ok(
      Array.isArray(t) && t.length === 2,
      `${p.name}: text needs [en, bn]`,
    );
  assert.ok(p.practice.length >= 4, `${p.name}: needs practice problems`);
}
console.log(
  `PASS: 30 DSA patterns, ${dsaPatterns.reduce((n, p) => n + p.trace().frames.length, 0)} animated steps, all answers correct.`,
);
