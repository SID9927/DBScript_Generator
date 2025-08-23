import React, { useState } from "react";

// --- Reusable Components (same as in other guides) ---
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

// --- Interactive Playground for Views ---
const ViewPlayground = () => {
  const [viewName, setViewName] = useState("vw_ActiveEmployees");
  const [table, setTable] = useState("Employees");
  const [columns, setColumns] = useState("EmployeeID, FirstName, LastName");
  const [condition, setCondition] = useState("IsActive = 1");

  const generateSQL = () => {
    return `CREATE VIEW ${viewName} AS
SELECT ${columns}
FROM ${table}
${condition ? "WHERE " + condition : ""};`;
  };

  return (
    <div className="p-6 bg-gray-50 border rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🛠 Try It Yourself: View Generator</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">View Name</label>
          <input
            type="text"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            className="w-full border p-2 rounded"
          />
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

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">Columns</label>
          <input
            type="text"
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            placeholder="e.g., EmployeeID, FirstName, LastName"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">Condition (Optional)</label>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g., IsActive = 1"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {/* Live Preview */}
      <CodeBlock>{generateSQL()}</CodeBlock>
    </div>
  );
};

// --- Main Guide Component ---
const ViewsGuide = () => {
  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Views</h1>
      <p className="text-gray-700 leading-relaxed">
        A View is a virtual table whose contents are defined by a SQL query. Views do not store data physically
        (except indexed views) but provide a way to simplify complex queries, improve security, and reuse logic.
      </p>

      <InfoCard type="info">
        <strong>Definition:</strong> A view is a saved query that behaves like a table, providing an abstraction
        layer over database tables.
      </InfoCard>

      <SectionTitle>Why Use Views?</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-green-600 mb-2">✅ Advantages</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Simplifies complex queries.</li>
            <li>Improves security by restricting direct table access.</li>
            <li>Encapsulates business logic in the database layer.</li>
            <li>Supports data abstraction — users query the view, not raw tables.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Limitations</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Performance overhead for complex views (especially with joins).</li>
            <li>Cannot always perform <code>INSERT</code>, <code>UPDATE</code>, or <code>DELETE</code> on views.</li>
            <li>Indexed views consume extra storage and maintenance.</li>
          </ul>
        </div>
      </div>

      <SectionTitle>Examples of Views</SectionTitle>

      <SubSectionTitle>1. Simple View</SubSectionTitle>
      <p className="text-gray-700 leading-relaxed">A basic view selecting specific columns from a table.</p>
      <CodeBlock>{`CREATE VIEW vw_EmployeeNames AS
SELECT EmployeeID, FirstName, LastName
FROM Employees;`}</CodeBlock>

      <SubSectionTitle>2. Complex View (with Join)</SubSectionTitle>
      <p className="text-gray-700 leading-relaxed">
        A view combining multiple tables to show richer data.
      </p>
      <CodeBlock>{`CREATE VIEW vw_EmployeeDepartment AS
SELECT e.EmployeeID, e.FirstName, d.DepartmentName
FROM Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID;`}</CodeBlock>

      <SubSectionTitle>3. Indexed View</SubSectionTitle>
      <p className="text-gray-700 leading-relaxed">
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

      {/* Playground */}
      <ViewPlayground />
    </div>
  );
};

export default ViewsGuide;
