import React, { useState } from "react";
import { analyzeSP } from "../utils/sqlStaticAnalyzer";

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

// --- SP Performance Analyzer & Suggestion Tool ---
const SPPerformanceAnalyzer = () => {
  const [inputSP, setInputSP] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = () => {
    if (!inputSP.trim()) return;
    const analysis = analyzeSP(inputSP);
    setAnalysisResult(analysis);
  };

  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center gap-2">
        🔍 SP Performance Analyzer
      </h2>

      <div className="flex flex-col gap-6">
        {/* Input Area */}
        <div className="w-full">
          <label className="block mb-2 font-semibold text-slate-700">Paste Your Stored Procedure (T-SQL)</label>
          <textarea
            className="w-full h-96 p-4 border border-slate-300 rounded-lg resize-none font-mono text-sm focus:outline-none focus:border-blue-400 transition-colors custom-scrollbar bg-white"
            value={inputSP}
            onChange={(e) => setInputSP(e.target.value)}
            placeholder={`CREATE PROCEDURE GetOrders
AS
BEGIN
    SELECT * 
    FROM Orders o
    JOIN Customers c ON o.CustomerID = c.ID
    WHERE YEAR(o.OrderDate) = 2023
END`}
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!inputSP.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-sm"
            >
              🚀 Analyze Performance
            </button>
            {analysisResult && (
              <button
                onClick={() => { setInputSP(''); setAnalysisResult(null); }}
                className="text-slate-600 hover:text-slate-800 px-4 py-2 text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-4 animate-fade-in">

            {/* Score Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                  <span>🤖</span> Performance Analysis
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-indigo-700 font-medium">Score:</span>
                  <span className={`px-4 py-2 rounded-lg text-2xl font-bold ${analysisResult.score >= 90 ? 'bg-green-100 text-green-700' :
                      analysisResult.score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {analysisResult.score}/100
                  </span>
                </div>
              </div>
              <p className="text-indigo-800 leading-relaxed mb-4">{analysisResult.summary}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-indigo-100">
                <div className="text-center">
                  <div className="text-xs text-indigo-600 uppercase font-bold mb-1">Lines of Code</div>
                  <div className="text-lg font-bold text-indigo-900">{analysisResult.metrics.linesOfCode}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-indigo-600 uppercase font-bold mb-1">Complexity</div>
                  <div className="text-lg font-bold text-indigo-900">{analysisResult.metrics.complexity}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-indigo-600 uppercase font-bold mb-1">Execution Risk</div>
                  <div className={`text-lg font-bold ${analysisResult.metrics.estimatedExecutionRisk === 'Low' ? 'text-green-700' :
                      analysisResult.metrics.estimatedExecutionRisk === 'Medium' ? 'text-yellow-700' :
                        'text-red-700'
                    }`}>{analysisResult.metrics.estimatedExecutionRisk}</div>
                </div>
              </div>
            </div>

            {/* Critical Issues */}
            {analysisResult.issues.length > 0 && (
              <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
                <div className="bg-red-50 p-4 border-b border-red-100">
                  <h3 className="font-bold text-red-900 flex items-center gap-2">
                    <span>⚠️</span> Critical Issues Found ({analysisResult.issues.length})
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {analysisResult.issues.map((issue, idx) => (
                    <div key={idx} className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🔴</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-red-200 text-red-900 rounded text-xs font-bold uppercase">
                              {issue.type}
                            </span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-bold">
                              {issue.severity} Severity
                            </span>
                            {issue.line && (
                              <span className="text-xs text-red-600 font-mono">
                                Line {issue.line}
                              </span>
                            )}
                          </div>
                          <p className="text-red-900 font-medium mb-2">{issue.message}</p>
                          {issue.suggestion && (
                            <div className="mt-2 p-3 bg-white rounded border border-red-100">
                              <p className="text-sm text-slate-700">
                                <strong className="text-green-700">💡 Fix:</strong> {issue.suggestion}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysisResult.suggestions.length > 0 && (
              <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2">
                    <span>💡</span> Optimization Suggestions ({analysisResult.suggestions.length})
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {analysisResult.suggestions.map((sugg, idx) => (
                    <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 items-start">
                      <span className="text-xl">💡</span>
                      <div className="flex-1">
                        <span className="px-2 py-1 bg-blue-200 text-blue-900 rounded text-xs font-bold uppercase block w-fit mb-2">
                          {sugg.type}
                        </span>
                        <p className="text-blue-900">{sugg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Issues */}
            {analysisResult.issues.length === 0 && analysisResult.suggestions.length === 0 && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                <span className="text-4xl block mb-2">✅</span>
                <p className="text-green-800 font-bold text-lg">Excellent! No performance issues detected.</p>
                <p className="text-green-700 text-sm mt-1">Your stored procedure follows best practices.</p>
              </div>
            )}
          </div>
        )}
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
            {tab === 'playground' && '� Performance Analyzer'}
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

          <SectionTitle>🚀 Advanced Performance Optimization</SectionTitle>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-3">1. SARGable Queries</h3>
              <p className="text-slate-600 mb-2">
                <strong>SARGable</strong> (Search ARGumentable) means writing queries so SQL Server can use indexes.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded border border-red-100">
                  <span className="text-red-700 font-bold block mb-1">❌ Bad (Index Scan)</span>
                  <code className="text-sm">WHERE YEAR(OrderDate) = 2023</code>
                  <p className="text-xs text-red-600 mt-1">Applying a function to a column hides the column from the index.</p>
                </div>
                <div className="bg-green-50 p-3 rounded border border-green-100">
                  <span className="text-green-700 font-bold block mb-1">✅ Good (Index Seek)</span>
                  <code className="text-sm">WHERE OrderDate &gt;= '2023-01-01' AND OrderDate &lt; '2024-01-01'</code>
                  <p className="text-xs text-green-600 mt-1">Range comparison allows direct index usage.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-3">2. Avoid SELECT *</h3>
              <p className="text-slate-600 mb-2">
                Always specify columns. <code>SELECT *</code> forces the engine to read more data than needed (increasing I/O) and prevents the use of Covering Indexes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-3">3. Parameter Sniffing</h3>
              <p className="text-slate-600 mb-2">
                If a query runs fast sometimes and slow other times, it might be Parameter Sniffing. SQL Server caches a plan for the first parameter it sees (e.g., a small date range), which might be terrible for a large date range.
              </p>
              <p className="text-sm text-slate-500">
                <strong>Fix:</strong> Use <code>OPTION (RECOMPILE)</code> or optimize for the most common case.
              </p>
            </div>
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
        <SPPerformanceAnalyzer />
      )}
    </div>
  );
};

export default SPWithNoLockEnhancer;
