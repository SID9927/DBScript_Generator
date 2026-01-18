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

// --- Interactive Playground for Views ---
const ViewPlayground = () => {
  const [viewName, setViewName] = useState("vw_ActiveEmployees");
  const [table, setTable] = useState("Employees");
  const [columns, setColumns] = useState("EmployeeID, FirstName, LastName");
  const [condition, setCondition] = useState("IsActive = 1");
  const [schemaBinding, setSchemaBinding] = useState(false);

  const generateSQL = () => {
    return `CREATE VIEW ${viewName}
${schemaBinding ? "WITH SCHEMABINDING" : ""}
AS
SELECT ${columns}
FROM dbo.${table} -- Schema prefix required for SCHEMABINDING
${condition ? "WHERE " + condition : ""};`;
  };

  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">🛠 Try It Yourself: View Generator</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold text-slate-300">View Name</label>
          <input
            type="text"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
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

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-slate-300">Columns</label>
          <input
            type="text"
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            placeholder="e.g., EmployeeID, FirstName, LastName"
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-slate-300">Condition (Optional)</label>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g., IsActive = 1"
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-slate-300 font-semibold">
            <input
              type="checkbox"
              checked={schemaBinding}
              onChange={(e) => setSchemaBinding(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            Enable Schema Binding (Prevents table changes)
          </label>
        </div>
      </div>

      {/* Live Preview */}
      <CodeBlock>{generateSQL()}</CodeBlock>
    </div>
  );
};

// --- Main Guide Component ---
const ViewsGuide = () => {
  const [activeTab, setActiveTab] = useState("guide");
  const [expandedTerm, setExpandedTerm] = useState(null);

  const toggleTerm = (index) => {
    setExpandedTerm(expandedTerm === index ? null : index);
  };

  const terms = [
    {
      name: "Standard View",
      description: "A virtual table defined by a query. Does not store data.",
      impact: "Simplifies queries, adds security.",
      color: "blue",
      icon: "🖼️",
      basics: "A Standard View is just a saved query. When you select from the view, SQL Server runs the underlying query in real-time. It's like a bookmark for a complex search.",
      details: "The most common type. It consumes no storage space (other than the definition). Performance depends on the underlying query.",
      scenario: "Hiding complex joins or sensitive columns (like Salary) from end-users.",
      code: `CREATE VIEW vw_EmployeeNames AS
SELECT FirstName, LastName FROM Employees;`
    },
    {
      name: "Indexed View",
      description: "A view that has been materialized (stored physically) on disk.",
      impact: "Greatly improves performance for aggregations.",
      color: "green",
      icon: "⚡",
      basics: "An Indexed View is special because the result of the query is actually saved to disk, just like a real table. It's automatically updated whenever the underlying data changes. This makes reading from it incredibly fast.",
      details: "Requires SCHEMABINDING. You must create a Unique Clustered Index on the view first. Increases storage and slows down write operations on the underlying tables.",
      scenario: "Pre-calculating complex totals (SUM, COUNT) for a dashboard that is viewed frequently.",
      code: `CREATE VIEW vw_SalesTotal WITH SCHEMABINDING AS
SELECT ProductID, SUM(Amount) as Total
FROM dbo.Sales GROUP BY ProductID;

CREATE UNIQUE CLUSTERED INDEX IX_View ON vw_SalesTotal(ProductID);`
    },
    {
      name: "Schema Binding",
      description: "Locks the underlying tables so they cannot be altered in a way that breaks the view.",
      impact: "Ensures dependency integrity.",
      color: "red",
      icon: "🔒",
      basics: "Schema Binding is like a safety lock. If you create a view with Schema Binding, no one can drop the table or change the columns that the view depends on. It prevents 'oops, I broke the report' moments.",
      details: "Required for Indexed Views. You must use two-part names (dbo.TableName).",
      scenario: "Protecting critical reporting views from accidental schema changes.",
      code: `CREATE VIEW vw_SafeView WITH SCHEMABINDING AS ...`
    },
    {
      name: "Partitioned View",
      description: "Joins horizontally partitioned data from multiple tables across one or more servers.",
      impact: "Scalability for massive datasets.",
      color: "purple",
      icon: "🧩",
      basics: "A Partitioned View acts like a big container that holds data from several smaller tables. For example, you might have separate tables for Sales2023, Sales2024, etc., but the view lets you query them all as if they were one big 'Sales' table.",
      details: "Uses UNION ALL to combine results. Can be local (same server) or distributed (different servers).",
      scenario: "Archiving old data into separate tables while keeping it accessible via a single view.",
      code: `CREATE VIEW vw_AllSales AS
SELECT * FROM Sales2023
UNION ALL
SELECT * FROM Sales2024;`
    },
    {
      name: "System View",
      description: "Built-in views that expose database metadata.",
      impact: "Essential for administration.",
      color: "orange",
      icon: "⚙️",
      basics: "System Views are read-only views provided by SQL Server to tell you about the database itself. They answer questions like 'What tables do I have?' or 'Who is logged in?'.",
      details: "Examples include sys.tables, sys.objects, sys.indexes. They are the preferred way to query metadata.",
      scenario: "Checking which tables have been created recently.",
      code: `SELECT * FROM sys.tables;`
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-white">Views Guide</h1>
      <p className="text-slate-400 mb-8 text-lg">
        Simplifying data access and security with SQL Server Views.
      </p>

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
            <strong>Definition:</strong> A view is a saved query that behaves like a table, providing an abstraction layer over database tables.
          </InfoCard>

          <SectionTitle>📖 Basics: What is a View?</SectionTitle>
          <div className="bg-teal-900/20 border-l-4 border-teal-500 p-6 rounded-r-lg">
            <p className="text-slate-300 leading-relaxed mb-4">
              A <strong>View</strong> is like a saved shortcut to a complex query. Instead of writing the same complicated SELECT statement over and over, you create a view once and then query it like it's a regular table. Think of it as a "virtual table" - it doesn't store data itself, but shows you data from other tables.
            </p>

            <SubSectionTitle>Real-World Analogy</SubSectionTitle>
            <p className="text-slate-300 leading-relaxed mb-4">
              Imagine you have a messy closet with clothes scattered everywhere. Instead of reorganizing the closet, you create a "view" - a photo album showing only your favorite outfits, neatly organized. The clothes are still in the messy closet, but the photo album gives you a clean, organized way to see what you want.
            </p>

            <SubSectionTitle>Creating Your First View</SubSectionTitle>
            <p className="text-slate-300 leading-relaxed mb-2">
              Let's say you often need to see only active employees. Instead of writing the WHERE clause every time:
            </p>
            <CodeBlock>{`-- Create the view once
CREATE VIEW vw_ActiveEmployees AS
SELECT EmployeeID, FirstName, LastName, Email
FROM Employees
WHERE IsActive = 1;

-- Now query it like a table:
SELECT * FROM vw_ActiveEmployees;

-- Much simpler than:
SELECT EmployeeID, FirstName, LastName, Email
FROM Employees
WHERE IsActive = 1;`}</CodeBlock>

            <SubSectionTitle>Why Use Views?</SubSectionTitle>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800 p-4 rounded border border-teal-500/30">
                <h4 className="font-bold text-teal-400 mb-2">1. Simplify Complex Queries</h4>
                <p className="text-sm text-slate-300">Hide JOINs, calculations, and filters behind a simple name</p>
              </div>
              <div className="bg-slate-800 p-4 rounded border border-teal-500/30">
                <h4 className="font-bold text-teal-400 mb-2">2. Security</h4>
                <p className="text-sm text-slate-300">Show only certain columns/rows to users without giving full table access</p>
              </div>
              <div className="bg-slate-800 p-4 rounded border border-teal-500/30">
                <h4 className="font-bold text-teal-400 mb-2">3. Consistency</h4>
                <p className="text-sm text-slate-300">Everyone uses the same logic - no duplicate code</p>
              </div>
              <div className="bg-slate-800 p-4 rounded border border-teal-500/30">
                <h4 className="font-bold text-teal-400 mb-2">4. Abstraction</h4>
                <p className="text-sm text-slate-300">Hide database structure changes from applications</p>
              </div>
            </div>

            <SubSectionTitle>Example: Hiding Sensitive Data</SubSectionTitle>
            <CodeBlock>{`-- Table has sensitive salary data
-- CREATE TABLE Employees (
--     EmployeeID INT,
--     Name VARCHAR(100),
--     Salary DECIMAL(10,2),  -- Sensitive!
--     Department VARCHAR(50)
-- );

-- Create a view WITHOUT the salary column
CREATE VIEW vw_EmployeeDirectory AS
SELECT EmployeeID, Name, Department
FROM Employees;

-- Give users access to the view, not the table
-- They can see names and departments, but NOT salaries`}</CodeBlock>

            <SubSectionTitle>Important Notes</SubSectionTitle>
            <div className="space-y-2">
              <div className="bg-slate-800 p-3 rounded border border-teal-500/30">
                <p className="text-sm text-slate-300">
                  <strong className="text-teal-400">• Views don't store data</strong> - They're just saved queries. The data still lives in the underlying tables.
                </p>
              </div>
              <div className="bg-slate-800 p-3 rounded border border-teal-500/30">
                <p className="text-sm text-slate-300">
                  <strong className="text-teal-400">• You can query views like tables</strong> - SELECT, WHERE, JOIN, ORDER BY all work.
                </p>
              </div>
              <div className="bg-slate-800 p-3 rounded border border-teal-500/30">
                <p className="text-sm text-slate-300">
                  <strong className="text-teal-400">• Sometimes you can UPDATE through views</strong> - But only simple views (single table, no aggregations).
                </p>
              </div>
            </div>

            <SubSectionTitle>Viewing Existing Views</SubSectionTitle>
            <CodeBlock>{`-- See all views in the database
SELECT name FROM sys.views;

-- See the definition of a specific view
EXEC sp_helptext 'vw_ActiveEmployees';`}</CodeBlock>
          </div>

          <SectionTitle>Why Use Views?</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2">✅ Advantages</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Simplifies complex queries.</li>
                <li>Improves security by restricting direct table access.</li>
                <li>Encapsulates business logic in the database layer.</li>
                <li>Supports data abstraction — users query the view, not raw tables.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Limitations</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Performance overhead for complex views (especially with joins).</li>
                <li>Cannot always perform <code>INSERT</code>, <code>UPDATE</code>, or <code>DELETE</code> on views.</li>
                <li>Indexed views consume extra storage and maintenance.</li>
              </ul>
            </div>
          </div>

          <SectionTitle>Examples of Views</SectionTitle>

          <SubSectionTitle>1. Simple View</SubSectionTitle>
          <p className="text-slate-300 leading-relaxed">A basic view selecting specific columns from a table.</p>
          <CodeBlock>{`CREATE VIEW vw_EmployeeNames AS
SELECT EmployeeID, FirstName, LastName
FROM Employees;`}</CodeBlock>

          <SubSectionTitle>2. Complex View (with Join)</SubSectionTitle>
          <p className="text-slate-300 leading-relaxed">
            A view combining multiple tables to show richer data.
          </p>
          <CodeBlock>{`CREATE VIEW vw_EmployeeDepartment AS
SELECT e.EmployeeID, e.FirstName, d.DepartmentName
FROM Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID;`}</CodeBlock>

          <SubSectionTitle>3. Indexed View</SubSectionTitle>
          <p className="text-slate-300 leading-relaxed">
            Indexed views store results physically and can improve performance for complex aggregations.
          </p>
          <CodeBlock>{`CREATE VIEW vw_SalesSummary
WITH SCHEMABINDING
AS
SELECT SalesPersonID, COUNT_BIG(*) AS TotalOrders, SUM(SaleAmount) AS TotalSales
FROM dbo.Sales
GROUP BY SalesPersonID;

-- Indexed View requires unique clustered index
CREATE UNIQUE CLUSTERED INDEX IX_vw_SalesSummary
ON vw_SalesSummary (SalesPersonID);`}</CodeBlock>
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
        <ViewPlayground />
      )}
    </div>
  );
};

export default ViewsGuide;
