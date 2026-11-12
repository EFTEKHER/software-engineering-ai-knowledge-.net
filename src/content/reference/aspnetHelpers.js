// Shared builders for ASP.NET Core track examples.
const consoleSetupEn =
  "Create a console project, replace Program.cs with this complete example, then run it. Implicit usings are enabled by the template.";
const consoleSetupBn =
  "Console project বানান। Program.cs-এর লেখা এই উদাহরণ দিয়ে বদলে চালান। Template-এর implicit usings চালু থাকবে।";

export function consoleEx(title, code, expectedOutput, packages = []) {
  return {
    title,
    kind: "Console example",
    language: "csharp",
    setupEn: consoleSetupEn,
    setupBn: consoleSetupBn,
    commands: [
      "dotnet new console -n LearnBackend",
      ...packages.map((p) => `dotnet add LearnBackend package ${p}`),
      "# Replace LearnBackend/Program.cs with the example.",
      "dotnet run --project LearnBackend",
    ].join("\n"),
    code,
    expectedOutput,
  };
}

export function webEx(title, code, tryRequest, packages = []) {
  return {
    title,
    kind: "ASP.NET Core program",
    language: "csharp",
    setupEn:
      "Create an empty ASP.NET Core project and replace Program.cs. Run locally, then use the port printed by the host. This is a learning app with deliberately small in-memory state.",
    setupBn:
      "একটি empty ASP.NET Core project বানিয়ে Program.cs বদলান। Local-এ চালিয়ে host যে port দেখায় সেটি ব্যবহার করুন। শেখার জন্য ইচ্ছাকৃতভাবে ছোট in-memory data।",
    commands: [
      "dotnet new web -n LearnApi",
      ...packages.map((p) => `dotnet add LearnApi package ${p}`),
      "# Replace LearnApi/Program.cs with the example.",
      "dotnet run --project LearnApi",
    ].join("\n"),
    code,
    tryRequest,
  };
}

export function refEx(title, code, en, bn, language = "csharp") {
  return {
    title,
    kind: "Project file (reference)",
    language,
    setupEn: en,
    setupBn: bn,
    code,
  };
}

