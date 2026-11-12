import React, { useState } from "react";
import "./learning.css";
import {
  Download,
  Upload,
  BookOpen,
  Search,
  Bookmark,
  ArrowUpRight,
} from "lucide-react";
import { allLessons } from "../content/lessons";
export function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function useSaved(key, fallback) {
  const [value, setValue] = useState(() => readStore(key, fallback));
  const [error, setError] = useState("");
  const save = (v) => {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
      setError("");
    } catch {
      setError(
        "Browser storage is full or unavailable. Export your notes before leaving. / নোট download করে রাখুন।",
      );
    }
  };
  return [value, save, error];
}
export function TopicNotes({ lesson, lang }) {
  const [notes, save, error] = useSaved("mastery-topic-notes", {});
  return (
    <section className="topic-notes">
      <div className="section-kicker">07 / PERSONAL NOTES · নিজের নোট</div>
      <h2>
        {lang === "English"
          ? "Explain it in your own words"
          : "নিজের ভাষায় লিখুন · Your notebook"}
      </h2>
      <p className="muted">
        {lang === "English"
          ? "What is it? When would you use it? Which line confused you?"
          : "এটি কী? কখন ব্যবহার করবেন? কোন লাইনটি বুঝতে অসুবিধা হলো? নিজের উদাহরণ লিখুন।"}
      </p>
      <textarea
        aria-label="Topic notes"
        placeholder="আমার বোঝা... / My understanding..."
        value={notes[lesson.id] || ""}
        onChange={(e) => save({ ...notes, [lesson.id]: e.target.value })}
      />
      <small>
        {error ||
          "Saved in this browser only · এই browser-এ সংরক্ষিত। Notebook থেকে export করতে পারবেন।"}
      </small>
    </section>
  );
}
export default function Notebook({ onOpen }) {
  const [notes, setNotes, error] = useSaved("mastery-topic-notes", {}),
    [bookmarks, setBookmarks] = useSaved("mastery-bookmarks", []),
    [global, setGlobal] = useSaved("mastery-global-notes", ""),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("");
  let chosen = allLessons.filter(
    (l) =>
      (notes[l.id]?.trim() || bookmarks.includes(l.id)) &&
      `${l.topic} ${notes[l.id] || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const exportNotes = () => {
    let data = {
      format: "dotnet-mastery-notebook",
      version: 1,
      exportedAt: new Date().toISOString(),
      notes,
      bookmarks,
      global,
      progress: readStore("mastery-progress", []),
    };
    let url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    let a = document.createElement("a");
    a.href = url;
    a.download = "dotnet-mastery-notebook.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importNotes = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2e6) throw Error("File must be smaller than 2 MB.");
      const d = JSON.parse(await file.text());
      const ids = new Set(allLessons.map((l) => l.id));
      if (
        d.format !== "dotnet-mastery-notebook" ||
        d.version !== 1 ||
        !d.notes ||
        typeof d.notes !== "object" ||
        Array.isArray(d.notes)
      )
        throw Error("Not a supported notebook export.");
      let clean = Object.fromEntries(
        Object.entries(d.notes).filter(
          ([k, v]) => ids.has(k) && typeof v === "string",
        ),
      );
      setNotes({ ...notes, ...clean });
      setBookmarks([
        ...new Set([
          ...bookmarks,
          ...(Array.isArray(d.bookmarks)
            ? d.bookmarks.filter((x) => ids.has(x))
            : []),
        ]),
      ]);
      if (typeof d.global === "string" && d.global)
        setGlobal(global ? global + "\n\n" + d.global : d.global);
      setStatus(
        "Notes merged successfully. Existing notes with matching topics were replaced. / নোট যুক্ত হয়েছে।",
      );
    } catch (err) {
      setStatus(err.message);
    }
    e.target.value = "";
  };
  return (
    <section className="notebook notebook-full">
      <div className="notebook-top">
        <div>
          <h2>
            <BookOpen size={20} />
            My notebook · আমার নোট
          </h2>
          <p>
            Keep topic notes and bookmarks together. Export a backup before
            changing browser or device.
          </p>
        </div>
        <div>
          <button className="secondary" onClick={exportNotes}>
            <Download size={14} />
            Export
          </button>
          <label className="secondary import-notes">
            <Upload size={14} />
            Import
            <input
              type="file"
              accept="application/json,.json"
              onChange={importNotes}
            />
          </label>
        </div>
      </div>
      {(status || error) && <p role="status">{error || status}</p>}
      <label className="notebook-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your notes / নোট খুঁজুন"
        />
      </label>
      <div className="saved-topic-grid">
        {chosen.map((l) => (
          <article key={l.id}>
            <small>{l.module.title}</small>
            <h3>
              {bookmarks.includes(l.id) && <Bookmark size={14} />} {l.topic}
            </h3>
            <p>{notes[l.id] || "Bookmarked for later / পরে পড়বেন"}</p>
            <button onClick={() => onOpen(l.module, l.index)}>
              Open lesson
              <ArrowUpRight size={14} />
            </button>
          </article>
        ))}
      </div>
      {!chosen.length && (
        <div className="empty-notes">
          <BookOpen size={28} />
          <h3>Your learning notebook starts here.</h3>
          <p>
            Open any lesson to write notes or save a bookmark. / যেকোনো lesson
            খুলে নোট লিখুন বা bookmark করুন।
          </p>
        </div>
      )}
      <h3>General notes / সাধারণ নোট</h3>
      <textarea
        aria-label="General notes"
        value={global}
        placeholder="Questions, ideas, and study plans..."
        onChange={(e) => setGlobal(e.target.value)}
      />
      <small>
        Browser-local storage. Export includes notes, bookmarks, and a progress
        backup. Import merges notes/bookmarks; it does not change course
        progress.
      </small>
    </section>
  );
}
