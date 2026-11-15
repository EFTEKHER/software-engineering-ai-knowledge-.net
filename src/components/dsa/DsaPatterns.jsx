import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Captions,
  Volume2,
  VolumeX,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Youtube,
  Lightbulb,
  Radar,
  Code2,
  Gauge,
  AlertTriangle,
  MessagesSquare,
  ListChecks,
} from "lucide-react";
import Panel from "./Panels";
import { dsaPatterns, dsaLevels } from "../../content/dsa/index.js";
import "./dsa.css";

const store = {
  get(k, d) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};
const slugFromHash = () => {
  const m = window.location.hash.match(/^#dsa\/([\w-]+)/);
  return m && dsaPatterns.some((p) => p.slug === m[1]) ? m[1] : null;
};
const pad = (n) => String(n).padStart(2, "0");

// Bilingual text: [en, bn] -> respects the site language switch.
function useT(lang) {
  const mode = lang === "English" ? "en" : lang === "বাংলা" ? "bn" : "both";
  const T = (x, block) => {
    if (!Array.isArray(x)) return x;
    if (mode === "en") return x[0];
    if (mode === "bn") return <span lang="bn">{x[1]}</span>;
    return block ? (
      <>
        <span className="dsa-en">{x[0]}</span>
        <span className="dsa-bn" lang="bn">
          {x[1]}
        </span>
      </>
    ) : (
      <>
        {x[0]}{" "}
        <span className="dsa-bn-inline" lang="bn">
          · {x[1]}
        </span>
      </>
    );
  };
  return { T, mode };
}

function Player({ pattern, lang, T, mode }) {
  const { frames } = useMemo(() => pattern.trace(), [pattern]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(() => store.get("dsa-speed", 1));
  const [cc, setCc] = useState(true);
  const [voice, setVoice] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const f = frames[i];
  const line = pattern.code.tags[f.line];
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    setI(0);
    setPlaying(false);
  }, [pattern]);
  useEffect(() => store.set("dsa-speed", speed), [speed]);

  // Auto-advance (timer, or after narration when voice is on).
  useEffect(() => {
    if (!playing) return;
    if (i >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    let done = false;
    const next = () => {
      if (!done) setI((x) => Math.min(x + 1, frames.length - 1));
    };
    if (voice && canSpeak) {
      const say = Array.isArray(f.say)
        ? mode === "bn"
          ? f.say[1]
          : f.say[0]
        : f.say;
      const u = new SpeechSynthesisUtterance(say);
      u.lang = mode === "bn" ? "bn-BD" : "en-US";
      u.rate = Math.min(2, 0.9 * speed);
      u.onend = () => setTimeout(next, 250);
      u.onerror = () => setTimeout(next, 1500 / speed);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      return () => {
        done = true;
        window.speechSynthesis.cancel();
      };
    }
    const t = setTimeout(next, (mode === "both" ? 2600 : 2000) / speed);
    return () => {
      done = true;
      clearTimeout(t);
    };
  }, [playing, i, speed, voice, frames.length]);

  useEffect(() => () => canSpeak && window.speechSynthesis.cancel(), []);

  // Keep the highlighted C# line in view inside the code box.
  useEffect(() => {
    const box = codeRef.current;
    const el = box?.querySelector(".is-now");
    if (box && el) {
      const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
      box.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, [i, pattern]);

  const onKey = (e) => {
    if (e.target.closest("select")) return;
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      setPlaying((p) => (i >= frames.length - 1 ? (setI(0), true) : !p));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPlaying(false);
      setI((x) => Math.min(x + 1, frames.length - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPlaying(false);
      setI((x) => Math.max(x - 1, 0));
    }
  };
  const copy = () => {
    navigator.clipboard?.writeText(pattern.code.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  const pct = frames.length > 1 ? (i / (frames.length - 1)) * 100 : 100;

  return (
    <div className="dsa-player-wrap">
      <div
        className="dsa-player"
        tabIndex={0}
        onKeyDown={onKey}
        aria-label="Step-by-step walkthrough. Space plays or pauses, arrow keys step."
      >
        <div className="dsa-screen">
          <div className="dsa-screen-top">
            <span className="dsa-live">
              <span /> {pad(pattern.id)} · {pattern.name}
            </span>
            <span className="dsa-vars">
              {Object.entries(f.vars).map(([k, v]) => (
                <span key={k}>
                  {k} = <b>{String(v)}</b>
                </span>
              ))}
            </span>
          </div>
          <div className="dsa-stage">
            {f.panels.map((p, k) => (
              <Panel key={k} p={p} />
            ))}
          </div>
          {f.out != null && (
            <div className="dsa-out">
              → <b>{f.out}</b>
            </div>
          )}
          {cc && (
            <div className="dsa-caption" aria-live="polite">
              {T(f.say, true)}
            </div>
          )}
        </div>
        <div className="dsa-progress">
          <input
            type="range"
            min="0"
            max={frames.length - 1}
            value={i}
            onChange={(e) => {
              setPlaying(false);
              setI(+e.target.value);
            }}
            style={{ "--pct": pct + "%" }}
            aria-label="Walkthrough position"
          />
        </div>
        <div className="dsa-controls">
          <button
            onClick={() => (setPlaying(false), setI((x) => Math.max(0, x - 1)))}
            aria-label="Previous step"
            title="Previous step (←)"
          >
            <SkipBack size={18} />
          </button>
          <button
            className="dsa-play"
            onClick={() => {
              if (i >= frames.length - 1) setI(0);
              setPlaying((p) => (i >= frames.length - 1 ? true : !p));
            }}
            aria-label={playing ? "Pause" : "Play"}
            title="Play / pause (space)"
          >
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => (
              setPlaying(false),
              setI((x) => Math.min(frames.length - 1, x + 1))
            )}
            aria-label="Next step"
            title="Next step (→)"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={() => (setPlaying(false), setI(0))}
            aria-label="Restart"
            title="Restart"
          >
            <RotateCcw size={16} />
          </button>
          <span className="dsa-time">
            {T(["Step", "ধাপ"])} {i + 1} / {frames.length}
          </span>
          <span className="dsa-spacer" />
          {canSpeak && (
            <button
              className={voice ? "on" : ""}
              onClick={() => setVoice((v) => !v)}
              aria-pressed={voice}
              title="Narrate captions aloud"
            >
              {voice ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          )}
          <button
            className={cc ? "on" : ""}
            onClick={() => setCc((v) => !v)}
            aria-pressed={cc}
            title="Captions"
          >
            <Captions size={18} />
          </button>
          <select
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
            aria-label="Playback speed"
          >
            {[0.5, 0.75, 1, 1.5, 2].map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="dsa-code">
        <div className="dsa-code-head">
          <span>
            <Code2 size={14} /> C# · {pattern.problem.title}
          </span>
          <button onClick={copy} title="Copy C# code">
            {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre ref={codeRef}>
          {pattern.code.lines.map((l, k) => (
            <div
              key={k}
              className={"dsa-line" + (k + 1 === line ? " is-now" : "")}
            >
              <span className="dsa-ln">{k + 1}</span>
              <code>{l || " "}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function Section({ id, icon: I, title, children }) {
  return (
    <section className="dsa-sec" id={id}>
      <h3>
        <I size={17} /> {title}
      </h3>
      {children}
    </section>
  );
}

export default function DsaPatterns({ lang }) {
  const { T, mode } = useT(lang);
  const [slug, setSlug] = useState(
    () => slugFromHash() || store.get("dsa-last", dsaPatterns[0].slug),
  );
  const [done, setDone] = useState(() => new Set(store.get("dsa-done", [])));
  const [solved, setSolved] = useState(
    () => new Set(store.get("dsa-solved", [])),
  );
  const topRef = useRef(null);
  const idx = Math.max(
    0,
    dsaPatterns.findIndex((p) => p.slug === slug),
  );
  const p = dsaPatterns[idx];

  useEffect(() => {
    const sync = () => {
      const s = slugFromHash();
      if (s) setSlug(s);
    };
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      // Leaving the page: drop the #dsa/… hash so a reload opens the page the user moved to.
      if (window.location.hash.startsWith("#dsa"))
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
    };
  }, []);
  useEffect(() => {
    store.set("dsa-last", slug);
    if (window.location.hash !== "#dsa/" + slug)
      history.replaceState(null, "", "#dsa/" + slug);
  }, [slug]);

  const choose = (s) => {
    setSlug(s);
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  const toggleDone = (s) => {
    const n = new Set(done);
    n.has(s) ? n.delete(s) : n.add(s);
    setDone(n);
    store.set("dsa-done", [...n]);
  };
  const toggleSolved = (k) => {
    const n = new Set(solved);
    n.has(k) ? n.delete(k) : n.add(k);
    setSolved(n);
    store.set("dsa-solved", [...n]);
  };
  const prev = dsaPatterns[idx - 1],
    next = dsaPatterns[idx + 1];
  const yt =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(`${p.problem.title} ${p.name} explained C#`);

  return (
    <div className="dsa">
      <section className="dsa-hero">
        <div>
          <span className="dsa-kicker">
            {T(["DSA PATTERNS · NOOB → PRO", "DSA প্যাটার্ন · নতুন → পেশাদার"])}
          </span>
          <h2>
            {T(
              [
                "30 patterns. One example each. Watch it run.",
                "৩০টি প্যাটার্ন। প্রতিটির একটি উদাহরণ। চলতে দেখুন।",
              ],
              true,
            )}
          </h2>
          <p>
            {T(
              [
                "Every pattern has an animated step-by-step walkthrough, C# code that highlights the running line, the most-asked interview problems, and the traps interviewers love.",
                "প্রতিটি প্যাটার্নে আছে ধাপে ধাপে অ্যানিমেশন, চলমান লাইন হাইলাইট করা C# কোড, সবচেয়ে বেশি জিজ্ঞাসিত ইন্টারভিউ সমস্যা, আর ইন্টারভিউয়ারদের প্রিয় ফাঁদগুলো।",
              ],
              true,
            )}
          </p>
        </div>
        <div
          className="dsa-ring"
          style={{ "--p": (done.size / 30) * 100 + "%" }}
        >
          <b>{done.size}</b>
          <span>/ 30</span>
          <small>{T(["mastered", "আয়ত্ত"])}</small>
        </div>
      </section>

      <div className="dsa-layout">
        <div className="dsa-index" role="navigation" aria-label="Patterns">
          <label className="dsa-mobile-pick">
            <span>{T(["Pattern", "প্যাটার্ন"])}</span>
            <select value={slug} onChange={(e) => choose(e.target.value)}>
              {dsaPatterns.map((x) => (
                <option key={x.slug} value={x.slug}>
                  {pad(x.id)} · {x.name}
                  {done.has(x.slug) ? " ✓" : ""}
                </option>
              ))}
            </select>
          </label>
          {dsaLevels.map((lv, li) => (
            <div className="dsa-group" key={lv.name}>
              <div className="dsa-group-head">
                <span className={"dsa-lv lv" + li}>
                  {mode === "bn" ? lv.bn : lv.name}
                </span>
                <small>{T(lv.note)}</small>
              </div>
              {dsaPatterns
                .filter((x) => x.level === li)
                .map((x) => (
                  <button
                    key={x.slug}
                    className={"dsa-item" + (x.slug === slug ? " is-on" : "")}
                    onClick={() => choose(x.slug)}
                  >
                    <span className="dsa-num">{pad(x.id)}</span>
                    <span className="dsa-name">{x.name}</span>
                    {done.has(x.slug) ? (
                      <CheckCircle2 size={15} className="dsa-ok" />
                    ) : null}
                  </button>
                ))}
            </div>
          ))}
        </div>

        <article className="dsa-main" ref={topRef}>
          <div className="dsa-head">
            <div>
              <div className="dsa-meta">
                <span className={"dsa-lv lv" + p.level}>
                  {mode === "bn"
                    ? dsaLevels[p.level].bn
                    : dsaLevels[p.level].name}
                </span>
                <span>
                  {T(["Pattern", "প্যাটার্ন"])} {pad(p.id)} / 30
                </span>
              </div>
              <h2>{p.name}</h2>
              <p className="dsa-problem">
                {T(["Featured problem", "উদাহরণ সমস্যা"])}:{" "}
                <a href={p.problem.url} target="_blank" rel="noreferrer">
                  {typeof p.problem.n === "number"
                    ? "LeetCode " + p.problem.n
                    : p.problem.n}{" "}
                  · {p.problem.title} <ExternalLink size={12} />
                </a>{" "}
                <span className={"dsa-diff d-" + p.problem.level}>
                  {p.problem.level}
                </span>
              </p>
            </div>
            <button
              className={"dsa-done" + (done.has(p.slug) ? " is-done" : "")}
              onClick={() => toggleDone(p.slug)}
            >
              {done.has(p.slug) ? (
                <CheckCircle2 size={16} />
              ) : (
                <Circle size={16} />
              )}
              {done.has(p.slug)
                ? T(["Mastered", "আয়ত্ত হয়েছে"])
                : T(["Mark as mastered", "আয়ত্ত হিসেবে চিহ্ন"])}
            </button>
          </div>

          <nav className="dsa-chapters" aria-label="Chapters">
            {[
              ["idea", ["1. Idea", "১. ধারণা"]],
              ["watch", ["2. Watch", "২. দেখুন"]],
              ["spot", ["3. Spot it", "৩. চিনুন"]],
              ["cost", ["4. Cost & traps", "৪. খরচ ও ফাঁদ"]],
              ["interview", ["5. Interview Q&A", "৫. ইন্টারভিউ প্রশ্ন"]],
              ["practice", ["6. Practice", "৬. অনুশীলন"]],
            ].map(([id, t]) => (
              <a
                key={id}
                href={"#dsa/" + p.slug}
                onClick={(e) => (
                  e.preventDefault(),
                  document
                    .getElementById("dsa-" + id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                )}
              >
                {mode === "bn" ? t[1] : t[0]}
              </a>
            ))}
          </nav>

          <Section
            id="dsa-idea"
            icon={Lightbulb}
            title={T(["The idea in plain words", "সহজ ভাষায় ধারণা"])}
          >
            <p className="dsa-idea">{T(p.idea, true)}</p>
            <p className="dsa-analogy">
              <b>{T(["Real-life picture", "বাস্তব উদাহরণ"])}:</b>{" "}
              {T(p.analogy, true)}
            </p>
          </Section>

          <Section
            id="dsa-watch"
            icon={Play}
            title={T(["Watch it step by step", "ধাপে ধাপে দেখুন"])}
          >
            <div className="dsa-io">
              <span>
                <b>Input</b> <code>{p.input}</code>
              </span>
              <span>
                <b>Output</b> <code>{p.expected}</code>
              </span>
            </div>
            <Player pattern={p} lang={lang} T={T} mode={mode} />
            <p className="dsa-hint">
              {T([
                "Tip: click the player, then press Space to play/pause and ← → to step. Turn on 🔊 to hear each step read aloud.",
                "টিপ: প্লেয়ারে ক্লিক করে Space দিয়ে চালু/বন্ধ, ← → দিয়ে ধাপ বদলান। 🔊 চালু করলে প্রতিটি ধাপ পড়ে শোনাবে।",
              ])}
            </p>
          </Section>

          <Section
            id="dsa-spot"
            icon={Radar}
            title={T([
              "How to recognize this pattern",
              "প্যাটার্নটি কীভাবে চিনবেন",
            ])}
          >
            <ul className="dsa-list">
              {p.signals.map((s, k) => (
                <li key={k}>{T(s, true)}</li>
              ))}
            </ul>
          </Section>

          <Section
            id="dsa-cost"
            icon={Gauge}
            title={T(["Complexity & common mistakes", "জটিলতা ও সাধারণ ভুল"])}
          >
            <div className="dsa-cx">
              <span>
                <small>{T(["Time", "সময়"])}</small>
                <b>{p.complexity.time}</b>
              </span>
              <span>
                <small>{T(["Space", "মেমরি"])}</small>
                <b>{p.complexity.space}</b>
              </span>
            </div>
            <ul className="dsa-list dsa-warn">
              {p.mistakes.map((s, k) => (
                <li key={k}>
                  <AlertTriangle size={14} /> <span>{T(s, true)}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            id="dsa-interview"
            icon={MessagesSquare}
            title={T([
              "Interview follow-up questions",
              "ইন্টারভিউয়ের পরের প্রশ্ন",
            ])}
          >
            {p.followups.map(([q, a], k) => (
              <details key={k} className="dsa-qa">
                <summary>{T(q)}</summary>
                <div>{T(a, true)}</div>
              </details>
            ))}
          </Section>

          <Section
            id="dsa-practice"
            icon={ListChecks}
            title={T([
              "Most-asked problems — practice in C#",
              "সবচেয়ে বেশি জিজ্ঞাসিত সমস্যা — C#-এ অনুশীলন",
            ])}
          >
            <ul className="dsa-practice">
              {p.practice.map((q) => {
                const key = String(q.n) + "-" + q.title;
                return (
                  <li key={key} className={solved.has(key) ? "is-solved" : ""}>
                    <button
                      onClick={() => toggleSolved(key)}
                      aria-pressed={solved.has(key)}
                      title="Mark solved"
                    >
                      {solved.has(key) ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <Circle size={17} />
                      )}
                    </button>
                    <span className="dsa-pn">
                      {typeof q.n === "number" ? "#" + q.n : q.n}
                    </span>
                    <a href={q.url} target="_blank" rel="noreferrer">
                      {q.title} <ExternalLink size={12} />
                    </a>
                    <span className={"dsa-diff d-" + q.level}>{q.level}</span>
                  </li>
                );
              })}
            </ul>
            <a className="dsa-yt" href={yt} target="_blank" rel="noreferrer">
              <Youtube size={17} />{" "}
              {T([
                "Find more video explanations on YouTube",
                "YouTube-এ আরও ভিডিও ব্যাখ্যা খুঁজুন",
              ])}
            </a>
          </Section>

          <div className="dsa-nav">
            {prev ? (
              <button onClick={() => choose(prev.slug)}>
                <ChevronLeft size={16} />
                <span>
                  <small>{T(["Previous", "আগের"])}</small>
                  {pad(prev.id)} · {prev.name}
                </span>
              </button>
            ) : (
              <span />
            )}
            {next && (
              <button
                className="dsa-next"
                onClick={() => {
                  if (!done.has(p.slug)) toggleDone(p.slug);
                  choose(next.slug);
                }}
              >
                <span>
                  <small>{T(["Next pattern", "পরের প্যাটার্ন"])}</small>
                  {pad(next.id)} · {next.name}
                </span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
