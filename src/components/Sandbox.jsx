import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Copy, Check, Square, ExternalLink } from "lucide-react";
import "./sandbox.css";

// Starter programs for each language. Learners can edit and run them.
const starters = {
  javascript: [
    ["Hello + arrays", `const scores = [72, 95, 88, 61];
const passed = scores.filter((s) => s >= 70);
const average = scores.reduce((a, b) => a + b, 0) / scores.length;
console.log("Passed:", passed);
console.log("Average:", average.toFixed(1));`],
    ["Two Sum with a hash map", `// O(n): remember what we have seen
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}
console.log(twoSum([2, 7, 11, 15], 9));   // [0, 1]
console.log(twoSum([3, 2, 4], 6));        // [1, 2]`],
    ["Retry with exponential backoff", `// Production habit: retry temporary failures, not forever
let calls = 0;
async function flakyApi() {
  calls++;
  if (calls < 3) throw new Error("503 Service Unavailable");
  return { ok: true, calls };
}
async function retry(fn, attempts = 4, baseMs = 50) {
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) {
      const wait = baseMs * 2 ** i;
      console.log(\`attempt \${i + 1} failed (\${e.message}), waiting \${wait} ms\`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw new Error("gave up");
}
console.log(await retry(flakyApi));`],
    ["Token bucket rate limiter", `class TokenBucket {
  constructor(capacity, refillPerSec) {
    this.capacity = capacity; this.tokens = capacity;
    this.refill = refillPerSec; this.last = Date.now();
  }
  take() {
    const now = Date.now();
    this.tokens = Math.min(this.capacity, this.tokens + ((now - this.last) / 1000) * this.refill);
    this.last = now;
    if (this.tokens < 1) return false;
    this.tokens -= 1; return true;
  }
}
const bucket = new TokenBucket(3, 1);
for (let i = 1; i <= 5; i++) console.log("request", i, bucket.take() ? "200 OK" : "429 Too Many Requests");`],
  ],
  python: [
    ["Hello + lists", `scores = [72, 95, 88, 61]
passed = [s for s in scores if s >= 70]
print("Passed:", passed)
print("Average:", round(sum(scores) / len(scores), 1))`],
    ["Binary search", `def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    steps = 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid, steps
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, steps

data = list(range(0, 1_000_000, 3))
print(binary_search(data, 299_997))   # found in ~19 steps, not 100,000`],
    ["Tiny RAG: retrieve by similarity", `# Retrieval-Augmented Generation, step 1: find the most relevant text.
# Real systems use model embeddings; here we use word counts so it runs offline.
import math
from collections import Counter

docs = {
    "refund": "refunds are processed within 7 days after the item is returned",
    "shipping": "shipping inside Dhaka takes 2 days and outside takes 4 days",
    "password": "reset your password from the login page using your email",
}

def vec(text):
    return Counter(text.lower().split())

def cosine(a, b):
    dot = sum(a[w] * b[w] for w in a)
    na = math.sqrt(sum(v * v for v in a.values()))
    nb = math.sqrt(sum(v * v for v in b.values()))
    return dot / (na * nb) if na and nb else 0.0

question = "how many days does shipping take outside dhaka"
q = vec(question)
ranked = sorted(docs.items(), key=lambda kv: cosine(q, vec(kv[1])), reverse=True)
for name, text in ranked:
    print(f"{cosine(q, vec(text)):.2f}  {name}")
print("\\nContext sent to the model:", ranked[0][1])`],
    ["Evaluate an AI answer", `# 2028 skill: test AI output like any other code.
cases = [
    {"q": "Capital of Bangladesh?", "answer": "Dhaka is the capital.", "must": ["dhaka"]},
    {"q": "2 + 2?", "answer": "It is five.", "must": ["4"]},
    {"q": "Refund window?", "answer": "Refunds take 7 days.", "must": ["7"]},
]
passed = 0
for c in cases:
    ok = all(m in c["answer"].lower() for m in c["must"])
    passed += ok
    print(("PASS" if ok else "FAIL"), "-", c["q"])
print(f"score: {passed}/{len(cases)}")`],
  ],
  sql: [
    ["Join employees to departments", `SELECT e.Name, d.Name AS Department, e.Salary
FROM Employees e
LEFT JOIN Departments d ON d.Id = e.DepartmentId
ORDER BY e.Salary DESC;`],
    ["Group and filter groups", `SELECT d.Name, COUNT(*) AS People, AVG(e.Salary) AS AvgSalary
FROM Employees e
JOIN Departments d ON d.Id = e.DepartmentId
GROUP BY d.Name
HAVING COUNT(*) >= 1
ORDER BY AvgSalary DESC;`],
    ["Rank with a window function", `SELECT Name, Salary,
       RANK() OVER (ORDER BY Salary DESC) AS SalaryRank
FROM Employees;`],
    ["Create, insert, update", `CREATE TABLE Tasks(Id INTEGER PRIMARY KEY, Title TEXT NOT NULL, Done INTEGER DEFAULT 0);
INSERT INTO Tasks(Title) VALUES ('Learn SQL'), ('Build an API'), ('Deploy');
UPDATE Tasks SET Done = 1 WHERE Title = 'Learn SQL';
SELECT * FROM Tasks;`],
  ],
  csharp: [
    ["Records + LINQ", `record Student(string Name, int Score);

var students = new List<Student> { new("Asha", 91), new("Rafi", 67), new("Mina", 78) };
var passed = students.Where(s => s.Score >= 70).OrderByDescending(s => s.Score);
foreach (var s in passed) Console.WriteLine($"{s.Name}: {s.Score}");
Console.WriteLine($"Average: {students.Average(s => s.Score):0.0}");`],
    ["Async + cancellation", `using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(300));
try
{
    for (int i = 1; i <= 5; i++)
    {
        await Task.Delay(100, cts.Token);
        Console.WriteLine($"step {i}");
    }
}
catch (OperationCanceledException)
{
    Console.WriteLine("Stopped: took too long");
}`],
    ["Pattern matching", `object[] inputs = { 42, "hello", 3.5, null!, new[] { 1, 2, 3 } };
foreach (var x in inputs)
{
    string text = x switch
    {
        int n when n > 40 => $"big int {n}",
        int n => $"int {n}",
        string s => $"string of length {s.Length}",
        int[] arr => $"array with {arr.Length} items",
        null => "null",
        _ => $"something else: {x}"
    };
    Console.WriteLine(text);
}`],
  ],
};

