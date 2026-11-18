import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Lightbulb,
  MessageCircleQuestion,
  Search,
  Server,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { bankDbSetup, chapters, parts } from "../content/sqlMastery/index.js";
import "./sqlServerMastery.css";

const HASH = "#sql-server";
const STORE = "sqlm-done";

function readSlug() {
  const m = window.location.hash.match(/^#sql-server\/([\w-]+)$/);
  return m && chapters.some((c) => c.slug === m[1]) ? m[1] : null;
}

/* ---------------- T-SQL syntax highlighter ---------------- */
const KEYWORDS = new Set(
  `ADD ALL ALTER AND ANY APPLY AS ASC AUTO BEGIN BETWEEN BIGINT BINARY BIT BREAK BY CASCADE CASE CAST CATCH CHAR CHECK CHECKPOINT CLOSE CLUSTERED COLUMNSTORE COMMIT CONSTRAINT CONTINUE CREATE CROSS CUBE CURSOR DATABASE DATE DATETIME DATETIME2 DATETIMEOFFSET DEALLOCATE DECIMAL DECLARE DEFAULT DELAY DELETE DESC DETAILED DISABLE DISTINCT DROP ELSE END ESCAPE EXCEPT EXEC EXECUTE EXISTS FAST_FORWARD FETCH FIRST FLOAT FOR FOREIGN FROM FULLSCAN FUNCTION GLOBAL GO GOTO GRANT GROUP GROUPING HASH HAVING HISTOGRAM HOLDLOCK IDENTITY IF IN INCLUDE INDEX INNER INSERT INSTEAD INT INTERSECT INTO IS JOIN JSON KEY LEFT LEVEL LIKE LOCAL LOOP MATCHED MAX MERGE NEXT NOCOUNT NOEXPAND NONCLUSTERED NOT NOWAIT NULL NVARCHAR OF OFF OFFSET ON ONLY OPEN OPTIMIZE OPTION OR ORDER OUTER OUTPUT OVER PARTITION PATH PERIOD PERSISTED PIVOT PRECEDING PRIMARY PROCEDURE RANGE READ READONLY RECOMPILE REFERENCES RETURN RETURNS RIGHT ROLE ROLLBACK ROLLUP ROW ROWLOCK ROWS ROWVERSION SAVE SCHEMABINDING SELECT SERIALIZABLE SET SETS SNAPSHOT SOURCE STATISTICS SYSNAME SYSTEM_TIME SYSTEM_VERSIONING TABLE TARGET THEN THROW TIME TO TOP TRAN TRANSACTION TRIGGER TRUNCATE TRY TYPE UNBOUNDED UNCOMMITTED UNION UNIQUE UNIQUEIDENTIFIER UNKNOWN UNPIVOT UPDATE UPDLOCK USE USING VALUES VARCHAR VIEW WAITFOR WHEN WHERE WHILE WITH WITHIN WITHOUT_ARRAY_WRAPPER XACT_ABORT XML`.split(
    /\s+/,
  ),
);
const FUNCTIONS = new Set(
  `ABS AVG COALESCE CONVERT COUNT COUNT_BIG CURRENT_TIMESTAMP DATALENGTH DATEADD DATEDIFF DATEFROMPARTS DB_ID DENSE_RANK EOMONTH ERROR_LINE ERROR_MESSAGE ERROR_NUMBER ERROR_PROCEDURE FORMAT GETDATE IIF ISJSON ISNULL JSON_VALUE LAG LEAD MIN MONTH NEWID NEWSEQUENTIALID NTILE NULLIF OBJECT_ID OBJECT_NAME OPENJSON QUOTENAME RANK REPLICATE ROUND ROWCOUNT_BIG ROW_NUMBER STRING_AGG STRING_SPLIT STUFF SUBSTRING SUM SUSER_SNAME SYSUTCDATETIME TRIM TYPE_NAME UPPER XACT_STATE YEAR`.split(
    /\s+/,
  ),
);
const TOKEN =
  /(--[^\n]*|\/\*[\s\S]*?\*\/)|(N?'(?:[^']|'')*')|(@@?\w+|#\w+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][\w$]*\b)/g;

