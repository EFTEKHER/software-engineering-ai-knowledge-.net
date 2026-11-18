import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Lightbulb,
  ListVideo,
  MessageCircleQuestion,
  Play,
  PlayCircle,
  Search,
  Server,
  TriangleAlert,
  Trophy,
  Wrench,
} from "lucide-react";
import {
  bankDbSetup,
  chapters,
  parts,
  quizzes,
} from "../content/sqlMastery/index.js";
import { episodeMinutes } from "../content/sqlMastery/episodes.js";
import { CodeBlock } from "./sqlm/highlight.jsx";
import Player from "./sqlm/Player.jsx";
import "./sqlServerMastery.css";

const HASH = "#sql-server";
const STORE = "sqlm-progress-v2";

/* ---------------- routing ---------------- */
// #sql-server                 -> course home
// #sql-server/<module>        -> first episode of the module
// #sql-server/<module>/<n>    -> episode n (1-based)
// #sql-server/<module>/quiz   -> module quiz
function readRoute() {
  const m = window.location.hash.match(
    /^#sql-server\/([\w-]+)(?:\/(\d+|quiz))?$/,
  );
  if (!m) return null;
  const chapter = chapters.find((c) => c.slug === m[1]);
  if (!chapter) return null;
  if (m[2] === "quiz") return { slug: chapter.slug, ep: "quiz" };
  const n = m[2] ? +m[2] - 1 : 0;
  return {
    slug: chapter.slug,
    ep: Math.min(Math.max(n, 0), chapter.sections.length - 1),
  };
}
const routeHash = (r) =>
  r ? `${HASH}/${r.slug}/${r.ep === "quiz" ? "quiz" : r.ep + 1}` : HASH;

const ROMAN = ["0", "I", "II", "III", "IV", "V"];
const epKey = (slug, i) => `${slug}:${i}`;

/* ---------------- shared bits ---------------- */
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
  trap: { icon: TriangleAlert, en: "Watch out", bn: "সাবধান" },
  tip: { icon: Wrench, en: "Pro tip", bn: "প্রো টিপ" },
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

function searchText(c) {
  return [
    c.title,
    c.titleBn,
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
  const [route, setRoute] = useState(readRoute);
  const [autoStart, setAutoStart] = useState(false);
  const [progress, setProgress] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem(STORE) || "{}");
      return {
        watched: Array.isArray(p.watched)
          ? p.watched.filter((x) => typeof x === "string")
          : [],
        quiz: p.quiz && typeof p.quiz === "object" ? p.quiz : {},
      };
    } catch {
      return { watched: [], quiz: {} };
    }
  });
  const topRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash.startsWith(HASH)) setRoute(readRoute());
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const allEpisodes = useMemo(
    () =>
      chapters.flatMap((c) =>
        c.sections.map((_, i) => ({ slug: c.slug, ep: i })),
      ),
    [],
  );
  const minutes = useMemo(() => {
    const m = {};
    chapters.forEach((c) =>
      c.sections.forEach(
        (_, i) => (m[epKey(c.slug, i)] = episodeMinutes(c, i)),
      ),
    );
    return m;
  }, []);
  const watched = new Set(progress.watched);

  function open(next, { autoplay = false } = {}) {
    setAutoStart(autoplay);
    const hash = routeHash(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    setRoute(next);
    requestAnimationFrame(() => {
      const el = topRef.current;
      if (el) {
        el.focus({ preventScroll: true });
        el.scrollIntoView({ block: "start" });
      }
    });
  }
  const markWatched = (slug, i, value = true) =>
    setProgress((p) => {
      const k = epKey(slug, i);
      const has = p.watched.includes(k);
      if (has === value) return p;
      return {
        ...p,
        watched: value ? [...p.watched, k] : p.watched.filter((x) => x !== k),
      };
    });
  const saveQuiz = (slug, score) =>
    setProgress((p) => ({
      ...p,
      quiz: { ...p.quiz, [slug]: Math.max(score, p.quiz[slug] || 0) },
    }));

  const nextUnwatched =
    allEpisodes.find((e) => !watched.has(epKey(e.slug, e.ep))) ||
    allEpisodes[0];

  return (
    <section className="sqlm" aria-labelledby="sqlm-title">
      <div ref={topRef} tabIndex={-1} className="sqlm-anchor" />
      {route ? (
        <Watch
          route={route}
          mode={mode}
          watched={watched}
          minutes={minutes}
          quizScores={progress.quiz}
          autoStart={autoStart}
          open={open}
          markWatched={markWatched}
          saveQuiz={saveQuiz}
        />
      ) : (
        <Home
          mode={mode}
          watched={watched}
          minutes={minutes}
          quizScores={progress.quiz}
          open={open}
          nextUnwatched={nextUnwatched}
          totalEpisodes={allEpisodes.length}
        />
      )}
    </section>
  );
}