const languages = [
  ["javascript", "JavaScript"],
  ["python", "Python"],
  ["sql", "SQL"],
  ["csharp", "C#"],
];

// JavaScript runs inside a throwaway Web Worker so a bad loop cannot freeze the page.
const jsWorkerSource = `
const fmt = (v) => { try { return typeof v === "string" ? v : JSON.stringify(v); } catch { return String(v); } };
const out = (kind) => (...args) => postMessage({ type: "out", kind, text: args.map(fmt).join(" ") });
console.log = out("log"); console.info = out("log"); console.warn = out("warn"); console.error = out("error");
console.table = (rows) => postMessage({ type: "out", kind: "log", text: JSON.stringify(rows, null, 2) });
onmessage = async (e) => {
  try {
    const fn = new Function("return (async () => {\\n" + e.data + "\\n})()");
    const result = await fn();
    if (result !== undefined) postMessage({ type: "out", kind: "log", text: "← " + fmt(result) });
    postMessage({ type: "done" });
  } catch (err) {
    postMessage({ type: "out", kind: "error", text: (err && err.stack) ? String(err.stack).split("\\n")[0] : String(err) });
    postMessage({ type: "done" });
  }
};`;

// Python runs with Pyodide (CPython compiled to WebAssembly), loaded on first use.
const pyWorkerSource = `
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
let ready = loadPyodide().then((py) => { postMessage({ type: "ready" }); return py; });
onmessage = async (e) => {
  const py = await ready;
  py.setStdout({ batched: (t) => postMessage({ type: "out", kind: "log", text: t }) });
  py.setStderr({ batched: (t) => postMessage({ type: "out", kind: "error", text: t }) });
  try {
    const scope = py.globals.get("dict")();
    await py.loadPackagesFromImports(e.data);
    const result = await py.runPythonAsync(e.data, { globals: scope });
    if (result !== undefined && result !== null) postMessage({ type: "out", kind: "log", text: "← " + String(result) });
  } catch (err) {
    const lines = String(err.message || err).trim().split("\\n");
    postMessage({ type: "out", kind: "error", text: lines.slice(-3).join("\\n") });
  }
  postMessage({ type: "done" });
};`;

function blobWorker(source) {
  const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  const w = new Worker(url);
  URL.revokeObjectURL(url);
  return w;
}