function highlight(code) {
  const out = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [text, comment, str, variable, num, word] = m;
    let cls = null;
    if (comment) cls = "tk-comment";
    else if (str) cls = "tk-string";
    else if (variable) cls = "tk-var";
    else if (num) cls = "tk-num";
    else if (word) {
      const up = word.toUpperCase();
      if (KEYWORDS.has(up)) cls = "tk-kw";
      else if (FUNCTIONS.has(up)) cls = "tk-fn";
    }
    out.push(
      cls ? (
        <span key={key++} className={cls}>
          {text}
        </span>
      ) : (
        text
      ),
    );
    last = m.index + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

function CodeBlock({ code, label = "T-SQL · SQL Server" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const html = useMemo(() => highlight(code), [code]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }
  return (
    <figure className="sqlm-code">
      <figcaption>
        <span>{label}</span>
        <button type="button" onClick={copy} aria-label="Copy SQL code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre tabIndex={0}>
        <code>{html}</code>
      </pre>
    </figure>
  );
}

/* ---------------- bilingual text ---------------- */
function useMode(lang) {
  return lang === "English" ? "en" : lang === "বাংলা" ? "bn" : "both";
}
function Bi({ en, bn, mode, as: Tag = "p", className = "" }) {
  return (
    <>
      {mode !== "bn" && <Tag className={className}>{en}</Tag>}
      {mode !== "en" && (
        <Tag className={className + " sqlm-bn"} lang="bn">
          {bn}
        </Tag>
      )}
    </>
  );
}

const NOTE_META = {
  key: { icon: Lightbulb, en: "Key idea", bn: "মূল কথা" },
  trap: { icon: TriangleAlert, en: "Trap", bn: "ফাঁদ" },
  tip: { icon: Wrench, en: "Practitioner tip", bn: "প্র্যাকটিক্যাল টিপ" },
  interview: {
    icon: MessageCircleQuestion,
    en: "Interview question",
    bn: "ইন্টারভিউ প্রশ্ন",
  },
};

function Note({ note, mode }) {
  const meta = NOTE_META[note.type];
  const Icon = meta.icon;
  return (
    <div role="note" className={"sqlm-note sqlm-note-" + note.type}>
      <strong className="sqlm-note-title">
        <Icon size={16} aria-hidden="true" />
        {mode === "bn" ? meta.bn : meta.en}
        {mode === "both" && <span lang="bn"> · {meta.bn}</span>}
      </strong>
      {note.q && <p className="sqlm-q">“{note.q}”</p>}
      <Bi en={note.en} bn={note.bn} mode={mode} />
    </div>
  );
}

function downloadSetup() {
  const blob = new Blob([bankDbSetup], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "BankDB-setup.sql";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function chapterText(c) {
  return [
    c.title,
    c.titleBn,
    c.analogy.en,
    c.analogy.bn,
    ...c.summary.flatMap((x) => [x.en, x.bn]),
    ...c.sections.flatMap((s) => [
      s.title,
      s.titleBn,
      s.en,
      s.bn,
      s.code,
      ...(s.notes || []).flatMap((n) => [n.q, n.en, n.bn]),
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

/* ---------------- page ---------------- */
export default function SqlServerMastery({ lang }) {
  const mode = useMode(lang);
  const [slug, setSlug] = useState(readSlug);
  const [query, setQuery] = useState("");
  const [done, setDone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "[]");
      return Array.isArray(saved)
        ? saved.filter((s) => typeof s === "string")
        : [];
    } catch {
      return [];
    }
  });
  const articleRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash.startsWith(HASH)) setSlug(readSlug());
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(done));
    } catch {}
  }, [done]);

  const index = useMemo(
    () => new Map(chapters.map((c) => [c.slug, chapterText(c)])),
    [],
  );
  const q = query.trim().toLowerCase();
  const visible = q
    ? chapters.filter((c) => index.get(c.slug).includes(q))
    : chapters;
  const chapter = chapters.find((c) => c.slug === slug) || null;
  const position = chapter ? chapters.indexOf(chapter) : -1;
  const totalSections = chapters.reduce((n, c) => n + c.sections.length, 0);
  const totalCode = chapters.reduce(
    (n, c) => n + c.sections.filter((s) => s.code).length,
    0,
  );

  function open(next) {
    const hash = next ? HASH + "/" + next : HASH;
    if (window.location.hash !== hash) window.location.hash = hash;
    setSlug(next);
    requestAnimationFrame(() => {
      const target = articleRef.current;
      if (target) {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start" });
      }
    });
  }
  const toggleDone = (s) =>
    setDone((d) => (d.includes(s) ? d.filter((x) => x !== s) : [...d, s]));

  return (
    <section className="sqlm" aria-labelledby="sqlm-title">
      <header className="sqlm-hero">
        <span className="sqlm-badge">
          <Server size={15} aria-hidden="true" /> Microsoft SQL Server · T-SQL
          only
        </span>
        <h1 id="sqlm-title">SQL Server Mastery</h1>
        <p className="sqlm-hero-sub">
          {mode !== "bn" &&
            "SQL from A to Z for backend engineers — from SELECT to execution plans and query optimization. One banking database, real T-SQL in every lesson."}
        </p>
        {mode !== "en" && (
          <p className="sqlm-hero-sub sqlm-bn" lang="bn">
            ব্যাকএন্ড ইঞ্জিনিয়ারদের জন্য A থেকে Z SQL — SELECT থেকে execution plan ও
            query optimization পর্যন্ত। একটি ব্যাংকিং ডেটাবেস, প্রতিটি লেসনে আসল
            T-SQL কোড, সহজ বাংলা ব্যাখ্যা।
          </p>
        )}
        <ul className="sqlm-stats" aria-label="Course size">
          <li>
            <strong>{parts.length}</strong> parts
          </li>
          <li>
            <strong>{chapters.length}</strong> modules
          </li>
          <li>
            <strong>{totalSections}</strong> lessons
          </li>
          <li>
            <strong>{totalCode}</strong> T-SQL examples
          </li>
          <li>
            <strong>
              {done.length}/{chapters.length}
            </strong>{" "}
            completed
          </li>
        </ul>
        <div className="sqlm-hero-actions">
          <button
            type="button"
            className="sqlm-primary"
            onClick={() =>
              open(
                (chapters.find((c) => !done.includes(c.slug)) || chapters[0])
                  .slug,
              )
            }
          >
            {done.length ? "Continue learning" : "Start Module 1"}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button type="button" onClick={downloadSetup}>
            <Download size={16} aria-hidden="true" /> Download BankDB setup
            script
          </button>
        </div>
      </header>

      <div className="sqlm-layout">
        <nav className="sqlm-side" aria-label="SQL Server modules">
          <label className="sqlm-search">
            <Search size={15} aria-hidden="true" />
            <span className="sqlm-sr">Search SQL lessons</span>
            <input
              type="search"
              placeholder="Search topics, code… (e.g. NOLOCK)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {q && (
            <p className="sqlm-hits" role="status">
              {visible.length} {visible.length === 1 ? "module" : "modules"}{" "}
              match
            </p>
          )}
          <label className="sqlm-jump">
            <span className="sqlm-sr">Jump to module</span>
            <select
              value={slug || ""}
              onChange={(e) => open(e.target.value || null)}
            >
              <option value="">Course overview</option>
              {visible.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.id}. {c.title}
                </option>
              ))}
            </select>
          </label>
          <div className="sqlm-modules">
            {parts.map((p, pi) => {
              const list = visible.filter((c) => c.part === pi);
              if (!list.length) return null;
              return (
                <div key={p.title} className="sqlm-part">
                  <h2>
                    Part {["I", "II", "III", "IV", "V", "VI"][pi]} · {p.title}
                  </h2>
                  {list.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      aria-current={c.slug === slug ? "page" : undefined}
                      onClick={() => open(c.slug)}
                    >
                      <span className="sqlm-num">
                        {done.includes(c.slug) ? (
                          <CheckCircle2 size={16} aria-label="Completed" />
                        ) : (
                          c.id
                        )}
                      </span>
                      <span className="sqlm-mod-text">
                        {c.title}
                        {mode !== "en" && <small lang="bn">{c.titleBn}</small>}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
            {!visible.length && (
              <p className="sqlm-empty">No module matches “{query}”.</p>
            )}
          </div>
        </nav>

        <article
          className="sqlm-main"
          ref={articleRef}
          tabIndex={-1}
          aria-labelledby={
            chapter ? "sqlm-chapter-title" : "sqlm-overview-title"
          }
        >
          {chapter ? (
            <Chapter
              chapter={chapter}
              mode={mode}
              done={done.includes(chapter.slug)}
              onToggle={() => toggleDone(chapter.slug)}
              prev={chapters[position - 1]}
              next={chapters[position + 1]}
              onOpen={open}
            />
          ) : (
            <Overview mode={mode} onOpen={open} done={done} />
          )}
        </article>
      </div>
    </section>
  );
}

function Overview({ mode, onOpen, done }) {
  return (
    <>
      <h2 id="sqlm-overview-title" className="sqlm-h2">
        Course overview
      </h2>
      <Bi
        mode={mode}
        en="Pick any module. Each lesson has a simple English explanation, a Bangla explanation, runnable T-SQL against BankDB, and notes on traps, tips and interview questions. Run the setup script once in SSMS or Azure Data Studio, then type every query yourself."
        bn="যেকোনো মডিউল বেছে নিন। প্রতিটি লেসনে সহজ ইংরেজি ও বাংলা ব্যাখ্যা, BankDB-তে চালানো যায় এমন T-SQL কোড, আর ফাঁদ, টিপস ও ইন্টারভিউ প্রশ্ন আছে। SSMS বা Azure Data Studio-তে একবার setup script চালান, তারপর প্রতিটি query নিজে টাইপ করুন।"
      />
      <div className="sqlm-grid">
        {parts.map((p, pi) => (
          <section key={p.title} className="sqlm-card">
            <h3>
              Part {["I", "II", "III", "IV", "V", "VI"][pi]} · {p.title}
              {mode !== "en" && <small lang="bn">{p.titleBn}</small>}
            </h3>
            <ol>
              {chapters
                .filter((c) => c.part === pi)
                .map((c) => (
                  <li key={c.slug} value={c.id}>
                    <a
                      href={"#sql-server/" + c.slug}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpen(c.slug);
                      }}
                    >
                      {c.title}
                    </a>
                    {done.includes(c.slug) && (
                      <CheckCircle2 size={14} aria-label="Completed" />
                    )}
                    <span
                      className={
                        "sqlm-level sqlm-level-" + c.level.toLowerCase()
                      }
                    >
                      {c.level}
                    </span>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
      <h3 className="sqlm-h3">BankDB setup script</h3>
      <Bi
        mode={mode}
        en="Creates (or resets) the BankDB database, the six core tables, helper tables used in later modules, and sample data in Bangladeshi Taka."
        bn="BankDB ডেটাবেস (আবার চালালে রিসেট হয়), ছয়টি মূল টেবিল, পরের মডিউলে লাগবে এমন সহায়ক টেবিল এবং বাংলাদেশি টাকায় স্যাম্পল ডেটা তৈরি করে।"
      />
      <CodeBlock code={bankDbSetup} label="BankDB-setup.sql · SQL Server" />
    </>
  );
}

function Chapter({ chapter, mode, done, onToggle, prev, next, onOpen }) {
  const c = chapter;
  return (
    <>
      <p className="sqlm-crumb">
        Part {["I", "II", "III", "IV", "V", "VI"][c.part]} ·{" "}
        {parts[c.part].title} · Module {c.id} of {chapters.length}
      </p>
      <h2 id="sqlm-chapter-title" className="sqlm-h2">
        {c.id}. {c.title}
      </h2>
      {mode !== "en" && (
        <p className="sqlm-subtitle" lang="bn">
          {c.titleBn}
        </p>
      )}
      <span className={"sqlm-level sqlm-level-" + c.level.toLowerCase()}>
        {c.level}
      </span>

      <div className="sqlm-analogy">
        <strong>{mode === "bn" ? "সহজ উদাহরণ" : "Real-life analogy"}</strong>
        <Bi en={c.analogy.en} bn={c.analogy.bn} mode={mode} />
      </div>

      <nav className="sqlm-toc" aria-label="Lessons in this module">
        <strong>
          {mode === "bn" ? "এই মডিউলের লেসন" : "Lessons in this module"}
        </strong>
        <ol>
          {c.sections.map((s, i) => (
            <li key={s.title}>
              <a
                href={"#sql-server/" + c.slug}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(`sqlm-${c.slug}-${i}`)
                    ?.scrollIntoView({ block: "start", behavior: "smooth" });
                }}
              >
                {c.id}.{i + 1} {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {c.sections.map((s, i) => (
        <section
          key={s.title}
          className="sqlm-section"
          id={`sqlm-${c.slug}-${i}`}
        >
          <h3>
            <span className="sqlm-secnum">
              {c.id}.{i + 1}
            </span>{" "}
            {s.title}
            {mode !== "en" && <small lang="bn">{s.titleBn}</small>}
          </h3>
          <Bi en={s.en} bn={s.bn} mode={mode} />
          {s.code && <CodeBlock code={s.code} />}
          {s.notes?.map((n, k) => (
            <Note key={k} note={n} mode={mode} />
          ))}
        </section>
      ))}

      <section className="sqlm-summary">
        <h3>{mode === "bn" ? "সারসংক্ষেপ" : "Module summary"}</h3>
        <ul>
          {c.summary.map((s) => (
            <li key={s.en}>
              <Check size={15} aria-hidden="true" />
              <span>
                {mode !== "bn" && <span>{s.en}</span>}
                {mode !== "en" && (
                  <span className="sqlm-bn" lang="bn">
                    {s.bn}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={done ? "sqlm-done is-done" : "sqlm-done"}
          aria-pressed={done}
          onClick={onToggle}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          {done ? "Module completed" : "Mark module complete"}
        </button>
      </section>

      <div className="sqlm-pager">
        {prev ? (
          <button type="button" onClick={() => onOpen(prev.slug)}>
            <ArrowLeft size={15} aria-hidden="true" />
            <span>
              <small>Previous</small>
              {prev.id}. {prev.title}
            </span>
          </button>
        ) : (
          <button type="button" onClick={() => onOpen(null)}>
            <ArrowLeft size={15} aria-hidden="true" />
            <span>
              <small>Back</small>Course overview
            </span>
          </button>
        )}
        {next && (
          <button
            type="button"
            className="sqlm-next"
            onClick={() => onOpen(next.slug)}
          >
            <span>
              <small>Next</small>
              {next.id}. {next.title}
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  );
}
