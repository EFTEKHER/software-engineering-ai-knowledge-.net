import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/* ---------------- T-SQL syntax highlighter ---------------- */
const KEYWORDS = new Set(
  `ADD ALL ALTER AND ANY APPLY AS ASC AUTO BEGIN BETWEEN BIGINT BINARY BIT BREAK BY CASCADE CASE CAST CATCH CHAR CHECK CHECKPOINT CLOSE CLUSTERED COLUMNSTORE COMMIT CONSTRAINT CONTINUE CREATE CROSS CUBE CURSOR DATABASE DATE DATETIME DATETIME2 DATETIMEOFFSET DEALLOCATE DECIMAL DECLARE DEFAULT DELAY DELETE DESC DETAILED DISABLE DISTINCT DROP ELSE END ESCAPE EXCEPT EXEC EXECUTE EXISTS FAST_FORWARD FETCH FIRST FLOAT FOR FOREIGN FROM FULLSCAN FUNCTION GLOBAL GO GOTO GRANT GROUP GROUPING HASH HAVING HISTOGRAM HOLDLOCK IDENTITY IF IN INCLUDE INDEX INNER INSERT INSTEAD INT INTERSECT INTO IS JOIN JSON KEY LEFT LEVEL LIKE LOCAL LOOP MATCHED MAX MERGE NEXT NOCOUNT NOEXPAND NONCLUSTERED NOT NOWAIT NULL NVARCHAR OF OFF OFFSET ON ONLY OPEN OPTIMIZE OPTION OR ORDER OUTER OUTPUT OVER PARTITION PATH PERIOD PERSISTED PIVOT PRECEDING PRIMARY PROCEDURE RANGE READ READONLY RECOMPILE REFERENCES RETURN RETURNS RIGHT ROLE ROLLBACK ROLLUP ROW ROWLOCK ROWS ROWVERSION SAVE SCHEMABINDING SELECT SERIALIZABLE SET SETS SNAPSHOT SOURCE STATISTICS SYSNAME SYSTEM_TIME SYSTEM_VERSIONING TABLE TARGET THEN THROW TIME TO TOP TRAN TRANSACTION TRIGGER TRUNCATE TRY TYPE UNBOUNDED UNCOMMITTED UNION UNIQUE UNIQUEIDENTIFIER UNKNOWN UNPIVOT UPDATE UPDLOCK USE USING VALUES VARCHAR VIEW WAITFOR WHEN WHERE WHILE WITH WITHIN WITHOUT_ARRAY_WRAPPER XACT_ABORT XML`.split(
    /\s+/,
  ),
);
const FUNCTIONS = new Set(
  `ABS AVG COALESCE CONVERT COUNT COUNT_BIG CURRENT_TIMESTAMP DATALENGTH DATEADD DATEDIFF DATEFROMPARTS DB_ID DENSE_RANK EOMONTH ERROR_LINE ERROR_MESSAGE ERROR_NUMBER ERROR_PROCEDURE FORMAT GETDATE IIF ISJSON ISNULL JSON_VALUE LAG LEAD MIN MONTH NEWID NEWSEQUENTIALID NTILE NULLIF OBJECT_ID OBJECT_NAME OPENJSON QUOTENAME RANK REPLICATE ROUND ROWCOUNT_BIG ROW_NUMBER STRING_AGG STRING_SPLIT STUFF SUBSTRING SUM SUSER_SNAME SYSUTCDATETIME TRIM TYPE_NAME UPPER XACT_STATE YEAR`.split(
    /\s+/,
  ),
);
const TOKEN =
  /(--[^\n]*|\/\*[\s\S]*?\*\/)|(N?'(?:[^']|'')*')|(@@?\w+|#\w+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][\w$]*\b)/g;

export function highlight(code) {
  const out = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [text, comment, str, variable, num, word] = m;
    let cls = null;
    if (comment) cls = "tk-comment";
    else if (str) cls = "tk-string";
    else if (variable) cls = "tk-var";
    else if (num) cls = "tk-num";
    else if (word) {
      const up = word.toUpperCase();
      if (KEYWORDS.has(up)) cls = "tk-kw";
      else if (FUNCTIONS.has(up)) cls = "tk-fn";
    }
    out.push(
      cls ? (
        <span key={key++} className={cls}>
          {text}
        </span>
      ) : (
        text
      ),
    );
    last = m.index + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeBlock({ code, label = "T-SQL · SQL Server" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const html = useMemo(() => highlight(code), [code]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }
  return (
    <figure className="sqlm-code">
      <figcaption>
        <span>{label}</span>
        <button type="button" onClick={copy} aria-label="Copy SQL code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre tabIndex={0}>
        <code>{html}</code>
      </pre>
    </figure>
  );
}
