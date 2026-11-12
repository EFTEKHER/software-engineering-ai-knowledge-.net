import React, { useState } from "react";
import "./learning.css";
import modules from "../curriculum.json";
import { getLesson } from "../content/lessons";
import Diagram from "./Diagram";
import CodeLab from "./CodeLab";
export default function PracticeLab({ lang }) {
  const [m, setM] = useState(3),
    [t, setT] = useState(5);
  let lesson = getLesson(modules[m], t);
  return (
    <section className="practice-hub">
      <div className="path-heading">
        <div>
          <h2>Interactive learning lab · শেখার পরীক্ষাগার</h2>
          <p>
            Pick a concept. Change the inputs, trace the diagram, and read the
            code.
          </p>
        </div>
      </div>
      <div className="lab-selectors">
        <label>
          Module / মডিউল
          <select
            value={m}
            onChange={(e) => {
              setM(+e.target.value);
              setT(0);
            }}
          >
            {modules.map((x) => (
              <option value={x.id} key={x.id}>
                {x.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Concept / বিষয়
          <select value={t} onChange={(e) => setT(+e.target.value)}>
            {modules[m].topics.map((x, i) => (
              <option value={i} key={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Diagram key={lesson.id} lesson={lesson} lang={lang} />
      <CodeLab key={"code" + lesson.id} lesson={lesson} lang={lang} />
    </section>
  );
}
