import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Captions,
  CaptionsOff,
  Check,
  Lightbulb,
  MessageCircleQuestion,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  TriangleAlert,
  Volume2,
  VolumeX,
  Wrench,
} from "lucide-react";
import {
  buildScenes,
  sceneDuration,
} from "../../content/sqlMastery/episodes.js";
import { highlight } from "./highlight.jsx";

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

const NOTE_ICON = {
  key: Lightbulb,
  trap: TriangleAlert,
  tip: Wrench,
  interview: MessageCircleQuestion,
};

const fmt = (ms) => {
  const s = Math.round(ms / 1000);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};

export default function Player({
  chapter,
  index,
  mode,
  onEnded,
  nextLabel,
  onNext,
  autoStart = false,
}) {
  const scenes = useMemo(() => buildScenes(chapter, index), [chapter, index]);
  const durations = useMemo(
    () => scenes.map((s) => sceneDuration(s, mode)),
    [scenes, mode],
  );
  const total = durations.reduce((a, b) => a + b, 0);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(autoStart);
  const [ended, setEnded] = useState(false);
  const [speed, setSpeed] = useState(() => store.get("sqlm-speed", 1));
  const [cc, setCc] = useState(() => store.get("sqlm-cc", true));
  const [voice, setVoice] = useState(false);
  const [autoplay, setAutoplay] = useState(() =>
    store.get("sqlm-autoplay", true),
  );
  const [countdown, setCountdown] = useState(null);
  const codeRef = useRef(null);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  const scene = scenes[i];

  useEffect(() => store.set("sqlm-speed", speed), [speed]);
  useEffect(() => store.set("sqlm-cc", cc), [cc]);
  useEffect(() => store.set("sqlm-autoplay", autoplay), [autoplay]);

  // Auto-advance through scenes (timer, or narration when voice is on).
  useEffect(() => {
    if (!playing) return;
    let done = false;
    const advance = () => {
      if (done) return;
      if (i >= scenes.length - 1) {
        setPlaying(false);
        setEnded(true);
        onEnded?.();
      } else setI(i + 1);
    };
    if (voice && canSpeak) {
      const text =
        scene.kind === "recap"
          ? scene.items.map((x) => (mode === "bn" ? x.bn : x.en)).join(". ")
          : mode === "bn"
            ? scene.bn
            : scene.en;
      const u = new SpeechSynthesisUtterance(text || "");
      u.lang = mode === "bn" ? "bn-BD" : "en-US";
      u.rate = Math.min(2, 0.95 * speed);
      u.onend = () => setTimeout(advance, 300);
      u.onerror = () => setTimeout(advance, durations[i] / speed);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      return () => {
        done = true;
        window.speechSynthesis.cancel();
      };
    }
    const t = setTimeout(advance, durations[i] / speed);
    return () => {
      done = true;
      clearTimeout(t);
    };
  }, [playing, i, speed, voice, mode, scenes.length]);

  useEffect(() => () => canSpeak && window.speechSynthesis.cancel(), []);

  // "Up next" countdown after the episode ends.
  useEffect(() => {
    if (!ended || !autoplay || !onNext) return;
    setCountdown(5);
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [ended, autoplay, onNext]);
  useEffect(() => {
    if (countdown === 0 && ended && autoplay) onNext?.(true);
  }, [countdown]);

  // Keep the highlighted code in view.
  useEffect(() => {
    const box = codeRef.current;
    const el = box?.querySelector(".is-now");
    if (box && el) {
      const top = el.offsetTop - box.clientHeight / 3;
      box.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, [i]);

  const go = (n) => {
    setEnded(false);
    setCountdown(null);
    setI(Math.max(0, Math.min(scenes.length - 1, n)));
  };
  const toggle = () => {
    if (ended) {
      go(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  };
  const onKey = (e) => {
    if (e.target.closest("select,button")) return;
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPlaying(false);
      go(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPlaying(false);
      go(i - 1);
    }
  };

  const elapsed = durations.slice(0, i).reduce((a, b) => a + b, 0);
  const pct = scenes.length > 1 ? (i / (scenes.length - 1)) * 100 : 100;
  const primary = (x) => (mode === "bn" ? x.bn : x.en);
  const secondary = (x) => (mode === "both" ? x.bn : null);
  const codeLines = useMemo(
    () => (chapter.sections[index].code || "").split("\n"),
    [chapter, index],
  );

  return (
    <div
      className="sqlm-player"
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Episode player. Space plays or pauses, arrow keys move between scenes."
    >
      <div className={"sqlm-screen sqlm-scene-" + scene.kind}>
        <div className="sqlm-screen-top">
          <span className="sqlm-live">
            <span /> Ep {chapter.id}.{index + 1}
          </span>
          <span className="sqlm-chip">
            {scene.kind === "note"
              ? mode === "bn"
                ? scene.title[1]
                : scene.title[0]
              : scene.label}
            {scene.steps > 1 && ` · ${scene.step + 1}/${scene.steps}`}
          </span>
        </div>

        <div className="sqlm-stage" key={i}>
          {scene.kind === "intro" && (
            <div className="sqlm-titlecard">
              <small>
                Module {chapter.id} · {chapter.title}
              </small>
              <h3>{chapter.sections[index].title}</h3>
              {mode !== "en" && (
                <p lang="bn">{chapter.sections[index].titleBn}</p>
              )}
              <span className="sqlm-press">
                {playing
                  ? "▶"
                  : mode === "bn"
                    ? "▶ চালাতে Play চাপুন"
                    : "▶ Press play to start"}
              </span>
            </div>
          )}

          {(scene.kind === "story" || scene.kind === "explain") && (
            <div className="sqlm-bigtext">
              {scene.kind === "story" && (
                <strong>
                  {mode === "bn" ? "সহজ উদাহরণ" : "Real-life story"}
                </strong>
              )}
              <p lang={mode === "bn" ? "bn" : undefined}>{primary(scene)}</p>
            </div>
          )}

          {scene.kind === "code" && (
            <div
              className="sqlm-codestage"
              ref={codeRef}
              aria-label="Code walkthrough"
            >
              {codeLines.map((line, n) => (
                <div
                  key={n}
                  className={
                    "sqlm-cl" +
                    (n >= scene.from && n <= scene.to
                      ? " is-now"
                      : n < scene.from
                        ? " is-past"
                        : "")
                  }
                >
                  <span className="sqlm-ln">{n + 1}</span>
                  <code>
                    {highlight(line)}
                    {line ? "" : " "}
                  </code>
                </div>
              ))}
            </div>
          )}

          {scene.kind === "note" && (
            <div className={"sqlm-notecard sqlm-note-" + scene.noteType}>
              <strong>
                {React.createElement(NOTE_ICON[scene.noteType], {
                  size: 22,
                  "aria-hidden": true,
                })}
                {mode === "bn" ? scene.title[1] : scene.title[0]}
              </strong>
              {scene.q && <p className="sqlm-q">“{scene.q}”</p>}
              <p lang={mode === "bn" ? "bn" : undefined}>{primary(scene)}</p>
            </div>
          )}

          {scene.kind === "recap" && (
            <div className="sqlm-recapcard">
              <strong>
                {mode === "bn" ? "মডিউলের সারসংক্ষেপ" : "Module recap"}
              </strong>
              <ul>
                {scene.items.map((x) => (
                  <li key={x.en}>
                    <Check size={18} aria-hidden="true" />
                    <span>
                      {primary(x)}
                      {secondary(x) && <small lang="bn">{secondary(x)}</small>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {cc &&
          (scene.kind === "code" ||
            (secondary(scene) && scene.kind !== "intro")) &&
          scene.kind !== "recap" && (
            <div className="sqlm-caption" aria-live="polite">
              {scene.kind === "code" ? (
                <>
                  {mode !== "bn" && <span>{scene.en}</span>}
                  {mode !== "en" && <span lang="bn">{scene.bn}</span>}
                </>
              ) : (
                <span lang="bn">{scene.bn}</span>
              )}
            </div>
          )}

        {ended && (
          <div
            className="sqlm-endcard"
            role="dialog"
            aria-label="Episode finished"
          >
            <p>
              <Check size={18} aria-hidden="true" />{" "}
              {mode === "bn" ? "এপিসোড শেষ!" : "Episode complete!"}
            </p>
            {onNext ? (
              <>
                <small>{mode === "bn" ? "পরের এপিসোড" : "Up next"}</small>
                <strong>{nextLabel}</strong>
                <div>
                  <button
                    type="button"
                    className="sqlm-primary"
                    onClick={() => onNext(true)}
                  >
                    <Play size={15} aria-hidden="true" /> Play next
                    {autoplay &&
                      countdown != null &&
                      countdown > 0 &&
                      ` (${countdown})`}
                  </button>
                  <button type="button" onClick={() => go(0)}>
                    <RotateCcw size={15} aria-hidden="true" /> Replay
                  </button>
                </div>
              </>
            ) : (
              <button type="button" onClick={() => go(0)}>
                <RotateCcw size={15} aria-hidden="true" /> Replay
              </button>
            )}
          </div>
        )}
      </div>

      <div className="sqlm-progress">
        <input
          type="range"
          min="0"
          max={scenes.length - 1}
          value={i}
          onChange={(e) => {
            setPlaying(false);
            go(+e.target.value);
          }}
          style={{ "--pct": pct + "%" }}
          aria-label="Episode position"
          aria-valuetext={`Scene ${i + 1} of ${scenes.length}: ${scene.label}`}
        />
        <div className="sqlm-ticks" aria-hidden="true">
          {scenes.map((s, n) => (
            <span
              key={n}
              className={
                "sqlm-tick tick-" + (s.kind === "note" ? s.noteType : s.kind)
              }
              style={{
                left:
                  (scenes.length > 1 ? (n / (scenes.length - 1)) * 100 : 0) +
                  "%",
              }}
            />
          ))}
        </div>
      </div>

      <div className="sqlm-controls">
        <button
          type="button"
          onClick={() => (setPlaying(false), go(i - 1))}
          aria-label="Previous scene"
          title="Previous scene (←)"
        >
          <SkipBack size={18} />
        </button>
        <button
          type="button"
          className="sqlm-play"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          title="Play / pause (Space)"
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          type="button"
          onClick={() => (setPlaying(false), go(i + 1))}
          aria-label="Next scene"
          title="Next scene (→)"
        >
          <SkipForward size={18} />
        </button>
        <span className="sqlm-time">
          {fmt(elapsed / speed)} / {fmt(total / speed)}
        </span>
        <span className="sqlm-spacer" />
        <label className="sqlm-auto">
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
          />
          Autoplay
        </label>
        <select
          value={speed}
          onChange={(e) => setSpeed(+e.target.value)}
          aria-label="Playback speed"
        >
          {[0.75, 1, 1.25, 1.5, 2].map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setCc((c) => !c)}
          aria-pressed={cc}
          aria-label="Captions"
          title="Captions"
        >
          {cc ? <Captions size={18} /> : <CaptionsOff size={18} />}
        </button>
        {canSpeak && (
          <button
            type="button"
            onClick={() => {
              setVoice((v) => !v);
              window.speechSynthesis.cancel();
            }}
            aria-pressed={voice}
            aria-label="Read aloud"
            title="Read aloud (uses your browser's voice)"
          >
            {voice ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
