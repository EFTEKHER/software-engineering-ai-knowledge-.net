import React, { useEffect, useRef, useState } from "react";
import {
  Code2,
  Copy,
  Download,
  Check,
  RotateCcw,
  Play,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Database,
  Edit3,
  BookOpen,
} from "lucide-react";
function colorize(text) {
  return text
    .split(
      /("(?:[^"\\]|\\.)*"|'[^']*'|\b(?:int|string|var|long|bool|double|float|decimal|public|private|class|record|interface|return|if|else|for|foreach|while|new|await|async|using|void|static|enum|true|false|null|SELECT|FROM|WHERE|ORDER|BY|JOIN|LEFT|INNER|GROUP|HAVING|AS|LIMIT|CASE|WHEN|THEN|END)\b|\b\d+\b)/g,
    )
    .map((x, i) => (
      <span
        key={i}
        className={
          /^["']/.test(x)
            ? "syntax-string"
            : /^\d/.test(x)
              ? "syntax-number"
              : /^(int|string|var|long|bool|double|float|decimal|public|private|class|record|interface|return|if|else|for|foreach|while|new|await|async|using|void|static|enum|true|false|null|SELECT|FROM|WHERE|ORDER|BY|JOIN|LEFT|INNER|GROUP|HAVING|AS|LIMIT|CASE|WHEN|THEN|END)$/.test(
                    x,
                  )
                ? "syntax-keyword"
                : ""
        }
      >
        {x}
      </span>
    ));
}
export default function CodeLab({ lesson, lang }) {
  const [code, setCode] = useState(lesson.code),
    [line, setLine] = useState(0),
    [edit, setEdit] = useState(false),
    [copied, setCopied] = useState(false),
    [result, setResult] = useState(null),
    [running, setRunning] = useState(false),
    [error, setError] = useState("");
  const worker = useRef(null),
    timer = useRef(null),
    request = useRef(0);
  const isSQL = lesson.module.id === 2;
  const en = lang !== "বাংলা",
    bn = lang !== "English";
  useEffect(() => {
    setCode(lesson.code);
    setLine(0);
    setEdit(false);
    setResult(null);
    setError("");
  }, [lesson.id]);
  useEffect(
    () => () => {
      worker.current?.terminate();
      clearTimeout(timer.current);
    },
    [],
  );
  const getWorker = () => {
    if (!worker.current) {
      worker.current = new Worker(new URL("./sql.worker.js", import.meta.url), {
        type: "module",
      });
      worker.current.onmessage = ({ data }) => {
        if (data.id !== request.current) return;
        clearTimeout(timer.current);
        setRunning(false);
        setError(data.error || "");
        setResult(data);
      };
      worker.current.onerror = () => {
        clearTimeout(timer.current);
        setRunning(false);
        setError(
          "SQLite could not start. Check the WASM download and try again.",
        );
        worker.current?.terminate();
        worker.current = null;
      };
    }
    return worker.current;
  };
  const runSQL = (reset = false) => {
    setRunning(true);
    setError("");
    let id = ++request.current;
    try {
      getWorker().postMessage({ id, query: code, reset });
      timer.current = setTimeout(() => {
        worker.current?.terminate();
        worker.current = null;
        setRunning(false);
        setError(
          "Query stopped after 5 seconds. Try a smaller query; the sample database will reset.",
        );
      }, 5000);
    } catch (e) {
      setRunning(false);
      setError(e.message);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(
        "Clipboard permission was denied. Use Edit and select the code to copy.",
      );
    }
  };
  const download = () => {
    const extension =
      {
        csharp: "cs",
        bash: "sh",
        yaml: "yaml",
        sql: "sql",
        "sql-reference": "sql",
        dockerfile: "Dockerfile",
        nginx: "conf",
        promql: "txt",
      }[lesson.lang] || "txt";
    let u = URL.createObjectURL(
      new Blob([code], { type: "text/plain;charset=utf-8" }),
    );
    let a = document.createElement("a");
    a.href = u;
    a.download = lesson.topic.replace(/[^a-z0-9]/gi, "-") + "." + extension;
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  };
  let selected = lesson.lines[line];
  const changed = code !== lesson.code;
  return (
    <section className="code-lab" aria-label="Code and line explanations">
      <div className="panel-title">
        <span>
          <Code2 size={18} />
          {bn ? "কোড ধরে ধরে বুঝুন · " : ""}Code walkthrough
        </span>
        <span className="language-tag">{lesson.lang.toUpperCase()}</span>
      </div>
      <div className="code-toolbar">
        <span>
          {lesson.topic}
          {lesson.lang === "csharp" ? ".cs" : ""}
        </span>
        <div>
          <button onClick={() => setEdit((x) => !x)}>
            <Edit3 size={13} />
            {edit ? "Read" : "Edit"}
          </button>
          <button onClick={copy} aria-label="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button onClick={download} aria-label="Download code">
            <Download size={14} />
          </button>
          <button
            onClick={() => {
              setCode(lesson.code);
              setLine(0);
              setResult(null);
              setError("");
            }}
            aria-label="Reset code"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <div className="annotated-code">
        {edit ? (
          <textarea
            className="code-editor"
            aria-label="Edit lesson code"
            spellCheck="false"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const start = e.target.selectionStart,
                  end = e.target.selectionEnd;
                setCode(code.slice(0, start) + "  " + code.slice(end));
                requestAnimationFrame(() => {
                  e.target.selectionStart = e.target.selectionEnd = start + 2;
                });
              }
            }}
          />
        ) : (
          <div className="code-list">
            {code.split("\n").map((text, i) => (
              <button
                key={i}
                className={
                  "code-line " + (line === i && !changed ? "selected-line" : "")
                }
                onClick={() => !changed && setLine(i)}
                aria-label={`Explain line ${i + 1}`}
              >
                <span className="line-number">{i + 1}</span>
                <code>{colorize(text)}</code>
                {line === i && !changed && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        )}
        <div className="line-explanation">
          <span className="lesson-label">
            {changed ? "EDITED EXAMPLE" : `LINE ${line + 1} · লাইনের ব্যাখ্যা`}
          </span>
          {changed ? (
            <>
              <p>
                The walkthrough describes the original example. Reset to follow
                it again; edited C# is not compiled here.
              </p>
              <p lang="bn">
                ব্যাখ্যা মূল উদাহরণের জন্য। আবার দেখতে Reset করুন; এখানে C# compile
                হয় না।
              </p>
            </>
          ) : (
            <>
              {en && <p>{selected?.en}</p>}
              {bn && <p className="bn-text">{selected?.bn}</p>}
              <div className="line-controls">
                <button
                  disabled={line === 0}
                  onClick={() => setLine((x) => x - 1)}
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>
                <span>
                  {line + 1}/{lesson.lines.length}
                </span>
                <button
                  disabled={line === lesson.lines.length - 1}
                  onClick={() => setLine((x) => x + 1)}
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="code-run-bar">
        {isSQL ? (
          <>
            <small>
              <Database size={13} />
              Real SQLite · isolated browser database
            </small>
            <div>
              <button onClick={() => runSQL(true)} disabled={running}>
                Reset database
              </button>
              <button
                className="primary"
                disabled={running}
                onClick={() => runSQL()}
              >
                <Play size={14} />
                {running ? "Running..." : "Run SQL / চালান"}
              </button>
            </div>
          </>
        ) : lesson.output ? (
          <>
            <small>
              <Terminal size={13} />
              Safe reference-command simulation · no real system changes
            </small>
            <button
              className="primary"
              onClick={() =>
                setResult({
                  demo: changed
                    ? "Reset the code to run the original demonstration. / মূল demo চালাতে reset করুন।"
                    : lesson.output,
                })
              }
            >
              <Play size={14} />
              Simulate command
            </button>
          </>
        ) : (
          <small>
            <BookOpen size={14} />
            Explained reference code. C# requires a .NET SDK/project; framework
            and provider fragments need the dependencies noted in the lesson.
          </small>
        )}
      </div>
      {error && (
        <div className="lab-error" role="alert">
          {error}
        </div>
      )}
      {result && (
        <div className="sql-output" aria-live="polite">
          <div className="lesson-label">
            {result.demo
              ? "SIMULATED OUTPUT"
              : result.reset
                ? "DATABASE RESET"
                : "SQL RESULT"}
          </div>
          {result.demo ? (
            <pre>{result.demo}</pre>
          ) : result.reset ? (
            <p>Sample tables restored. / উদাহরণের টেবিল আগের অবস্থায় এসেছে।</p>
          ) : result.results?.length ? (
            result.results.map((r, i) => (
              <div key={i} className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {r.columns.map((c, j) => (
                        <th key={j}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.values.map((row, j) => (
                      <tr key={j}>
                        {row.map((v, k) => (
                          <td key={k}>
                            {v === null ? <em>NULL</em> : String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <small>
                  {r.total} rows {r.total > 200 ? "(first 200 shown)" : ""}
                </small>
              </div>
            ))
          ) : (
            <p>Query completed. Rows changed: {result.modified}.</p>
          )}
        </div>
      )}
      {isSQL && (
        <details className="sample-data">
          <summary>Sample database / কোন data ব্যবহার হচ্ছে?</summary>
          <p>
            Employees: Id, Name, DepartmentId, Salary, ManagerId · Departments:
            Id, Name
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {["Id", "Name", "DepartmentId", "Salary", "ManagerId"].map(
                    (x) => (
                      <th key={x}>{x}</th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  [1, "Ayesha", 1, 95000, "NULL"],
                  [2, "Rahim", 1, 65000, 1],
                  [3, "Nadia", 2, 80000, "NULL"],
                  [4, "Arif", 3, 50000, 1],
                  [5, "Tania", 1, 65000, 1],
                  [6, "Sami", "NULL", 45000, "NULL"],
                ].map((r, i) => (
                  <tr key={i}>
                    {r.map((v, j) => (
                      <td key={j}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Departments: 1 Engineering · 2 Design · 3 Operations. Edits remain
            within this lesson’s temporary database.
          </p>
        </details>
      )}
    </section>
  );
}