function load(lang) {
  try {
    const saved = localStorage.getItem("sandbox-code-" + lang);
    if (saved) return saved;
  } catch {}
  return starters[lang][0][1];
}

export default function Sandbox({ lang: uiLang }) {
  const en = uiLang !== "বাংলা",
    bn = uiLang !== "English";
  const [language, setLanguage] = useState(() => {
    try {
      const h = JSON.parse(sessionStorage.getItem("sandbox-handoff") || "null");
      if (h && starters[h.language]) return h.language;
    } catch {}
    return "javascript";
  });
  const [code, setCode] = useState(() => {
    try {
      const h = JSON.parse(sessionStorage.getItem("sandbox-handoff") || "null");
      if (h && starters[h.language]) {
        sessionStorage.removeItem("sandbox-handoff");
        return h.code;
      }
    } catch {}
    return load("javascript");
  });
  const [output, setOutput] = useState([]);
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const workers = useRef({});
  const timer = useRef(null);
  const started = useRef(0);

  useEffect(() => () => Object.values(workers.current).forEach((w) => w?.terminate()), []);
  useEffect(() => {
    try {
      localStorage.setItem("sandbox-code-" + language, code);
    } catch {}
  }, [code, language]);

  const switchLanguage = (l) => {
    if (running) stop();
    setLanguage(l);
    setCode(load(l));
    setOutput([]);
    setTables([]);
    setStatus("");
  };

  const finish = (note) => {
    clearTimeout(timer.current);
    setRunning(false);
    setStatus(note || `Finished in ${Math.round(performance.now() - started.current)} ms`);
  };

  const stop = () => {
    const w = workers.current[language];
    w?.terminate();
    workers.current[language] = null;
    finish("Stopped · থামানো হয়েছে");
  };

  const getWorker = (l) => {
    if (workers.current[l]) return workers.current[l];
    let w;
    if (l === "javascript") w = blobWorker(jsWorkerSource);
    else if (l === "python") w = blobWorker(pyWorkerSource);
    else w = new Worker(new URL("./sql.worker.js", import.meta.url), { type: "module" });
    w.onerror = (e) => {
      setOutput((o) => [...o, { kind: "error", text: e.message || "Worker failed to start (check your connection for Python)." }]);
      w.terminate();
      workers.current[l] = null;
      finish("Error");
    };
    workers.current[l] = w;
    return w;
  };

  const run = () => {
    if (running || language === "csharp") return;
    setOutput([]);
    setTables([]);
    setRunning(true);
    started.current = performance.now();
    const w = getWorker(language);
    if (language === "sql") {
      armTimeout(10000);
      w.postMessage({ id: Date.now(), reset: true });
      w.onmessage = ({ data }) => {
        if (data.reset) {
          w.onmessage = ({ data: d }) => {
            if (d.error) setOutput([{ kind: "error", text: d.error }]);
            else {
              setTables(d.results || []);
              if (!d.results?.length) setOutput([{ kind: "log", text: `OK · ${d.modified} row(s) changed` }]);
            }
            finish();
          };
          w.postMessage({ id: Date.now(), query: code });
        }
      };
    } else {
      if (language === "python" && !w.pyReady) setStatus("Loading Python (first time ~10 MB)… · Python লোড হচ্ছে…");
      w.onmessage = ({ data }) => {
        if (data.type === "ready") {
          w.pyReady = true;
          setStatus("Running… · চলছে…");
          started.current = performance.now();
          armTimeout(15000);
        } else if (data.type === "out") setOutput((o) => [...o, { kind: data.kind, text: data.text }]);
        else if (data.type === "done") finish();
      };
      w.postMessage(code);
      if (language === "javascript" || w.pyReady) armTimeout(language === "python" ? 15000 : 5000);
    }
  };

  const armTimeout = (ms) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const w = workers.current[language];
      w?.terminate();
      workers.current[language] = null;
      setOutput((o) => [...o, { kind: "error", text: `Time limit ${ms / 1000}s reached — infinite loop? · সময় শেষ, অসীম loop?` }]);
      finish("Timed out");
    }, ms);
  };

  const onKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const t = e.target,
        s = t.selectionStart;
      const next = code.slice(0, s) + "  " + code.slice(t.selectionEnd);
      setCode(next);
      requestAnimationFrame(() => (t.selectionStart = t.selectionEnd = s + 2));
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <section className="sandbox">
      <div className="path-heading">
        <div>
          <h2>
            Code sandbox · কোড স্যান্ডবক্স <span className="pill">RUNS IN YOUR BROWSER</span>
          </h2>
          <p>
            {en && "Write code, press Run (Ctrl/⌘ + Enter), see the result. Nothing is sent to a server. "}
            {bn && "কোড লিখুন, Run চাপুন (Ctrl/⌘ + Enter), ফল দেখুন। কোনো server-এ কিছু পাঠানো হয় না।"}
          </p>
        </div>
      </div>
      <div className="sandbox-bar" role="tablist" aria-label="Language">
        {languages.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={language === id}
            className={language === id ? "selected" : ""}
            onClick={() => switchLanguage(id)}
          >
            {label}
          </button>
        ))}
        <select
          aria-label="Starter example"
          value=""
          onChange={(e) => {
            const s = starters[language][+e.target.value];
            if (s) {
              setCode(s[1]);
              setOutput([]);
              setTables([]);
            }
          }}
        >
          <option value="">Load an example · উদাহরণ…</option>
          {starters[language].map(([name], i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="sandbox-grid">
        <div className="sandbox-editor">
          <textarea
            aria-label="Code editor"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKey}
          />
          <div className="sandbox-actions">
            {language === "csharp" ? (
              <a className="primary" href="https://dotnetfiddle.net/" target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> Open .NET Fiddle
              </a>
            ) : running ? (
              <button className="primary" onClick={stop}>
                <Square size={15} /> Stop
              </button>
            ) : (
              <button className="primary" onClick={run}>
                <Play size={15} /> Run
              </button>
            )}
            <button onClick={copy} aria-label="Copy code">
              {copied ? <Check size={15} /> : <Copy size={15} />} Copy
            </button>
            <button
              onClick={() => {
                setCode(starters[language][0][1]);
                setOutput([]);
                setTables([]);
              }}
              aria-label="Reset code"
            >
              <RotateCcw size={15} /> Reset
            </button>
            <span className="sandbox-status" role="status">
              {status}
            </span>
          </div>
        </div>
        <div className="sandbox-output" aria-live="polite">
          <strong>Output · ফলাফল</strong>
          {language === "csharp" ? (
            <div className="sandbox-note">
              {en && (
                <p>
                  C# needs the .NET runtime, which is too large to load in a phone browser. Copy the code, then either
                  paste it into .NET Fiddle (online, free) or run it on your computer:
                </p>
              )}
              {bn && (
                <p>
                  C# চালাতে .NET runtime লাগে, যা ফোনের browser-এ লোড করা ভারী। Code copy করে .NET Fiddle-এ (অনলাইন,
                  ফ্রি) paste করুন, অথবা নিজের কম্পিউটারে চালান:
                </p>
              )}
              <pre>{"dotnet new console -n Practice\n# replace Practice/Program.cs with your code\ndotnet run --project Practice"}</pre>
            </div>
          ) : (
            <>
              {!output.length && !tables.length && (
                <p className="sandbox-empty">Press Run to see output here. · Run চাপলে ফল এখানে দেখাবে।</p>
              )}
              {output.map((o, i) => (
                <pre key={i} className={"sandbox-line " + o.kind}>
                  {o.text}
                </pre>
              ))}
              {tables.map((t, i) => (
                <div className="sandbox-table" key={i}>
                  <table>
                    <thead>
                      <tr>
                        {t.columns.map((c) => (
                          <th key={c}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.values.map((row, r) => (
                        <tr key={r}>
                          {row.map((v, c) => (
                            <td key={c}>{v === null ? "NULL" : String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <small>{t.total} row(s)</small>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="sandbox-tips">
        <p>
          {en && "Tip: change one thing at a time, predict the output first, then run. That is how engineers learn fast. "}
          {bn && "টিপস: একবারে একটি জিনিস বদলান, আগে ফল অনুমান করুন, তারপর চালান। এভাবেই দ্রুত শেখা যায়।"}
        </p>
        <p>
          {en && "SQL uses the course database: Departments(Id, Name) and Employees(Id, Name, DepartmentId, Salary, ManagerId). It resets on every run. "}
          {bn && "SQL-এ course-এর database: Departments ও Employees টেবিল। প্রতিবার চালালে নতুন করে শুরু হয়।"}
        </p>
      </div>
    </section>
  );
}

export { sendToSandbox } from "./sandboxBridge";
