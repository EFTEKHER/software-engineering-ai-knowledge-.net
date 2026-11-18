import React, { useEffect, useRef, useState } from "react";
import { Database, Play } from "lucide-react";
import {
  challenges,
  hrmsSchema,
  sqlServerTopics,
} from "../content/hrmsOptimization";
import "./hrmsOptimization.css";

export default function HrmsOptimization() {
  const [selected, setSelected] = useState(challenges[0].id);
  const challenge = challenges.find(({ id }) => id === selected);

  return (
    <section className="hrms-module" aria-labelledby="hrms-title">
      <header className="hrms-hero">
        <Database size={25} aria-hidden="true" />
        <h1 id="hrms-title">SQL Query Optimization</h1>
        <p>
          Tune complex queries for a human resources management system (HRMS).
          Write SQL, inspect query plans, and work through each solution.
        </p>
      </header>
      <div className="hrms-layout">
        <nav className="hrms-panel hrms-nav" aria-label="HRMS challenges">
          <h2>Practice challenges</h2>
          {challenges.map(({ id, title, topic }) => (
            <button
              key={id}
              type="button"
              aria-current={id === selected ? "true" : undefined}
              onClick={() => setSelected(id)}
            >
              <strong>{title}</strong>
              <span>{topic}</span>
            </button>
          ))}
        </nav>
        <Challenge key={challenge.id} challenge={challenge} />
      </div>
      <div className="hrms-panel hrms-reference">
        <h2>SQL Server tuning notes</h2>
        <p>
          The editor runs SQLite on synthetic HRMS records. These notes connect
          the exercises to the SQL Server topics in chapters 20–25 of
          <cite> SQL for Software Developers &amp; Backend Engineers</cite>.
        </p>
        <div className="hrms-topics">
          {sqlServerTopics.map(({ title, detail }) => (
            <section key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function Challenge({ challenge }) {
  const [query, setQuery] = useState(challenge.starter);
  const [indexed, setIndexed] = useState(false);
  const [response, setResponse] = useState(null);
  const [busy, setBusy] = useState(false);
  const worker = useRef(null);
  const timer = useRef(null);

  useEffect(
    () => () => {
      worker.current?.terminate();
      clearTimeout(timer.current);
    },
    [],
  );

  function run(plan) {
    setBusy(true);
    setResponse(null);
    const session = new Worker(
      new URL("./hrmsOptimization.worker.js", import.meta.url),
      {
        type: "module",
      },
    );
    worker.current = session;
    function finish(data) {
      clearTimeout(timer.current);
      session.terminate();
      worker.current = null;
      setResponse({ ...data, plan });
      setBusy(false);
    }
    session.onmessage = ({ data }) => finish(data);
    session.onerror = () =>
      finish({ error: "The SQL engine could not start. Try again." });
    timer.current = setTimeout(
      () =>
        finish({
          error: "The query took too long. Narrow the input and try again.",
        }),
      10000,
    );
    session.postMessage({ query, plan, index: indexed ? challenge.index : "" });
  }

  return (
    <article className="hrms-panel hrms-exercise">
      <header>
        <h2>{challenge.title}</h2>
        <p>{challenge.prompt}</p>
      </header>
      <details>
        <summary>Sample database schema and data</summary>
        <pre>{hrmsSchema.trim()}</pre>
      </details>
      <label htmlFor="hrms-query">Your query (SQLite)</label>
      <textarea
        id="hrms-query"
        spellCheck="false"
        autoCapitalize="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="hrms-actions">
        <button
          type="button"
          className="hrms-run"
          onClick={() => run(false)}
          disabled={busy || !query.trim()}
        >
          <Play size={14} aria-hidden="true" /> Run query
        </button>
        <button
          type="button"
          onClick={() => run(true)}
          disabled={busy || !query.trim()}
        >
          Explain plan
        </button>
        <button type="button" onClick={() => setQuery(challenge.starter)}>
          Reset query
        </button>
        <label>
          <input
            type="checkbox"
            checked={indexed}
            onChange={(event) => setIndexed(event.target.checked)}
          />
          Apply suggested indexes
        </label>
      </div>
      <div aria-live="polite" aria-busy={busy} className="hrms-results">
        {busy && <p>Running SQL…</p>}
        {response && <QueryResults response={response} />}
      </div>
      <details>
        <summary>Step-by-step solution</summary>
        <ol>
          {challenge.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h3>Solution query</h3>
        <pre>{challenge.solution}</pre>
        <button type="button" onClick={() => setQuery(challenge.solution)}>
          Load solution
        </button>
        <h3>Suggested indexes</h3>
        <pre>{challenge.index}</pre>
        <p>
          Run Explain plan before and after applying the indexes. Look for
          changes in access paths, sorting, and grouping.
        </p>
      </details>
    </article>
  );
}

function QueryResults({ response }) {
  if (response.error) return <p role="alert">{response.error}</p>;
  if (!response.results.length) return <p>No rows returned.</p>;

  return response.results.map(({ columns, values, total }, resultIndex) => (
    <div
      className="hrms-result-scroll"
      key={resultIndex}
      tabIndex={0}
      aria-label="SQL output"
    >
      <table>
        <caption>
          {response.plan ? "SQLite query plan" : "Query results"} · {total}{" "}
          {total === 1 ? "row" : "rows"}
          {total > values.length && ` (showing ${values.length})`}
        </caption>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, index) => (
            <tr key={index}>
              {row.map((value, cell) => (
                <td key={cell}>{value === null ? "NULL" : String(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));
}