/* ---------------- course home ---------------- */
function Home({
  mode,
  watched,
  minutes,
  quizScores,
  open,
  nextUnwatched,
  totalEpisodes,
}) {
  const [query, setQuery] = useState("");
  const index = useMemo(
    () => new Map(chapters.map((c) => [c.slug, searchText(c)])),
    [],
  );
  const q = query.trim().toLowerCase();
  const visible = q
    ? chapters.filter((c) => index.get(c.slug).includes(q))
    : chapters;
  const totalMin = Object.values(minutes).reduce((a, b) => a + b, 0);
  const started = watched.size > 0;
  const nextChapter = chapters.find((c) => c.slug === nextUnwatched.slug);

  return (
    <>
      <header className="sqlm-hero">
        <span className="sqlm-badge">
          <Server size={15} aria-hidden="true" /> Microsoft SQL Server · T-SQL
          only
        </span>
        <h1 id="sqlm-title">SQL Server Mastery</h1>
        {mode !== "bn" && (
          <p className="sqlm-hero-sub">
            A zero-to-pro SQL course you watch like a YouTube playlist. Short
            episodes, one simple idea at a time, every line of code explained —
            from your very first SELECT to execution plans and query
            optimization.
          </p>
        )}
        {mode !== "en" && (
          <p className="sqlm-hero-sub sqlm-bn" lang="bn">
            একদম শূন্য থেকে প্রো — YouTube প্লেলিস্টের মতো দেখে শিখুন। ছোট ছোট এপিসোড,
            একবারে একটি সহজ ধারণা, কোডের প্রতিটি লাইনের ব্যাখ্যা — প্রথম SELECT থেকে
            execution plan ও query optimization পর্যন্ত।
          </p>
        )}
        <ul className="sqlm-stats" aria-label="Course size">
          <li>
            <strong>{chapters.length}</strong> modules
          </li>
          <li>
            <strong>{totalEpisodes}</strong> episodes
          </li>
          <li>
            <strong>~{Math.round(totalMin / 60)}</strong> hours
          </li>
          <li>
            <strong>{chapters.length}</strong> quizzes
          </li>
          <li>
            <strong>
              {watched.size}/{totalEpisodes}
            </strong>{" "}
            watched
          </li>
        </ul>
        <div className="sqlm-hero-actions">
          <button
            type="button"
            className="sqlm-primary"
            onClick={() =>
              open(started ? nextUnwatched : { slug: "start-here", ep: 0 })
            }
          >
            <PlayCircle size={18} aria-hidden="true" />
            {started
              ? `Continue: Ep ${nextChapter.id}.${nextUnwatched.ep + 1}`
              : "Start here — Episode 0.1"}
          </button>
          <button type="button" onClick={downloadSetup}>
            <Download size={16} aria-hidden="true" /> Download BankDB setup
            script
          </button>
        </div>
      </header>

      <section className="sqlm-how" aria-labelledby="sqlm-how-title">
        <h2 id="sqlm-how-title">
          {mode === "bn" ? "কীভাবে শিখবেন" : "How this course works"}
        </h2>
        <ol>
          {[
            [
              "Watch",
              "দেখুন",
              "Press play. Each episode is 1–3 minutes: a story, the idea, then the code line by line.",
            ],
            [
              "Type",
              "টাইপ করুন",
              "Open SSMS and type the episode's code yourself. Press F5.",
            ],
            [
              "Change",
              "বদলান",
              "Change one number or condition and run again. See what changes.",
            ],
            [
              "Quiz",
              "কুইজ",
              "Finish each module with a two-question quiz to lock it in.",
            ],
          ].map(([t, tb, d], n) => (
            <li key={t}>
              <span className="sqlm-step">{n + 1}</span>
              <strong>
                {mode === "bn" ? tb : t}
                {mode === "both" && <small lang="bn"> · {tb}</small>}
              </strong>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="sqlm-home-search">
        <label className="sqlm-search">
          <Search size={15} aria-hidden="true" />
          <span className="sqlm-sr">Search SQL lessons</span>
          <input
            type="search"
            placeholder="Search any topic or keyword… (e.g. NOLOCK, LEFT JOIN, index)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {q && (
          <p className="sqlm-hits" role="status">
            {visible.length} {visible.length === 1 ? "module" : "modules"} match
          </p>
        )}
      </div>

      <div className="sqlm-tracks">
        {parts.map((p, pi) => {
          const list = visible.filter((c) => c.part === pi);
          if (!list.length) return null;
          return (
            <section
              key={p.title}
              className="sqlm-track"
              aria-labelledby={"sqlm-track-" + pi}
            >
              <header>
                <span className="sqlm-track-num">{pi === 0 ? "★" : pi}</span>
                <div>
                  <h2 id={"sqlm-track-" + pi}>
                    {pi === 0 ? p.title : `Track ${pi} · ${p.title}`}
                  </h2>
                  {mode !== "en" && (
                    <small lang="bn" className="sqlm-bn">
                      {p.titleBn}
                    </small>
                  )}
                  <p>{mode === "bn" ? p.goalBn : p.goal}</p>
                </div>
              </header>
              <div className="sqlm-mods">
                {list.map((c) => {
                  const done = c.sections.filter((_, i) =>
                    watched.has(epKey(c.slug, i)),
                  ).length;
                  const mins = c.sections.reduce(
                    (a, _, i) => a + minutes[epKey(c.slug, i)],
                    0,
                  );
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      className="sqlm-modcard"
                      onClick={() => open({ slug: c.slug, ep: 0 })}
                      aria-label={`Module ${c.id}: ${c.title}`}
                    >
                      <span className="sqlm-modnum">{c.id}</span>
                      <span className="sqlm-modbody">
                        <strong>{c.title}</strong>
                        {mode !== "en" && <small lang="bn">{c.titleBn}</small>}
                        <span className="sqlm-meta">
                          <span>
                            <ListVideo size={13} aria-hidden="true" />{" "}
                            {c.sections.length} episodes
                          </span>
                          <span>
                            <Clock size={13} aria-hidden="true" /> {mins} min
                          </span>
                          <span
                            className={
                              "sqlm-level sqlm-level-" + c.level.toLowerCase()
                            }
                          >
                            {c.level}
                          </span>
                          {quizScores[c.slug] != null && (
                            <span>
                              <Trophy size={13} aria-hidden="true" />{" "}
                              {quizScores[c.slug]}/
                              {(quizzes[c.slug] || []).length}
                            </span>
                          )}
                        </span>
                        <span className="sqlm-bar" aria-hidden="true">
                          <span
                            style={{
                              width: (done / c.sections.length) * 100 + "%",
                            }}
                          />
                        </span>
                      </span>
                      {done === c.sections.length ? (
                        <CheckCircle2
                          size={20}
                          className="sqlm-modcheck"
                          aria-label="Completed"
                        />
                      ) : (
                        <Play
                          size={18}
                          className="sqlm-modplay"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        {!visible.length && (
          <p className="sqlm-empty">No module matches “{query}”.</p>
        )}
      </div>

      <details className="sqlm-setup">
        <summary>
          <BookOpenText size={16} aria-hidden="true" /> View the BankDB setup
          script
        </summary>
        <CodeBlock code={bankDbSetup} label="BankDB-setup.sql · SQL Server" />
      </details>
    </>
  );
}

/* ---------------- watch page ---------------- */
function Watch({
  route,
  mode,
  watched,
  minutes,
  quizScores,
  autoStart,
  open,
  markWatched,
  saveQuiz,
}) {
  const chapter = chapters.find((c) => c.slug === route.slug);
  const position = chapters.indexOf(chapter);
  const isQuiz = route.ep === "quiz";
  const ep = isQuiz ? chapter.sections.length : route.ep;
  const section = isQuiz ? null : chapter.sections[ep];
  const quiz = quizzes[chapter.slug] || [];

  // Linear order: every episode, then the module quiz, then the next module.
  const nextRoute = isQuiz
    ? chapters[position + 1] && { slug: chapters[position + 1].slug, ep: 0 }
    : ep < chapter.sections.length - 1
      ? { slug: chapter.slug, ep: ep + 1 }
      : { slug: chapter.slug, ep: "quiz" };
  const prevRoute = isQuiz
    ? { slug: chapter.slug, ep: chapter.sections.length - 1 }
    : ep > 0
      ? { slug: chapter.slug, ep: ep - 1 }
      : chapters[position - 1] && {
          slug: chapters[position - 1].slug,
          ep: "quiz",
        };
  const labelOf = (r) => {
    if (!r) return "";
    const c = chapters.find((x) => x.slug === r.slug);
    return r.ep === "quiz"
      ? `Module ${c.id} quiz`
      : `Ep ${c.id}.${r.ep + 1} · ${c.sections[r.ep].title}`;
  };
  const watchedHere = chapter.sections.filter((_, i) =>
    watched.has(epKey(chapter.slug, i)),
  ).length;

  return (
    <>
      <nav className="sqlm-crumbs" aria-label="Breadcrumb">
        <button type="button" onClick={() => open(null)}>
          <ArrowLeft size={15} aria-hidden="true" /> All modules
        </button>
        <span>
          {chapter.part === 0
            ? parts[0].title
            : `Track ${chapter.part} · ${parts[chapter.part].title}`}
        </span>
      </nav>

      <div className="sqlm-watch">
        <div className="sqlm-watch-main">
          {isQuiz ? (
            <Quiz
              key={chapter.slug}
              chapter={chapter}
              questions={quiz}
              mode={mode}
              best={quizScores[chapter.slug]}
              onScore={(n) => saveQuiz(chapter.slug, n)}
              onNext={nextRoute ? () => open(nextRoute) : null}
              nextLabel={labelOf(nextRoute)}
            />
          ) : (
            <Player
              key={chapter.slug + ":" + ep + ":" + mode}
              chapter={chapter}
              index={ep}
              mode={mode}
              autoStart={autoStart}
              onEnded={() => markWatched(chapter.slug, ep)}
              onNext={
                nextRoute
                  ? (auto) =>
                      open(nextRoute, {
                        autoplay: auto && nextRoute.ep !== "quiz",
                      })
                  : null
              }
              nextLabel={labelOf(nextRoute)}
            />
          )}

          <div className="sqlm-epinfo">
            <h1 id="sqlm-title" className="sqlm-eptitle">
              {isQuiz
                ? `Module ${chapter.id} quiz`
                : `${chapter.id}.${ep + 1} ${section.title}`}
            </h1>
            {mode !== "en" && !isQuiz && (
              <p className="sqlm-subtitle" lang="bn">
                {section.titleBn}
              </p>
            )}
            <p className="sqlm-epmeta">
              Module {chapter.id}: {chapter.title}
              {!isQuiz && (
                <>
                  {" · "}
                  <Clock size={13} aria-hidden="true" />{" "}
                  {minutes[epKey(chapter.slug, ep)]} min
                </>
              )}
            </p>
            <div className="sqlm-epactions">
              <button
                type="button"
                disabled={!prevRoute}
                onClick={() => open(prevRoute)}
              >
                <ArrowLeft size={15} aria-hidden="true" /> Previous
              </button>
              {!isQuiz && (
                <button
                  type="button"
                  className={
                    watched.has(epKey(chapter.slug, ep))
                      ? "sqlm-done is-done"
                      : "sqlm-done"
                  }
                  aria-pressed={watched.has(epKey(chapter.slug, ep))}
                  onClick={() =>
                    markWatched(
                      chapter.slug,
                      ep,
                      !watched.has(epKey(chapter.slug, ep)),
                    )
                  }
                >
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {watched.has(epKey(chapter.slug, ep))
                    ? "Watched"
                    : "Mark as watched"}
                </button>
              )}
              {nextRoute && (
                <button
                  type="button"
                  className="sqlm-primary"
                  onClick={() => open(nextRoute)}
                >
                  Next <ArrowRight size={15} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {!isQuiz && (
            <Transcript chapter={chapter} section={section} mode={mode} />
          )}
        </div>

        <section className="sqlm-playlist" aria-label="Module playlist">
          <header>
            <small>
              {chapter.part === 0 ? parts[0].title : `Track ${chapter.part}`} ·
              Module {chapter.id}
            </small>
            <strong>{chapter.title}</strong>
            {mode !== "en" && <span lang="bn">{chapter.titleBn}</span>}
            <span className="sqlm-bar" aria-hidden="true">
              <span
                style={{
                  width: (watchedHere / chapter.sections.length) * 100 + "%",
                }}
              />
            </span>
            <small>
              {watchedHere}/{chapter.sections.length} watched
            </small>
          </header>
          <ol>
            {chapter.sections.map((s, i) => {
              const now = !isQuiz && i === ep;
              const seen = watched.has(epKey(chapter.slug, i));
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    aria-current={now ? "true" : undefined}
                    onClick={() => open({ slug: chapter.slug, ep: i })}
                  >
                    <span className="sqlm-epnum">
                      {now ? (
                        <Play size={13} aria-label="Now playing" />
                      ) : seen ? (
                        <Check size={14} aria-label="Watched" />
                      ) : (
                        `${chapter.id}.${i + 1}`
                      )}
                    </span>
                    <span className="sqlm-eptext">
                      {s.title}
                      {mode !== "en" && <small lang="bn">{s.titleBn}</small>}
                    </span>
                    <span className="sqlm-epmin">
                      {minutes[epKey(chapter.slug, i)]}m
                    </span>
                  </button>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                aria-current={isQuiz ? "true" : undefined}
                onClick={() => open({ slug: chapter.slug, ep: "quiz" })}
              >
                <span className="sqlm-epnum">
                  <GraduationCap size={14} aria-hidden="true" />
                </span>
                <span className="sqlm-eptext">
                  Module quiz
                  {mode !== "en" && <small lang="bn">মডিউল কুইজ</small>}
                </span>
                <span className="sqlm-epmin">
                  {quizScores[chapter.slug] != null
                    ? `${quizScores[chapter.slug]}/${quiz.length}`
                    : `${quiz.length}Q`}
                </span>
              </button>
            </li>
          </ol>
          <label className="sqlm-jump">
            <span>Jump to another module</span>
            <select
              value={chapter.slug}
              onChange={(e) => open({ slug: e.target.value, ep: 0 })}
              aria-label="Jump to module"
            >
              {parts.map((p, pi) => (
                <optgroup
                  key={p.title}
                  label={pi === 0 ? p.title : `Track ${pi} · ${p.title}`}
                >
                  {chapters
                    .filter((c) => c.part === pi)
                    .map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.id}. {c.title}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
        </section>
      </div>
    </>
  );
}

function Transcript({ chapter, section, mode }) {
  return (
    <details className="sqlm-transcript" open>
      <summary>
        <BookOpenText size={16} aria-hidden="true" />
        {mode === "bn" ? "এপিসোডের নোট ও পুরো কোড" : "Episode notes & full code"}
      </summary>
      <Bi en={section.en} bn={section.bn} mode={mode} />
      {section.code && <CodeBlock code={section.code} />}
      {section.notes?.map((n, k) => (
        <Note key={k} note={n} mode={mode} />
      ))}
    </details>
  );
}

/* ---------------- quiz ---------------- */
function Quiz({ chapter, questions, mode, best, onScore, onNext, nextLabel }) {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const finished = answered === questions.length;
  useEffect(() => {
    if (finished) onScore(score);
  }, [finished]);

  return (
    <section className="sqlm-quiz" aria-labelledby="sqlm-quiz-title">
      <div className="sqlm-quiz-head">
        <GraduationCap size={26} aria-hidden="true" />
        <div>
          <h2 id="sqlm-quiz-title">
            {mode === "bn" ? "যাচাই করুন" : "Check what you learned"}
          </h2>
          <p>
            Module {chapter.id}: {chapter.title}
            {best != null && ` · best ${best}/${questions.length}`}
          </p>
        </div>
      </div>
      {questions.map((q, i) => {
        const picked = answers[i];
        return (
          <fieldset key={q.q} className="sqlm-question">
            <legend>
              <span className="sqlm-qnum">Q{i + 1}</span>
              {mode !== "bn" && <span>{q.q}</span>}
              {mode !== "en" && (
                <span lang="bn" className="sqlm-bn">
                  {q.qBn}
                </span>
              )}
            </legend>
            <div className="sqlm-options">
              {q.options.map((o, k) => {
                const state =
                  picked == null
                    ? ""
                    : k === q.answer
                      ? " is-right"
                      : k === picked
                        ? " is-wrong"
                        : "";
                return (
                  <button
                    key={o}
                    type="button"
                    className={"sqlm-option" + state}
                    disabled={picked != null}
                    aria-pressed={picked === k}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: k }))}
                  >
                    <span className="sqlm-optkey">{"ABCD"[k]}</span> {o}
                  </button>
                );
              })}
            </div>
            {picked != null && (
              <div
                className={
                  "sqlm-why" + (picked === q.answer ? " is-right" : " is-wrong")
                }
                role="status"
              >
                <strong>
                  {picked === q.answer ? "Correct!" : "Not quite."}
                </strong>
                <Bi en={q.why.en} bn={q.why.bn} mode={mode} />
              </div>
            )}
          </fieldset>
        );
      })}
      {finished && (
        <div className="sqlm-quiz-done">
          <Trophy size={22} aria-hidden="true" />
          <strong>
            Score: {score}/{questions.length}
          </strong>
          <button type="button" onClick={() => setAnswers({})}>
            Try again
          </button>
          {onNext && (
            <button type="button" className="sqlm-primary" onClick={onNext}>
              {nextLabel} <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
