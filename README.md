# .NET Mastery — bilingual engineering classroom

A client-side React JavaScript learning project for beginners studying in Bangla and English. Built with React 19, Vite, Lucide, self-hosted fonts, and SQLite compiled to WebAssembly.

## Start locally

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For a production build:

```sh
npm run build
```

`dist/` is a static site. No server, database service, API key, or cloud credentials are needed for the learning application.

## What is included

- 16 modules and all 320 topic entries from the supplied curriculum.
- Expanded reference chapters for every topic: 720 additional code examples and roughly 5,650 added code lines across the curriculum, with topic-specific mechanics, decisions, edge cases, and bilingual explanations.
- Chapter contents navigation, within-chapter text/code search, connected-topic links, copy/download controls, and Markdown chapter export.
- Additional SQL examples run in the browser; C# LINQ companions include complete in-memory fixtures.
- An absolute-beginner C# guide explaining syntax, variables, types, conditions, loops, methods, objects, and async/cancellation.
- Backend Engineering adds 60 complete C# examples across its 20 topics: console starters, ASP.NET Core/EF Core programs, and exercises with expected results. Each includes setup commands and beginner English/Bangla reading steps. These additions are isolated to module 7.
- Topic-specific English and Bangla intuitions, module foundations, analogies, prerequisites, glossary, code-line explanations, limitations, exercises, model answers, and official references.
- Beginner/intermediate/advanced reading depth. Advanced technical notes include English reference material alongside Bangla learning guidance.
- Step-controlled diagrams with play/pause, previous/next, speed, and direct node selection.
- Editable array inputs and real JavaScript traces for several C# algorithm examples; conceptual lifecycle graphs for architecture topics.
- Capacity/failure teaching models, security-boundary demonstrations, and Kubernetes replica visualization.
- Twenty executable SQL examples in a real SQLite browser database, a sample employee schema, editable queries, and database reset. SQL runs in a disposable Web Worker with a five-second timeout and a 200-row display cap.
- C# and infrastructure code reference walkthroughs, copy, download, and reset.
- Safe fixed-command output demonstrations for Git/Linux/Docker/Kubernetes. They never execute shell commands or change a real system.
- Topic notes, bookmarks, completion tracking, notebook JSON import/export, Bangla/English search, deep links, and responsive mobile navigation.
- Downloadable source ZIP generated at build time.

## Educational boundaries

The project is a growing guided engineering reference, not an exhaustive textbook or production-ready implementation of each of the 320 systems. Related curriculum entries intentionally share foundational examples. Framework/provider examples are labeled reference fragments; the lesson identifies surrounding dependencies and omitted production concerns. Advanced notes and some UI/reference text remain in English.

C# is not compiled or executed in the browser. Use a supported .NET SDK and a correctly configured project to run C# examples. The algorithm traces execute an equivalent JavaScript teaching model. Cloud examples do not contact AWS, and the deployment does not provide authenticated accounts or server-synced learning data.

Progress and notes belong to this browser/origin. Export the notebook before switching device or host. Import merges notes/bookmarks and retains current course progress. Source downloads contain no student notes or credentials.

## Project layout

```text
src/
  main.jsx                  App navigation, curriculum cards, search, progress
  curriculum.json           Ordered 16 × 20 curriculum
  content/
    lessons.js              Lesson resolver and integrity contract
    concepts.js             Topic theory, annotated examples, flow nodes, limits
    cli.js                  80 command reference lessons
    sql.js                  20 SQL lessons and sample schema
    context.js              Bilingual prerequisites, module primers, glossaries
    bangla.js               Beginner notes about errors and edge cases
    incidents.json          20 production case-study summaries
    reference/              Expanded canonical chapters, examples, and lazy loader
  components/
    LessonReader.jsx        Guided bilingual topic reader
    Diagram.jsx             Algorithm and system visualizations
    CodeLab.jsx             Syntax view, annotation pane, editable SQL/commands
    sql.worker.js           Isolated SQLite runner
    Notebook.jsx            Notes, bookmarks, import/export
    PracticeLab.jsx         Standalone interactive lab
    BeginnerGuide.jsx       C# from absolute zero
    learning.css            Reader, lab, and notebook layout
  style.css                 Workspace design system
scripts/
  check-content.mjs         Completeness and bilingual-content checks
  package-source.mjs        Deterministic source bundle generator
 tests/
  learning.spec.js          End-to-end learning-flow tests
```

## Check the project

```sh
npm run test:content
npm run test:sql
# Optional: compile self-contained C# examples with your installed .NET SDK
npm run test:csharp
npx playwright install chromium  # only when no browser is available
npm test
npm run build
```

Tests use `/usr/bin/chromium` when present, otherwise Playwright's Chromium. The suite checks every lesson route, all SQL examples, diagram behavior, bilingual line explanations, notes/progress persistence, search, quizzes, mobile layout, and capacity/failure controls. To test a separately served deployment, set `TEST_BASE_URL`.

`npm run test:csharp` compiles deduplicated self-contained console examples and checks selected algorithm outputs. It requires a .NET 8+ SDK (`DOTNET_BIN` can select its executable). Framework/provider integration fragments are not included in this compile-only category.

`npm run format` formats the source with Prettier.

## Vercel

The tracked `vercel.json` selects Vite, `npm run build`, and `dist/`. Import this folder into Vercel or deploy using the Vercel CLI from an authorized linked project. There are no environment variables for this static app. Existing team deployment protection settings are preserved.

## Extend the course

For quick guides, add or improve a record in `content/concepts.js`, retaining the `~~ English / বাংলা` code annotation format. Expanded chapters live in `content/reference/` by subject. Each chapter supplies bilingual mechanism/decision text and at least two additional code examples with explicit languages and execution/integration labels. Run `node scripts/reference-manifest.mjs` after adding a canonical chapter. Update a module's context, references, or practice as needed. Run the content integrity check and relevant browser tests after edits. New true execution runtimes should be implemented as an explicit separate feature rather than presented as if a teaching simulation were a compiler.

Font packages include their upstream open-font license files; dependencies retain their respective licenses.

## ASP.NET Core backend track

The Backend Engineering module (module 08) includes 18 hands-on ASP.NET Core lessons
(lessons 21–38): Web API setup, EF Core, controllers, DI, DTOs, a generic response model,
password hashing, CRUD, JWT, role-based and policy authorization, MVC with Razor,
JWT-in-cookie and built-in cookie authentication, CSRF, global error handling and
refresh tokens. Content lives in `src/content/aspnetConcepts.js` and
`src/content/reference/aspnet*.js`.

Pushing to `main` deploys to https://dotnet-mastery.vercel.app automatically.
