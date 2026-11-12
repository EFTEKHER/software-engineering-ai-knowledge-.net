import React, { useEffect, useMemo, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Workflow,
  AlertTriangle,
  MoveRight,
} from "lucide-react";
function algorithmFrames(a, index, target) {
  let frames = [],
    push = (active, en, bn, extra = {}) =>
      frames.push({ active, en, bn, ...extra });
  if (index === 5) {
    let lo = 0,
      hi = a.length - 1;
    while (lo <= hi) {
      let mid = lo + Math.floor((hi - lo) / 2);
      push(
        [lo, mid, hi],
        `Search [${lo}, ${hi}]. Middle value ${a[mid]} compared with target ${target}.`,
        `সীমা [${lo}, ${hi}]। মাঝের মান ${a[mid]}, লক্ষ্য ${target}।`,
        { mid },
      );
      if (a[mid] === target) {
        push(
          [mid],
          `Found ${target} at index ${mid}.`,
          `লক্ষ্য ${target} পাওয়া গেছে index ${mid}-এ।`,
        );
        return frames;
      }
      if (a[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    push([], `Target ${target} is absent.`, `লক্ষ্য ${target} নেই।`);
  } else if (index === 2) {
    let l = 0,
      r = a.length - 1;
    while (l < r) {
      let sum = a[l] + a[r];
      push(
        [l, r],
        `${a[l]} + ${a[r]} = ${sum}; target ${target}.`,
        `${a[l]} + ${a[r]} = ${sum}; লক্ষ্য ${target}।`,
      );
      if (sum === target) {
        push([l, r], "Pair found. Stop.", "জোড়া পাওয়া গেছে। থামুন।");
        break;
      }
      if (sum < target) l++;
      else r--;
    }
    if (l >= r) push([], "No pair found.", "জোড়া নেই।");
  } else if (index === 3) {
    for (let i = 0; i <= a.length - 3; i++) {
      let sum = a.slice(i, i + 3).reduce((x, y) => x + y, 0);
      push(
        [i, i + 1, i + 2],
        `Window [${i}..${i + 2}] has sum ${sum}.`,
        `তিন ঘরের window-এর যোগফল ${sum}।`,
      );
    }
  } else if (index === 4) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i];
      push(
        Array.from({ length: i + 1 }, (_, j) => j),
        `prefix[${i + 1}] = ${sum}.`,
        `শুরু থেকে ${i + 1}টি মানের মোট ${sum}।`,
      );
    }
  } else if (index === 1) {
    let map = new Map();
    for (let i = 0; i < a.length; i++) {
      map.set(a[i], (map.get(a[i]) || 0) + 1);
      push(
        [i],
        `Key ${a[i]} now has count ${map.get(a[i])}.`,
        `${a[i]} key-এর সংখ্যা এখন ${map.get(a[i])}।`,
        { state: [...map].map(([k, v]) => `${k} → ${v}`).join(" · ") },
      );
    }
  } else if (index === 6) {
    for (let i = 0; i < a.length; i++)
      push([i], `Enqueue/Push ${a[i]}.`, `মান ${a[i]} যোগ করুন।`);
    push(
      [0, a.length - 1],
      `Queue removes ${a[0]} first; stack removes ${a.at(-1)} first.`,
      `Queue-তে ${a[0]} আগে, stack-এ ${a.at(-1)} আগে।`,
    );
  } else if (index === 8) {
    let stack = [];
    for (let i = 0; i < a.length; i++) {
      while (stack.length && a[stack.at(-1)] < a[i]) {
        let prev = stack.pop();
        push(
          [prev, i],
          `Next greater for index ${prev} is ${a[i]}.`,
          `index ${prev}-এর পরের বড় মান ${a[i]}।`,
        );
      }
      stack.push(i);
      push(
        [...stack],
        `Pending indices: ${stack.join(", ")}.`,
        `অপেক্ষায় index: ${stack.join(", ")}।`,
      );
    }
  } else if (index === 9) {
    for (let n = 4; n >= 1; n--)
      push(
        [4 - n],
        `Call Factorial(${n}). ${n === 1 ? "Base case returns 1." : "Wait for the smaller call."}`,
        `Factorial(${n}) ডাকুন। ${n === 1 ? "থামার শর্তে ১ ফেরত।" : "ছোট ফলের অপেক্ষা।"}`,
      );
    push([], "Unwind: 1 → 2 → 6 → 24.", "ফেরার পথে গুণ: ১ → ২ → ৬ → ২৪।");
  } else if (index === 10) {
    for (let mask = 0; mask < Math.min(1 << a.length, 16); mask++) {
      let chosen = a.map((_, i) => i).filter((i) => mask & (1 << i));
      push(
        chosen,
        `Subset: {${chosen.map((i) => a[i]).join(", ")}}. Each branch includes or skips a value.`,
        `উপসেট: {${chosen.map((i) => a[i]).join(", ")}}। একটি মান নিন বা বাদ দিন।`,
      );
    }
  } else if (index === 12) {
    let order = a.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v);
    order.forEach((x, j) =>
      push(
        [x.i],
        `Min-priority removal ${j + 1}: ${x.v}.`,
        `ছোট priority আগে: ${x.v}।`,
      ),
    );
  } else if (index === 19) {
    let p = 0,
      q = 1;
    for (let i = 0; i < Math.min(a.length + 2, 12); i++) {
      push(
        [i % a.length],
        `F(${i}) = ${p}. Reuse previous two answers.`,
        `F(${i}) = ${p}। আগের দুই উত্তর ব্যবহার।`,
      );
      [p, q] = [q, p + q];
    }
  } else {
    a.forEach((v, i) =>
      push(
        [i],
        `Visit index ${i}, value ${v}. ${index === 7 ? "Follow the next reference." : "Inspect this element before moving on."}`,
        `index ${i}-এর মান ${v}। ${index === 7 ? "পরের node-এর link ধরুন।" : "পরের মানে যাওয়ার আগে এটি দেখুন।"}`,
      ),
    );
  }
  return frames.length
    ? frames
    : [
        {
          active: [],
          en: "Add at least three values for a window.",
          bn: "Window-এর জন্য কমপক্ষে তিনটি মান দিন।",
        },
      ];
}
export default function Diagram({ lesson, lang }) {
  const [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1),
    [input, setInput] = useState("2, 4, 6, 8, 10, 12"),
    [target, setTarget] = useState(8),
    [traffic, setTraffic] = useState(400),
    [replicas, setReplicas] = useState(3),
    [failure, setFailure] = useState(false),
    [patched, setPatched] = useState(true);
  const bn = lang !== "English",
    en = lang !== "বাংলা";
  let isArray =
    lesson.module.id === 3 &&
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 19].includes(lesson.index);
  let numbers = input.split(",").map((x) => Number(x.trim()));
  let valid =
    numbers.length > 0 &&
    numbers.length <= 16 &&
    numbers.every(Number.isFinite) &&
    input.split(",").every((x) => x.trim() !== "") &&
    input.trim() !== "";
  let sorted = [2, 5].includes(lesson.index);
  const frames = useMemo(
    () =>
      isArray && valid
        ? algorithmFrames(
            sorted ? [...numbers].sort((a, b) => a - b) : numbers,
            lesson.index,
            +target,
          )
        : [],
    [input, target, lesson.index, isArray],
  );
  let count = isArray ? frames.length : lesson.flow.length;
  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [lesson.id, input, target]);
  useEffect(() => {
    if (!playing || !count) return;
    let id = setInterval(
      () =>
        setStep((s) => {
          if (s >= count - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      1500 / speed,
    );
    return () => clearInterval(id);
  }, [playing, speed, count]);
  const frame = frames[step] || frames[0];
  let system = [7, 8, 9, 10, 13].includes(lesson.module.id);
  let cluster = lesson.module.id === 12;
  let security = lesson.module.id === 6;
  let activeReplicas =
    cluster && failure ? Math.max(0, replicas - 1) : replicas;
  let capacity = activeReplicas * 250;
  let load = capacity ? Math.round((traffic / capacity) * 100) : 0;
  let latency =
    (failure && !cluster) || capacity === 0
      ? null
      : Math.round(20 + Math.max(0, traffic - capacity) * 0.3);
  let arr = sorted ? [...numbers].sort((a, b) => a - b) : numbers;
  return (
    <section
      className="interactive-diagram"
      aria-label="Interactive topic diagram"
    >
      <div className="panel-title">
        <span>
          <Workflow size={18} />
          {bn ? "চিত্রে বুঝুন · " : ""}Interactive visualization
        </span>
        <span className="sim-badge">
          {isArray ? "ALGORITHM TRACE" : "TEACHING MODEL"}
        </span>
      </div>
      <div className="diagram-configuration">
        {isArray ? (
          <>
            <label>
              {bn ? "মানগুলো · " : ""}Values
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Array values"
              />
            </label>
            {[2, 5].includes(lesson.index) && (
              <label>
                Target
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  aria-label="Target value"
                />
              </label>
            )}
            {sorted && (
              <small>
                Input is sorted for this algorithm. / সাজানো মান ব্যবহার হয়।
              </small>
            )}
            {!valid && (
              <p role="alert">Enter 1–16 finite numbers separated by commas.</p>
            )}
          </>
        ) : (
          <>
            <span className="diagram-purpose">{lesson.topic}</span>
            {(system || cluster) && (
              <label>
                {bn ? "অ্যাপের কপি · " : ""}Replicas
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={replicas}
                  onChange={(e) =>
                    setReplicas(Math.min(8, Math.max(1, +e.target.value || 1)))
                  }
                />
              </label>
            )}
            {security && (
              <button
                className={patched ? "good-state" : "bad-state"}
                onClick={() => setPatched((v) => !v)}
              >
                {patched ? "Patched · সুরক্ষিত" : "Vulnerable · ঝুঁকিপূর্ণ"}
              </button>
            )}
          </>
        )}
      </div>
      {isArray ? (
        <div className="array-scene">
          <div className="array-cells">
            {valid &&
              arr.map((v, i) => (
                <div
                  className={
                    "array-cell " +
                    (frame?.active.includes(i) ? "highlight" : "")
                  }
                  key={i}
                >
                  <small>[{i}]</small>
                  <strong>{v}</strong>
                  {frame?.mid === i && <b>MID</b>}
                </div>
              ))}
          </div>
          {frame?.state && <div className="data-state">{frame.state}</div>}
        </div>
      ) : (
        <div className={"graph-scene domain-" + lesson.module.id}>
          {lesson.flow.map((node, i) => (
            <React.Fragment key={node + i}>
              <button
                className={
                  "diagram-node " +
                  (step === i ? "current" : "") +
                  ((failure && !cluster && i === lesson.flow.length - 1) ||
                  (!patched && security && i === 2)
                    ? " failed"
                    : "")
                }
                onClick={() => {
                  setStep(i);
                  setPlaying(false);
                }}
                aria-label={`Inspect ${node}`}
              >
                <span>0{i + 1}</span>
                <strong>{node}</strong>
                <small>
                  {step === i
                    ? bn
                      ? "এখন এই ধাপ · Active"
                      : "Active step"
                    : "Click to inspect"}
                </small>
                {cluster && i === 2 && (
                  <div className="pod-dots">
                    {Array.from({ length: replicas }, (_, j) => (
                      <i key={j} className={failure && j === 0 ? "down" : ""} />
                    ))}
                  </div>
                )}
              </button>
              {i < lesson.flow.length - 1 && (
                <MoveRight
                  className={step > i ? "edge-passed" : "edge"}
                  size={24}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="step-caption" aria-live="polite">
        <span className="lesson-label">
          STEP {step + 1} / {count || 1}
        </span>
        {isArray ? (
          <>
            {en && <p>{frame?.en}</p>}
            {bn && <p lang="bn">{frame?.bn}</p>}
          </>
        ) : (
          <>
            {en && (
              <p>
                <strong>{lesson.flow[step]}:</strong>{" "}
                {lesson.lines[step % lesson.lines.length]?.en}
              </p>
            )}
            {bn && (
              <p lang="bn">
                <strong>{lesson.flow[step]}:</strong>{" "}
                {lesson.lines[step % lesson.lines.length]?.bn}
              </p>
            )}
          </>
        )}
      </div>
      <div className="viz-controls">
        <button
          aria-label="Previous diagram step"
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.max(0, s - 1));
          }}
          disabled={step === 0}
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={() => {
            if (step === count - 1) setStep(0);
            setPlaying((v) => !v);
          }}
          disabled={!count || (!valid && isArray)}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          aria-label="Next diagram step"
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(count - 1, s + 1));
          }}
          disabled={step === count - 1}
        >
          <SkipForward size={16} />
        </button>
        <button
          aria-label="Reset diagram"
          onClick={() => {
            setStep(0);
            setPlaying(false);
            setFailure(false);
          }}
        >
          <RotateCcw size={15} />
        </button>
        <select
          value={speed}
          aria-label="Diagram speed"
          onChange={(e) => setSpeed(+e.target.value)}
        >
          {[0.5, 1, 1.5, 2].map((x) => (
            <option key={x} value={x}>
              {x}x
            </option>
          ))}
        </select>
        <span>Click any node to inspect / ধাপে ক্লিক করুন</span>
      </div>
      {(system || cluster) && (
        <div className="system-controls">
          <label>
            Traffic / চাপ: <b>{traffic} req/s</b>
            <input
              type="range"
              min="100"
              max="3000"
              step="100"
              value={traffic}
              onChange={(e) => setTraffic(+e.target.value)}
            />
          </label>
          <button
            className={failure ? "bad-state" : ""}
            onClick={() => setFailure((f) => !f)}
          >
            <AlertTriangle size={14} />
            {failure ? "Restore node / ফিরিয়ে আনুন" : "Simulate node failure"}
          </button>
          <div className="model-metrics">
            <span>
              Capacity <strong>{capacity} req/s</strong>
            </span>
            <span>
              Load <strong>{load}%</strong>
            </span>
            <span>
              Model latency{" "}
              <strong>
                {latency === null ? "Unavailable" : latency + " ms"}
              </strong>
            </span>
          </div>
          <small>
            Illustrative capacity model: 250 req/s per replica. Values are not
            benchmarks. / এটি শেখার হিসাব, বাস্তব benchmark নয়।
          </small>
        </div>
      )}
      {security && (
        <div className={"security-result " + (patched ? "safe" : "unsafe")}>
          <strong>
            {patched
              ? "Blocked at validation boundary"
              : "Untrusted input reaches the sensitive boundary"}
          </strong>
          <p lang="bn">
            {patched
              ? "নিরাপত্তার নিয়ম input-কে সংবেদনশীল কাজ থেকে আলাদা রাখে।"
              : "এই মডেলে নিরাপত্তার যাচাই বাদ গেছে। বাস্তবে সঠিক server-side প্রতিকার লাগবে।"}
          </p>
          <small>
            Conceptual boundary demonstration; no attack is sent or executed.
          </small>
        </div>
      )}
    </section>
  );
}
