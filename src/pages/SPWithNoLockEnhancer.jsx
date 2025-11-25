import React, { useState } from "react";

// --- Reusable Components ---
const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative my-4">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-slate-700 text-white px-2 py-1 text-xs rounded hover:bg-slate-600 transition-colors"
      >
        {copied ? "✅ Copied!" : "Copy"}
      </button>
      <pre className="bg-slate-900 text-blue-200 p-4 rounded-lg overflow-x-auto text-sm border border-slate-700">
        <code>{children}</code>
      </pre>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b border-slate-200 pb-2">
    {children}
  </h2>
);

const SubSectionTitle = ({ children }) => (
  <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-3">
    {children}
  </h3>
);

const InfoCard = ({ type = "info", children }) => {
  const styles = {
    info: "bg-blue-50 border-blue-500 text-blue-800",
    success: "bg-green-50 border-green-500 text-green-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    danger: "bg-red-50 border-red-500 text-red-800",
  };
  return (
    <div className={`p-4 my-4 rounded-md border-l-4 ${styles[type]}`}>
      {children}
    </div>
  );
};

// --- NoLock Playground (Original Logic) ---
const NoLockPlayground = () => {
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
    while (i < s.length) {
      if (s[i] === "*" && s[i + 1] === "/") return i + 2;
      i++;
    }
    return s.length;
  };

  const readSingleQuoted = (s, i) => {
    while (i < s.length) {
      if (s[i] === "'") {
        if (s[i + 1] === "'") {
          i += 2;
          continue;
        }
        return i + 1;
      }
      i++;
    }
    return s.length;
  };

  const readBracketIdent = (s, i) => {
    while (i < s.length) {
      if (s[i] === "]") {
        if (s[i + 1] === "]") {
          i += 2;
          continue;
        }
        return i + 1;
      }
      i++;
    }
    return s.length;
  };

  const readQuotedIdent = (s, i) => {
    while (i < s.length) {
      if (s[i] === '"') return i + 1;
      i++;
    }
    return s.length;
  };

  const readBalanced = (s, i) => {
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
        if (depth === 0) return i;
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
    if (s.substring(i, i + word.length).toUpperCase() === word.toUpperCase()) {
      const prev = i > 0 ? s[i - 1] : "";
      const next = s[i + word.length];
      if (isWordBoundary(prev, next)) return word.length;
    }
    return 0;
  };

  const ciMatchTokens = (s, i, tokens) => {
    let pos = i;
    for (let t = 0; t < tokens.length; t++) {
      pos = skipSpaces(s, pos);
      const len = ciMatchWord(s, pos, tokens[t]);
      if (!len) return 0;
      pos += len;
      if (t < tokens.length - 1) {
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

  const KW_FROM = [["FROM"]];
  const KW_JOINS = [
    ["JOIN"], ["LEFT", "JOIN"], ["RIGHT", "JOIN"], ["INNER", "JOIN"],
    ["FULL", "JOIN"], ["OUTER", "JOIN"], ["CROSS", "JOIN"],
    ["CROSS", "APPLY"], ["OUTER", "APPLY"],
  ];
  const TERMINATORS = [
    ["ON"], ["WHERE"], ["GROUP"], ["ORDER"], ["HAVING"],
    ["UNION"], ["EXCEPT"], ["INTERSECT"], ["OPTION"],
  ];

  const isTerminatorAt = (s, i) => anyKeywordAt(s, i, TERMINATORS);

  const stripNoLockEverywhere = (txt) =>
    txt.replace(/\bWITH\s*\(\s*NOLOCK\s*\)/gi, "");

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
        let j = i + 1;
        while (j < s.length && isIdentChar(s[j])) j++;
        i = j;
        seenPart = true;
      } else {
        break;
      }
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

  const looksFunctionLikeAt = (s, start, end) => {
    const i = skipSpaces(s, end);
    return s[i] === "(";
  };

  const parseOneTableRef = (sql, start, action) => {
    let i = skipSpaces(sql, start);
    const leading = sql.substring(start, i);

    if (sql[i] === "(") {
      const closeAfter = readBalanced(sql, i);
      const inner = sql.substring(i + 1, closeAfter - 1);
      const processedInner = transform(inner, action);
      let out = leading + "(" + processedInner + ")";

      let p = skipSpaces(sql, closeAfter);
      let aliasText = "";
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

      let tail = sql.substring(p);
      tail = tail.replace(/^\s*\bWITH\s*\(\s*NOLOCK\s*\)/i, "");
      out += aliasText + tail;
      return { text: out, nextPos: sql.length - tail.length };
    }

    const nameStart = i;
    const nameEnd = readMultipartNameEnd(sql, i);
    if (nameEnd === i) {
      return { text: sql[start], nextPos: start + 1 };
    }

    if (looksFunctionLikeAt(sql, nameStart, nameEnd)) {
      const argsEnd = readBalanced(sql, skipSpaces(sql, nameEnd));
      let segment = sql.substring(start, argsEnd);
      segment = stripNoLockEverywhere(segment);
      return { text: segment, nextPos: argsEnd };
    }

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

    let slice = sql.substring(nameStart, q);
    const relNameEnd = readMultipartNameEnd(slice, 0);
    const tableText = slice.substring(0, relNameEnd);
    let afterTable = slice.substring(relNameEnd);

    const existingNolockMatch = afterTable.match(/^\s*WITH\s*\(\s*NOLOCK\s*\)/i);
    const hasExistingNolock = existingNolockMatch !== null;

    afterTable = afterTable.replace(/\bWITH\s*\(\s*NOLOCK\s*\)/gi, "");

    let aliasMatch = afterTable.match(/^\s*(AS\s+)?(\[?[A-Za-z0-9_]+\]?)/i);
    let aliasPart = "";
    let afterAlias = "";

    if (aliasMatch) {
      aliasPart = afterTable.substring(0, aliasMatch[0].length);
      afterAlias = afterTable.substring(aliasMatch[0].length);
    } else {
      afterAlias = afterTable;
    }

    let out = leading + tableText;

    if (action === "remove") {
      out += aliasPart + afterAlias;
    } else {
      if (!hasExistingNolock) {
        out += " WITH(NOLOCK)";
      } else {
        out += " WITH(NOLOCK)";
      }
      out += aliasPart + afterAlias;
    }

    return { text: out, nextPos: q };
  };

  const parseFromSources = (sql, start, action) => {
    let out = "";
    let i = start;
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

  const transform = (sql, action) => {
    let out = "";
    let i = 0;
    while (i < sql.length) {
      const ch = sql[i];
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
      if (ch === "(") {
        const end = readBalanced(sql, i);
        const inner = sql.substring(i + 1, end - 1);
        out += "(" + transform(inner, action) + ")";
        i = end;
        continue;
      }
      const fromHit = anyKeywordAt(sql, i, KW_FROM);
      if (fromHit) {
        const kw = sql.substring(i, i + fromHit.len);
        out += kw;
        i += fromHit.len;
        const { text, nextPos } = parseFromSources(sql, i, action);
        out += text;
        i = nextPos;
        continue;
      }
      const joinHit = anyKeywordAt(sql, i, KW_JOINS);
      if (joinHit) {
        const kw = sql.substring(i, i + joinHit.len);
        out += kw;
        i += joinHit.len;
        const { text, nextPos } = parseOneTableRef(sql, i, action);
        out += text;
        i = nextPos;
        continue;
      }
      out += ch;
      i++;
    }
    return out;
  };

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

  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">🛠 Try It Yourself: NOLOCK Enhancer</h2>
      <div className="flex flex-col md:flex-row gap-6 h-[600px]">
        {/* Left */}
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="block mb-2 font-semibold text-slate-700">Paste Stored Procedure (T-SQL)</label>
          <textarea
            className="w-full flex-grow p-4 border border-slate-300 rounded-lg resize-none font-mono text-sm focus:outline-none focus:border-blue-400 transition-colors custom-scrollbar bg-white"
            value={inputSP}
            onChange={(e) => setInputSP(e.target.value)}
            placeholder={`SELECT * 
FROM Users u
JOIN Orders o ON u.ID = o.UserID
-- Will become:
-- FROM Users u WITH(NOLOCK)
-- JOIN Orders o WITH(NOLOCK) ...`}
          />

          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Mode:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="input-modern w-auto"
            >
              <option value="enforce">Enforce WITH (NOLOCK)</option>
              <option value="remove">Remove WITH (NOLOCK)</option>
            </select>

            <button
              onClick={handleRun}
              className="btn-primary"
            >
              Run
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-slate-700">Transformed SP</label>
            <button
              onClick={handleCopy}
              disabled={!outputSP}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${copied ? "bg-green-600 text-white" : "bg-slate-700 text-white hover:bg-slate-800"
                }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            className="w-full flex-grow p-4 border border-slate-300 rounded-lg resize-none bg-slate-900 text-blue-200 font-mono text-sm custom-scrollbar"
            value={outputSP}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Guide Component ---
const SPWithNoLockEnhancer = () => {
  const [activeTab, setActiveTab] = useState('guide');
  const [expandedTerm, setExpandedTerm] = useState(null);

  const toggleTerm = (index) => {
    setExpandedTerm(expandedTerm === index ? null : index);
  };

  const terms = [
    {
      name: 'NOLOCK',
      description: 'A table hint that allows reading data without acquiring locks.',
      impact: 'High Performance, Low Consistency',
      color: 'green',
      icon: '🔓',
      basics: 'Normally, if someone is editing a row, you have to wait until they are done to read it. NOLOCK says "I don\'t care if they are editing it, just show me what is there right now". It is fast, but you might see messy data.',
      details: 'Equivalent to READ UNCOMMITTED isolation level. It prevents the query from issuing shared locks (S-locks) and ignores exclusive locks (X-locks) held by other transactions.',
      scenario: 'Running a large report on a live system where you don\'t want to block customers from buying things.',
      code: `SELECT * FROM Orders WITH (NOLOCK)`
    },
    {
      name: 'Dirty Read',
      description: 'Reading data that has been modified but not yet committed.',
      impact: 'Data Integrity Risk',
      color: 'red',
      icon: '⚠️',
      basics: 'Imagine someone is writing a check. You look over their shoulder and see "$100". But then they rip up the check and don\'t send it. You thought they paid $100, but they didn\'t. That is a Dirty Read.',
      details: 'Occurs when you read uncommitted data. If the transaction rolls back, you have read data that "never existed".',
      scenario: 'Reading an Order status as "Paid" while the payment processing transaction is still running (and might fail).',
      code: `-- Transaction A
BEGIN TRAN
UPDATE Accounts SET Balance = 0 WHERE ID = 1;
-- Transaction B (NOLOCK) reads 0
ROLLBACK; -- Balance is back to original, but B saw 0`
    },
    {
      name: 'Blocking',
      description: 'When one transaction has to wait for another to release a lock.',
      impact: 'Slow Performance',
      color: 'orange',
      icon: '🛑',
      basics: 'Like waiting in line for the bathroom. Only one person can be in there at a time. If someone takes a long time, everyone else waits. NOLOCK is like skipping the line (but you might walk in on someone!).',
      details: 'Standard behavior (READ COMMITTED) uses Shared Locks for reading. If a Writer has an Exclusive Lock, Readers must wait. NOLOCK bypasses this wait.',
      scenario: 'A user clicks "Save" (Write) and the screen freezes because a Report (Read) is locking the table.',
      code: `-- No code, just waiting...`
    },
    {
      name: 'READPAST',
      description: 'Skips rows that are currently locked by other transactions.',
      impact: 'Incomplete Data',
      color: 'blue',
      icon: '⏭️',
      basics: 'Instead of waiting (Blocking) or peeking (NOLOCK), READPAST just ignores the locked rows completely. It shows you everything EXCEPT what is being edited.',
      details: 'Useful for queue processing where you want to grab the next available item without getting stuck on locked items.',
      scenario: 'Processing a queue of email jobs. If Job #5 is being processed, just skip it and grab Job #6.',
      code: `SELECT TOP 1 * FROM EmailQueue WITH (READPAST)`
    },
    {
      name: 'RCSI (Read Committed Snapshot)',
      description: 'A database setting that uses versioning to avoid blocking without dirty reads.',
      impact: 'Best of Both Worlds',
      color: 'purple',
      icon: '📸',
      basics: 'SQL Server takes a "photo" of the data before it was edited. If someone is editing a row, you see the old photo (the last committed version). You don\'t wait, and you don\'t see dirty data.',
      details: 'Uses TempDB to store row versions. Increases TempDB usage but eliminates reader/writer blocking while maintaining consistency.',
      scenario: 'Modern applications often turn this on by default to avoid deadlock and blocking issues.',
      code: `ALTER DATABASE MyDB
SET READ_COMMITTED_SNAPSHOT ON;`
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-slate-900">
        NOLOCK & Hints Guide
      </h1>

      <p className="text-slate-600 mb-8 text-lg">
        Understanding locking, blocking, and table hints in SQL Server.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {['guide', 'terms', 'playground'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === tab
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-blue-500'
              }`}
          >
            {tab === 'guide' && '📚 Guide'}
            {tab === 'terms' && '📖 Terms Dictionary'}
            {tab === 'playground' && '🛠 Enhancer Tool'}
          </button>
        ))}
      </div>

      {/* Guide Tab */}
      {activeTab === 'guide' && (
        <div className="space-y-8">
          <InfoCard type="info">
            <strong>Definition:</strong> <code>WITH (NOLOCK)</code> is a query hint that tells SQL Server to read data without acquiring locks, preventing blocking but risking "dirty reads".
          </InfoCard>

          <SectionTitle>📖 Basics: What is NOLOCK?</SectionTitle>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <p className="text-slate-700 leading-relaxed mb-4">
              By default, SQL Server is very careful. If someone is updating a row, SQL Server won't let you read it until they are finished. This ensures you never see "half-finished" work. This is called <strong>Read Committed</strong>.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              However, this safety causes <strong>Blocking</strong>. If a report takes 5 minutes to run, it might lock the table, preventing customers from placing orders.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              <code>NOLOCK</code> removes the safety. It lets you read the data <em>right now</em>, even if it's being changed.
            </p>

            <SubSectionTitle>The Danger: Dirty Reads</SubSectionTitle>
            <p className="text-slate-700 leading-relaxed mb-2">
              Imagine a bank transfer:
            </p>
            <ol className="list-decimal list-inside text-slate-700 space-y-1 mb-4">
              <li>Transaction starts: Deduct $500 from Alice.</li>
              <li><strong>You read the balance with NOLOCK. You see the -$500.</strong></li>
              <li>Transaction fails (error). Rollback happens. Money is put back.</li>
              <li><strong>Your report is wrong.</strong> You reported that Alice has $500 less than she actually does.</li>
            </ol>
          </div>

          <SectionTitle>When to Use NOLOCK</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-green-700 mb-2">✅ Use When...</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Running heavy reports on historical data.</li>
                <li>Approximate numbers are acceptable (e.g., "Total Website Hits").</li>
                <li>The system is under heavy load and blocking is killing performance.</li>
                <li>You are just checking data for debugging.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-700 mb-2">❌ Do NOT Use When...</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Moving money or financial calculations.</li>
                <li>Checking inventory levels for a sale.</li>
                <li>Data consistency is critical.</li>
                <li>You are running <code>UPDATE</code> or <code>DELETE</code> statements (never use NOLOCK on the target table!).</li>
              </ul>
            </div>
          </div>

          <SectionTitle>Better Alternatives</SectionTitle>
          <InfoCard type="success">
            <strong>Read Committed Snapshot Isolation (RCSI):</strong>
            <p className="mt-2">
              Instead of using NOLOCK everywhere, consider enabling RCSI on your database. It allows readers to see the "last committed version" of the row instead of waiting. It fixes blocking WITHOUT dirty reads.
            </p>
          </InfoCard>
        </div>
      )}

      {/* Terms Dictionary Tab */}
      {activeTab === 'terms' && (
        <div className="grid grid-cols-1 gap-4">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all"
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                onClick={() => toggleTerm(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{term.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{term.name}</h3>
                    <p className="text-sm text-slate-600">{term.description}</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {expandedTerm === index ? "▲" : "▼"}
                </div>
              </div>

              {expandedTerm === index && (
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-700 mb-1">💡 Basics (For Beginners)</h4>
                    <p className="text-slate-600 leading-relaxed">{term.basics}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-700 mb-1">📘 Technical Details</h4>
                    <p className="text-slate-600 leading-relaxed">{term.details}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-700 mb-1">🏢 Real-World Scenario</h4>
                    <p className="text-slate-600 leading-relaxed">{term.scenario}</p>
                  </div>

                  <div className="mb-2">
                    <h4 className="font-semibold text-slate-700 mb-1">💻 Example</h4>
                    <CodeBlock>{term.code}</CodeBlock>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-500">Impact: </span>
                    <span className={`text-sm font-medium ${term.color === 'red' ? 'text-red-600' :
                      term.color === 'orange' ? 'text-orange-600' :
                        term.color === 'yellow' ? 'text-yellow-600' :
                          term.color === 'green' ? 'text-green-600' :
                            'text-blue-600'
                      }`}>{term.impact}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Playground Tab */}
      {activeTab === 'playground' && (
        <NoLockPlayground />
      )}
    </div>
  );
};

export default SPWithNoLockEnhancer;
