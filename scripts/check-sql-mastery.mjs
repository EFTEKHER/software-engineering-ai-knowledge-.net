// Integrity check for the SQL Server Mastery module.
// - Start Here + 25 modules, quizzes and player scenes; every lesson bilingual (English + Bangla)
// - SQL Server / T-SQL only: no syntax or mentions from other database engines
import {
  chapters,
  parts,
  bankDbSetup,
  quizzes,
} from "../src/content/sqlMastery/index.js";
import { buildScenes, codeSteps } from "../src/content/sqlMastery/episodes.js";

const errors = [];
const bangla = /[ঀ-৿]/;
const otherDbms = [
  [/\bLIMIT\s+\d/i, "LIMIT n (use TOP / OFFSET-FETCH)"],
  [/\bILIKE\b/i, "ILIKE"],
  [/\bON\s+CONFLICT\b/i, "ON CONFLICT"],
  [/\bON\s+DUPLICATE\s+KEY\b/i, "ON DUPLICATE KEY"],
  [/\bRETURNING\b/, "RETURNING (use OUTPUT)"],
  [/\bAUTO_INCREMENT\b/i, "AUTO_INCREMENT"],
  [/\bSERIAL\b/, "SERIAL"],
  [/\bWITH\s+RECURSIVE\b/i, "WITH RECURSIVE"],
  [/\bNOW\(\)/i, "NOW()"],
  [/::\w+/, "::type casts"],
  [/\bINTERVAL\s+'/i, "INTERVAL literals"],
  [/\bPRAGMA\b/i, "PRAGMA"],
  [/\bPostgre(SQL|s)\b/i, "PostgreSQL mention"],
  [/\bMySQL\b/i, "MySQL mention"],
  [/\bSQLite\b/i, "SQLite mention"],
  [/\bOracle\b/i, "Oracle mention"],
  [/\bMariaDB\b/i, "MariaDB mention"],
];

function scan(where, text) {
  for (const [re, label] of otherDbms)
    if (re.test(text))
      errors.push(`${where}: non-SQL Server syntax/mention: ${label}`);
}

if (parts.length !== 6) errors.push(`expected 6 parts, found ${parts.length}`);
if (chapters.length !== 26)
  errors.push(
    `expected 26 modules (Start Here + 25), found ${chapters.length}`,
  );

const slugs = new Set();
let lessons = 0;
let examples = 0;
chapters.forEach((c, i) => {
  const at = `Module ${c.id}`;
  if (c.id !== i) errors.push(`${at}: ids must be sequential`);
  if (slugs.has(c.slug)) errors.push(`${at}: duplicate slug ${c.slug}`);
  slugs.add(c.slug);
  if (!(c.part >= 0 && c.part < parts.length)) errors.push(`${at}: bad part`);
  if (!["Beginner", "Intermediate", "Advanced"].includes(c.level))
    errors.push(`${at}: bad level`);
  if (!c.title || !bangla.test(c.titleBn || ""))
    errors.push(`${at}: needs English and Bangla titles`);
  if (!c.analogy?.en || !bangla.test(c.analogy?.bn || ""))
    errors.push(`${at}: needs a bilingual analogy`);
  if (
    !c.summary?.length ||
    c.summary.some((s) => !s.en || !bangla.test(s.bn || ""))
  )
    errors.push(`${at}: needs a bilingual summary`);
  if (c.sections.length < 2) errors.push(`${at}: needs at least two lessons`);
  scan(at, JSON.stringify(c));
  c.sections.forEach((s, k) => {
    const where = `${at}.${k + 1} ${s.title}`;
    lessons++;
    if (!s.title || !bangla.test(s.titleBn || ""))
      errors.push(`${where}: bilingual title missing`);
    if ((s.en || "").length < 60)
      errors.push(`${where}: English explanation too short`);
    if (!bangla.test(s.bn || "") || s.bn.length < 60)
      errors.push(`${where}: Bangla explanation missing`);
    if (!s.code || s.code.trim().length < 20)
      errors.push(`${where}: T-SQL example missing`);
    else examples++;
    (s.notes || []).forEach((n, j) => {
      if (!["key", "trap", "tip", "interview"].includes(n.type))
        errors.push(`${where} note ${j}: bad type`);
      if (!n.en || !bangla.test(n.bn || ""))
        errors.push(`${where} note ${j}: must be bilingual`);
      if (n.type === "interview" && !n.q)
        errors.push(`${where} note ${j}: interview needs a question`);
    });
  });
});

// Every module has a quiz; every episode builds into playable scenes.
let scenesTotal = 0;
for (const c of chapters) {
  const qs = quizzes[c.slug];
  if (!qs || qs.length < 2)
    errors.push(`Module ${c.id}: needs a quiz with at least 2 questions`);
  (qs || []).forEach((q, k) => {
    if (!q.q || !bangla.test(q.qBn || ""))
      errors.push(`Module ${c.id} quiz ${k + 1}: bilingual question missing`);
    if (!(q.answer >= 0 && q.answer < q.options.length))
      errors.push(`Module ${c.id} quiz ${k + 1}: bad answer index`);
    if (!q.why?.en || !bangla.test(q.why?.bn || ""))
      errors.push(
        `Module ${c.id} quiz ${k + 1}: bilingual explanation missing`,
      );
    scan(`Module ${c.id} quiz`, JSON.stringify(q));
  });
  c.sections.forEach((s, k) => {
    const scenes = buildScenes(c, k);
    scenesTotal += scenes.length;
    if (!scenes.some((x) => x.kind === "explain"))
      errors.push(`Ep ${c.id}.${k + 1}: no explanation scene`);
    const steps = codeSteps(s.code);
    const lines = s.code.split("\n").length;
    if (
      !steps.length ||
      steps.some((x) => !x.en || !x.bn || x.from > x.to || x.to >= lines)
    )
      errors.push(`Ep ${c.id}.${k + 1}: code walkthrough steps are invalid`);
  });
}
for (const slug of Object.keys(quizzes))
  if (!chapters.some((c) => c.slug === slug))
    errors.push(`quiz for unknown module ${slug}`);

scan("BankDB setup", bankDbSetup);
for (const table of [
  "Branches",
  "Employees",
  "Customers",
  "Accounts",
  "Transactions",
  "Loans",
])
  if (!bankDbSetup.includes(`CREATE TABLE dbo.${table}`))
    errors.push(`setup: missing dbo.${table}`);

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(
    `\nSQL Server Mastery check failed with ${errors.length} problem(s).`,
  );
  process.exit(1);
}
console.log(
  `SQL Server Mastery: ${chapters.length} modules, ${lessons} bilingual lessons, ${examples} T-SQL examples, ${scenesTotal} player scenes, ${chapters.length} quizzes — SQL Server only ✓`,
);
