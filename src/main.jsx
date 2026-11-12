import React, { useState, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  GitBranch,
  Terminal,
  Database,
  Network,
  Boxes,
  Shield,
  Cloud,
  Workflow,
  BrainCircuit,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  CheckCircle2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  X,
  Command,
  Flame,
  LayoutDashboard,
  Map,
  PanelLeftClose,
  Sparkles,
  Target,
  Clock,
  Layers,
  ExternalLink,
} from "lucide-react";
import ThemeToggle, { ThemeProvider } from "./components/ThemeToggle";
import modules from "./curriculum.json";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/noto-sans-bengali/bengali-400.css";
import "@fontsource/noto-sans-bengali/bengali-500.css";
import "./style.css";
import { allLessons } from "./content/lessons";
const LessonReader = lazy(() => import("./components/LessonReader"));
const Notebook = lazy(() => import("./components/Notebook"));
const PracticeLab = lazy(() => import("./components/PracticeLab"));
const BeginnerGuide = lazy(() => import("./components/BeginnerGuide"));
const Sandbox = lazy(() => import("./components/Sandbox"));
const icons = [
  GitBranch,
  Terminal,
  Database,
  Network,
  Boxes,
  Code2,
  Shield,
  Layers,
  Network,
  Map,
  Target,
  Boxes,
  Workflow,
  Cloud,
  Workflow,
  BrainCircuit,
  Sparkles,
];
const stages = [
  "Foundations",
  "Software Engineering",
  "Systems, Cloud & DevOps",
  "AI Engineering",
];
const levels = ["All levels", "Beginner", "Intermediate", "Advanced"];
function readRoute() {
  const match = window.location.hash.match(/^#lesson\/(\d+)\/(\d+)$/);
  if (!match) return null;
  const m = modules[+match[1]],
    t = +match[2];
  return m && t >= 0 && t < m.topics.length ? { m, t } : null;
}
function useLessonRoute() {
  const [value, setValue] = useState(readRoute);
  useEffect(() => {
    const sync = () => setValue(readRoute());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const update = (v) => {
    setValue(v);
    const hash = v ? "#lesson/" + v.m.id + "/" + v.t : "";
    if (window.location.hash !== hash) window.location.hash = hash;
  };
  return [value, update];
}
function App() {
  const [page, setPage] = useState("Learning path"),
    [stage, setStage] = useState(-1),
    [level, setLevel] = useState("All levels"),
    [lang, setLang] = useState(() => {
      try {
        return localStorage.getItem("mastery-language") || "বাংলা + EN";
      } catch {
        return "বাংলা + EN";
      }
    }),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState(false),
    [lesson, setLesson] = useLessonRoute(),
    [done, setDone] = useState(() => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("mastery-progress") || "[]",
        );
        return Array.isArray(saved)
          ? [
              ...new Set(
                saved.filter(
                  (x) => typeof x === "string" && /^\d+-\d+$/.test(x),
                ),
              ),
            ]
          : [];
      } catch {
        return [];
      }
    }),
    [view, setView] = useState("grid"),
    [sandboxKey, setSandboxKey] = useState(0);
  useEffect(() => {
    const go = () => {
      setLesson(null);
      setPage("Sandbox");
      setSandboxKey((k) => k + 1);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("open-sandbox", go);
    return () => window.removeEventListener("open-sandbox", go);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("mastery-progress", JSON.stringify(done));
    } catch {}
  }, [done]);
  useEffect(() => {
    let f = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
      if (e.key === "Escape") {
        setSearch(false);
        setLesson(null);
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("mastery-language", lang);
    } catch {}
  }, [lang]);
  const open = (m, t = 0) => setLesson({ m, t });
  const mark = () => {
    let k = `${lesson.m.id}-${lesson.t}`;
    setDone((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));
  };
  let shown = modules.filter(
    (m) =>
      (stage < 0 || m.stage === stage) &&
      (!query ||
        `${m.title} ${m.topics.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  let pct = Math.round((done.length / allLessons.length) * 100);
  return (
    <div className="app">
      <aside inert={!!lesson || search}>
        <a
          className="brand"
          href="#"
          onClick={() => {
            setPage("Learning path");
            setStage(-1);
          }}
        >
          <span className="brandmark">⌘</span>
          <span>
            .NET<span className="light">mastery</span>
            <small>LEARN. BUILD. LEVEL UP.</small>
          </span>
        </a>
        <div className="workspace">
          <span className="workspace-icon">⌘</span>
          <div>
            My learning workspace<small>Personal workspace</small>
          </div>
          <ChevronDown size={14} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {[
            [LayoutDashboard, "Overview"],
            [BookOpen, "Beginner guide"],
            [Map, "Learning path"],
            [Code2, "Playground"],
            [Terminal, "Sandbox"],
            [BookOpen, "My notebook"],
          ].map(([I, n]) => (
            <button
              key={n}
              className={page === n ? "active" : ""}
              onClick={() => {
                setPage(n);
                setStage(-1);
                setQuery("");
              }}
            >
              <I size={18} />
              {n}
              {n === "Learning path" && <span className="tiny">{modules.length}</span>}
              {n === "Sandbox" && <span className="new">NEW</span>}
            </button>
          ))}
        </nav>
        <div className="nav-label stages-label">YOUR LEARNING JOURNEY</div>
        <div className="stage-nav">
          {stages.map((s, i) => (
            <button
              key={s}
              className={stage === i ? "chosen" : ""}
              onClick={() => {
                setStage(i);
                setPage("Learning path");
              }}
            >
              <span className={"stage-dot c" + i}></span>
              <span>
                {s}
                <small>STAGE 0{i + 1}</small>
              </span>
              <ChevronRight size={13} />
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="daily">
            <span>
              <Flame size={16} /> A little better, every day
            </span>
            <p>
              Your next breakthrough starts
              <br />
              with one more lesson.
            </p>
            <div className="days">
              {"MTWTFSS".split("").map((x, i) => (
                <span className={i < 3 ? "filled" : ""} key={i}>
                  {i < 3 ? <Check size={10} /> : x}
                </span>
              ))}
            </div>
          </div>
          <div className="profile">
            <span className="avatar">Y</span>
            <div>
              Your workspace<small>Future .NET engineer</small>
            </div>
            <span className="online" />
          </div>
        </div>
      </aside>
      <div className="shell" inert={!!lesson || search}>
        <header>
          <div className="breadcrumb">
            Workspace <ChevronRight size={13} />
            <strong>{page}</strong>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <button className="search-trigger" onClick={() => setSearch(true)}>
              <Search size={15} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {["বাংলা + EN", "English", "বাংলা"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <span className="header-divider" />
            <span className="avatar small">Y</span>
          </div>
        </header>
        <nav className="mobile-navigation" aria-label="Mobile workspace">
          {[
            ["Learning path", "Roadmap"],
            ["Beginner guide", "Start here"],
            ["Playground", "Lab"],
            ["Sandbox", "Run code"],
            ["My notebook", "Notes"],
          ].map(([p, n]) => (
            <button
              key={p}
              className={page === p ? "selected" : ""}
              onClick={() => {
                setPage(p);
                setStage(-1);
                setQuery("");
              }}
            >
              {n}
            </button>
          ))}
        </nav>
        <main>
          <div className="eyebrow">
            <span className="live-dot" /> YOUR ENGINEERING JOURNEY STARTS HERE
          </div>
          <section className="intro">
            <div>
              <h1>
                {page === "Beginner guide" ? (
                  "Every expert started here."
                ) : page === "My notebook" ? (
                  "Your knowledge, connected."
                ) : page === "Playground" ? (
                  "Learn it. Then build it."
                ) : page === "Sandbox" ? (
                  "Write it. Run it. Own it."
                ) : page === "Overview" ? (
                  "Small steps. Real progress."
                ) : (
                  <>
                    From your first line of code
                    <br />
                    to <em>production-ready.</em>
                  </>
                )}
              </h1>
              <p>
                {lang === "বাংলা" ? (
                  "শুরু থেকে শিখুন, কোড লিখুন, আত্মবিশ্বাসের সাথে এগিয়ে যান।"
                ) : (
                  <>
                    A clear path to mastering C#, .NET, and modern software
                    engineering.
                    <br />
                    Learn in Bangla + English. Understand visually. Build with
                    confidence.
                  </>
                )}
              </p>
            </div>
            <div className="orbit-art" aria-hidden="true">
              <div className="orbit o1" />
              <div className="orbit o2" />
              <div className="orbit o3" />
              <span className="orb a">{"</>"}</span>
              <span className="orb b">C#</span>
              <span className="orb c">◇</span>
              <span className="core">
                .NET<small>YOUR NEXT CHAPTER</small>
              </span>
              <span className="star s1">✦</span>
              <span className="star s2">+</span>
            </div>
          </section>
          <div className="stats">
            {[
              [Layers, String(modules.length), "in-depth modules"],
              [Code2, String(allLessons.length), "concepts to explore"],
              [Target, "3", "levels of mastery"],
              [GitBranch, "One", "connected learning path"],
            ].map(([I, v, l]) => (
              <div className="stat" key={l}>
                <span className="stat-icon">
                  <I size={19} />
                </span>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <section className="continue">
            <div className="continue-icon">
              <GitBranch size={27} />
            </div>
            <div>
              <div className="micro">
                {done.length ? "KEEP THE MOMENTUM" : "A GREAT PLACE TO START"}{" "}
                <span>•</span> STAGE 01
              </div>
              <h3>
                {done.length
                  ? "Your next step is waiting"
                  : "Your journey begins with Git"}
              </h3>
              <p>
                {lang === "English"
                  ? "Start with the fundamentals. Build something extraordinary."
                  : "ছোট ছোট পদক্ষেপে বড় কিছু। One concept at a time."}
              </p>
            </div>
            <div className="continue-right">
              <button
                className="primary"
                onClick={() =>
                  (() => {
                    const m =
                      modules.find((m) =>
                        m.topics.some((_, t) => !done.includes(`${m.id}-${t}`)),
                      ) || modules[0];
                    open(
                      m,
                      Math.max(
                        0,
                        m.topics.findIndex(
                          (_, t) => !done.includes(`${m.id}-${t}`),
                        ),
                      ),
                    );
                  })()
                }
              >
                {done.length ? "Continue learning" : "Start learning"}
                <ArrowRight size={16} />
              </button>
              <small>No experience needed. Just curiosity.</small>
            </div>
          </section>
          {page === "Beginner guide" ? (
            <BeginnerGuide lang={lang} />
          ) : page === "Playground" ? (
            <PracticeLab lang={lang} />
          ) : page === "Sandbox" ? (
            <Sandbox key={sandboxKey} lang={lang} />
          ) : page === "My notebook" ? (
            <Notebook onOpen={open} />
          ) : (
            <>
              <section className="path-heading">
                <div>
                  <h2>
                    {page === "Overview"
                      ? "Your progress"
                      : "Your learning path"}{" "}
                    <span className="pill">THE COMPLETE ROADMAP</span>
                  </h2>
                  <p>
                    {page === "Overview"
                      ? `${done.length} concepts completed · ${pct}% of your engineering journey`
                      : "Four stages. Real-world skills. A stronger engineer at every step."}
                  </p>
                </div>
                <div className="overall">
                  <span>
                    Overall progress <b>{pct}%</b>
                  </span>
                  <div className="track">
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  <small>
                    {done.length} of {allLessons.length} concepts completed
                  </small>
                </div>
              </section>
              <div className="filters">
                <div className="stage-tabs">
                  <button
                    className={stage === -1 ? "selected" : ""}
                    onClick={() => setStage(-1)}
                  >
                    All stages <span>{modules.length}</span>
                  </button>
                  {stages.map((s, i) => (
                    <button
                      key={s}
                      className={stage === i ? "selected" : ""}
                      onClick={() => setStage(i)}
                    >
                      <span className={"stage-dot c" + i} />
                      {
                        [
                          "Foundations",
                          "Engineering",
                          "System Design & Cloud",
                          "Agentic AI",
                        ][i]
                      }
                    </button>
                  ))}
                </div>
                <div className="filter-tools">
                  <select
                    aria-label="Skill level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {levels.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                  <button
                    aria-label="Toggle list view"
                    onClick={() =>
                      setView((v) => (v === "grid" ? "list" : "grid"))
                    }
                  >
                    <LayoutDashboard size={17} />
                  </button>
                </div>
              </div>
              {stage < 0 ? (
                <>
                  {stages.map((s, i) => (
                    <ModuleSection
                      key={s}
                      title={s}
                      index={i}
                      items={shown.filter((m) => m.stage === i)}
                      done={done}
                      open={open}
                      level={level}
                      view={view}
                    />
                  ))}
                </>
              ) : (
                <ModuleSection
                  title={stages[stage]}
                  index={stage}
                  items={shown}
                  done={done}
                  open={open}
                  level={level}
                  view={view}
                />
              )}
            </>
          )}
          <footer>
            <span className="brand-footer">⌘ .NETmastery</span>
            <span>
              Built for curious minds. Made for real-world engineering.
            </span>
            <span className="footer-tag">
              <span className="live-dot" /> LEARNING IS A SUPERPOWER
            </span>
            <div className="footer-credit">
              <span>Created by</span>
              <strong>Eftekher Ali Efte</strong>
              <span className="footer-credit-meta">
                CSE, RUET · Software Engineer at National Bank PLC · Ex-Notre Damian
              </span>
            </div>
          </footer>
        </main>
      </div>
      {search && (
        <div className="modal-shade" onClick={() => setSearch(false)}>
          <div
            className="command-modal"
            role="dialog"
            aria-label="Search curriculum"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-input">
              <Search size={21} />
              <input
                autoFocus
                placeholder={`Search ${allLessons.length} concepts, commands, and modules...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => setSearch(false)}>
                <X size={19} />
              </button>
            </div>
            <div className="search-results">
              {allLessons
                .map((l) => ({
                  m: l.module,
                  t: l.topic,
                  i: l.index,
                  searchText: l.en + " " + l.bn,
                }))
                .filter((x) =>
                  `${x.m.title} ${x.t} ${x.searchText}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .slice(0, 30)
                .map((x) => (
                  <button
                    key={`${x.m.id}-${x.i}`}
                    onClick={() => {
                      open(x.m, x.i);
                      setSearch(false);
                      setQuery("");
                    }}
                  >
                    <Code2 size={17} />
                    <span>
                      {x.t}
                      <small>{x.m.title}</small>
                    </span>
                    <ArrowUpRight size={15} />
                  </button>
                ))}
            </div>
            <div className="search-foot">
              Search the complete curriculum <kbd>ESC to close</kbd>
            </div>
          </div>
        </div>
      )}
      {lesson && (
        <LessonReader
          lesson={lesson}
          close={() => setLesson(null)}
          lang={lang}
          onLanguageChange={setLang}
          initialLevel={level}
          completed={done.includes(`${lesson.m.id}-${lesson.t}`)}
          mark={mark}
          selectTopic={(i) => setLesson({ ...lesson, t: i })}
          next={() =>
            setLesson({ ...lesson, t: (lesson.t + 1) % lesson.m.topics.length })
          }
        />
      )}
    </div>
  );
}
function ModuleSection({ title, index, items, done, open, level, view }) {
  if (!items.length) return null;
  return (
    <section className="module-section">
      <div className="stage-heading">
        <span className={"stage-number c" + index}>0{index + 1}</span>
        <div>
          <h3>{title}</h3>
          <p>
            {
              [
                "Get comfortable with the tools. Build the fundamentals.",
                "Write better software. Bring your ideas to life.",
                "Think at scale. Build systems that last.",
                "Explore intelligent software and the next frontier.",
              ][index]
            }
          </p>
        </div>
        <span className={"tier tier" + index}>
          {["BEGINNER", "INTERMEDIATE", "ADVANCED", "NEXT GENERATION"][index]}
        </span>
        <span className="stage-line" />
        <span className="module-count">{items.length} modules</span>
      </div>
      <div className={"modules " + view}>
        {items.map((m) => {
          let I = icons[m.id],
            n = done.filter((x) => x.startsWith(m.id + "-")).length;
          return (
            <article className={"module-card accent" + m.stage} key={m.id}>
              <div className="card-top">
                <span className={"module-icon c" + m.stage}>
                  <I size={25} />
                </span>
                <span className="module-id">
                  MODULE {String(m.id + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight size={17} className="card-arrow" />
              </div>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <div className="topic-chips">
                {m.topics.slice(0, 3).map((t) => (
                  <span key={t}>{t.split(" — ")[0]}</span>
                ))}
                <span>+{m.topics.length - 3}</span>
              </div>
              <div className="card-meta">
                <span>
                  <BookOpen size={13} />
                  {m.topics.length} concepts
                </span>
                <span>
                  <Layers size={13} />
                  {level === "All levels" ? "3 levels" : level}
                </span>
                <span>
                  <Code2 size={13} />
                  Interactive
                </span>
              </div>
              <div className="track">
                <i style={{ width: `${(n / m.topics.length) * 100}%` }} />
              </div>
              <div className="card-bottom">
                <span>{n ? `${n}/${m.topics.length} completed` : "Ready when you are"}</span>
                <button onClick={() => open(m)}>
                  {n ? "Continue module" : "Explore module"}
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
createRoot(document.getElementById("root")).render(
  <Suspense
    fallback={
      <div className="loading-screen">
        Loading your learning workspace… / শেখার ঘর প্রস্তুত হচ্ছে…
      </div>
    }
  >
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Suspense>,
);
