// The in-browser SQL lab loads SQLite as WebAssembly from /sql-wasm.wasm.
import { copyFile, mkdir } from "node:fs/promises";
await mkdir("public", { recursive: true });
await copyFile("node_modules/sql.js/dist/sql-wasm.wasm", "public/sql-wasm.wasm");
console.log("SQL lab ready: public/sql-wasm.wasm");
