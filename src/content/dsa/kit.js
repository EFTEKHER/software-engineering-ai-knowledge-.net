// Tiny toolkit used by every DSA pattern trace.
// A trace runs the real algorithm in JavaScript and records "frames".
// Each frame = what the screen shows + a caption + which C# line is running.

// C# source with `//@tag` markers at line ends. Tags are stripped for display
// and turned into line numbers so traces can say `line: "loop"`.
export function cs(source) {
  const lines = [];
  const tags = {};
  source
    .replace(/^\n/, "")
    .replace(/\s+$/, "")
    .split("\n")
    .forEach((raw, i) => {
      const m = raw.match(/\s*\/\/@(\w+)\s*$/);
      if (m) tags[m[1]] = i + 1;
      lines.push(m ? raw.slice(0, m.index) : raw);
    });
  return { lines, tags, text: lines.join("\n") };
}

export function recorder() {
  const frames = [];
  return {
    frames,
    // step(line tag, caption, panels[], vars{}, output?)
    step(line, say, panels, vars = {}, out) {
      frames.push({ line, say, panels: clone(panels), vars: { ...vars }, out });
    },
  };
}

const clone = (x) => JSON.parse(JSON.stringify(x ?? null));

// Merge pointer labels: ptr([[0,"L"],[3,"R"],[3,"mid"]]) -> {0:"L",3:"R·mid"}
export function ptr(pairs) {
  const out = {};
  for (const [i, label] of pairs) {
    if (i == null || i < 0) continue;
    out[i] = out[i] ? out[i] + " · " + label : label;
  }
  return out;
}

// ---- Panel builders -------------------------------------------------------
// hi: { index: "active" | "good" | "bad" | "dim" | "done" | "warn" }
export const A = (values, o = {}) => ({ type: "array", values, ...o });
export const Grid = (rows, o = {}) => ({ type: "grid", rows, ...o });
export const List = (values, next, o = {}) => ({
  type: "list",
  values,
  next,
  ...o,
});
export const Stack = (values, o = {}) => ({ type: "stack", values, ...o });
export const Queue = (values, o = {}) => ({ type: "queue", values, ...o });
export const Map_ = (entries, o = {}) => ({ type: "map", entries, ...o });
export const Bits = (rows, o = {}) => ({ type: "bits", rows, ...o });
export const BTree = (values, o = {}) => ({ type: "btree", values, ...o });
export const NTree = (nodes, o = {}) => ({ type: "ntree", nodes, ...o });
export const Chips = (items, o = {}) => ({ type: "chips", items, ...o });
export const Bars = (items, o = {}) => ({ type: "intervals", items, ...o });

// range(a,b) -> {a:cls,...,b:cls}
export function span(a, b, cls = "range", base = {}) {
  const out = { ...base };
  for (let i = a; i <= b; i++) if (out[i] == null) out[i] = cls;
  return out;
}

export const lc = (n, title, level) => ({
  n,
  title,
  level,
  url:
    "https://leetcode.com/problems/" +
    title
      .toLowerCase()
      .replace(/[()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "/",
});
