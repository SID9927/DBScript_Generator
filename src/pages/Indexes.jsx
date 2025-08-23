import React, { useState } from "react";


// --- Reusable Components ---
const CodeBlock = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // reset after 2s
        });
    };

    return (
        <div className="relative my-4">
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded hover:bg-gray-600"
            >
                {copied ? "✅ Copied!" : "Copy"}
            </button>
            <pre className="bg-gray-900 text-green-200 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{children}</code>
            </pre>
        </div>
    );
};


const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-gray-300 pb-2">
        {children}
    </h2>
);

const SubSectionTitle = ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
        {children}
    </h3>
);


const copyToClipboard = () => {
    navigator.clipboard.writeText(children).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2s
    });
};

const InfoCard = ({ type = "info", children }) => {
    const styles = {
        info: "bg-blue-50 border-blue-500 text-blue-700",
        success: "bg-green-50 border-green-500 text-green-700",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
        danger: "bg-red-50 border-red-500 text-red-700",
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

    const generateSQL = () => {
        switch (type) {
            case "clustered":
                return `CREATE CLUSTERED INDEX IX_${table}_${columns.replace(
                    /,/g,
                    "_"
                )}\nON ${table} (${columns});`;
            case "nonclustered":
                return `CREATE NONCLUSTERED INDEX IX_${table}_${columns.replace(
                    /,/g,
                    "_"
                )}\nON ${table} (${columns});`;
            case "unique":
                return `CREATE UNIQUE NONCLUSTERED INDEX UQ_${table}_${columns.replace(
                    /,/g,
                    "_"
                )}\nON ${table} (${columns});`;
            case "filtered":
                return `CREATE NONCLUSTERED INDEX IX_${table}_${columns.replace(
                    /,/g,
                    "_"
                )}\nON ${table} (${columns})\nWHERE ${filter || "/* condition */"};`;
            case "table":
                return `CREATE NONCLUSTERED INDEX IX_${table}_${columns.replace(
                    /,/g,
                    "_"
                )}\nON ${table} (${columns} ASC);`;
            case "sp":
                return `-- Inside Stored Procedure\nSELECT ${columns}\nFROM ${table} WITH (INDEX(IX_${table}_${columns.replace(
                    /,/g,
                    "_"
                )}))\nWHERE ${filter || "/* condition */"};`;
            default:
                return "-- Select an index type and fill details --";
        }
    };

    return (
        <div className="p-6 bg-gray-50 border rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                🛠 Try It Yourself: Index Syntax Generator
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-semibold">Index Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="clustered">Clustered</option>
                        <option value="nonclustered">Non-Clustered</option>
                        <option value="unique">Unique</option>
                        <option value="filtered">Filtered</option>
                        <option value="table">Table Level</option>
                        <option value="sp">Stored Procedure Level</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Table Name</label>
                    <input
                        type="text"
                        value={table}
                        onChange={(e) => setTable(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Column(s)</label>
                    <input
                        type="text"
                        value={columns}
                        onChange={(e) => setColumns(e.target.value)}
                        placeholder="e.g., LastName, FirstName"
                        className="w-full border p-2 rounded"
                    />
                </div>

                {(type === "filtered" || type === "sp") && (
                    <div>
                        <label className="block mb-2 font-semibold">Filter Condition</label>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="e.g., IsActive = 1"
                            className="w-full border p-2 rounded"
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
    return (
        <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                Indexes
            </h1>
            <p className="text-gray-700 leading-relaxed">
                Think of an index like the index of a book. Instead of scanning every
                page to find a topic, you can jump directly to the right page. In
                databases, indexes make queries faster by reducing full table scans.
            </p>

            <InfoCard type="info">
                <strong>Definition:</strong> An index is a data structure that speeds up
                data retrieval at the cost of additional storage and slower writes.
            </InfoCard>

            {/* Why & When */}
            <SectionTitle>Why and When to Use Indexes?</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-green-600 mb-2">✅ Pros</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Speeds up <code>SELECT</code> queries and <code>WHERE</code> clauses.</li>
                        <li>Improves <code>JOIN</code> and <code>ORDER BY</code> performance.</li>
                        <li>Can enforce uniqueness (e.g., <code>Unique Index</code>).</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Cons</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
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

            {/* Types of Indexes */}
            <SectionTitle>Types of Indexes</SectionTitle>

            <SubSectionTitle>1. Clustered Index</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                A clustered index determines the physical order of data in a table. Because of this, a table can have only <strong>one</strong> clustered index. The leaf nodes of a clustered index contain the actual data pages of the table. It's like organizing a library by arranging the books themselves alphabetically by title on the shelves.
            </p>
            <CodeBlock>{`CREATE TABLE Employees (
  EmployeeID INT PRIMARY KEY, -- A primary key constraint automatically creates a clustered index by default
  FirstName NVARCHAR(50),
  LastName NVARCHAR(50)
);

CREATE CLUSTERED INDEX IX_Employees_EmployeeID
ON Employees (EmployeeID ASC);`}</CodeBlock>

            <SubSectionTitle>2. Non-Clustered Index</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                A separate structure that points to the actual table rows. It's like a separate card catalog in a library. The index contains key values, and each key has a pointer (a row locator) to the data row in the table. A table can have multiple non-clustered indexes.
            </p>
            <CodeBlock>{`CREATE NONCLUSTERED INDEX IX_Employees_LastName
ON Employees (LastName);`}</CodeBlock>

            <SubSectionTitle>3. Unique Index</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                A unique index ensures that all values in the indexed column(s) are unique. It prevents duplicate entries.{" "}
                Both clustered and non-clustered indexes can be unique. Created automatically with{" "}
                <code>PRIMARY KEY</code> or <code>UNIQUE</code> constraints.
            </p>
            <CodeBlock>{`CREATE UNIQUE NONCLUSTERED INDEX UQ_Employees_SSN
ON Employees (SocialSecurityNumber)
WHERE SocialSecurityNumber IS NOT NULL;`}</CodeBlock>

            <SubSectionTitle>4. Filtered Index</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                Indexes only a subset of rows based on a <code>WHERE</code> condition.
                A well-designed filtered index can improve query performance, reduce index maintenance costs, and reduce index storage costs compared with full-table indexes.
            </p>
            <CodeBlock>{`CREATE NONCLUSTERED INDEX IX_Employees_Active
ON Employees (ManagerID)
WHERE IsActive = 1;`}</CodeBlock>

            {/* Using Indexes */}
            <SectionTitle>Using Indexes in Real Life</SectionTitle>

            <SubSectionTitle>Table Level</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                You define indexes using <code>CREATE INDEX</code> at the table level.
            </p>
            <CodeBlock>{`CREATE NONCLUSTERED INDEX IX_Customers_Email
ON Customers (EmailAddress ASC);`}</CodeBlock>

            <SubSectionTitle>Stored Procedures / Query Level</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
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

            <InfoCard type="warning">
                <strong>Tip:</strong> Use index hints as a last resort. It’s usually
                better to fix queries or update statistics.
            </InfoCard>

            {/* Interactive Playground */}
            <IndexPlayground />
        </div>


    );
};

export default IndexesGuide;
