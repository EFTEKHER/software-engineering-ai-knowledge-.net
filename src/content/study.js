import csharp from "./csharpStudyData.json";
import backend from "./backendEssentialsData.json";
import { gapRows } from "./gapTopics";
// Lines may carry their own "~~ English / বাংলা" explanation; strip it for copyable code.
const stripNotes = (code) =>
  code
    .split("\n")
    .map((line) => line.split(" ~~ ")[0])
    .join("\n");
function explainLine(line, row) {
  const code = line.trim();
  const rules = [
    [
      /^Console\.WriteLine/,
      "Write the expression to standard output and end the line.",
      "Expression-এর মান পর্দায় লিখে নতুন লাইন শুরু করুন।",
    ],
    [
      /^Console\.Write/,
      "Write a prompt without adding a line break.",
      "নতুন লাইন ছাড়া prompt লিখুন।",
    ],
    [
      /Console\.ReadLine/,
      "Read a nullable string from standard input.",
      "Standard input থেকে string পড়ুন; null আসতে পারে।",
    ],
    [
      /^return\b/,
      "Return this result to the caller.",
      "Caller-কে হিসাবের ফল ফেরত দিন।",
    ],
    [
      /^if\b|^else/,
      "Choose a branch according to the condition.",
      "শর্ত অনুযায়ী branch বেছে নিন।",
    ],
    [
      /^for\b|^foreach\b|^while\b/,
      "Repeat this operation over the indicated values or condition.",
      "দেওয়া মান বা শর্ত অনুযায়ী কাজটি বারবার করুন।",
    ],
    [
      /^class |^static class |^record /,
      "Declare the data or behavior used by this example.",
      "উদাহরণের data বা behavior-এর type ঘোষণা করুন।",
    ],
    [
      /^catch/,
      "Handle the specified failure path.",
      "নির্দিষ্ট failure path সামলান।",
    ],
    [
      /^try/,
      "Start the operation whose failure will be handled below.",
      "নিচে failure সামলানো হবে এমন কাজ শুরু করুন।",
    ],
    [
      /^\{|^\}/,
      "Mark the boundary of this scope or block.",
      "Scope বা block-এর সীমানা চিহ্নিত করুন।",
    ],
    [
      /^\/\//,
      "Read this comment for prerequisites or limitations.",
      "প্রয়োজনীয় setup বা সীমা জানতে comment পড়ুন।",
    ],
  ];
  const match = rules.find(([pattern]) => pattern.test(code));
  return match ? [match[1], match[2]] : [row.en, row.bn];
}
export const studyRows = [...csharp, ...backend, ...gapRows];
export const studyConcepts = Object.fromEntries(
  studyRows.map((r) => [
    r.topic,
    {
      ...r,
      study: true,
      code: r.code
        .split("\n")
        .map((line) => {
          if (line.includes(" ~~ ")) return line;
          const [en, bn] = explainLine(line, r);
          return `${line} ~~ ${en} / ${bn}`;
        })
        .join("\n"),
      flow: r.flow || [
        "Read the contract",
        "Prepare input",
        "Execute the example",
        "Inspect the result",
        "Change an edge case",
      ],
      caution:
        r.caution ||
        "These are corrected teaching examples from the study edition, not verified transcriptions of the original lecture screenshots. File examples require a local sample.txt; console input examples require interactive input.",
      deep:
        r.en +
        " Practice: predict the output first, run the example locally, then change one input and explain the difference.",
    },
  ]),
);
export function buildStudyChapter(lesson) {
  const r = studyRows.find((r) => r.topic === lesson.topic);
  const web = r.kind === "ASP.NET Core program";
  const reference = r.kind === "Reference example";
  const source = r.pages
    ? `Study edition lesson ${lesson.index + 1}; original lecture source pp. ${r.pages}. Page ranges are orientation aids. The edition labels its code as corrected teaching reconstructions.`
    : "Additional backend curriculum, authored for this site.";
  const gap = Boolean(r.analogy);
  const sourceText = gap
    ? "Interview-roadmap lesson written for this site in plain English and Bangla."
    : source;
  const extraSections = [];
  if (r.analogy)
    extraSections.push({
      title: "The easy way · সহজ ভাষায়",
      en:
        r.analogy[0] +
        " Keep this picture in mind while reading the code: every line in the lesson view has a plain English note, and the SQL Server and command examples below show the same idea from the database and server side.",
      bn:
        r.analogy[1] +
        " কোড পড়ার সময় এই ছবিটি মনে রাখুন: lesson-এ প্রতিটি লাইনের সহজ বাংলা ব্যাখ্যা আছে, আর নিচের SQL Server ও command উদাহরণ একই ধারণা database ও server-এর দিক থেকে দেখায়।",
    });
  if (r.interview)
    extraSections.push({
      title: "Interview question · ইন্টারভিউ প্রশ্ন",
      en:
        r.interview[0] +
        " Explain it with the example above and one real incident you can imagine in your own API.",
      bn:
        r.interview[1] +
        " উপরের উদাহরণ ও আপনার নিজের API-র একটি সম্ভাব্য ঘটনা দিয়ে ব্যাখ্যা করুন।",
    });
  return {
    group: "study",
    canonicalKey: r.topic,
    en: r.en,
    bn: r.bn,
    decisionEn: lesson.caution + " " + lesson.deep,
    decisionBn: r.bn,
    extraSections: [
      ...extraSections,
      {
        title: "Source and practice · উৎস ও অনুশীলন",
        en:
          sourceText +
          " Read, type, run, compare the output, and change one boundary input.",
        bn: gap
          ? "কোড নিজে টাইপ করুন, চালান, ফল মিলিয়ে দেখুন, তারপর একটি মান বদলে কী হয় ব্যাখ্যা করুন।"
          : "উৎসের পৃষ্ঠা শুধু খুঁজে পাওয়ার সহায়ক। কোড লিখুন, চালান, ফল মিলিয়ে দেখুন এবং একটি সীমার ইনপুট বদলান।",
      },
    ],
    examples: [
      {
        title: r.topic,
        kind: r.kind || "Console example",
        language: "csharp",
        code: stripNotes(r.code),
        expectedOutput: r.output,
        setupEn:
          r.setup && gap
            ? r.setup
            : gap && !reference && !web
              ? "Create a .NET 8+ console project (dotnet new console -n Study), replace Program.cs with this code and run dotnet run."
              : (reference
                  ? "Reference fragment: follow the prerequisites in the limitations section; this is not a standalone program."
                  : web
                    ? "Create an empty ASP.NET Core web project and replace Program.cs. Use the localhost port printed by the host."
                    : r.setup) ||
                "Use a .NET 8+ console project with implicit usings enabled. File examples require sample.txt in the working directory. ReadLine examples need interactive input.",
        setupBn: gap
          ? web
            ? "খালি ASP.NET Core project (dotnet new web) বানিয়ে Program.cs বদলান, তারপর curl বা browser দিয়ে পরীক্ষা করুন।"
            : reference
              ? "এটি reference অংশ: উপরের setup অনুযায়ী project-এ যুক্ত করুন।"
              : "নতুন .NET 8 console project (dotnet new console) বানিয়ে Program.cs বদলান এবং dotnet run দিন।"
          : "নতুন .NET console project বানিয়ে Program.cs বদলান। ফাইলের উদাহরণে sample.txt আগে তৈরি করুন।",
        commands: reference
          ? "# Reference fragment: integrate into the project described above."
          : `dotnet new ${web ? "web" : "console"} -n Study\n# Replace Study/Program.cs\ndotnet run --project Study`,
      },
      ...(r.sql
        ? [
            {
              title: "SQL Server side · SQL Server-এ একই ধারণা",
              kind: "T-SQL reference",
              language: "sql-reference",
              code: r.sql,
            },
          ]
        : []),
      ...(r.bash
        ? [
            {
              title: "Commands to try · চালিয়ে দেখার command",
              kind: "Command workflow",
              language: "bash",
              code: r.bash,
            },
          ]
        : []),
      {
        title: "Practice and verification · অনুশীলন",
        kind: "Practice checklist",
        language: "markdown",
        code: `1. Explain ${r.topic} in your own words.\n2. Predict the example output before running.\n3. Run with a normal input and a boundary input.\n4. ${r.exercise || "Change one value and explain why the output changes."}`,
      },
    ],
  };
}
