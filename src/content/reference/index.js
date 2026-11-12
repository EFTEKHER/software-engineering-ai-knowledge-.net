import { orderTypes } from "./format";
import manifest from "./manifest.json";
import { incidents } from "./incidents";
const loaders = {
  commands: () => import("./commands"),
  sql: () => import("./sql"),
  algorithms: () => import("./algorithms"),
  design: () => import("./design"),
  backend: () => import("./backend"),
  security: () => import("./security"),
  systems: () => import("./systems"),
  foundations: () => import("./foundations"),
  cloud: () => import("./cloud"),
  operations: () => import("./operations"),
  ai: () => import("./ai"),
};
const cached = new Map();
const incidentKeys = [
  "Logging and Monitoring",
  "Database Indexing",
  "Caching with Redis",
  "CDN",
  "Scalability",
  "Load Balancing",
  "Rate Limiting",
  "Replication",
  "Database Sharding",
  "Pagination",
  "Background Jobs",
  "Distributed Systems",
  "Transactions and ACID",
  "Circuit Breaker",
  "Replication",
  "ORM and Migrations",
  "Database Indexing",
  "CDN",
  "Replication",
  "Logging and Monitoring",
];
function groupFor(key, preferred) {
  if (preferred && manifest[preferred]?.includes(key)) return preferred;
  return Object.keys(manifest).find(
    (g) => !["commands", "sql"].includes(g) && manifest[g].includes(key),
  );
}
async function retrieve(group, key) {
  if (!group) throw new Error("No reference chapter: " + key);
  if (!cached.has(group))
    cached.set(
      group,
      loaders[group]().catch((e) => {
        cached.delete(group);
        throw e;
      }),
    );
  const data = (await cached.get(group)).default;
  const chapter = data[key];
  if (!chapter) throw new Error("Missing chapter " + group + ":" + key);
  return { ...chapter, group, canonicalKey: key };
}
export async function loadChapter(lesson) {
  const m = lesson.module.id,
    t = lesson.index;
  let chapter;
  if ([0, 1, 11, 12].includes(m))
    chapter = await retrieve("commands", `${m}-${t}`);
  else if (m === 2) chapter = await retrieve("sql", t);
  else if (m === 10) {
    const key = incidentKeys[t];
    chapter = await retrieve(groupFor(key), key);
    const [title, en, bn, code] = incidents[t];
    chapter = {
      ...chapter,
      en: en + " " + chapter.en,
      bn: bn + " " + chapter.bn,
      incidentTitle: title,
      examples: [
        {
          title: "Incident evidence workflow · সমস্যা খোঁজার ধাপ",
          language:
            t === 1 || t === 7 || t === 8 || t === 9 || t === 12 || t === 16
              ? "sql-reference"
              : "bash",
          kind: "Diagnostic reference",
          code,
        },
        ...chapter.examples,
      ],
    };
  } else if (m === 16) {
    const { default: ai2028 } = await import("./ai2028");
    const found = ai2028[lesson.topic];
    if (!found) throw new Error("Missing chapter ai2028:" + lesson.topic);
    chapter = { ...found, group: "ai2028", canonicalKey: lesson.topic };
  } else if (m === 7 && lesson.aspnet) {
    const { buildAspnetChapter } = await import("./aspnet");
    chapter = buildAspnetChapter(lesson);
  } else {
    const key = lesson.related || lesson.topic;
    const preferred =
      m === 13
        ? "cloud"
        : m === 14
          ? "operations"
          : m === 6
            ? "security"
            : undefined;
    chapter = await retrieve(groupFor(key, preferred), key);
  }
  if (m === 7 && !lesson.aspnet) {
    const { enhanceBackendEngineering } = await import("./backendEngineering");
    const { enrichExisting } = await import("./aspnet");
    chapter = enrichExisting(lesson, enhanceBackendEngineering(lesson, chapter));
  }
  if (m === 5) {
    const { enhanceBackendDevelopment } = await import("./backendDevelopment");
    chapter = enhanceBackendDevelopment(lesson, chapter);
  }
  if (m !== 5 && m !== 7) {
    const { enrichModule } = await import("./enrich/index");
    chapter = await enrichModule(lesson, chapter);
  }
  chapter = {
    ...chapter,
    examples: chapter.examples.map((e) => ({
      ...e,
      kind:
        e.kind ||
        (e.language === "sql"
          ? "Executable SQLite example"
          : e.language === "bash"
            ? "Command workflow"
            : "Reference example"),
      code: e.language === "csharp" ? orderTypes(e.code) : e.code,
    })),
  };
  const sections = [
    {
      title: "Mechanism and mental model · ভেতরে কীভাবে কাজ করে",
      en: chapter.en,
      bn: chapter.bn,
    },
    ...(chapter.extraSections || []),
    {
      title: "Design decisions and edge cases · সিদ্ধান্ত ও সীমা",
      en: chapter.decisionEn,
      bn: chapter.decisionBn,
    },
  ];
  const plain =
    sections.map((s) => s.en + " " + s.bn).join(" ") +
    chapter.examples.map((e) => e.code).join(" ");
  return {
    ...chapter,
    sections,
    wordCount: plain.trim().split(/\s+/).length,
    codeLines: chapter.examples.reduce(
      (n, e) => n + e.code.split("\n").length,
      0,
    ),
    readingMinutes: Math.max(5, Math.ceil(plain.split(/\s+/).length / 120) + 3),
  };
}
