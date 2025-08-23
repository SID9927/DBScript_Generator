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

// --- Playground Tabs ---
const TablePlaygroundDynamic = () => {
  const [tables, setTables] = useState([
    {
      tableName: "Employees",
      columns: [
        { name: "EmployeeID", type: "INT", nullable: false, primaryKey: true },
        { name: "FirstName", type: "NVARCHAR(50)", nullable: false, primaryKey: false },
        { name: "LastName", type: "NVARCHAR(50)", nullable: false, primaryKey: false },
      ],
    },
  ]);
  const [activeTableIndex, setActiveTableIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("CREATE");

  const [insertValues, setInsertValues] = useState({});
  const [updateValues, setUpdateValues] = useState({});
  const [updateCondition, setUpdateCondition] = useState("");
  const [deleteCondition, setDeleteCondition] = useState("");
  const [selectColumns, setSelectColumns] = useState("*");
  const [selectCondition, setSelectCondition] = useState("");

  // --- Table Handlers ---
  const addTable = () => {
    const newTable = {
      tableName: "NewTable",
      columns: [{ name: "ID", type: "INT", nullable: false, primaryKey: true }],
    };
    setTables([...tables, newTable]);
    setActiveTableIndex(tables.length); // Activate the new table
    setActiveTab("CREATE"); // Force CREATE tab first
  };

  const removeTable = (index) => {
    const newTables = tables.filter((_, i) => i !== index);
    setTables(newTables);
    // Adjust active index
    setActiveTableIndex(Math.max(0, activeTableIndex - 1));
  };

  const updateTableName = (index, name) => {
    const newTables = [...tables];
    newTables[index].tableName = name;
    setTables(newTables);
  };

  const addColumn = (tableIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.push({ name: "NewColumn", type: "VARCHAR(50)", nullable: true, primaryKey: false });
    setTables(newTables);
  };

  const removeColumn = (tableIndex, colIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.splice(colIndex, 1);
    setTables(newTables);
  };

  const updateColumn = (tableIndex, colIndex, field, value) => {
    const newTables = [...tables];
    newTables[tableIndex].columns[colIndex][field] = value;
    setTables(newTables);
  };

  const activeTable = tables[activeTableIndex];

  // --- SQL Generators ---
  const generateCreateSQL = () => {
    const columnDefs = activeTable.columns.map(c => `${c.name} ${c.type}${c.nullable ? "" : " NOT NULL"}`).join(",\n    ");
    const primaryKeys = activeTable.columns.filter(c => c.primaryKey).map(c => c.name);
    const pkSQL = primaryKeys.length ? `,\n    PRIMARY KEY (${primaryKeys.join(", ")})` : "";
    return `CREATE TABLE ${activeTable.tableName} (\n    ${columnDefs}${pkSQL}\n);`;
  };

  const generateInsertSQL = () => {
    const cols = activeTable.columns.map(c => c.name);
    const values = cols.map(c => insertValues[c] ? `'${insertValues[c]}'` : "NULL");
    return `INSERT INTO ${activeTable.tableName} (${cols.join(", ")})\nVALUES (${values.join(", ")});`;
  };

  const generateUpdateSQL = () => {
    const setSQL = activeTable.columns
      .map(c => updateValues[c.name] ? `${c.name}='${updateValues[c.name]}'` : null)
      .filter(Boolean)
      .join(", ");
    return `UPDATE ${activeTable.tableName}\nSET ${setSQL}${updateCondition ? `\nWHERE ${updateCondition}` : ""};`;
  };

  const generateDeleteSQL = () => `DELETE FROM ${activeTable.tableName}${deleteCondition ? `\nWHERE ${deleteCondition}` : ""};`;
  const generateSelectSQL = () => `SELECT ${selectColumns} FROM ${activeTable.tableName}${selectCondition ? `\nWHERE ${selectCondition}` : ""};`;
  const generateTruncateSQL = () => `TRUNCATE TABLE ${activeTable.tableName};`;

  // --- Render Playground ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "CREATE":
        return (
          <div>
            <label className="block mb-2 font-semibold">Table Name</label>
            <input type="text" value={activeTable.tableName} onChange={(e) => updateTableName(activeTableIndex, e.target.value)} className="w-full border p-2 rounded mb-4" />
            <label className="block mb-2 font-semibold">Columns</label>
            {activeTable.columns.map((col, index) => (
              <div key={index} className="flex gap-2 mb-2 flex-wrap">
                <input type="text" value={col.name} onChange={(e) => updateColumn(activeTableIndex, index, "name", e.target.value)} className="border p-2 rounded flex-1" />
                <input type="text" value={col.type} onChange={(e) => updateColumn(activeTableIndex, index, "type", e.target.value)} className="border p-2 rounded w-32" />
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={col.nullable} onChange={(e) => updateColumn(activeTableIndex, index, "nullable", e.target.checked)} /> Nullable
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={col.primaryKey} onChange={(e) => updateColumn(activeTableIndex, index, "primaryKey", e.target.checked)} /> Primary Key
                </label>
                <button onClick={() => removeColumn(activeTableIndex, index)} className="bg-red-500 text-white px-2 rounded hover:bg-red-600">Remove</button>
              </div>
            ))}
            <button onClick={() => addColumn(activeTableIndex)} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">+ Add Column</button>
            <CodeBlock>{generateCreateSQL()}</CodeBlock>
          </div>
        );
      case "INSERT":
        return (
          <div>
            {activeTable.columns.map(col => (
              <div key={col.name} className="flex gap-2 mb-2">
                <span className="w-32">{col.name}:</span>
                <input type="text" value={insertValues[col.name] || ""} onChange={(e) => setInsertValues({ ...insertValues, [col.name]: e.target.value })} className="border p-2 rounded flex-1" />
              </div>
            ))}
            <CodeBlock>{generateInsertSQL()}</CodeBlock>
          </div>
        );
      case "UPDATE":
        return (
          <div>
            {activeTable.columns.map(col => (
              <div key={col.name} className="flex gap-2 mb-2">
                <span className="w-32">{col.name}:</span>
                <input type="text" value={updateValues[col.name] || ""} onChange={(e) => setUpdateValues({ ...updateValues, [col.name]: e.target.value })} className="border p-2 rounded flex-1" />
              </div>
            ))}
            <label className="block mt-2 mb-1">WHERE Condition</label>
            <input type="text" value={updateCondition} onChange={(e) => setUpdateCondition(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="e.g. EmployeeID = 1" />
            <CodeBlock>{generateUpdateSQL()}</CodeBlock>
          </div>
        );
      case "DELETE":
        return (
          <div>
            <label className="block mb-2 font-semibold">WHERE Condition</label>
            <input type="text" value={deleteCondition} onChange={(e) => setDeleteCondition(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="e.g. EmployeeID = 1" />
            <CodeBlock>{generateDeleteSQL()}</CodeBlock>
          </div>
        );
      case "SELECT":
        return (
          <div>
            <label className="block mb-2 font-semibold">Columns</label>
            <input type="text" value={selectColumns} onChange={(e) => setSelectColumns(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="* or col1,col2" />
            <label className="block mb-2 font-semibold">WHERE Condition</label>
            <input type="text" value={selectCondition} onChange={(e) => setSelectCondition(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="e.g. LastName='Smith'" />
            <CodeBlock>{generateSelectSQL()}</CodeBlock>
          </div>
        );
      case "TRUNCATE":
        return (
          <div>
            <p className="mb-2 text-gray-700">TRUNCATE TABLE removes all rows quickly without firing DELETE triggers.</p>
            <CodeBlock>{generateTruncateSQL()}</CodeBlock>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 border rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🛠SQL Playground</h2>

      {/* Table Buttons */}
      <div className="flex gap-2 flex-wrap mb-4">
        {tables.map((table, index) => (
          <div key={index} className="flex gap-1">
            <button
              onClick={() => setActiveTableIndex(index)}
              className={`px-3 py-1 rounded ${activeTableIndex === index ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {table.tableName}
            </button>
            {index !== 0 && (
              <button onClick={() => removeTable(index)} className="bg-red-500 text-white px-1 rounded hover:bg-red-600">×</button>
            )}
          </div>
        ))}
        <button onClick={addTable} className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">+ Add Table</button>
      </div>

      {/* Operation Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {["CREATE", "INSERT", "UPDATE", "DELETE", "SELECT", "TRUNCATE"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};

// --- Main Tables Guide Component ---
const TablesGuide = () => {
  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Tables</h1>
      <p className="text-gray-700 leading-relaxed">
        Tables store relational data in rows and columns. This guide covers table DDL, DML, constraints, advanced queries, and indexes.
      </p>

      <InfoCard type="info">
        Tables are the backbone of relational databases. Proper design ensures data integrity and performance.
      </InfoCard>

      <SectionTitle>DDL Examples</SectionTitle>
      <InfoCard type="info">
        DDL (Data Definition Language) statements define or modify database structures like tables, indexes, and schemas.
      </InfoCard>

      <SubSectionTitle>CREATE TABLE</SubSectionTitle>
      <CodeBlock>{`CREATE TABLE Employees (
    EmployeeID INT NOT NULL PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL
);`}</CodeBlock>
      <InfoCard type="success">
        CREATE TABLE creates a new table with columns, types, and constraints. Always define primary keys for data integrity.
      </InfoCard>

      <SubSectionTitle>ALTER TABLE</SubSectionTitle>
      <CodeBlock>{`ALTER TABLE Employees
ADD DateOfBirth DATE NULL;`}</CodeBlock>
      <InfoCard type="success">
        ALTER TABLE modifies an existing table. You can add, modify, or drop columns and constraints.
      </InfoCard>

      <SubSectionTitle>DROP TABLE</SubSectionTitle>
      <CodeBlock>{`DROP TABLE Employees;`}</CodeBlock>
      <InfoCard type="danger">
        DROP TABLE permanently deletes a table and all its data. Use carefully.
      </InfoCard>

      <SubSectionTitle>TRUNCATE TABLE</SubSectionTitle>
      <CodeBlock>{`TRUNCATE TABLE Employees;`}</CodeBlock>
      <InfoCard type="warning">
        TRUNCATE TABLE removes all rows quickly but does not fire DELETE triggers. Table structure remains intact.
      </InfoCard>

      <SectionTitle>DML Examples</SectionTitle>
      <InfoCard type="info">
        DML (Data Manipulation Language) statements manipulate data inside tables: INSERT, UPDATE, DELETE, SELECT.
      </InfoCard>

      <SubSectionTitle>INSERT</SubSectionTitle>
      <CodeBlock>{`INSERT INTO Employees (EmployeeID, FirstName, LastName)
VALUES (1, 'John', 'Doe');`}</CodeBlock>
      <InfoCard type="success">
        INSERT adds new rows to a table. Ensure data types match column definitions.
      </InfoCard>

      <SubSectionTitle>UPDATE</SubSectionTitle>
      <CodeBlock>{`UPDATE Employees
SET LastName='Smith'
WHERE EmployeeID=1;`}</CodeBlock>
      <InfoCard type="warning">
        UPDATE modifies existing rows. Always include a WHERE clause to prevent updating all rows unintentionally.
      </InfoCard>

      <SubSectionTitle>DELETE</SubSectionTitle>
      <CodeBlock>{`DELETE FROM Employees
WHERE EmployeeID=1;`}</CodeBlock>
      <InfoCard type="danger">
        DELETE removes rows from a table. Without WHERE, all rows are deleted.
      </InfoCard>

      <SubSectionTitle>SELECT</SubSectionTitle>
      <CodeBlock>{`SELECT EmployeeID, FirstName, LastName
FROM Employees
WHERE LastName='Smith';`}</CodeBlock>
      <InfoCard type="info">
        SELECT retrieves data. You can filter with WHERE, sort with ORDER BY, and aggregate with GROUP BY.
      </InfoCard>

      <SectionTitle>Constraints</SectionTitle>
      <CodeBlock>{`-- PRIMARY KEY
EmployeeID INT PRIMARY KEY

-- FOREIGN KEY
DepartmentID INT FOREIGN KEY REFERENCES Departments(DepartmentID)

-- UNIQUE
Email NVARCHAR(100) UNIQUE

-- CHECK
Salary DECIMAL(10,2) CHECK (Salary>0)

-- NOT NULL
FirstName NVARCHAR(50) NOT NULL`}</CodeBlock>

      <SectionTitle>Indexes</SectionTitle>
      <CodeBlock>{`-- Creating Index
CREATE INDEX IX_Employees_LastName
ON Employees(LastName);

-- Dropping Index
DROP INDEX IX_Employees_LastName ON Employees;`}</CodeBlock>

      <InfoCard type="success">
        Use constraints and indexes wisely to maintain data integrity and improve query performance.
      </InfoCard>

      <SectionTitle>Advanced Queries</SectionTitle>
      <SubSectionTitle>UNION</SubSectionTitle>
      <CodeBlock>{`SELECT FirstName FROM Employees
UNION
SELECT FirstName FROM Managers;`}</CodeBlock>
      <InfoCard type="info">
        UNION combines results from multiple SELECT statements and removes duplicates.
      </InfoCard>

      <SubSectionTitle>INTERSECT</SubSectionTitle>
      <CodeBlock>{`SELECT FirstName FROM Employees
INTERSECT
SELECT FirstName FROM Managers;`}</CodeBlock>
      <InfoCard type="info">
        INTERSECT returns only rows common to both SELECT statements.
      </InfoCard>

      <SubSectionTitle>EXCEPT / MINUS</SubSectionTitle>
      <CodeBlock>{`SELECT FirstName FROM Employees
EXCEPT
SELECT FirstName FROM Managers;`}</CodeBlock>
      <InfoCard type="info">
        EXCEPT (or MINUS in some DBs) returns rows from the first query that are not in the second.
      </InfoCard>

      <SubSectionTitle>ORDER BY & GROUP BY</SubSectionTitle>
      <CodeBlock>{`SELECT DepartmentID, COUNT(*) AS NumEmployees
FROM Employees
GROUP BY DepartmentID
HAVING COUNT(*) > 5
ORDER BY NumEmployees DESC;`}</CodeBlock>
      <InfoCard type="info">
        GROUP BY aggregates data, HAVING filters aggregated results, ORDER BY sorts output.
      </InfoCard>

      <SubSectionTitle>Joins</SubSectionTitle>
      <CodeBlock>{`-- INNER JOIN
SELECT e.FirstName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d
ON e.DepartmentID = d.DepartmentID;

-- LEFT JOIN
SELECT e.FirstName, d.DepartmentName
FROM Employees e
LEFT JOIN Departments d
ON e.DepartmentID = d.DepartmentID;`}</CodeBlock>
      <InfoCard type="info">
        Joins combine data from multiple tables. INNER JOIN returns matching rows, LEFT JOIN includes all rows from the left table.
      </InfoCard>

      {/* Tabbed Playground */}
      <TablePlaygroundDynamic />
    </div>
  );
};

export default TablesGuide;
