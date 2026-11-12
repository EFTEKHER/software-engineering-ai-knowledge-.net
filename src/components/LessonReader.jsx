import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Download,
  ArrowUp,
} from "lucide-react";
import { getLesson } from "../content/lessons";
import ThemeToggle from "./ThemeToggle";
import Diagram from "./Diagram";
import DeepReference from "./DeepReference";
import CodeLab from "./CodeLab";
import { TopicNotes, useSaved } from "./Notebook";
import "./learning.css";
function Pair({ en, bn, lang }) {
  return (
    <>
      {lang !== "বাংলা" && <p>{en}</p>}
      {lang !== "English" && (
        <p lang="bn" className="bn-text">
          {bn}
        </p>
      )}
    </>
  );
}
export default function LessonReader({
  lesson: selection,
  close,
  lang,
  onLanguageChange,
  initialLevel,
  completed,
  mark,
  next,
  selectTopic,
}) {
  const l = useMemo(
    () => getLesson(selection.m, selection.t),
    [selection.m.id, selection.t],
  );
  const [level, setLevel] = useState(
      initialLevel === "All levels" ? "Beginner" : initialLevel,
    ),
    [saved, setSaved] = useSaved("mastery-bookmarks", []),
    [answer, setAnswer] = useState(null),
    [showAnswer, setShowAnswer] = useState(false),
    [reading, setReading] = useState(false);
  const top = useRef(null);
  useEffect(() => {
    top.current?.scrollTo(0, 0);
    setAnswer(null);
    setShowAnswer(false);
  }, [l.id]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    top.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  let isSaved = saved.includes(l.id),
    bn = lang !== "English";
  const options = useMemo(() => {
    const arr = [
      { text: l.en, bn: l.bn, correct: true },
      {
        text: "It guarantees that an operation can never fail, regardless of its input or environment.",
        bn: "যে input বা পরিবেশই হোক, এই কাজ কখনো ব্যর্থ হবে না।",
      },
      {
        text: "It removes the need to validate inputs, check permissions, or handle errors.",
        bn: "এটি থাকলে input যাচাই, অনুমতি ও error handling দরকার হয় না।",
      },
    ];
    let n = l.index % 3;
    return [...arr.slice(n), ...arr.slice(0, n)];
  }, [l.id]);
  const jump = (id) =>
    top.current?.querySelector("#" + id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  return (
    <div
      className="lesson-overlay rich-reader"
      ref={top}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
        if (e.key === "Tab") {
          const items = [
            ...e.currentTarget.querySelectorAll(
              "button:not(:disabled),a[href],input,textarea,select,summary",
            ),
          ].filter((x) => x.getClientRects().length);
          const first = items[0],
            last = items.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <div className="lesson-header">
        <button onClick={close}>
          <X size={18} />
          Learning path
        </button>
        <span>
          {l.module.title}
          <ChevronRight size={14} />
          {l.index + 1} / {l.module.topics.length}
        </span>
        <div>
          <ThemeToggle />
          <select
            aria-label="Lesson language"
            value={lang}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {["বাংলা + EN", "English", "বাংলা"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <button
            className={isSaved ? "bookmarked" : ""}
            aria-label={isSaved ? "Remove bookmark" : "Bookmark topic"}
            onClick={() =>
              setSaved(
                isSaved ? saved.filter((x) => x !== l.id) : [...saved, l.id],
              )
            }
          >
            <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button className="primary" onClick={mark}>
            {completed ? <CheckCircle2 size={15} /> : <Check size={15} />}{" "}
            {completed
              ? "Completed"
              : bn
                ? "বুঝেছি · Mark complete"
                : "Mark complete"}
          </button>
        </div>
      </div>
      <div className="lesson-layout">
        <nav className="lesson-nav" aria-label="Module lessons">
          <div className="nav-label">{l.module.title}</div>
          {l.module.topics.map((t, i) => (
            <button
              className={i === l.index ? "active" : ""}
              key={t}
              onClick={() => selectTopic(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
              {i === l.index && <ChevronRight size={13} />}
            </button>
          ))}
          <a
            className="source-download"
            href="/dotnet-mastery-react.zip"
            download
          >
            <Download size={14} />
            Download full React project
          </a>
        </nav>
        <article className="lesson-content">
          <div className="eyebrow">
            STAGE {l.module.stage + 1} · MODULE{" "}
            {String(l.module.id + 1).padStart(2, "0")} · CONCEPT {l.index + 1}
          </div>
          <select
            className="mobile-topic-selector"
            aria-label="Choose topic"
            value={l.index}
            onChange={(e) => selectTopic(+e.target.value)}
          >
            {l.module.topics.map((t, i) => (
              <option value={i} key={t}>
                {i + 1}. {t}
              </option>
            ))}
          </select>
          <h1 id="lesson-title">{l.topic}</h1>
          <div className="lesson-subtitle">
            <BookOpen size={14} />
            {bn ? "শূন্য থেকে বুঝুন · " : ""}A guided lesson, one idea at a time
            <span className="reading-time">
              Quick guide + expanded reference
            </span>
          </div>
          <div className="reader-jumps">
            {[
              ["start", "Start here / শুরু"],
              ["visual", "Diagram / চিত্র"],
              ["code", "Code / কোড"],
              ["reference", "Deep reference / বিস্তৃত পাঠ"],
              ["practice", "Practice / অনুশীলন"],
              ["notes", "Notes / নোট"],
            ].map(([id, name]) => (
              <button key={id} onClick={() => jump(id)}>
                {name}
              </button>
            ))}
          </div>
          <div className="lesson-tabs" aria-label="Learning depth">
            {["Beginner", "Intermediate", "Advanced"].map((t) => (
              <button
                className={level === t ? "selected" : ""}
                onClick={() => setLevel(t)}
                key={t}
              >
                {t}
                <small>
                  {t === "Beginner"
                    ? "শুরু থেকে"
                    : t === "Intermediate"
                      ? "বাস্তব ব্যবহার"
                      : "গভীরে যান"}
                </small>
              </button>
            ))}
          </div>
          <section id="start" className="reader-section">
            <div className="section-kicker">01 / THE FOUNDATION · ভিত্তি</div>
            <h2>
              {bn ? "একদম শুরু থেকে · " : ""}What is {l.topic}?
            </h2>
            <div className="intuition-box">
              <Lightbulb size={20} />
              <div>
                <Pair en={l.en} bn={l.bn} lang={lang} />
              </div>
            </div>
            <div className="prerequisite">
              <strong>{bn ? "আগে যা জানবেন · " : ""}Before you start</strong>
              <Pair en={l.context.need[0]} bn={l.context.need[1]} lang={lang} />
            </div>
            <h3>{bn ? "বিষয়টি কোথায় কাজে লাগে · " : ""}The bigger picture</h3>
            <Pair en={l.context.why[0]} bn={l.context.why[1]} lang={lang} />
            <div className="analogy-box">
              <span>☕</span>
              <div>
                <h3>Everyday analogy · বাস্তব জীবনের তুলনা</h3>
                <Pair
                  en={l.context.analogy[0]}
                  bn={l.context.analogy[1]}
                  lang={lang}
                />
              </div>
            </div>
            <details className="glossary" open={reading}>
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setReading((x) => !x);
                }}
              >
                {bn ? "নতুন শব্দের সহজ মানে · " : ""}New words, explained simply
              </summary>
              <dl>
                {l.context.terms.map(([term, en, bn]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>
                      <Pair en={en} bn={bn} lang={lang} />
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          </section>
          {level !== "Beginner" && (
            <section className="reader-section deep-section">
              <div className="section-kicker">
                {level === "Intermediate"
                  ? "APPLIED ENGINEERING · বাস্তব কাজ"
                  : "ADVANCED REFERENCE · গভীর ধারণা"}
              </div>
              <h2>
                {level === "Intermediate"
                  ? "Move from the example to a real project"
                  : "Internals, limits, and trade-offs"}
              </h2>
              <Pair
                en={
                  level === "Intermediate"
                    ? `Use the ${l.topic} example to identify inputs, operations, and outputs. The walkthrough below explains each line; before integrating it, check the specific limitation: ${l.caution}`
                    : l.deep
                }
                bn={
                  level === "Intermediate"
                    ? `${l.topic} ব্যবহার করার আগে নিচের প্রতিটি লাইনের input, কাজ ও ফল বুঝুন। তারপর নিজের project-এর data, অনুমতি ও error handling যুক্ত করুন। ছোট উদাহরণকে production-ready ধরে নেবেন না।`
                    : `${l.topic}-এ শুধু ফল ঠিক হলেই শেষ নয়। চাপ বাড়লে সময়, memory, একইসাথে কাজ ও ব্যর্থতার প্রভাব বুঝতে হবে। নিচের technical reference ও common mistake পড়ে নিজের ভাষায় trade-off লিখুন।`
                }
                lang={lang}
              />
              <p className="technical-reading">{l.deep}</p>
            </section>
          )}
          <section id="visual" className="reader-section">
            <div className="section-kicker">02 / SEE IT HAPPEN · চোখে দেখুন</div>
            <h2>{bn ? "ধাপে ধাপে কাজটি দেখুন · " : ""}Follow the diagram</h2>
            <Pair
              en="Press Play, or use the arrow buttons to inspect one step at a time. Click a node to focus on it. Change the controls and compare what happens."
              bn="Play দিন বা তীর দিয়ে এক ধাপ করে দেখুন। যেকোনো node-এ ক্লিক করুন। Input বদলে দেখুন ফল কেন বদলায়।"
              lang={lang}
            />
            <Diagram key={l.id} lesson={l} lang={lang} />
          </section>
          <section id="code" className="reader-section">
            <div className="section-kicker">03 / READ THE CODE · কোড বুঝুন</div>
            <h2>{bn ? "এক লাইন একবারে · " : ""}Code, explained line by line</h2>
            <Pair
              en="Read one line, predict its effect, then open the explanation. You do not need to understand the entire program at once."
              bn="একটি লাইন পড়ুন, কী করবে অনুমান করুন, তারপর পাশের ব্যাখ্যা দেখুন। একবারে পুরো code বুঝতে হবে না।"
              lang={lang}
            />
            <CodeLab key={l.id} lesson={l} lang={lang} />
            <div className="setup-guide">
              <h3>
                {bn ? "নিজের কম্পিউটারে চালাতে · " : ""}Run it in a real
                environment
              </h3>
              <p>
                {l.lang === "csharp"
                  ? "Install a supported .NET SDK. Plain C# examples can be placed in a console project created with dotnet new console. ASP.NET Core/EF Core/AI samples are integration fragments: create the matching project, install the named packages, and provide the services/models identified below."
                  : "Use the matching tool in a disposable learning environment. Browser SQL uses SQLite; provider-specific SQL is reference code. Cloud and infrastructure examples require your own authorized account, configuration, and real resource names."}
              </p>
              <p lang="bn">
                {l.lang === "csharp"
                  ? "সাধারণ C# শেখার জন্য .NET SDK ও console project দরকার। Framework-এর উদাহরণে আসল project, package, data model ও service যুক্ত করতে হবে। এখানে walkthrough চলে, C# compiler নয়।"
                  : "কমান্ডের tool ও শেখার পরিবেশ আগে প্রস্তুত করুন। এখানে simulation আসল machine বা cloud বদলায় না। SQL module-এর query browser-এর SQLite-এ সত্যি চলে।"}
              </p>
            </div>
          </section>
          <DeepReference key={l.id} lesson={l} lang={lang} />
          <section className="reader-section mistakes-section">
            <div className="section-kicker">04 / AVOID THE TRAP · ভুল এড়ান</div>
            <h2>
              <AlertTriangle size={20} />
              {bn ? "সাধারণ ভুল ও সীমা · " : ""}Common mistake
            </h2>
            <Pair en={l.caution} bn={l.warningBn} lang={lang} />
            {l.incident && (
              <div className="incident-fix">
                <h3>{l.incident.solution}</h3>
                <p>{l.incident.implementation}</p>
              </div>
            )}
            <details>
              <summary>
                Before calling it production-ready / বাস্তবে ব্যবহারের আগে
              </summary>
              <ul>
                <li>
                  Test empty, missing, invalid, and boundary inputs. / খালি, ভুল
                  ও সীমার input পরীক্ষা।
                </li>
                <li>
                  Check concurrency, timeouts, and repeated calls where
                  applicable. / একইসাথে কাজ, timeout ও পুনরাবৃত্তি।
                </li>
                <li>
                  Protect identities, credentials, data, and resource ownership.
                  / পরিচয়, গোপন তথ্য ও মালিকানা।
                </li>
                <li>
                  Measure the actual bottleneck and recovery behavior. / আসল
                  বাধা ও পুনরুদ্ধার মাপুন।
                </li>
              </ul>
            </details>
          </section>
          <section id="practice" className="reader-section practice-section">
            <div className="section-kicker">
              05 / CHECK YOUR UNDERSTANDING · যাচাই
            </div>
            <h2>
              <HelpCircle size={21} />
              {bn ? "সঠিক ধারণাটি বেছে নিন · " : ""}Which statement is correct?
            </h2>
            <p className="muted">
              Topic: {l.topic}. Select one answer; read the reason before moving
              on.
            </p>
            <div className="quiz-options">
              {options.map((o, i) => (
                <button
                  key={i}
                  className={
                    answer === i ? (o.correct ? "correct" : "incorrect") : ""
                  }
                  onClick={() => setAnswer(i)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  <div>
                    <Pair en={o.text} bn={o.bn} lang={lang} />
                  </div>
                  {answer === i &&
                    (o.correct ? <CheckCircle2 size={18} /> : <X size={18} />)}
                </button>
              ))}
            </div>
            {answer !== null && (
              <div
                className={
                  "quiz-feedback " +
                  (options[answer].correct ? "correct" : "incorrect")
                }
                role="status"
              >
                <strong>
                  {options[answer].correct
                    ? "Correct · ঠিক ধরেছেন"
                    : "Try again · আবার ভাবুন"}
                </strong>
                <Pair
                  en={
                    options[answer].correct
                      ? l.en
                      : "This statement ignores limitations and failure conditions. Review the topic intuition and the common mistake. The example cannot guarantee safety or success in every environment."
                  }
                  bn={
                    options[answer].correct
                      ? l.bn
                      : "সব পরিবেশে সফলতা বা নিরাপত্তার নিশ্চয়তা এই code দেয় না। বিষয়ের ধারণা ও সাধারণ ভুল আবার পড়ুন।"
                  }
                  lang={lang}
                />
              </div>
            )}
            <h3 className="practice-title">
              Three ways to practice · তিন ধাপের অনুশীলন
            </h3>
            <div className="practice-cards">
              <div>
                <span className="tier tier0">EASY</span>
                <h4>Explain it / বুঝিয়ে বলুন</h4>
                <p>
                  Explain {l.topic} to a friend using the everyday analogy. /
                  বাস্তব তুলনা দিয়ে বন্ধুকে বুঝিয়ে বলুন।
                </p>
              </div>
              <div>
                <span className="tier tier1">MEDIUM</span>
                <h4>Trace it / হাতে চালান</h4>
                <p>
                  Write the state after each of the {l.lines.length} code lines.
                  Change one input and predict what changes. / প্রতি লাইনের পরে
                  কী বদলায় লিখুন।
                </p>
              </div>
              <div>
                <span className="tier tier2">HARD</span>
                <h4>Challenge it / সীমা পরীক্ষা</h4>
                <p>
                  Find an input or environment where the example is
                  insufficient. Use the common mistake as a clue. / কোথায়
                  উদাহরণটি যথেষ্ট নয়, বলুন।
                </p>
              </div>
            </div>
            <button
              className="secondary"
              onClick={() => setShowAnswer((x) => !x)}
            >
              {showAnswer ? "Hide" : "Show"} model answer / নমুনা উত্তর
            </button>
            {showAnswer && (
              <div className="model-answer">
                <h3>Self-check guide · উত্তর মিলিয়ে নিন</h3>
                <Pair en={l.en} bn={l.bn} lang={lang} />
                <ol>
                  {l.lines.map((line, i) => (
                    <li key={i}>
                      <Pair en={line.en} bn={line.bn} lang={lang} />
                    </li>
                  ))}
                </ol>
                <strong>Limit / সীমা:</strong>
                <Pair en={l.caution} bn={l.warningBn} lang={lang} />
              </div>
            )}
          </section>
          <section className="reader-section references">
            <div className="section-kicker">06 / KEEP EXPLORING · আরও শিখুন</div>
            <h2>Read the original documentation</h2>
            <p lang="bn">
              Package ও version বদলালে নিয়ম বদলাতে পারে। সরকারি documentation-এর
              বর্তমান উদাহরণ মিলিয়ে দেখুন।
            </p>
            <a href={l.docs[1]} target="_blank" rel="noreferrer">
              {l.docs[0]}
              <ExternalLink size={14} />
            </a>
          </section>
          <div id="notes">
            <TopicNotes key={l.id} lesson={l} lang={lang} />
          </div>
          <div className="lesson-end">
            <button
              className="secondary"
              disabled={l.index === 0}
              onClick={() => selectTopic(l.index - 1)}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              className="secondary"
              onClick={() =>
                top.current?.scrollTo({ top: 0, behavior: "smooth" })
              }
            >
              <ArrowUp size={15} />
              Top
            </button>
            <button className="primary" onClick={l.index === l.module.topics.length - 1 ? close : next}>
              {l.index === l.module.topics.length - 1
                ? "Back to roadmap"
                : "Next concept"}
              <ArrowRight size={16} />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
