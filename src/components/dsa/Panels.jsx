import React from "react";

// Renders one visualization panel from a trace frame.
const cls = (c) => (c ? " is-" + c : "");

function ArrayPanel({ p }) {
  const off = p.idx ?? 0;
  return (
    <div className="dsa-arr" style={{ "--n": p.values.length }}>
      {p.values.map((v, i) => (
        <div className="dsa-col" key={i}>
          <span className="dsa-ptr">{p.ptr?.[i] ? "▼ " + p.ptr[i] : ""}</span>
          <span className={"dsa-cell" + cls(p.hi?.[i])}>{String(v)}</span>
          <span className="dsa-idx">{i + off}</span>
          {p.sub && <span className="dsa-sub">{p.sub[i]}</span>}
        </div>
      ))}
    </div>
  );
}

function GridPanel({ p }) {
  return (
    <div className="dsa-gridwrap">
      <table className="dsa-grid">
        {p.colLabels && (
          <thead>
            <tr>
              {p.rowLabels && <th />}
              {p.colLabels.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {p.rows.map((row, r) => (
            <tr key={r}>
              {p.rowLabels && <th>{p.rowLabels[r]}</th>}
              {row.map((v, c) => (
                <td
                  key={c}
                  className={
                    "dsa-cell" +
                    cls(p.hi?.[r + "," + c]) +
                    (v === "" ? " is-empty" : "")
                  }
                >
                  {String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListPanel({ p }) {
  const n = p.values.length;
  return (
    <div className="dsa-ll">
      {p.values.map((v, i) => {
        const nx = p.next[i];
        return (
          <React.Fragment key={i}>
            <div className="dsa-col">
              <span className="dsa-ptr">
                {p.ptr?.[i] ? "▼ " + p.ptr[i] : ""}
              </span>
              <span className={"dsa-node" + cls(p.hi?.[i])}>{v}</span>
              <span className="dsa-sub">
                next: {nx < 0 ? "∅" : p.values[nx]}
              </span>
            </div>
            {i < n - 1 && (
              <span className="dsa-link">
                {p.next[i] === i + 1 ? "→" : ""}
                {p.next[i + 1] === i ? "←" : ""}
                {p.next[i] !== i + 1 && p.next[i + 1] !== i ? "·" : ""}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StackPanel({ p }) {
  const items = [...p.values].reverse();
  return (
    <div className="dsa-stack">
      {items.length === 0 && <span className="dsa-emptynote">empty</span>}
      {items.map((v, i) => (
        <span
          key={i}
          className={
            "dsa-sitem" + (i === 0 && p.hi === "top" ? " is-active" : "")
          }
        >
          {String(v)}
          {i === 0 && <small>top</small>}
        </span>
      ))}
    </div>
  );
}

function QueuePanel({ p }) {
  return (
    <div className="dsa-queue">
      <small>front</small>
      {p.values.length === 0 && <span className="dsa-emptynote">empty</span>}
      {p.values.map((v, i) => (
        <span key={i} className={"dsa-qitem" + cls(p.hi?.[i])}>
          {String(v)}
        </span>
      ))}
      <small>back</small>
    </div>
  );
}

function MapPanel({ p }) {
  return (
    <div className="dsa-map">
      {p.entries.length === 0 && (
        <span className="dsa-emptynote">{"{ }"} empty</span>
      )}
      {p.entries.map(([k, v]) => (
        <span key={String(k)} className={"dsa-kv" + cls(p.hi?.[k])}>
          <b>{String(k)}</b>
          <i>{String(v)}</i>
        </span>
      ))}
    </div>
  );
}

function BitsPanel({ p }) {
  const w = p.width || 4;
  return (
    <div className="dsa-bits">
      {p.rows.map((row) => (
        <div
          key={row.label}
          className={"dsa-bitrow" + (row.hi ? " is-hi" : "")}
        >
          <span className="dsa-bitlabel">{row.label}</span>
          {row.value
            .toString(2)
            .padStart(w, "0")
            .split("")
            .map((b, i) => (
              <span key={i} className={"dsa-bit" + (b === "1" ? " on" : "")}>
                {b}
              </span>
            ))}
          <span className="dsa-bitdec">= {row.value}</span>
        </div>
      ))}
    </div>
  );
}

function BTreePanel({ p }) {
  const vals = p.values;
  const depth = Math.max(1, Math.ceil(Math.log2(vals.length + 1)));
  const W = 100 * Math.pow(2, depth - 1) + 40;
  const H = depth * 78 + 20;
  const pos = (i) => {
    const d = Math.floor(Math.log2(i + 1));
    const k = i - (Math.pow(2, d) - 1);
    return [((k + 0.5) / Math.pow(2, d)) * W, 34 + d * 78];
  };
  if (!vals.length) return <span className="dsa-emptynote">empty</span>;
  return (
    <svg
      className="dsa-tree"
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: W }}
      role="img"
      aria-label="tree"
    >
      {vals.map((v, i) => {
        if (v == null || i === 0) return null;
        const pi = (i - 1) >> 1;
        if (vals[pi] == null) return null;
        const [x, y] = pos(i),
          [px, py] = pos(pi);
        return (
          <line
            key={"e" + i}
            x1={px}
            y1={py}
            x2={x}
            y2={y}
            className="dsa-edge"
          />
        );
      })}
      {vals.map((v, i) => {
        if (v == null) return null;
        const [x, y] = pos(i);
        return (
          <g key={i} className={"dsa-tnode" + cls(p.hi?.[i])}>
            <circle cx={x} cy={y} r="19" />
            <text x={x} y={y + 5} textAnchor="middle">
              {v}
            </text>
            {p.notes?.[i] && (
              <text x={x} y={y + 35} textAnchor="middle" className="dsa-tnote">
                {p.notes[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function NTreePanel({ p }) {
  const nodes = p.nodes;
  const kids = {};
  nodes.forEach((n) => {
    if (n.parent != null) (kids[n.parent] ||= []).push(n.id);
  });
  const at = {};
  let leaf = 0;
  const place = (id, d) => {
    const ch = kids[id] || [];
    if (!ch.length) at[id] = [leaf++, d];
    else {
      ch.forEach((c) => place(c, d + 1));
      at[id] = [(at[ch[0]][0] + at[ch[ch.length - 1]][0]) / 2, d];
    }
  };
  place(0, 0);
  const maxD = Math.max(...Object.values(at).map((v) => v[1]));
  const W = Math.max(1, leaf) * 64 + 20,
    H = maxD * 66 + 60;
  const xy = (id) => [10 + 32 + at[id][0] * 64, 30 + at[id][1] * 66];
  return (
    <svg
      className="dsa-tree"
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: Math.max(W, 120) }}
      role="img"
      aria-label="trie"
    >
      {nodes.map((n) => {
        if (n.parent == null) return null;
        const [x, y] = xy(n.id),
          [px, py] = xy(n.parent);
        return (
          <line
            key={"e" + n.id}
            x1={px}
            y1={py}
            x2={x}
            y2={y}
            className="dsa-edge"
          />
        );
      })}
      {nodes.map((n) => {
        const [x, y] = xy(n.id);
        return (
          <g
            key={n.id}
            className={
              "dsa-tnode" + cls(p.hi?.[n.id]) + (n.end ? " is-end" : "")
            }
          >
            {n.end && <circle cx={x} cy={y} r="22" className="dsa-endring" />}
            <circle cx={x} cy={y} r="17" />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              style={n.id === 0 ? { fontSize: 10 } : undefined}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ChipsPanel({ p }) {
  return (
    <div className="dsa-chips">
      {p.items.length === 0 && <span className="dsa-emptynote">[ ]</span>}
      {p.items.map((v, i) => (
        <span key={i} className={"dsa-chip" + cls(p.hi?.[i])}>
          {String(v)}
        </span>
      ))}
    </div>
  );
}

function BarsPanel({ p }) {
  const max = p.max || 20;
  return (
    <div className="dsa-bars">
      <div className="dsa-scale">
        {Array.from({ length: max / 5 + 1 }, (_, i) => (
          <span key={i} style={{ left: (i * 5 * 100) / max + "%" }}>
            {i * 5}
          </span>
        ))}
      </div>
      {p.items.length === 0 && <span className="dsa-emptynote">empty</span>}
      {p.items.map(([s, e], i) => (
        <div key={i} className="dsa-barrow">
          <span
            className={"dsa-bar" + cls(p.hi?.[i])}
            style={{
              left: (s * 100) / max + "%",
              width: ((e - s) * 100) / max + "%",
            }}
          >
            [{s},{e}]
          </span>
        </div>
      ))}
    </div>
  );
}

const map = {
  array: ArrayPanel,
  grid: GridPanel,
  list: ListPanel,
  stack: StackPanel,
  queue: QueuePanel,
  map: MapPanel,
  bits: BitsPanel,
  btree: BTreePanel,
  ntree: NTreePanel,
  chips: ChipsPanel,
  intervals: BarsPanel,
};

export default function Panel({ p }) {
  const C = map[p.type];
  return (
    <div className={"dsa-panel dsa-panel-" + p.type}>
      {p.label && <div className="dsa-plabel">{p.label}</div>}
      {C ? <C p={p} /> : null}
    </div>
  );
}
