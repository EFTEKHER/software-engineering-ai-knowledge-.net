import assert from "node:assert/strict";
import path from "node:path";
import initSqlJs from "sql.js";
import { schema, sql } from "../src/content/sql.js";
import expanded from "../src/content/reference/sql.js";
import { sqlServerChapters } from "../src/content/reference/sqlServer.js";
const SQL = await initSqlJs({
  locateFile: (name) => path.resolve("node_modules/sql.js/dist", name),
});
let passed = 0;
for (let i = 0; i < sql.length; i++) {
  for (const [kind, query] of [
    ["quick", sql[i][2]],
    ["reference", expanded[i].examples[0].code],
  ]) {
    const db = new SQL.Database();
    try {
      db.run(schema);
      const results = db.exec(query);
      assert.ok(Array.isArray(results));
      passed++;
    } catch (error) {
      throw new Error(`${kind} SQL topic ${i}: ${error.message}`);
    } finally {
      db.close();
    }
  }
}
// SQL Server track: every in-browser (language "sql") practice example must run.
for (const [topic, chapter] of Object.entries(sqlServerChapters)) {
  for (const example of chapter.examples.filter((e) => e.language === "sql")) {
    const db = new SQL.Database();
    try {
      db.run(schema);
      assert.ok(Array.isArray(db.exec(example.code)));
      passed++;
    } catch (error) {
      throw new Error(`SQL Server track "${topic}": ${error.message}`);
    } finally {
      db.close();
    }
  }
}
console.log(
  `PASS: ${passed} SQL examples executed against freshly seeded SQLite databases.`,
);
