import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Code2,
  Copy,
  Check,
  Download,
  ChevronDown,
  ArrowUpRight,
  Search,
  Printer,
} from "lucide-react";
import { loadChapter } from "../content/reference";
import modules from "../curriculum.json";
import CodeLab from "./CodeLab";
import "./reference.css";
function Pair({ en, bn, lang }) {
  return (
    <>
      {lang !== "বাংলা" && <p>{en}</p>}
      {lang !== "English" && (
        <p className="bn-text" lang="bn">
          {bn}
        </p>
      )}
    </>
  );
}
function download(name, text) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Example({ example, index, lesson, lang }) {
  const [copied, setCopied] = useState(false),
    [error, setError] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setError("Clipboard unavailable; use Download to save this example.");
    }
  };
  const ext =
    {
      csharp: "cs",
      sql: "sql",
      "sql-reference": "sql",
      bash: "sh",
      javascript: "js",
      yaml: "yml",
      json: "json",
      hcl: "tf",
      dockerfile: "Dockerfile",
    }[example.language] || "txt";
  const safe = lesson.topic.replace(/[^a-z0-9]/gi, "-");
  const sqlLesson = useMemo(
    () => ({
      id: lesson.id + "-reference-" + index,
      topic: example.title,
      lang: "sql",
      module: { id: 2 },
      code: example.code,
      lines: example.code
        .split("\n")
        .filter(Boolean)
        .map((text) => ({
          text,
          en: sqlExplanation(text),
          bn: sqlBangla(text),
        })),
    }),
    [lesson.id, index, example],
  );
  return (
    <section
      className="reference-example"
      aria-label={`Additional example ${index + 1}`}
    >
      <div className="reference-example-heading">
        <div>
          <span className="section-kicker">
            EXAMPLE {index + 2} · বাড়তি উদাহরণ
          </span>
          <h3>{example.title}</h3>
          <small>
            {example.kind} · {example.language.toUpperCase()} ·{" "}
            {example.code.split("\n").length} lines
          </small>
        </div>
        <div>
          <button
            onClick={copy}
            aria-label={`Copy additional example ${index + 1}`}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
          <button
            onClick={() =>
              download(`${safe}-example-${index + 2}.${ext}`, example.code)
            }
            aria-label={`Download additional example ${index + 1}`}
          >
            <Download size={15} />
          </button>
        </div>
      </div>
      {example.setupEn && (
        <div className="backend-example-setup">
          <strong>Before you run · চালানোর আগে</strong>
          <Pair en={example.setupEn} bn={example.setupBn} lang={lang} />
          <pre>{example.commands}</pre>
          {example.tryRequest && (
            <p>
              <strong>Try / পরীক্ষা:</strong> {example.tryRequest}
            </p>
          )}
        </div>
      )}
      {example.language === "sql" && lesson.module.id === 2 ? (
        <CodeLab lesson={sqlLesson} lang={lang} />
      ) : (
        <div className="reference-code-scroll">
          <pre>
            <code>
              {example.code.split("\n").map((line, i) => (
                <span className="reference-code-line" key={i}>
                  <span>{i + 1}</span>
                  <span>{line || " "}</span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      )}
      {example.expectedOutput && (
        <details className="backend-expected-output">
          <summary>Expected result · কী ফল পাবেন?</summary>
          <pre>{example.expectedOutput}</pre>
        </details>
      )}
      {error && <p role="status">{error}</p>}
      <div className="example-study-prompts">
        <Pair
          en="Trace the example from its inputs to its final output. The comments identify assumptions and omitted integration requirements. Change one input, predict the result, and check the relevant edge case before using the pattern in a project."
          bn="Input থেকে শেষ ফল পর্যন্ত code হাতে চালান। Comment-এ শর্ত ও integration-এর প্রয়োজন লেখা আছে। একটি input বদলে আগে ফল অনুমান করুন, তারপর সেই সীমার case মিলিয়ে দেখুন।"
          lang={lang}
        />
      </div>
    </section>
  );
}
function sqlExplanation(text) {
  const s = text.trim().toUpperCase();
  if (s.startsWith("--")) return text.replace(/^\s*--\s*/, "");
  if (s.startsWith("SELECT"))
    return "Choose result columns or expressions. This does not rename or rewrite stored data.";
  if (s.startsWith("FROM"))
    return "Choose the input table and aliases used by this result.";
  if (s.includes("JOIN"))
    return "Combine matching rows under the specified relationship; check the resulting row grain.";
  if (s.startsWith("WHERE"))
    return "Filter individual input rows before grouping or output projection.";
  if (s.startsWith("GROUP")) return "Form one group per distinct grouping key.";
  if (s.startsWith("HAVING"))
    return "Filter groups after their aggregate values have been calculated.";
  if (s.startsWith("ORDER"))
    return "Specify a deterministic output order and suitable tie breakers.";
  if (s.startsWith("LIMIT"))
    return "Bound the result size; ordering determines which rows are included.";
  if (s.startsWith("EXPLAIN"))
    return "Ask the database for a plan rather than assuming which access path is used.";
  if (s.startsWith("CREATE INDEX"))
    return "Create an auxiliary index; consider write and storage costs as well as read benefits.";
  return "Continue the expression or clause above; check aliases, parentheses, and the provider-specific syntax.";
}
function sqlBangla(text) {
  const s = text.trim().toUpperCase();
  if (s.startsWith("SELECT")) return "কোন column বা হিসাব ফলে দেখাবেন তা বাছুন।";
  if (s.startsWith("FROM")) return "মূল table ও alias ঠিক করুন।";
  if (s.includes("JOIN"))
    return "শর্ত মেনে দুই দিকের row মিলান; কত pair হচ্ছে দেখুন।";
  if (s.startsWith("WHERE"))
    return "Group করার আগে আলাদা row-এর শর্ত পরীক্ষা করুন।";
  if (s.startsWith("GROUP")) return "একই key-এর row নিয়ে দল তৈরি করুন।";
  if (s.startsWith("HAVING")) return "হিসাব হয়ে যাওয়া দল শর্ত মেনে রাখুন।";
  if (s.startsWith("ORDER")) return "ফলের ক্রম ও সমান মানের tie breaker দিন।";
  if (s.startsWith("LIMIT")) return "ফলের সর্বোচ্চ row সংখ্যা বাঁধুন।";
  return "আগের clause-এর বাকি expression, alias ও বন্ধনী মিলিয়ে পড়ুন।";
}
export default function DeepReference({ lesson, lang }) {
  const [chapter, setChapter] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0),
    [query, setQuery] = useState("");
  useEffect(() => {
    let active = true;
    setChapter(null);
    setError("");
    setQuery("");
    loadChapter(lesson)
      .then((c) => {
        if (active) setChapter(c);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [lesson.id, retry]);
  const jump = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  if (error)
    return (
      <section id="reference" className="deep-reference">
        <h2>Reference chapter unavailable</h2>
        <p role="alert">{error}</p>
        <button className="secondary" onClick={() => setRetry((x) => x + 1)}>
          Retry loading
        </button>
      </section>
    );
  if (!chapter)
    return (
      <section id="reference" className="deep-reference" aria-busy="true">
        <p>
          Loading the expanded reference chapter… / বড় reference প্রস্তুত হচ্ছে…
        </p>
      </section>
    );
  const q = query.trim().toLowerCase();
  const sections = chapter.sections.filter((s) =>
    `${s.title} ${s.en} ${s.bn} ${(s.steps || []).map((step) => step.en + " " + step.bn).join(" ")}`
      .toLowerCase()
      .includes(q),
  );
  const examples = chapter.examples
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => `${e.title} ${e.code}`.toLowerCase().includes(q));
  const related = modules
    .flatMap((m) => m.topics.map((topic, t) => ({ m: m.id, t, topic })))
    .filter(
      (x) =>
        (x.topic === chapter.canonicalKey ||
          x.topic === lesson.related ||
          (x.m === lesson.module.id && Math.abs(x.t - lesson.index) <= 2)) &&
        !(x.m === lesson.module.id && x.t === lesson.index),
    )
    .slice(0, 6);
  const exportChapter = () => {
    let text = `# ${lesson.topic}\n\n`;
    for (const s of chapter.sections) {
      text += `## ${s.title}\n\n${s.en}\n\n${s.bn}\n\n`;
      for (const [index, step] of (s.steps || []).entries())
        text += `${index + 1}. ${step.en} / ${step.bn}\n`;
    }
    for (const e of chapter.examples) {
      text += `## ${e.title}\n\n`;
      if (e.setupEn)
        text +=
          `${e.setupEn}\n\n${e.setupBn}\n\n` +
          "```bash\n" +
          e.commands +
          "\n```\n\n";
      text += "```" + e.language + "\n" + e.code + "\n```\n\n";
      if (e.tryRequest) text += `Try: ${e.tryRequest}\n\n`;
      if (e.expectedOutput) text += `Expected result: ${e.expectedOutput}\n\n`;
    }
    text += `## Official reference\n\n${lesson.docs[1]}\n`;
    download(lesson.topic.replace(/[^a-z0-9]/gi, "-") + "-reference.md", text);
  };
  return (
    <section
      id="reference"
      className="deep-reference"
      aria-label="Expanded topic reference"
    >
      <div className="reference-banner">
        <span className="reference-mark">
          <BookOpen size={24} />
        </span>
        <div>
          <span className="section-kicker">
            ENCYCLOPEDIA CHAPTER · বিস্তৃত পাঠ
          </span>
          <h2>{lesson.topic}: deep reference</h2>
          <p>
            {chapter.examples.length} additional examples · {chapter.codeLines}{" "}
            added code lines · ~{chapter.readingMinutes} min study
          </p>
        </div>
        <div className="reference-actions">
          <button
            onClick={exportChapter}
            aria-label="Download reference chapter"
          >
            <Download size={16} />
          </button>
          <button onClick={() => window.print()} aria-label="Print lesson">
            <Printer size={16} />
          </button>
        </div>
      </div>
      <div className="reference-toc">
        <span>ON THIS CHAPTER / এই পাঠে</span>
        {[
          ["mechanism", "How it works"],
          ...(chapter.extraSections || []).map((s) => [
            s.id,
            s.id === "easy-story" ? "Easy story" : "4 C# steps",
          ]),
          ["decisions", "Decisions & limits"],
          ["examples", "More code"],
          ["questions", "Questions & answers"],
          ["connections", "Connected topics"],
        ].map(([id, label]) => (
          <button key={id} onClick={() => jump("ref-" + id)}>
            {label}
          </button>
        ))}
      </div>
      <label className="reference-find">
        <Search size={15} />
        <input
          aria-label="Find within reference"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a phrase or code symbol in this chapter… / এই পাঠে খুঁজুন"
        />
        {query && <button onClick={() => setQuery("")}>Clear</button>}
      </label>
      {sections.map((section, i) => (
        <section
          className="reference-prose"
          id={
            "ref-" +
            (section.id ||
              (section === chapter.sections[0] ? "mechanism" : "decisions"))
          }
          key={section.title}
        >
          <span className="section-kicker">
            {section === chapter.sections[0]
              ? "THE COMPLETE IDEA"
              : "TRADE-OFFS & BOUNDARIES"}
          </span>
          <h3>{section.title}</h3>
          <Pair en={section.en} bn={section.bn} lang={lang} />
          {section.steps && (
            <ol className="backend-reading-steps">
              {section.steps.map((step, index) => (
                <li key={index}>
                  <Pair en={step.en} bn={step.bn} lang={lang} />
                </li>
              ))}
            </ol>
          )}
          {i === 0 && (
            <div className="reference-source-note">
              <Pair
                en={lesson.en + " " + lesson.deep}
                bn={lesson.bn + " " + lesson.warningBn}
                lang={lang}
              />
            </div>
          )}
        </section>
      ))}
      <div id="ref-examples" className="reference-examples">
        {examples.map(({ e, i }) => (
          <Example
            key={lesson.id + "-" + i}
            example={e}
            index={i}
            lesson={lesson}
            lang={lang}
          />
        ))}
      </div>
      {q && sections.length === 0 && examples.length === 0 && (
        <p role="status">
          No matching reference section or code. / এই অংশে মিল নেই।
        </p>
      )}
      <section id="ref-questions" className="reference-questions">
        <span className="section-kicker">
          QUESTIONS, ANSWERS & PRACTICE · প্রশ্ন ও অনুশীলন
        </span>
        <h3>Explain the decisions, not just the syntax</h3>
        <details>
          <summary>
            How does {lesson.topic} work internally? / ভেতরের কাজ কী?
          </summary>
          <Pair en={chapter.en} bn={chapter.bn} lang={lang} />
        </details>
        <details>
          <summary>
            Which limitation changes the design? / কোন সীমায় নকশা বদলাবেন?
          </summary>
          <Pair en={chapter.decisionEn} bn={chapter.decisionBn} lang={lang} />
          <Pair en={lesson.caution} bn={lesson.warningBn} lang={lang} />
        </details>
        <details>
          <summary>
            How should I verify the example? / উদাহরণ কীভাবে যাচাই করব?
          </summary>
          <Pair
            en={`Use the declared inputs in the ${chapter.examples[0].title} example. Write each state change, then test the condition described in the design decisions. For a reference fragment, create the required surrounding project/provider first. A successful compile checks syntax and types; it does not prove the external system or business flow works.`}
            bn="উদাহরণের ঘোষিত input নিন, প্রতিটি state change লিখুন। Design decision-এর সীমার শর্ত test করুন। Fragment হলে আগে দরকারি project/provider তৈরি করুন। Compile সফল মানে syntax/type ঠিক; বাইরের system বা ব্যবসার কাজ সফল তার প্রমাণ নয়।"
            lang={lang}
          />
        </details>
        <div className="reference-task">
          <h4>Build a small extension · নিজে বাড়ান</h4>
          <Pair
            en={`Start from example 2. Add input validation and one negative test tied to this topic's documented limitation. Explain what remains in memory, what must be durable, and which dependencies the example intentionally leaves outside its boundary.`}
            bn="দ্বিতীয় উদাহরণ থেকে শুরু করুন। এই topic-এর সীমা অনুযায়ী input validation ও একটি negative test যোগ করুন। কী memory-তে, কী স্থায়ী রাখতে হবে ও কোন dependency বাইরে আছে, বলুন।"
            lang={lang}
          />
        </div>
      </section>
      <section id="ref-connections" className="reference-connections">
        <h3>Connected topics · সম্পর্কিত পাঠ</h3>
        <div>
          {related.map((x) => (
            <a href={`#lesson/${x.m}/${x.t}`} key={x.m + "-" + x.t}>
              {x.topic}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
        <a
          className="official-reference"
          href={lesson.docs[1]}
          target="_blank"
          rel="noreferrer"
        >
          {lesson.docs[0]}
          <ArrowUpRight size={14} />
        </a>
        <small>
          Related curriculum entries share canonical reference examples where
          they teach the same underlying concept. / একই ধারণার পাঠ একই canonical
          reference ব্যবহার করতে পারে।
        </small>
      </section>
    </section>
  );
}
