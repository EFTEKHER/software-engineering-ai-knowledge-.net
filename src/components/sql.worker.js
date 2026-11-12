import initSqlJs from "sql.js";
import { schema } from "../content/sql";
let db;
const ready = initSqlJs({ locateFile: () => "/sql-wasm.wasm" }).then((SQL) => {
  db = new SQL.Database();
  db.run(schema);
  return SQL;
});
self.onmessage = async (event) => {
  const { id, query, reset } = event.data;
  try {
    const SQL = await ready;
    if (reset) {
      db.close();
      db = new SQL.Database();
      db.run(schema);
      self.postMessage({ id, reset: true });
      return;
    }
    const results = db
      .exec(query)
      .map((r) => ({
        columns: r.columns,
        values: r.values.slice(0, 200),
        total: r.values.length,
      }));
    self.postMessage({ id, results, modified: db.getRowsModified() });
  } catch (e) {
    self.postMessage({ id, error: e.message });
  }
};
