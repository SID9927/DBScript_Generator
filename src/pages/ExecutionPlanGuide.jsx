import React, { useState, useRef } from 'react';
import { parseAndAnalyzePlan } from '../utils/executionPlanParser';

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

// --- Analyzer Component (Playground) ---
const ExecutionPlanAnalyzer = () => {
    const [executionPlan, setExecutionPlan] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [fileName, setFileName] = useState(null);
    const fileInputRef = useRef(null);

    // Handle File Upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setExecutionPlan(content); // Store raw content
                try {
                    const result = parseAndAnalyzePlan(content);
                    setAnalysis(result);
                } catch (error) {
                    console.error("Parsing error:", error);
                    alert("Failed to parse the execution plan. Ensure it is a valid .sqlplan (XML) file.");
                }
            };
            reader.readAsText(file);
        }
    };

    // Manual Analysis (Text Paste)
    const analyzeManual = () => {
        if (!executionPlan.trim()) return;
        // Try to detect if it's XML or just text
        if (executionPlan.trim().startsWith('<')) {
            try {
                const result = parseAndAnalyzePlan(executionPlan);
                setAnalysis(result);
            } catch (error) {
                alert("Invalid XML format.");
            }
        } else {
            // Fallback to simple text analysis (legacy)
            analyzeLegacyText(executionPlan);
        }
    };

    const analyzeLegacyText = (text) => {
        // Basic text analysis fallback
        setAnalysis({
            legacy: true,
            summary: { cost: 0, cachedPlanSize: 0, compileCPU: 0, compileMemory: 0 },
            warnings: [],
            recommendations: [{ type: "Info", text: "Text analysis is limited. Please upload a .sqlplan (XML) file for deep analysis." }],
            missingIndexes: [],
            expensiveOperations: [],
            waitStats: [],
            parameterAnalysis: [],
            aiSummary: "Basic text analysis performed. For a deep AI-driven analysis, please upload a valid .sqlplan XML file."
        });
    };

    const clearAnalysis = () => {
        setExecutionPlan('');
        setAnalysis(null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    🔍 Execution Plan Analyzer 
                    {/* <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">AI Powered</span> */}
                </h2>
                {analysis && (
                    <button onClick={clearAnalysis} className="text-sm text-red-600 hover:text-red-800 font-medium">
                        Reset Analysis
                    </button>
                )}
            </div>

            {!analysis && (
                <>
                    {/* Upload Section */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-dashed border-slate-300 mb-6 text-center hover:border-blue-400 transition-colors group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
                            <span className="text-5xl">📂</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                            Upload .sqlplan File
                        </h3>
                        <p className="text-slate-500 mb-4 text-sm">
                            Drag and drop or click to upload your XML Execution Plan
                        </p>
                        <input
                            type="file"
                            accept=".sqlplan,.xml"
                            onChange={handleFileUpload}
                            className="hidden"
                            ref={fileInputRef}
                        />
                        <button
                            className="btn-primary"
                        >
                            Select File
                        </button>
                    </div>

                    <div className="text-center text-slate-400 mb-6">- OR -</div>

                    {/* Text Area Fallback */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
                        <p className="text-slate-600 mb-4">
                            Paste raw XML execution plan content here:
                        </p>
                        <textarea
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-400 transition-colors custom-scrollbar bg-slate-50"
                            placeholder="<ShowPlanXML ...>"
                            value={executionPlan}
                            onChange={(e) => setExecutionPlan(e.target.value)}
                        />
                        <button
                            className="btn-primary mt-4"
                            onClick={analyzeManual}
                            disabled={!executionPlan.trim()}
                        >
                            Analyze Text
                        </button>
                    </div>
                </>
            )}

            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-8 animate-fade-in">

                    {/* AI Summary Card */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="text-9xl">🤖</span>
                        </div>
                        <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                            <span>🤖</span> AI Analysis Summary
                        </h3>
                        <div className="prose prose-indigo text-indigo-800 leading-relaxed">
                            <React.Fragment>
                                {analysis.aiSummary.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                                ))}
                            </React.Fragment>
                        </div>
                    </div>

                    {/* Summary Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-xs uppercase font-bold">Total Cost</div>
                            <div className="text-2xl font-bold text-slate-800">{analysis.summary.cost.toFixed(2)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-xs uppercase font-bold">Cached Size</div>
                            <div className="text-2xl font-bold text-slate-800">{analysis.summary.cachedPlanSize} KB</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-xs uppercase font-bold">Compile CPU</div>
                            <div className="text-2xl font-bold text-slate-800">{analysis.summary.compileCPU} ms</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-xs uppercase font-bold">Compile Memory</div>
                            <div className="text-2xl font-bold text-slate-800">{analysis.summary.compileMemory} KB</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-xs uppercase font-bold">Max DOP</div>
                            <div className="text-2xl font-bold text-slate-800">{analysis.summary.degreeOfParallelism}</div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {analysis.recommendations.length > 0 && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                                🚀 Actionable Recommendations
                            </h3>
                            <div className="space-y-3">
                                {analysis.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex gap-3 items-start bg-white/60 p-3 rounded-md">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                            ${rec.type === 'Index' ? 'bg-blue-100 text-blue-700' :
                                                rec.type === 'Memory' ? 'bg-purple-100 text-purple-700' :
                                                    rec.type === 'Code' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-200 text-slate-700'}`}>
                                            {rec.type}
                                        </span>
                                        <span className="text-emerald-900 font-medium">{rec.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Indexes */}
                    {analysis.missingIndexes.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                ⚡ Missing Indexes <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">{analysis.missingIndexes.length}</span>
                            </h3>
                            <div className="space-y-4">
                                {analysis.missingIndexes.map((idx, i) => (
                                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-red-200 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                        <div className="flex justify-between items-start mb-4 pl-2">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg">{idx.table}</h4>
                                                <p className="text-red-600 font-medium flex items-center gap-1">
                                                    <span className="text-xl">🔥</span> Impact: {idx.impact.toFixed(1)}% Improvement
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(idx.createScript)}
                                                className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded transition-colors"
                                            >
                                                Copy Script
                                            </button>
                                        </div>
                                        <CodeBlock>{idx.createScript}</CodeBlock>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Warnings */}
                    {analysis.warnings.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-orange-600 mb-4">⚠️ Warnings</h3>
                            <div className="grid gap-4">
                                {analysis.warnings.map((w, i) => (
                                    <div key={i} className="bg-orange-50 p-4 rounded-lg border border-orange-200 flex gap-4 items-start">
                                        <span className="text-2xl">⚠️</span>
                                        <div>
                                            <h4 className="font-bold text-orange-800">{w.type}</h4>
                                            <p className="text-orange-900">{w.message}</p>
                                            {w.details && <p className="text-xs text-orange-700 mt-1 font-mono bg-orange-100/50 p-1 rounded">{w.details}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Wait Stats */}
                    {analysis.waitStats && analysis.waitStats.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">⏳ Wait Statistics</h3>
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                        <tr>
                                            <th className="p-3">Wait Type</th>
                                            <th className="p-3">Time (ms)</th>
                                            <th className="p-3">Count</th>
                                            <th className="p-3">Explanation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {analysis.waitStats.map((wait, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="p-3 font-mono text-slate-700 font-semibold">{wait.type}</td>
                                                <td className="p-3 text-slate-600">{wait.time.toLocaleString()}</td>
                                                <td className="p-3 text-slate-600">{wait.count.toLocaleString()}</td>
                                                <td className="p-3 text-slate-500 italic">{wait.explanation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Parameter Sniffing */}
                    {analysis.parameterAnalysis && analysis.parameterAnalysis.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-purple-700 mb-4">🔎 Parameter Analysis</h3>
                            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                <p className="text-purple-900 mb-3 font-medium">
                                    Discrepancies found between compiled and runtime values (Parameter Sniffing risk):
                                </p>
                                <div className="space-y-2">
                                    {analysis.parameterAnalysis.map((param, i) => (
                                        <div key={i} className="bg-white p-3 rounded border border-purple-100 text-sm">
                                            <div className="font-mono font-bold text-slate-700">{param.name}</div>
                                            <div className="grid grid-cols-2 gap-4 mt-1">
                                                <div><span className="text-slate-500 text-xs">Compiled:</span> <span className="font-mono text-purple-700">{param.compiled}</span></div>
                                                <div><span className="text-slate-500 text-xs">Runtime:</span> <span className="font-mono text-purple-700">{param.runtime}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Expensive Operations */}
                    {analysis.expensiveOperations.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">🐢 Most Expensive Operations</h3>
                            <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                                <table className="w-full text-left border-collapse bg-white">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-600 text-sm">
                                            <th className="p-3">Operation</th>
                                            <th className="p-3">Cost %</th>
                                            <th className="p-3">Est. Rows</th>
                                            <th className="p-3">Est. IO</th>
                                            <th className="p-3">Est. CPU</th>
                                            <th className="p-3">Issue</th>
                                            <th className="p-3">Suggestion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-100">
                                        {analysis.expensiveOperations.map((op, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="p-3 font-medium text-slate-800">
                                                    {op.op}
                                                    {op.parallel && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">Parallel</span>}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div className={`h-full ${parseFloat(op.costPercent) > 50 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${op.costPercent}%` }}></div>
                                                        </div>
                                                        <span>{op.costPercent}%</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-slate-600">{op.rows.toLocaleString()}</td>
                                                <td className="p-3 text-slate-600">{op.io.toFixed(4)}</td>
                                                <td className="p-3 text-slate-600">{op.cpu.toFixed(4)}</td>
                                                <td className="p-3 text-red-600 font-medium">{op.issue}</td>
                                                <td className="p-3 text-slate-600 text-xs">{op.suggestion}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Main Guide Component ---
const ExecutionPlanGuide = () => {
    const [activeTab, setActiveTab] = useState('guide');
    const [expandedTerm, setExpandedTerm] = useState(null);

    const toggleTerm = (index) => {
        setExpandedTerm(expandedTerm === index ? null : index);
    };

    const terms = [
        {
            name: 'Table Scan',
            description: 'Reads every single row in the table.',
            impact: 'Very High Cost',
            color: 'red',
            icon: '🔴',
            basics: 'Imagine looking for a specific page in a book by reading every single page from start to finish. That is a Table Scan. It is the slowest way to find data.',
            details: 'Occurs when no suitable index exists. The engine must read all data pages. Performance degrades linearly with table size.',
            scenario: 'SELECT * FROM Users WHERE LastName = "Smith" (and no index on LastName).',
            code: `SELECT * FROM LargeTable`
        },
        {
            name: 'Index Seek',
            description: 'Uses an index to jump directly to specific rows.',
            impact: 'Very Efficient',
            color: 'green',
            icon: '🟢',
            basics: 'Imagine using the index at the back of a book to find a topic. You jump straight to page 42. That is an Index Seek. It is the fastest way to find data.',
            details: 'The engine traverses the B-Tree index structure to find the specific key(s). Number of reads is proportional to the tree depth (usually 3-4 reads).',
            scenario: 'SELECT * FROM Users WHERE UserID = 105 (with PK on UserID).',
            code: `SELECT * FROM Users WHERE UserID = 123`
        },
        {
            name: 'Key Lookup',
            description: 'Found the row in an index, but had to go back to the main table for more columns.',
            impact: 'Moderate to High Cost',
            color: 'orange',
            icon: '🔍',
            basics: 'You found "Smith" in the index, but the index doesn\'t list his Phone Number. So you have to go find his actual file in the cabinet. If you do this for one person, it\'s fine. If you do it for 1,000 people, it\'s slow.',
            details: 'Occurs when a non-clustered index matches the WHERE clause but doesn\'t cover all selected columns. The engine performs a random I/O to the Clustered Index for each row.',
            scenario: 'SELECT Phone FROM Users WHERE LastName = "Smith" (Index on LastName, but Phone is not included).',
            code: `SELECT * FROM Users WHERE LastName = 'Smith'`
        },
        {
            name: 'Nested Loops Join',
            description: 'For every row in Table A, scan Table B.',
            impact: 'Good for small data, bad for large',
            color: 'blue',
            icon: '🔄',
            basics: 'Pick up a file from pile A. Go through pile B to find matches. Repeat for every file in pile A. Fast if pile A is small.',
            details: 'Efficient when one input is small (outer) and the other has an index (inner). Complexity is O(N*M).',
            scenario: 'Joining a small table (e.g., "Status") to a large table.',
            code: `SELECT * 
FROM SmallTable s 
JOIN LargeTable l ON s.ID = l.SmallID`
        },
        {
            name: 'Hash Match',
            description: 'Builds a hash table in memory to join unsorted large inputs.',
            impact: 'High Memory Usage',
            color: 'yellow',
            icon: '⚡',
            basics: 'Take all items from pile A and put them in buckets based on a hash. Then take items from pile B, hash them, and check the buckets. Good for heavy lifting when nothing is sorted.',
            details: 'Used for large, unsorted inputs. Requires memory grant. If memory is insufficient, it spills to TempDB (very slow).',
            scenario: 'Joining two very large tables with no useful indexes.',
            code: `SELECT * 
FROM LargeTable1 t1 
JOIN LargeTable2 t2 ON t1.Col = t2.Col`
        },
        {
            name: 'Sort',
            description: 'Sorts the data in memory.',
            impact: 'Expensive',
            color: 'orange',
            icon: '📊',
            basics: 'Putting a shuffled deck of cards in order. It takes time and space.',
            details: 'Triggered by ORDER BY, GROUP BY, or Merge Joins. Can spill to TempDB if memory grant is too small.',
            scenario: 'SELECT * FROM Users ORDER BY LastName (with no index on LastName).',
            code: `SELECT * FROM Users ORDER BY NonIndexedColumn`
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-3 text-slate-900">
                SQL Execution Plan Guide
            </h1>

            <p className="text-slate-600 mb-8 text-lg">
                Learn how to read and optimize SQL Server execution plans.
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
                {['guide', 'terms', 'analyzer'].map((tab) => (
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
                        {tab === 'analyzer' && '🔍 Plan Analyzer'}
                    </button>
                ))}
            </div>

            {/* Guide Tab */}
            {activeTab === 'guide' && (
                <div className="space-y-8">
                    <InfoCard type="info">
                        <strong>Definition:</strong> An execution plan is a roadmap that SQL Server generates to show exactly how it intends to execute your query.
                    </InfoCard>

                    <SectionTitle>📖 Basics: How to Read a Plan</SectionTitle>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Reading an execution plan is like reading a map, but with one golden rule:
                        </p>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">Always Read from Right to Left</h4>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Data flows from right to left. The operations on the far right happen first (fetching data), and the operations on the left happen last (aggregating or sending results to you).
                        </p>

                        <SubSectionTitle>Key Indicators</SubSectionTitle>
                        <ul className="list-disc list-inside text-slate-700 space-y-2">
                            <li><strong>Arrow Thickness:</strong> Thicker arrows mean more rows are moving. If you see a thick arrow going into a filter and a thin arrow coming out, that filter is doing a lot of work.</li>
                            <li><strong>Cost %:</strong> Each operator shows a percentage. Look for the big numbers (e.g., 80% cost). That's your bottleneck.</li>
                            <li><strong>Warnings:</strong> Look for yellow exclamation marks ⚠️. These indicate missing statistics, implicit conversions, or spills to TempDB.</li>
                        </ul>
                    </div>

                    <SectionTitle>Common Operators</SectionTitle>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-green-700 mb-2">✅ The Good</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-2xl">🟢</span>
                                    <div>
                                        <strong>Index Seek:</strong> Pinpoint precision. The engine knows exactly where the data is.
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-2xl">🔄</span>
                                    <div>
                                        <strong>Nested Loops (with Index):</strong> Very fast for joining small datasets to indexed large ones.
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-700 mb-2">❌ The Bad</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-2xl">🔴</span>
                                    <div>
                                        <strong>Table Scan:</strong> Reading the entire book. Avoid on large tables.
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-2xl">🔍</span>
                                    <div>
                                        <strong>Key Lookup:</strong> Double work. Found the index, but had to fetch more data from the table. Fix with Covering Index.
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-2xl">💾</span>
                                    <div>
                                        <strong>Spool:</strong> Saving data to disk (TempDB) because it ran out of memory. Very slow.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <SectionTitle>Optimization Strategy</SectionTitle>
                    <InfoCard type="success">
                        <strong>Workflow:</strong>
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                            <li>Identify the operator with the highest cost %.</li>
                            <li>Check if it's a Scan or a Seek. If Scan, can you add an index?</li>
                            <li>Check for Key Lookups. Can you add <code>INCLUDE</code> columns to your index?</li>
                            <li>Check for thick arrows. Are you selecting too many rows?</li>
                        </ol>
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

            {/* Analyzer Tab */}
            {activeTab === 'analyzer' && (
                <ExecutionPlanAnalyzer />
            )}
        </div>
    );
};

export default ExecutionPlanGuide;
