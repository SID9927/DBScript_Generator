import React from "react";
import SEO from '../components/SEO';
import { useState } from "react";

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
    <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-slate-700 pb-2">
        {children}
    </h2>
);

const SubSectionTitle = ({ children }) => (
    <h3 className="text-xl font-semibold text-slate-300 mt-6 mb-3">
        {children}
    </h3>
);

const InfoCard = ({ type = "info", children }) => {
    const styles = {
        info: "bg-blue-900/20 border-blue-500/50 text-blue-200",
        success: "bg-green-900/20 border-green-500/50 text-green-200",
        warning: "bg-yellow-900/20 border-yellow-500/50 text-yellow-200",
        danger: "bg-red-900/20 border-red-500/50 text-red-200",
    };
    return (
        <div className={`p-4 my-4 rounded-md border-l-4 ${styles[type]}`}>
            {children}
        </div>
    );
};

// --- Interactive Playground ---
const IndexPlayground = () => {
    const [type, setType] = useState("clustered");
    const [table, setTable] = useState("Employees");
    const [columns, setColumns] = useState("EmployeeID");
    const [filter, setFilter] = useState("");
    const [includeColumns, setIncludeColumns] = useState("");

    const generateSQL = () => {
        const colName = columns.replace(/,/g, "_").replace(/\s/g, "");
        switch (type) {
            case "clustered":
                return `CREATE CLUSTERED INDEX IX_${table}_${colName}
ON ${table} (${columns});`;
            case "nonclustered":
                return `CREATE NONCLUSTERED INDEX IX_${table}_${colName}
ON ${table} (${columns})
${includeColumns ? `INCLUDE (${includeColumns})` : ""};`;
            case "unique":
                return `CREATE UNIQUE NONCLUSTERED INDEX UQ_${table}_${colName}
ON ${table} (${columns});`;
            case "filtered":
                return `CREATE NONCLUSTERED INDEX IX_${table}_${colName}
ON ${table} (${columns})
WHERE ${filter || "IsActive = 1"};`;
            case "columnstore":
                return `CREATE CLUSTERED COLUMNSTORE INDEX CCI_${table}
ON ${table};`;
            default:
                return "-- Select an index type";
        }
    };

    return (
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">
                🛠 Try It Yourself: Index Syntax Generator
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-semibold text-slate-300">Index Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="clustered">Clustered Index</option>
                        <option value="nonclustered">Non-Clustered Index</option>
                        <option value="unique">Unique Index</option>
                        <option value="filtered">Filtered Index</option>
                        <option value="columnstore">Columnstore Index</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-slate-300">Table Name</label>
                    <input
                        type="text"
                        value={table}
                        onChange={(e) => setTable(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-slate-300">Key Column(s)</label>
                    <input
                        type="text"
                        value={columns}
                        onChange={(e) => setColumns(e.target.value)}
                        placeholder="e.g., LastName, FirstName"
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {type === "nonclustered" && (
                    <div>
                        <label className="block mb-2 font-semibold text-slate-300">Included Columns (Optional)</label>
                        <input
                            type="text"
                            value={includeColumns}
                            onChange={(e) => setIncludeColumns(e.target.value)}
                            placeholder="e.g., Email, Phone"
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                )}

                {type === "filtered" && (
                    <div>
                        <label className="block mb-2 font-semibold text-slate-300">Filter Condition</label>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="e.g., IsActive = 1"
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Live Preview */}
            <CodeBlock>{generateSQL()}</CodeBlock>
        </div>
    );
};

// --- Main Guide Component ---
const IndexesGuide = () => {
    const [activeTab, setActiveTab] = useState("guide");
    const [expandedTerm, setExpandedTerm] = useState(null);

    const toggleTerm = (index) => {
        setExpandedTerm(expandedTerm === index ? null : index);
    };

    const terms = [
        {
            name: "Clustered Index",
            description: "Sorts and stores the data rows in the table based on their key values.",
            impact: "Fast retrieval, determines physical order.",
            color: "green",
            icon: "📚",
            basics: "Imagine a phone book. The entries are sorted alphabetically by name. This is a Clustered Index. The data itself is the index. You can only have one per table because data can only be sorted in one order physically.",
            details: "The leaf nodes of a clustered index contain the data pages of the underlying table. Searching by the clustered index key is the fastest way to retrieve a row.",
            scenario: "Primary Key on 'EmployeeID' or 'OrderDate' for sequential access.",
            code: `CREATE CLUSTERED INDEX IX_Employees_ID 
ON Employees(EmployeeID);`
        },
        {
            name: "Non-Clustered Index",
            description: "A separate structure that points to the data rows.",
            impact: "Speeds up lookups on non-primary columns.",
            color: "blue",
            icon: "🔖",
            basics: "Imagine the index at the back of a textbook. It lists keywords and page numbers. To find 'Photosynthesis', you look in the index, get the page number, and then flip to that page. This is a Non-Clustered Index. The index is separate from the data.",
            details: "Contains the index key values and row locators (pointers) to the data. You can have multiple non-clustered indexes on a table.",
            scenario: "Searching for Employees by 'LastName' or 'Email' when the table is sorted by 'EmployeeID'.",
            code: `CREATE NONCLUSTERED INDEX IX_Employees_LastName 
ON Employees(LastName);`
        },
        {
            name: "Unique Index",
            description: "Ensures that the index key contains no duplicate values.",
            impact: "Enforces data integrity.",
            color: "purple",
            icon: "1️⃣",
            basics: "A Unique Index is like a rule that says 'No two people can have the same Social Security Number'. It prevents duplicate entries in the indexed column.",
            details: "Automatically created when you define a PRIMARY KEY or UNIQUE constraint. Can be clustered or non-clustered.",
            scenario: "Ensuring 'Email' addresses are unique in the Users table.",
            code: `CREATE UNIQUE INDEX IX_Users_Email 
ON Users(Email);`
        },
        {
            name: "Filtered Index",
            description: "An optimized non-clustered index, especially suited to cover queries that select from a well-defined subset of data.",
            impact: "Saves storage, improves performance for subsets.",
            color: "orange",
            icon: "🔍",
            basics: "A Filtered Index is like an index that only includes 'Active' employees. If you never search for 'Inactive' employees, why waste space indexing them? It uses a WHERE clause.",
            details: "Reduces index maintenance costs and storage size compared to full-table indexes. Great for sparse columns (many NULLs).",
            scenario: "Indexing 'EndDate' only for projects that are actually finished, or 'ManagerID' only for active employees.",
            code: `CREATE NONCLUSTERED INDEX IX_Employees_Active 
ON Employees(ManagerID) 
WHERE IsActive = 1;`
        },
        {
            name: "Covering Index",
            description: "A non-clustered index that includes all columns needed for a query.",
            impact: "Extremely fast (no table lookup needed).",
            color: "green",
            icon: "☂️",
            basics: "A Covering Index is like having the answer written right in the index so you don't even have to flip to the page. If an index has all the data you asked for, SQL Server doesn't need to touch the table at all.",
            details: "Uses the INCLUDE clause to add non-key columns to the leaf level of the non-clustered index.",
            scenario: "A query that selects 'FirstName' and 'LastName' based on 'Email'. Indexing 'Email' and including 'FirstName' and 'LastName' covers the query.",
            code: `CREATE NONCLUSTERED INDEX IX_Employees_Email_Includes
ON Employees(Email)
INCLUDE (FirstName, LastName);`
        },
        {
            name: "Heap",
            description: "A table without a clustered index.",
            impact: "Fast inserts, slow reads.",
            color: "yellow",
            icon: "📦",
            basics: "A Heap is a pile of data with no order. New rows are just thrown in wherever there's space. It's fast to add data, but slow to find it later.",
            details: "Data is stored in no particular order. Useful for staging tables where data is inserted and then processed/moved.",
            scenario: "Staging tables for bulk data imports.",
            code: `CREATE TABLE Staging_Data (
    RawData VARCHAR(MAX)
); -- No Primary Key defined`
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <SEO
                title="Index Guide"
                description="Comprehensive guide to SQL Server indexes. Understand clustered vs non-clustered, heap tables, and fragmentation."
            />

            <header className="space-y-2">
                <h1 className="text-4xl font-bold mb-3 text-white">Indexes</h1>
                <p className="text-slate-400 mb-8 text-lg">
                    Mastering performance optimization with SQL Server Indexes.
                </p>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-700">
                {['guide', 'terms', 'playground'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === tab
                            ? 'text-blue-400 border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-blue-300'
                            }`}
                    >
                        {tab === 'guide' && '📚 Guide'}
                        {tab === 'terms' && '📖 Terms Dictionary'}
                        {tab === 'playground' && '🛠 Playground'}
                    </button>
                ))}
            </div>

            {/* Guide Tab */}
            {activeTab === 'guide' && (
                <div className="space-y-8">
                    <InfoCard type="info">
                        <strong>Definition:</strong> An index is a data structure that speeds up
                        data retrieval at the cost of additional storage and slower writes.
                    </InfoCard>

                    <SectionTitle>📖 Basics: What is an Index?</SectionTitle>
                    <div className="bg-purple-900/20 border-l-4 border-purple-500 p-6 rounded-r-lg">
                        <p className="text-slate-300 leading-relaxed mb-4">
                            An <strong>index</strong> is like the index at the back of a textbook. Instead of reading every page to find "SQL Server", you look it up in the index and jump directly to page 247. Similarly, database indexes help SQL Server find data quickly without scanning every row.
                        </p>

                        <SubSectionTitle>Why Do We Need Indexes?</SubSectionTitle>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-800 p-4 rounded border border-purple-500/30">
                                <h4 className="font-bold text-green-400 mb-2">✅ With Index</h4>
                                <p className="text-sm text-slate-300">Finding "John Smith" in 1 million employees: <strong>Instant</strong> (uses index)</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded border border-purple-500/30">
                                <h4 className="font-bold text-red-400 mb-2">❌ Without Index</h4>
                                <p className="text-sm text-slate-300">Finding "John Smith" in 1 million employees: <strong>Scans all 1M rows</strong> (slow!)</p>
                            </div>
                        </div>

                        <SubSectionTitle>Creating Your First Index</SubSectionTitle>
                        <p className="text-slate-700 leading-relaxed mb-2">
                            Let's say you frequently search employees by email. Create an index:
                        </p>
                        <CodeBlock>{`-- Create a non-clustered index on Email column
CREATE NONCLUSTERED INDEX IX_Employees_Email
ON Employees(Email);

-- Now this query will be FAST:
SELECT * FROM Employees WHERE Email = 'john@example.com';`}</CodeBlock>
                    </div>

                    <SectionTitle>Why and When to Use Indexes?</SectionTitle>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-green-400 mb-2">✅ Pros</h3>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>Speeds up <code>SELECT</code> queries and <code>WHERE</code> clauses.</li>
                                <li>Improves <code>JOIN</code> and <code>ORDER BY</code> performance.</li>
                                <li>Can enforce uniqueness (e.g., <code>Unique Index</code>).</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Cons</h3>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>Slows down modification operations like <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code> because the index also needs to be updated.</li>
                                <li>Consumes disk space (sometimes bigger than table itself).</li>
                                <li>Badly designed indexes can degrade performance instead of improving it.</li>
                            </ul>
                        </div>
                    </div>

                    <InfoCard type="success">
                        <strong>Rule of Thumb:</strong> Create indexes on columns that are frequently used in{" "}
                        <code>WHERE</code> clauses, <code>JOIN</code> conditions, or <code>ORDER BY</code> clauses. Avoid creating indexes on tables with frequent, large-batch update or insert operations, or on columns with very few unique values.
                    </InfoCard>

                    <SectionTitle>Using Indexes in Real Life</SectionTitle>

                    <SubSectionTitle>Table Level</SubSectionTitle>
                    <p className="text-slate-700 leading-relaxed">
                        You define indexes using <code>CREATE INDEX</code> at the table level.
                    </p>
                    <CodeBlock>{`CREATE NONCLUSTERED INDEX IX_Customers_Email
ON Customers (EmailAddress ASC);`}</CodeBlock>

                    <SubSectionTitle>Stored Procedures / Query Level</SubSectionTitle>
                    <p className="text-slate-700 leading-relaxed">
                        Usually, SQL Server automatically picks the best index. But you can
                        provide hints (not recommended unless necessary).
                    </p>
                    <CodeBlock>{`-- Optimizer usually picks this index automatically
SELECT EmployeeID, FirstName, LastName
FROM Employees
WHERE LastName = 'Smith';

-- Force index usage (use carefully!)
SELECT EmployeeID, FirstName, LastName
FROM Employees WITH (INDEX(IX_Employees_LastName))
WHERE LastName = 'Smith';`}</CodeBlock>
                </div>
            )}

            {/* Terms Tab */}
            {activeTab === 'terms' && (
                <div className="grid grid-cols-1 gap-4">
                    {terms.map((term, index) => (
                        <div
                            key={index}
                            className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden transition-all"
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/50"
                                onClick={() => toggleTerm(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{term.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{term.name}</h3>
                                        <p className="text-sm text-slate-400">{term.description}</p>
                                    </div>
                                </div>
                                <div className="text-slate-500">
                                    {expandedTerm === index ? "▲" : "▼"}
                                </div>
                            </div>

                            {expandedTerm === index && (
                                <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-300 mb-1">💡 Basics (For Beginners)</h4>
                                        <p className="text-slate-400 leading-relaxed">{term.basics}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-300 mb-1">📘 Technical Details</h4>
                                        <p className="text-slate-400 leading-relaxed">{term.details}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-300 mb-1">🏢 Real-World Scenario</h4>
                                        <p className="text-slate-400 leading-relaxed">{term.scenario}</p>
                                    </div>

                                    <div className="mb-2">
                                        <h4 className="font-semibold text-slate-300 mb-1">💻 Example</h4>
                                        <CodeBlock>{term.code}</CodeBlock>
                                    </div>

                                    <div className="mt-4 pt-2 border-t border-slate-700">
                                        <span className="text-sm font-medium text-slate-500">Impact: </span>
                                        <span className={`text-sm font-medium ${term.color === 'red' ? 'text-red-400' :
                                            term.color === 'orange' ? 'text-orange-400' :
                                                term.color === 'yellow' ? 'text-yellow-400' :
                                                    term.color === 'green' ? 'text-green-400' :
                                                        'text-blue-400'
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
                <IndexPlayground />
            )}
        </div>
    );
};

export default IndexesGuide;
