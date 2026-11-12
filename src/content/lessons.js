import modules from "../curriculum.json";
import { cli } from "./cli";
import { sql } from "./sql";
import { concepts } from "./concepts";
import { aspnetConcepts } from "./aspnetConcepts";
import { contexts } from "./context";
import incidents from "./incidents.json";
import { banglaWarnings, cliWarnings, sqlWarnings } from "./bangla";
const fixes = [
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
const outputs = {
  0: [
    "Initialized empty Git repository on branch main.",
    "Cloned repository into samples/ (simulated, no network).",
    " M Program.cs\n?? README.md",
    "Program.cs staged at its current contents.",
    "[main a1b2c3d] Add greeting endpoint\n1 file changed",
    "a1b2c3d Add greeting endpoint\n0a0b0c0 Initial commit",
    '+ Console.WriteLine("Hello");',
    "main -> origin/main\nTracking configured (simulation).",
    "Already up to date.",
    "Updated origin/main; local main is unchanged.",
    "Created feature/orders; still on main.",
    "Switched to a new branch feature/orders.",
    "Switched to a new branch fix/validation.",
    "Merge completed in the demonstration graph.",
    "Annotated tag v1.0.0 created.",
    "Commits replayed onto main; new commit IDs created.",
    "Saved working tree and index to stash.",
    "HEAD moved back; index and working tree retained.",
    "New inverse commit created; previous history kept.",
    "Selected commit applied as a new local commit.",
  ],
  1: [
    "drwxr-xr-x projects\n-rw-r--r-- README.md",
    "/learning",
    "/learning",
    "Created projects/api/src/",
    "Disposable /tmp/mastery-demo removed in simulation only.",
    "Copied src/ into backup/",
    "draft.txt renamed to notes.txt",
    "Welcome to .NET Mastery.",
    "src/Program.cs:3: // TODO validate input",
    "./src/Program.cs",
    "Permissions: owner rw, group r, others none.",
    "Owner app; group app (simulated).",
    "release/Program.dll\nrelease/appsettings.json",
    "USER PID %CPU COMMAND\napp 1234 0.1 dotnet App.dll",
    "Simulated CPU 12%, memory 180 MB",
    "SIGKILL sent to sample process 1234 (simulation only).",
    "Filesystem Size Used Avail\ndemo 20G 5G 15G",
    "24M ./logs",
    "SSH demo only: no remote connection was made.",
    "HTTP/1.1 200 OK\nContent-Type: text/html",
  ],
  11: [
    "Started api from app:1.0; host 8080 -> container 8080",
    "ID NAME STATUS\ndemo1 api Running",
    "REPOSITORY TAG\napp 1.0",
    "Downloaded image layers (simulation only)",
    "Built image app:1.0 from context",
    "Entered simulated container shell",
    "info: Application started",
    "api stopped gracefully",
    "api started",
    "api removed (simulated, no data changed)",
    "Local tag app:1.0 removed",
    '{"Name":"api","State":{"Running":true}}',
    "bridge\nhost\nnone",
    "local app-data",
    "Tagged app:1.0 as registry.example.com/app:1.0",
    "Pushed image (simulation only, no registry connection)",
    "Registry login not performed. Never enter real credentials in a demo.",
    "Services started: api, database",
    "Compose services stopped; named volumes retained",
    "Unused demo objects removed. No real Docker resources touched.",
  ],
  12: [
    "NAME READY STATUS\napi-demo 1/1 Running",
    "NAME TYPE PORT\napi ClusterIP 80/TCP",
    "NAME DESIRED AVAILABLE\napi 2 2",
    "NAME STATUS\nworker-1 Ready",
    "Name: api-abc\nConditions: Ready\nEvents: Scheduled, Started",
    "info: Listening on port 8080",
    "Simulated pod shell opened",
    "deployment.apps/api configured",
    "deployment.apps/api deleted in simulation",
    "namespace/learning created",
    "deployment.apps/api scaled to 3",
    "deployment/api successfully rolled out",
    "deployment/api rolled back",
    "Forwarding 127.0.0.1:8080 -> service port 80",
    "NAME CPU MEMORY\napi-demo 12m 180Mi",
    "Deployment opened for illustrative editing only",
    "pod/api-abc labeled tier=backend",
    "report.txt copied to simulated /tmp/report.txt",
    "current-context: learning-cluster\nnamespace: learning",
    "Kubernetes control plane: https://cluster.example.invalid",
  ],
};
const gitFlows = [
  ["Project folder", "Initialize .git", "Empty history", "First commit next"],
  ["Remote repository", "Copy history", "Working tree", "Origin configured"],
  ["Working tree", "Index", "HEAD snapshot", "Status comparison"],
  ["Edited file", "Select contents", "Index snapshot", "Ready to commit"],
  ["Staged contents", "Create snapshot", "Link parent", "Advance branch"],
  ["HEAD", "Read parents", "Commit graph", "History display"],
  ["Working tree", "Index", "HEAD", "Changed lines"],
  ["Local branch", "Send objects", "Remote validation", "Remote branch"],
  ["Remote updates", "Fetch objects", "Integrate branch", "Working tree"],
  [
    "Remote refs",
    "Download objects",
    "Tracking refs",
    "Local branch unchanged",
  ],
  ["Current commit", "New reference", "Branch name", "HEAD unchanged"],
  ["Branch name", "Move HEAD", "Update files", "New workspace"],
  ["Revision", "Move HEAD", "Update files", "Selected version"],
  ["Two histories", "Common ancestor", "Resolve changes", "Merge result"],
  ["Selected commit", "Release name", "Tag metadata", "Stable reference"],
  ["Old commits", "New base", "Replay changes", "New commit IDs"],
  ["Working edits", "Stash snapshot", "Clean workspace", "Apply later"],
  ["Previous commit", "Move HEAD", "Keep or reset index", "Review worktree"],
  ["Earlier change", "Compute inverse", "New commit", "History preserved"],
  ["Selected commit", "Extract patch", "Apply on branch", "New commit"],
];
function annotation(code) {
  return code
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      let [text, explain] = line.split(" ~~ ");
      let [en, bn] = (explain || "").split(" / ");
      return {
        text,
        en: en || "Read this part of the example.",
        bn: bn || "উদাহরণের এই অংশটি দেখুন।",
      };
    });
}
export function getLesson(m, t) {
  const topic = m.topics[t];
  let raw,
    lang = "csharp",
    output = "";
  if (cli[m.id]) {
    const r = cli[m.id][t];
    raw = {
      en: r[0],
      bn: r[1],
      code: `${r[2]} ~~ ${r[0]} / ${r[1]}`,
      caution: r[3],
      deep: r[3],
      flow:
        m.id === 0
          ? gitFlows[t]
          : m.id === 1
            ? [
                "Shell input",
                "Path and arguments",
                "Permission check",
                "Filesystem or process",
              ]
            : m.id === 11
              ? [
                  "CLI command",
                  "Docker engine",
                  "Image or container",
                  "Updated local state",
                ]
              : [
                  "Context and namespace",
                  "API server",
                  "Controller state",
                  "Pod or resource result",
                ],
    };
    lang = "bash";
    output = outputs[m.id][t];
  } else if (m.id === 2) {
    const r = sql[t];
    raw = {
      en: r[0],
      bn: r[1],
      code: r[2]
        .split("\n")
        .map(
          (x, i) =>
            `${x} ~~ ${r[3].split("\n")[i] || r[3]} / ${["কলাম বা হিসাব বাছুন।", "কোন তথ্য লাগবে ও কী শর্ত, দেখুন।", "দল, সংযোগ বা ক্রমের নিয়ম প্রয়োগ করুন।", "ফলের শেষ ধাপটি দেখুন।"][i % 4]}`,
        )
        .join("\n"),
      caution: r[4],
      deep: r[4],
      flow: [
        "Source rows",
        "Filter or join",
        "Calculate or order",
        "Result rows",
      ],
    };
    lang = "sql";
  } else if (m.id === 10) {
    const incident = incidents[t];
    raw = {
      ...concepts[fixes[t]],
      en: `${incident.problem}: ${incident.solution}. ${incident.implementation.replaceAll("`", "")}`,
      bn: incident.bn,
      incident,
    };
  } else raw = (m.id === 7 && aspnetConcepts[topic]) || concepts[topic];
  if (!raw) throw new Error("Missing lesson " + m.id + ":" + t + " " + topic);
  if (m.id === 13 && raw.code.trim().startsWith("aws ")) lang = "bash";
  if (
    [
      "Dependency Scanning",
      "Linux and Bash",
      "Networking Basics",
      "CI/CD Pipelines",
      "Ansible",
      "Helm",
      "Terraform",
      "Git and GitHub",
      "Docker & Kubernetes",
      "AWS Cloud",
      "EF Core Migrations",
    ].includes(topic)
  )
    lang = "bash";
  if (["Docker Compose", "Kubernetes", "GitHub Actions"].includes(topic))
    lang = "yaml";
  if (topic === "Docker") lang = "dockerfile";
  if (["Vector Databases", "Database Design & Optimization"].includes(topic))
    lang = "sql-reference";
  if (topic === "Nginx Reverse Proxy") lang = "nginx";
  if (topic === "Grafana") lang = "promql";
  const lines = annotation(raw.code);
  const warningBn =
    cliWarnings[m.id]?.[t] ||
    (m.id === 2
      ? sqlWarnings[t]
      : banglaWarnings[topic] ||
        banglaWarnings[raw.related] ||
        banglaWarnings[fixes[t]] ||
        raw.bn);
  return {
    ...raw,
    warningBn,
    id: `${m.id}-${t}`,
    module: m,
    topic,
    index: t,
    context: contexts[m.id],
    lang,
    lines,
    code: lines.map((x) => x.text).join("\n"),
    output,
    docs: docs(m.id, topic),
  };
}
function docs(id, topic) {
  if (id === 0) return ["Git documentation", "https://git-scm.com/docs"];
  if (id === 1)
    return [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html",
    ];
  if (id === 2)
    return ["SQLite language reference", "https://www.sqlite.org/lang.html"];
  if (id === 11)
    return [
      "Docker documentation",
      "https://docs.docker.com/reference/cli/docker/",
    ];
  if (id === 12)
    return [
      "Kubernetes reference",
      "https://kubernetes.io/docs/reference/kubectl/",
    ];
  if (id === 13) return ["AWS documentation", "https://docs.aws.amazon.com/"];
  if (id === 6)
    return ["OWASP Cheat Sheet Series", "https://cheatsheetseries.owasp.org/"];
  if (id === 15)
    return [
      "Microsoft .NET AI documentation",
      "https://learn.microsoft.com/dotnet/ai/",
    ];
  if (id === 7 && aspnetConcepts[topic])
    return [
      "Microsoft Learn: ASP.NET Core",
      "https://learn.microsoft.com/aspnet/core/",
    ];
  return [
    "Microsoft Learn: C# and .NET",
    "https://learn.microsoft.com/dotnet/",
  ];
}
export const allLessons = modules.flatMap((m) =>
  m.topics.map((_, t) => getLesson(m, t)),
);
