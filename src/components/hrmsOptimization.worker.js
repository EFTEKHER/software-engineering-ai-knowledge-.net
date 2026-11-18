import initSqlJs from "sql.js";
import { hrmsSchema } from "../content/hrmsOptimization";

const ready = initSqlJs({ locateFile: () => "/sql-wasm.wasm" });

self.onmessage = async ({ data: { query, index, plan } }) => {
  let db;
  try {
    const SQL = await ready;
    db = new SQL.Database();
    db.run(hrmsSchema);
    if (index) db.run(index);
    const results = db.exec(plan ? "EXPLAIN QUERY PLAN " + query : query);
    self.postMessage({
      results: results.map(({ columns, values }) => ({
        columns,
        values: values.slice(0, 100),
        total: values.length,
      })),
    });
  } catch (error) {
    self.postMessage({ error: error.message });
  } finally {
    db?.close();
  }
};
