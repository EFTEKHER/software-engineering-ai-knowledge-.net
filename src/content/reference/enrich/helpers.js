// Small example builders used by the per-module enrichment files.
export { consoleEx as cs, webEx as web } from "../aspnetHelpers";

const shellSetupEn =
  "Run these commands in a safe practice folder (or a throwaway VM/container). Lines starting with # are comments. Compare your terminal with the expected result.";
const shellSetupBn =
  "নিরাপদ অনুশীলনের folder-এ (বা ফেলে দেওয়া VM/container-এ) এই command চালান। # দিয়ে শুরু লাইন মন্তব্য। আপনার terminal-এর ফল প্রত্যাশিত ফলের সাথে মিলিয়ে দেখুন।";

// Short snippets get a heading comment (and padding) so every example has context.
function withHeader(code, title, comment = "#") {
  const lines = [`${comment} ${title.split(" · ")[0]}`, ...code.split("\n")];
  while (lines.length < 4) lines.splice(1, 0, `${comment} Run the lines below one at a time and compare with the expected output.`);
  return lines.join("\n");
}

/** Shell walkthrough with the output a learner should see. */
export function sh(title, code, expectedOutput) {
  return {
    title,
    kind: "Hands-on terminal practice",
    language: "bash",
    setupEn: shellSetupEn,
    setupBn: shellSetupBn,
    commands: "# Practice folder\nmkdir -p ~/practice && cd ~/practice",
    code: code.split("\n").length < 4 ? withHeader(code, title) : code,
    expectedOutput,
  };
}

/** Any other file type (yaml, dockerfile, hcl, sql, json, javascript...). */
export function file(language, title, code, expectedOutput, kind = "Ready-to-use file") {
  return { title, kind, language, code, expectedOutput };
}

/** SQL that runs in the in-browser SQLite lab (Departments/Employees schema). */
export function sql(title, code, expectedOutput) {
  return { title, kind: "Executable SQLite example", language: "sql", code, expectedOutput };
}
