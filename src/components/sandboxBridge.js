/** Lets lesson examples open their code in the Sandbox page. */
export const sandboxLanguages = { javascript: "javascript", python: "python", sql: "sql", "sql-reference": "sql", csharp: "csharp" };
export function sendToSandbox(language, code) {
  try {
    sessionStorage.setItem("sandbox-handoff", JSON.stringify({ language: sandboxLanguages[language], code }));
  } catch {}
  window.dispatchEvent(new CustomEvent("open-sandbox"));
}
