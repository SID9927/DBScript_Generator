import React, { useState } from "react";

/**
 * NO external parser.
 * Heuristic, depth-aware scanner that:
 * - Finds FROM/JOIN at top level (outside strings/comments); also processes inside (...) recursively.
 * - For each table source, ensures NOLOCK is right after the table name and before alias.
 * - Moves/removes misplaced NOLOCK (e.g., after alias).
 * - Skips adding NOLOCK to derived tables "(SELECT...)", and function-like sources "fn(...)" / OPENQUERY(...).
 * - Handles CTE bodies because parentheses are processed recursively.
 * - Supports comma-separated sources in FROM.
 */



const SPWithNoLockEnhancer = () => {
  const [inputSP, setInputSP] = useState("");
  const [outputSP, setOutputSP] = useState("");
  const [mode, setMode] = useState("enforce"); // "enforce" | "remove"
  const [copied, setCopied] = useState(false);

  // ------------ Low-level helpers (lexing-ish) ------------
  const isIdentStart = (ch) => /[A-Za-z_]/.test(ch) || ch === "[" || ch === '"';
  const isIdentChar = (ch) => /[A-Za-z0-9_$]/.test(ch);
  const isWordBoundary = (prev, next) =>
    !(prev && /[A-Za-z0-9_$]/.test(prev)) && !(next && /[A-Za-z0-9_$]/.test(next));

  const skipSpaces = (s, i) => {
    while (i < s.length && /\s/.test(s[i])) i++;
    return i;
  };

  const readLineEnd = (s, i) => {
    while (i < s.length && s[i] !== "\n" && s[i] !== "\r") i++;
    return i;
  };

  const readBlockCommentEnd = (s, i) => {
    // i points at first char after "/*"
    while (i < s.length) {
      if (s[i] === "*" && s[i + 1] === "/") return i + 2;
      i++;
    }
    return s.length;
  };

  const readSingleQuoted = (s, i) => {
    // i points after opening "'"
    while (i < s.length) {
      if (s[i] === "'") {
        if (s[i + 1] === "'") {
          i += 2; // escaped ''
          continue;
        }
        return i + 1;
      }
      i++;
    }
    return s.length;
  };

  const readBracketIdent = (s, i) => {
    // i points after '['
    while (i < s.length) {
      if (s[i] === "]") {
        if (s[i + 1] === "]") {
          i += 2; // escaped ]]
          continue;
        }
        return i + 1;
      }
      i++;
    }
    return s.length;
  };

  const readQuotedIdent = (s, i) => {
    // i points after '"'
    while (i < s.length) {
      if (s[i] === '"') return i + 1;
      i++;
    }
    return s.length;
  };

  const readBalanced = (s, i) => {
    // i points at '('
    let depth = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === "(") {
        depth++;
        i++;
        continue;
      } else if (ch === ")") {
        depth--;
        i++;
        if (depth === 0) return i; // return index after ')'
        continue;
      } else if (ch === "'") {
        i = readSingleQuoted(s, i + 1);
        continue;
      } else if (ch === "[") {
        i = readBracketIdent(s, i + 1);
        continue;
      } else if (ch === '"') {
        i = readQuotedIdent(s, i + 1);
        continue;
      } else if (ch === "-" && s[i + 1] === "-") {
        i = readLineEnd(s, i + 2);
        continue;
      } else if (ch === "/" && s[i + 1] === "*") {
        i = readBlockCommentEnd(s, i + 2);
        continue;
      }
      i++;
    }
    return s.length;
  };

  const ciMatchWord = (s, i, word) => {
    // match word at i with boundaries
    if (s.substring(i, i + word.length).toUpperCase() === word.toUpperCase()) {
      const prev = i > 0 ? s[i - 1] : "";
      const next = s[i + word.length];
      if (isWordBoundary(prev, next)) return word.length;
    }
    return 0;
  };

  const ciMatchTokens = (s, i, tokens) => {
    // tokens like ["LEFT","JOIN"]; allow any whitespace/newlines between tokens
    let pos = i;
    let consumedText = "";
    for (let t = 0; t < tokens.length; t++) {
      pos = skipSpaces(s, pos);
      const len = ciMatchWord(s, pos, tokens[t]);
      if (!len) return 0;
      consumedText += s.substring(pos, pos + len);
      pos += len;
      if (t < tokens.length - 1) {
        // must have at least one space/newline between multiword tokens
        const after = s[pos];
        if (after && !/\s/.test(after)) return 0;
      }
    }
    return pos - i;
  };

  const anyKeywordAt = (s, i, patterns) => {
    for (const p of patterns) {
      const len = ciMatchTokens(s, i, p);
      if (len) return { len, tokens: p };
    }
    return null;
  };

  // Keywords we care about
  const KW_FROM = [["FROM"]];
  const KW_JOINS = [
    ["JOIN"],
    ["LEFT", "JOIN"],
    ["RIGHT", "JOIN"],
    ["INNER", "JOIN"],
    ["FULL", "JOIN"],
    ["OUTER", "JOIN"],
    ["CROSS", "JOIN"],
    ["CROSS", "APPLY"],
    ["OUTER", "APPLY"],
  ];
  const TERMINATORS = [
    ["ON"], // for JOIN
    ["WHERE"],
    ["GROUP"],
    ["ORDER"],
    ["HAVING"],
    ["UNION"],
    ["EXCEPT"],
    ["INTERSECT"],
    ["OPTION"],
  ];

  const isTerminatorAt = (s, i) => anyKeywordAt(s, i, TERMINATORS);

  // ------------ NOLOCK helpers ------------
  const stripNoLockEverywhere = (txt) =>
    txt.replace(/\bWITH\s*\(\s*NOLOCK\s*\)/gi, "");

  // Read a multipart table name like: [dbo].[Table], dbo.Table, [My Schema].[Tbl]
  // Returns end index right after the last identifier part (and any dot parts).
  const readMultipartNameEnd = (s, i0) => {
    let i = skipSpaces(s, i0);
    let seenPart = false;

    while (i < s.length) {
      if (s[i] === "[") {
        i = readBracketIdent(s, i + 1);
        seenPart = true;
      } else if (s[i] === '"') {
        i = readQuotedIdent(s, i + 1);
        seenPart = true;
      } else if (isIdentChar(s[i])) {
        // read plain identifier
        let j = i + 1;
        while (j < s.length && isIdentChar(s[j])) j++;
        i = j;
        seenPart = true;
      } else {
        break;
      }
      // dotted part?
      let k = i;
      k = skipSpaces(s, k);
      if (s[k] === ".") {
        i = k + 1;
        i = skipSpaces(s, i);
        continue;
      } else {
        break;
      }
    }
    return seenPart ? i : i0;
  };

  // Detect if the source is function-like, e.g., OPENQUERY(...), fn(...).
  const looksFunctionLikeAt = (s, start, end) => {
    const i = skipSpaces(s, end);
    return s[i] === "("; // name(...) immediately after multipart name
  };

  // Parse and rewrite ONE table reference (before ON/JOIN/WHERE/,...)
  const parseOneTableRef = (sql, start, action) => {
    let i = skipSpaces(sql, start);
    const leading = sql.substring(start, i); // keep indentation/spaces

    // If derived table "(...)" — process inner recursively but DO NOT add NOLOCK here
    if (sql[i] === "(") {
      const closeAfter = readBalanced(sql, i);
      const inner = sql.substring(i + 1, closeAfter - 1);
      const processedInner = transform(inner, action);
      let out = leading + "(" + processedInner + ")";

      // Handle alias after derived table
      let p = skipSpaces(sql, closeAfter);
      let aliasText = "";

      // check for "AS alias" or bare alias
      const asLen = ciMatchWord(sql, p, "AS");
      if (asLen) {
        const aliasStart = p;
        p += asLen;
        const afterAs = skipSpaces(sql, p);
        let aliasEnd = afterAs;

        if (sql[aliasEnd] === "[") aliasEnd = readBracketIdent(sql, aliasEnd + 1);
        else if (sql[aliasEnd] === '"') aliasEnd = readQuotedIdent(sql, aliasEnd + 1);
        else if (isIdentStart(sql[aliasEnd])) {
          let j = aliasEnd + 1;
          while (isIdentChar(sql[j])) j++;
          aliasEnd = j;
        }
        aliasText = sql.substring(aliasStart, aliasEnd);
        p = aliasEnd;
      } else if (isIdentStart(sql[p])) {
        let aliasEnd = p + 1;
        while (isIdentChar(sql[aliasEnd])) aliasEnd++;
        aliasText = sql.substring(p, aliasEnd);
        p = aliasEnd;
      }

      // remove NOLOCK after alias if exists
      let tail = sql.substring(p);
      tail = tail.replace(/^\s*\bWITH\s*\(\s*NOLOCK\s*\)/i, "");

      out += aliasText + tail;
      return { text: out, nextPos: sql.length - tail.length };
    }

    // Base table or TVF
    const nameStart = i;
    const nameEnd = readMultipartNameEnd(sql, i);
    if (nameEnd === i) {
      return { text: sql[start], nextPos: start + 1 }; // nothing parsed
    }

    // If function-like (fn(...), OPENQUERY(...)) => leave as-is, just strip misplaced NOLOCK
    if (looksFunctionLikeAt(sql, nameStart, nameEnd)) {
      const argsEnd = readBalanced(sql, skipSpaces(sql, nameEnd));
      let segment = sql.substring(start, argsEnd);
      segment = stripNoLockEverywhere(segment);
      return { text: segment, nextPos: argsEnd };
    }

    // Slice until ON/WHERE/… or comma
    let q = nameEnd;
    let localDepth = 0;
    while (q < sql.length) {
      if (sql[q] === "(") { localDepth++; q++; continue; }
      if (sql[q] === ")") { if (localDepth === 0) break; localDepth--; q++; continue; }
      if (sql[q] === "'" || sql[q] === "[" || sql[q] === '"' ||
        (sql[q] === "-" && sql[q + 1] === "-") || (sql[q] === "/" && sql[q + 1] === "*")) {
        if (sql[q] === "'") q = readSingleQuoted(sql, q + 1);
        else if (sql[q] === "[") q = readBracketIdent(sql, q + 1);
        else if (sql[q] === '"') q = readQuotedIdent(sql, q + 1);
        else if (sql[q] === "-" && sql[q + 1] === "-") q = readLineEnd(sql, q + 2);
        else if (sql[q] === "/" && sql[q + 1] === "*") q = readBlockCommentEnd(sql, q + 2);
        continue;
      }
      if (localDepth === 0) {
        if (isTerminatorAt(sql, q) || sql[q] === ",") break;
      }
      q++;
    }

    let slice = sql.substring(nameStart, q);   // table + alias + any existing hints

    // Extract table name
    const relNameEnd = readMultipartNameEnd(slice, 0);
    const tableText = slice.substring(0, relNameEnd);
    let afterTable = slice.substring(relNameEnd);

    // Check if NOLOCK already exists right after table name
    const existingNolockMatch = afterTable.match(/^\s*WITH\s*\(\s*NOLOCK\s*\)/i);
    const hasExistingNolock = existingNolockMatch !== null;

    // Remove ALL existing NOLOCK hints from the entire slice
    afterTable = afterTable.replace(/\bWITH\s*\(\s*NOLOCK\s*\)/gi, "");

    // Extract alias (if any) from the cleaned afterTable
    let aliasMatch = afterTable.match(/^\s*(AS\s+)?(\[?[A-Za-z0-9_]+\]?)/i);
    let aliasPart = "";
    let afterAlias = "";

    if (aliasMatch) {
      aliasPart = afterTable.substring(0, aliasMatch[0].length);
      afterAlias = afterTable.substring(aliasMatch[0].length);
    } else {
      afterAlias = afterTable;
    }

    // Build output
    let out = leading + tableText;

    if (action === "remove") {
      // Remove mode: just table + alias + rest (no NOLOCK)
      out += aliasPart + afterAlias;
    } else {
      // Enforce mode: table + WITH(NOLOCK) + alias + rest
      // Only add WITH(NOLOCK) if it wasn't already there in the correct position
      if (!hasExistingNolock) {
        out += " WITH(NOLOCK)";
      } else {
        out += " WITH(NOLOCK)"; // Re-add it in correct position
      }
      out += aliasPart + afterAlias;
    }

    return { text: out, nextPos: q };
  };




  // Parse a FROM list (can be t1, t2, ... then joins etc.). We handle the initial comma list.
  // Returns { text, nextPos }
  const parseFromSources = (sql, start, action) => {
    let out = "";
    let i = start;

    // initial one or more sources separated by commas
    while (i < sql.length) {
      const { text, nextPos } = parseOneTableRef(sql, i, action);
      out += text;
      i = skipSpaces(sql, nextPos);

      if (sql[i] === ",") {
        out += ",";
        i = skipSpaces(sql, i + 1);
        continue;
      }
      break;
    }

    return { text: out, nextPos: i };
  };

  // Main transformer: scans whole text, handles parentheses recursively, and rewrites after FROM/JOIN
  const transform = (sql, action /* "enhance" | "remove" */) => {
    let out = "";
    let i = 0;

    while (i < sql.length) {
      const ch = sql[i];

      // Comments
      if (ch === "-" && sql[i + 1] === "-") {
        const end = readLineEnd(sql, i + 2);
        out += sql.substring(i, end);
        i = end;
        continue;
      }
      if (ch === "/" && sql[i + 1] === "*") {
        const end = readBlockCommentEnd(sql, i + 2);
        out += sql.substring(i, end);
        i = end;
        continue;
      }

      // Strings / bracket idents
      if (ch === "'") {
        const end = readSingleQuoted(sql, i + 1);
        out += sql.substring(i, end);
        i = end;
        continue;
      }
      if (ch === "[") {
        const end = readBracketIdent(sql, i + 1);
        out += sql.substring(i, end);
        i = end;
        continue;
      }
      if (ch === '"') {
        const end = readQuotedIdent(sql, i + 1);
        out += sql.substring(i, end);
        i = end;
        continue;
      }

      // Parentheses → process inside recursively (this covers CTE bodies & subqueries)
      if (ch === "(") {
        const end = readBalanced(sql, i);
        const inner = sql.substring(i + 1, end - 1);
        out += "(" + transform(inner, action) + ")";
        i = end;
        continue;
      }

      // FROM?
      const fromHit = anyKeywordAt(sql, i, KW_FROM);
      if (fromHit) {
        const kw = sql.substring(i, i + fromHit.len);
        out += kw;
        i += fromHit.len;
        // Parse sources after FROM (comma list handled here)
        const { text, nextPos } = parseFromSources(sql, i, action);
        out += text;
        i = nextPos;
        continue;
      }

      // JOIN variants?
      const joinHit = anyKeywordAt(sql, i, KW_JOINS);
      if (joinHit) {
        const kw = sql.substring(i, i + joinHit.len); // preserve original casing/spaces
        out += kw;
        i += joinHit.len;

        // After JOIN keyword, rewrite exactly ONE table reference (before ON/terminator)
        const { text, nextPos } = parseOneTableRef(sql, i, action);
        out += text;
        i = nextPos;
        continue;
      }

      // default: copy char
      out += ch;
      i++;
    }

    return out;
  };

  // ------------- UI handlers -------------
  const handleRun = () => {
    const action = mode === "enforce" ? "enhance" : "remove";
    const result = transform(inputSP, action);
    setOutputSP(result);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!outputSP) return;
    await navigator.clipboard.writeText(outputSP);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // ------------- UI -------------
  return (
    <div className="flex h-screen relative">
      {/* Left */}
      <div className="w-1/2 p-4 border-r border-gray-300 relative">
        <h2 className="text-xl font-bold mb-2">Paste Stored Procedure (T-SQL)</h2>
        <textarea
          className="w-full h-[78%] p-2 border rounded resize-none font-mono"
          value={inputSP}
          onChange={(e) => setInputSP(e.target.value)}
          placeholder={`FROM
    TR_SI_RequestMaker MPB WITH(NOLOCK)
    LEFT JOIN TR_SI_Request TS ON MPB.SI_Id=TS.SI_Id
    -- etc...`}
        />

        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <label className="text-sm font-medium">Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="enforce">Enforce WITH (NOLOCK)</option>
            <option value="remove">Remove WITH (NOLOCK)</option>
          </select>

          <button
            onClick={handleRun}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Run
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Transformed SP</h2>
          <button
            onClick={handleCopy}
            disabled={!outputSP}
            className={`px-3 py-1 rounded ${copied ? "bg-green-600 text-white" : "bg-gray-700 text-white hover:bg-gray-800"
              }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea
          className="w-full flex-grow p-2 border rounded resize-none bg-gray-100 text-gray-800 font-mono"
          value={outputSP}
          readOnly
        />
      </div>
    </div>
  );
};

export default SPWithNoLockEnhancer;
