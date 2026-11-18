// Turns a lesson into "video" scenes: intro → explanation steps → code walkthrough → notes → recap.
// Pure functions so they can be checked from Node.

const splitSentences = (text, bn) =>
  (bn
    ? text.split(/(?<=[।?!])\s+/)
    : text.split(/(?<=[.?!])\s+(?=[A-Z0-9'"(])/)
  )
    .map((s) => s.trim())
    .filter(Boolean);

// Split two sentence lists into the same number of chunks so English and Bangla stay in sync.
function pairChunks(en, bn, maxChunks = 4) {
  const k = Math.max(1, Math.min(maxChunks, en.length, bn.length));
  const chunk = (arr) =>
    Array.from({ length: k }, (_, i) =>
      arr
        .slice(
          Math.floor((i * arr.length) / k),
          Math.floor(((i + 1) * arr.length) / k),
        )
        .join(" "),
    );
  const e = chunk(en);
  const b = chunk(bn);
  return e.map((x, i) => ({ en: x, bn: b[i] }));
}

/* ---------- code walkthrough captions ---------- */
const STARTERS =
  /^(SELECT|FROM|(?:INNER |LEFT |RIGHT |FULL |CROSS )?(?:OUTER )?(?:LOOP |HASH |MERGE )?JOIN|CROSS APPLY|OUTER APPLY|WHERE|GROUP BY|HAVING|ORDER BY|OFFSET|INSERT|VALUES|UPDATE|SET|DELETE|TRUNCATE|MERGE|USING|WHEN|OUTPUT|CREATE|ALTER|DROP|DECLARE|BEGIN|COMMIT|ROLLBACK|SAVE|END|IF|ELSE|WHILE|THROW|RAISERROR|EXEC|EXECUTE|WITH|UNION|EXCEPT|INTERSECT|OPTION|GO|RETURN|RETURNS|AS|USE|PIVOT|UNPIVOT|WAITFOR|FETCH|OPEN|CLOSE|DEALLOCATE|CHECKPOINT|DBCC|GRANT|PRINT|BREAK)\b/i;

const RULES = [
  [
    /^SELECT\b[\s\S]*\bINTO\s+#/i,
    "SELECT … INTO creates a temp table from the result.",
    "SELECT … INTO ফলাফল থেকে temp table বানায়।",
  ],
  [
    /^SELECT\b[\s\S]*\bOVER\s*\(/i,
    "SELECT the columns — OVER(...) adds a window calculation without merging rows.",
    "কলাম বাছাই — OVER(...) রো না মিশিয়ে window হিসাব যোগ করে।",
  ],
  [
    /^SELECT\s+@\w+\s*=/i,
    "Read values into variables.",
    "মানগুলো variable-এ রাখা হচ্ছে।",
  ],
  [
    /^SELECT\b[\s\S]*\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i,
    "SELECT the columns and the totals (aggregates) to show.",
    "কোন কলাম আর কোন মোট (aggregate) দেখাবে তা বাছাই।",
  ],
  [
    /^SELECT\b/i,
    "SELECT chooses which columns appear in the result.",
    "SELECT ঠিক করে ফলাফলে কোন কলাম আসবে।",
  ],
  [
    /^FROM\b/i,
    "FROM names the table to read (with a short alias).",
    "FROM বলে কোন টেবিল পড়বে (ছোট alias সহ)।",
  ],
  [
    /^LEFT/i,
    "LEFT JOIN keeps every row on the left, even without a match.",
    "LEFT JOIN বাম দিকের সব রো রাখে, মিল না পেলেও।",
  ],
  [
    /^CROSS APPLY/i,
    "CROSS APPLY runs the inner query once for each outer row.",
    "CROSS APPLY বাইরের প্রতিটি রো-এর জন্য ভেতরের query চালায়।",
  ],
  [
    /^OUTER APPLY/i,
    "OUTER APPLY is like CROSS APPLY but keeps rows with no result.",
    "OUTER APPLY, CROSS APPLY-এর মতোই কিন্তু ফলাফলহীন রো-ও রাখে।",
  ],
  [
    /^CROSS JOIN/i,
    "CROSS JOIN pairs every row with every row.",
    "CROSS JOIN প্রতিটি রো-কে প্রতিটি রো-এর সাথে জোড়া দেয়।",
  ],
  [
    /JOIN\b/i,
    "JOIN adds a second table, matching rows on the ON condition.",
    "JOIN দ্বিতীয় টেবিল যোগ করে, ON শর্তে রো মেলায়।",
  ],
  [
    /^WHERE\b/i,
    "WHERE keeps only the rows that pass the condition.",
    "WHERE শুধু শর্ত পূরণ করা রো রাখে।",
  ],
  [
    /^GROUP BY/i,
    "GROUP BY puts rows into groups — one result row per group.",
    "GROUP BY রো-গুলোকে দলে ভাগ করে — প্রতি দলে একটি রো।",
  ],
  [
    /^HAVING/i,
    "HAVING filters whole groups using totals.",
    "HAVING মোটের ভিত্তিতে পুরো দল ফিল্টার করে।",
  ],
  [
    /^ORDER BY/i,
    "ORDER BY sorts the final result.",
    "ORDER BY চূড়ান্ত ফলাফল সাজায়।",
  ],
  [
    /^OFFSET/i,
    "OFFSET … FETCH returns just one page of rows.",
    "OFFSET … FETCH শুধু এক পাতা রো দেয়।",
  ],
  [
    /^INSERT/i,
    "INSERT adds new rows to the table.",
    "INSERT টেবিলে নতুন রো যোগ করে।",
  ],
  [
    /^VALUES/i,
    "VALUES lists the data for the new rows.",
    "VALUES নতুন রো-এর ডেটা দেয়।",
  ],
  [/^UPDATE/i, "UPDATE changes existing rows.", "UPDATE বিদ্যমান রো বদলায়।"],
  [
    /^SET\s+(NOCOUNT|XACT_ABORT|STATISTICS|TRANSACTION)/i,
    "A session setting that changes how the following statements behave.",
    "একটি session সেটিং — পরের statement-গুলোর আচরণ বদলায়।",
  ],
  [
    /^SET\b/i,
    "SET gives a new value (to a column or a variable).",
    "SET নতুন মান বসায় (কলাম বা variable-এ)।",
  ],
  [
    /^DELETE/i,
    "DELETE removes the matching rows.",
    "DELETE মিলে যাওয়া রো মুছে দেয়।",
  ],
  [
    /^TRUNCATE/i,
    "TRUNCATE empties the whole table quickly.",
    "TRUNCATE পুরো টেবিল দ্রুত খালি করে।",
  ],
  [
    /^MERGE/i,
    "MERGE compares a source with a target table.",
    "MERGE একটি source-কে target টেবিলের সাথে তুলনা করে।",
  ],
  [
    /^USING/i,
    "USING names the source rows for MERGE.",
    "USING, MERGE-এর source রো বলে দেয়।",
  ],
  [
    /^WHEN/i,
    "WHEN decides what happens for matched or unmatched rows.",
    "WHEN ঠিক করে মিল/অমিল রো-তে কী হবে।",
  ],
  [
    /^OUTPUT/i,
    "OUTPUT returns the rows this statement just changed.",
    "OUTPUT এই statement-এ বদলানো রো ফেরত দেয়।",
  ],
  [
    /^CREATE (UNIQUE )?(NONCLUSTERED |CLUSTERED )?(COLUMNSTORE )?INDEX/i,
    "CREATE INDEX builds a sorted copy that lets SQL Server find rows fast.",
    "CREATE INDEX একটি সাজানো কপি বানায়, যাতে SQL Server দ্রুত রো খুঁজে পায়।",
  ],
  [
    /^CREATE TABLE/i,
    "CREATE TABLE defines the columns, types and rules (constraints).",
    "CREATE TABLE কলাম, টাইপ আর নিয়ম (constraint) ঠিক করে।",
  ],
  [
    /^CREATE (OR ALTER )?VIEW/i,
    "CREATE VIEW saves a query under a name.",
    "CREATE VIEW একটি query নামসহ সংরক্ষণ করে।",
  ],
  [
    /^CREATE (OR ALTER )?PROC/i,
    "CREATE PROCEDURE saves reusable code with parameters.",
    "CREATE PROCEDURE parameter-সহ পুনঃব্যবহারযোগ্য কোড সংরক্ষণ করে।",
  ],
  [
    /^CREATE (OR ALTER )?FUNCTION/i,
    "CREATE FUNCTION defines a reusable calculation.",
    "CREATE FUNCTION একটি পুনঃব্যবহারযোগ্য হিসাব তৈরি করে।",
  ],
  [
    /^CREATE (OR ALTER )?TRIGGER/i,
    "CREATE TRIGGER runs code automatically after a change.",
    "CREATE TRIGGER পরিবর্তনের পর নিজে থেকে কোড চালায়।",
  ],
  [
    /^CREATE/i,
    "CREATE makes a new database object.",
    "CREATE নতুন একটি অবজেক্ট বানায়।",
  ],
  [
    /^ALTER DATABASE/i,
    "ALTER DATABASE changes a database-wide setting.",
    "ALTER DATABASE পুরো ডেটাবেসের সেটিং বদলায়।",
  ],
  [
    /^ALTER/i,
    "ALTER changes an existing object.",
    "ALTER বিদ্যমান অবজেক্ট বদলায়।",
  ],
  [/^DROP/i, "DROP removes an object.", "DROP একটি অবজেক্ট মুছে দেয়।"],
  [
    /^DECLARE \w+ CURSOR/i,
    "DECLARE CURSOR defines a row-by-row loop over a query.",
    "DECLARE CURSOR একটি query-র উপর রো-বাই-রো লুপ বানায়।",
  ],
  [
    /^DECLARE/i,
    "DECLARE creates variables to hold values.",
    "DECLARE মান রাখার variable বানায়।",
  ],
  [
    /^BEGIN TRY/i,
    "BEGIN TRY: if anything inside fails, jump to CATCH.",
    "BEGIN TRY: ভেতরে কিছু ব্যর্থ হলে CATCH-এ যায়।",
  ],
  [
    /^BEGIN CATCH/i,
    "BEGIN CATCH handles the error.",
    "BEGIN CATCH এরর সামলায়।",
  ],
  [
    /^BEGIN TRAN/i,
    "BEGIN TRANSACTION starts an all-or-nothing unit of work.",
    "BEGIN TRANSACTION একটি 'হয় সব, নয় কিছুই না' কাজ শুরু করে।",
  ],
  [
    /^BEGIN/i,
    "BEGIN starts a block of statements.",
    "BEGIN একটি statement-ব্লক শুরু করে।",
  ],
  [
    /^COMMIT/i,
    "COMMIT makes the changes permanent.",
    "COMMIT পরিবর্তন স্থায়ী করে।",
  ],
  [/^ROLLBACK/i, "ROLLBACK undoes the changes.", "ROLLBACK পরিবর্তন বাতিল করে।"],
  [
    /^SAVE/i,
    "SAVE TRANSACTION marks a savepoint for partial rollback.",
    "SAVE TRANSACTION আংশিক rollback-এর জন্য savepoint রাখে।",
  ],
  [/^END/i, "END closes the block.", "END ব্লক শেষ করে।"],
  [
    /^(IF|ELSE)/i,
    "IF runs the next statement only when the condition is true.",
    "IF শর্ত সত্য হলেই পরের statement চালায়।",
  ],
  [
    /^WHILE/i,
    "WHILE repeats the block while the condition is true.",
    "WHILE শর্ত সত্য থাকা পর্যন্ত ব্লক বারবার চালায়।",
  ],
  [/^THROW/i, "THROW raises an error and stops.", "THROW এরর তুলে থামিয়ে দেয়।"],
  [
    /^RAISERROR/i,
    "RAISERROR prints a formatted message.",
    "RAISERROR ফরম্যাট করা বার্তা দেখায়।",
  ],
  [
    /^EXEC/i,
    "EXEC runs a stored procedure.",
    "EXEC একটি stored procedure চালায়।",
  ],
  [
    /^WITH\b/i,
    "WITH starts a CTE — a named step you can read top to bottom.",
    "WITH একটি CTE শুরু করে — নামযুক্ত ধাপ, উপর থেকে নিচে পড়া যায়।",
  ],
  [
    /^UNION ALL/i,
    "UNION ALL stacks the next result under the previous one.",
    "UNION ALL পরের ফলাফল আগেরটির নিচে জোড়া দেয়।",
  ],
  [
    /^UNION/i,
    "UNION stacks results and removes duplicates.",
    "UNION ফলাফল জোড়া দিয়ে ডুপ্লিকেট সরায়।",
  ],
  [
    /^EXCEPT/i,
    "EXCEPT keeps rows from the first query that the second lacks.",
    "EXCEPT প্রথম query-র সেই রো রাখে যা দ্বিতীয়টিতে নেই।",
  ],
  [
    /^INTERSECT/i,
    "INTERSECT keeps rows found in both queries.",
    "INTERSECT দুই query-তেই থাকা রো রাখে।",
  ],
  [
    /^OPTION/i,
    "OPTION gives the optimizer a hint for this query.",
    "OPTION এই query-র জন্য optimizer-কে নির্দেশ দেয়।",
  ],
  [
    /^GO\b/i,
    "GO ends the batch in SSMS (it is not T-SQL itself).",
    "GO, SSMS-এ batch শেষ করে (এটা T-SQL নয়)।",
  ],
  [
    /^RETURNS?/i,
    "RETURN / RETURNS defines what comes back.",
    "RETURN / RETURNS ঠিক করে কী ফেরত যাবে।",
  ],
  [/^AS\b/i, "AS starts the body of the object.", "AS অবজেক্টের মূল অংশ শুরু করে।"],
  [/^USE/i, "USE switches to a database.", "USE ডেটাবেস বদলায়।"],
  [
    /^(PIVOT|UNPIVOT)/i,
    "PIVOT turns row values into columns (UNPIVOT does the reverse).",
    "PIVOT রো-এর মানকে কলাম বানায় (UNPIVOT উল্টোটা)।",
  ],
  [/^WAITFOR/i, "WAITFOR pauses for a moment.", "WAITFOR কিছুক্ষণ থামে।"],
  [
    /^(FETCH|OPEN|CLOSE|DEALLOCATE)/i,
    "Cursor housekeeping: open, fetch the next row, close, free memory.",
    "Cursor-এর কাজ: খোলা, পরের রো আনা, বন্ধ করা, মেমরি ছাড়া।",
  ],
  [
    /^CHECKPOINT/i,
    "CHECKPOINT flushes pages so the log can be reused.",
    "CHECKPOINT পেজ লিখে দেয় যাতে log আবার ব্যবহার হয়।",
  ],
  [
    /^DBCC/i,
    "DBCC shows internal information (here: statistics).",
    "DBCC ভেতরের তথ্য দেখায় (এখানে statistics)।",
  ],
  [/^GRANT/i, "GRANT gives a permission.", "GRANT অনুমতি দেয়।"],
  [/^BREAK/i, "BREAK leaves the loop.", "BREAK লুপ থেকে বের হয়।"],
  [/^PRINT/i, "PRINT shows a message.", "PRINT বার্তা দেখায়।"],
];

function caption(firstLine) {
  for (const [re, en, bn] of RULES) if (re.test(firstLine)) return { en, bn };
  return {
    en: "This line continues the statement above.",
    bn: "এই লাইন আগের statement চালিয়ে যায়।",
  };
}

// Group code lines into steps. Each step: { from, to, en, bn }
export function codeSteps(code, maxSteps = 10) {
  const lines = code.split("\n");
  const steps = [];
  let current = null;
  let pendingComment = [];
  let pendingStart = null;
  let depth = 0; // parenthesis depth: lines inside ( … ) belong to the same step
  lines.forEach((raw, i) => {
    const line = raw.trim();
    const commentOnly =
      line.startsWith("--") || line.startsWith("/*") || line.startsWith("*");
    if (!line) {
      if (depth === 0) current = null;
      return;
    }
    if (commentOnly) {
      if (pendingStart === null) pendingStart = i;
      pendingComment.push(
        line
          .replace(/^(--|\/\*+|\*\/?)\s*/, "")
          .replace(/\*\/$/, "")
          .trim(),
      );
      return;
    }
    const code = line.replace(/--.*$/, "");
    const starts = depth === 0 && STARTERS.test(code);
    if (!current || starts || pendingComment.length) {
      current = {
        from: pendingStart ?? i,
        to: i,
        firsts: [code],
        comments: [...pendingComment],
      };
      steps.push(current);
      pendingComment = [];
      pendingStart = null;
    } else current.to = i;
    const inline = line.match(/--\s*(.+)$/);
    if (inline) current.comments.push(inline[1].trim());
    depth = Math.max(
      0,
      depth +
        (code.match(/\(/g) || []).length -
        (code.match(/\)/g) || []).length,
    );
  });
  if (pendingComment.length)
    steps.push({
      from: pendingStart,
      to: lines.length - 1,
      firsts: [],
      comments: pendingComment,
    });

  // Merge small neighbouring steps until the walkthrough is short enough.
  let merged = steps;
  while (merged.length > maxSteps) {
    let best = 0;
    let bestSize = Infinity;
    for (let k = 0; k < merged.length - 1; k++) {
      const size = merged[k + 1].to - merged[k].from;
      if (size < bestSize) {
        bestSize = size;
        best = k;
      }
    }
    const a = merged[best];
    const b = merged[best + 1];
    merged = [
      ...merged.slice(0, best),
      {
        from: a.from,
        to: b.to,
        firsts: [...a.firsts, ...b.firsts],
        comments: [...a.comments, ...b.comments],
      },
      ...merged.slice(best + 2),
    ];
  }
  return merged.map((s) => {
    const parts = [];
    for (const f of s.firsts) {
      const c = caption(f);
      if (!parts.some((x) => x.en === c.en)) parts.push(c);
    }
    const shown = parts.slice(0, 3);
    const base = {
      en: shown.map((x) => x.en).join(" Then: "),
      bn: shown.map((x) => x.bn).join(" তারপর: "),
    };
    const note = s.comments.filter(Boolean).join(" · ");
    return {
      from: s.from,
      to: s.to,
      en: note ? (base.en ? base.en + " — " + note : note) : base.en,
      bn: note ? (base.bn ? base.bn + " (" + note + ")" : note) : base.bn,
    };
  });
}

const NOTE_TITLE = {
  key: ["Key idea", "মূল কথা"],
  trap: ["Watch out!", "সাবধান!"],
  tip: ["Pro tip", "প্রো টিপ"],
  interview: ["Interview question", "ইন্টারভিউ প্রশ্ন"],
};

export function buildScenes(chapter, sectionIndex) {
  const s = chapter.sections[sectionIndex];
  const scenes = [];
  scenes.push({
    kind: "intro",
    label: "Intro",
    en: `Episode ${chapter.id}.${sectionIndex + 1}: ${s.title}`,
    bn: `এপিসোড ${chapter.id}.${sectionIndex + 1}: ${s.titleBn}`,
  });
  if (sectionIndex === 0)
    scenes.push({
      kind: "story",
      label: "Story",
      en: chapter.analogy.en,
      bn: chapter.analogy.bn,
    });
  const chunks = pairChunks(
    splitSentences(s.en, false),
    splitSentences(s.bn, true),
  );
  chunks.forEach((c, i) =>
    scenes.push({
      kind: "explain",
      label: chunks.length > 1 ? `Explain ${i + 1}` : "Explain",
      ...c,
      step: i,
      steps: chunks.length,
    }),
  );
  if (s.code) {
    const steps = codeSteps(s.code);
    steps.forEach((c, i) =>
      scenes.push({
        kind: "code",
        label: `Code ${i + 1}`,
        ...c,
        step: i,
        steps: steps.length,
      }),
    );
  }
  (s.notes || []).forEach((n) =>
    scenes.push({
      kind: "note",
      noteType: n.type,
      label: NOTE_TITLE[n.type][0],
      title: NOTE_TITLE[n.type],
      q: n.q,
      en: n.en,
      bn: n.bn,
    }),
  );
  if (sectionIndex === chapter.sections.length - 1)
    scenes.push({
      kind: "recap",
      label: "Recap",
      items: chapter.summary,
      en: "Module recap",
      bn: "মডিউলের সারসংক্ষেপ",
    });
  return scenes;
}

// Reading time in ms for one scene at 1x speed.
export function sceneDuration(scene, mode) {
  const text =
    scene.kind === "recap"
      ? scene.items.map((x) => (mode === "bn" ? x.bn : x.en)).join(" ")
      : (mode !== "bn" ? scene.en || "" : "") +
        " " +
        (mode !== "en" ? scene.bn || "" : "");
  const words = text.trim().split(/\s+/).length;
  const extra =
    scene.kind === "code" ? 1200 + (scene.to - scene.from) * 250 : 0;
  return Math.min(16000, Math.max(3000, words * 330 + extra));
}

export function episodeMinutes(chapter, sectionIndex) {
  const total = buildScenes(chapter, sectionIndex).reduce(
    (ms, sc) => ms + sceneDuration(sc, "both"),
    0,
  );
  return Math.max(1, Math.round(total / 60000));
}
