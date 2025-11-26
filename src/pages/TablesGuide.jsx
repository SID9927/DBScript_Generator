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
            <label className="block mb-2 font-semibold text-slate-700">Table Name</label>
            <input type="text" value={activeTable.tableName} onChange={(e) => updateTableName(activeTableIndex, e.target.value)} className="input-modern mb-4" />
            <label className="block mb-2 font-semibold text-slate-700">Columns</label>
            {activeTable.columns.map((col, index) => (
              <div key={index} className="flex gap-2 mb-2 flex-wrap items-center">
                <input type="text" value={col.name} onChange={(e) => updateColumn(activeTableIndex, index, "name", e.target.value)} className="input-modern flex-1" />
                <input type="text" value={col.type} onChange={(e) => updateColumn(activeTableIndex, index, "type", e.target.value)} className="input-modern w-32" />
                <label className="flex items-center gap-1 text-sm text-slate-600">
                  <input type="checkbox" checked={col.nullable} onChange={(e) => updateColumn(activeTableIndex, index, "nullable", e.target.checked)} /> Nullable
                </label>
                <label className="flex items-center gap-1 text-sm text-slate-600">
                  <input type="checkbox" checked={col.primaryKey} onChange={(e) => updateColumn(activeTableIndex, index, "primaryKey", e.target.checked)} /> Primary Key
                </label>
                <button onClick={() => removeColumn(activeTableIndex, index)} className="text-red-500 hover:text-red-700 px-2">×</button>
              </div>
            ))}
            <button onClick={() => addColumn(activeTableIndex)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Column</button>
            <CodeBlock>{generateCreateSQL()}</CodeBlock>
          </div>
        );
      case "INSERT":
        return (
          <div>
            {activeTable.columns.map(col => (
              <div key={col.name} className="flex gap-2 mb-2 items-center">
                <span className="w-32 text-sm font-medium text-slate-700">{col.name}:</span>
                <input type="text" value={insertValues[col.name] || ""} onChange={(e) => setInsertValues({ ...insertValues, [col.name]: e.target.value })} className="input-modern flex-1" />
              </div>
            ))}
            <CodeBlock>{generateInsertSQL()}</CodeBlock>
          </div>
        );
      case "UPDATE":
        return (
          <div>
            {activeTable.columns.map(col => (
              <div key={col.name} className="flex gap-2 mb-2 items-center">
                <span className="w-32 text-sm font-medium text-slate-700">{col.name}:</span>
                <input type="text" value={updateValues[col.name] || ""} onChange={(e) => setUpdateValues({ ...updateValues, [col.name]: e.target.value })} className="input-modern flex-1" />
              </div>
            ))}
            <label className="block mt-2 mb-1 text-sm font-medium text-slate-700">WHERE Condition</label>
            <input type="text" value={updateCondition} onChange={(e) => setUpdateCondition(e.target.value)} className="input-modern mb-2" placeholder="e.g. EmployeeID = 1" />
            <CodeBlock>{generateUpdateSQL()}</CodeBlock>
          </div>
        );
      case "DELETE":
        return (
          <div>
            <label className="block mb-2 font-semibold text-slate-700">WHERE Condition</label>
            <input type="text" value={deleteCondition} onChange={(e) => setDeleteCondition(e.target.value)} className="input-modern mb-2" placeholder="e.g. EmployeeID = 1" />
            <CodeBlock>{generateDeleteSQL()}</CodeBlock>
          </div>
        );
      case "SELECT":
        return (
          <div>
            <label className="block mb-2 font-semibold text-slate-700">Columns</label>
            <input type="text" value={selectColumns} onChange={(e) => setSelectColumns(e.target.value)} className="input-modern mb-2" placeholder="* or col1,col2" />
            <label className="block mb-2 font-semibold text-slate-700">WHERE Condition</label>
            <input type="text" value={selectCondition} onChange={(e) => setSelectCondition(e.target.value)} className="input-modern mb-2" placeholder="e.g. LastName='Smith'" />
            <CodeBlock>{generateSelectSQL()}</CodeBlock>
          </div>
        );
      case "TRUNCATE":
        return (
          <div>
            <p className="mb-2 text-slate-700">TRUNCATE TABLE removes all rows quickly without firing DELETE triggers.</p>
            <CodeBlock>{generateTruncateSQL()}</CodeBlock>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">🛠 SQL Playground</h2>

      {/* Table Buttons */}
      <div className="flex gap-2 flex-wrap mb-4">
        {tables.map((table, index) => (
          <div key={index} className="flex gap-1">
            <button
              onClick={() => setActiveTableIndex(index)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTableIndex === index ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"}`}
            >
              {table.tableName}
            </button>
            {index !== 0 && (
              <button onClick={() => removeTable(index)} className="text-red-500 hover:text-red-700 px-1">×</button>
            )}
          </div>
        ))}
        <button onClick={addTable} className="px-3 py-1 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">+ Add Table</button>
      </div>

      {/* Operation Tabs */}
      <div className="flex gap-2 flex-wrap mb-4 border-b border-slate-200 pb-2">
        {["CREATE", "INSERT", "UPDATE", "DELETE", "SELECT", "TRUNCATE"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTab === tab ? "bg-blue-600 text-white" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};

// --- ALTER TABLE Generator Component ---
const AlterTableGenerator = () => {
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [copied, setCopied] = useState(false);

  const generateScriptForTable = (table, columnLines) => {
    let scriptParts = [];

    // Header
    scriptParts.push(`-- ============================================`);
    scriptParts.push(`-- ALTER TABLE: ${table}`);
    scriptParts.push(`-- Generated: ${new Date().toLocaleString()}`);
    scriptParts.push(`-- Total Columns: ${columnLines.length}`);
    scriptParts.push(`-- ============================================`);
    scriptParts.push(``);

    // Process each column
    columnLines.forEach((columnDef, index) => {
      const parts = columnDef.trim().split(/\s+/);
      const columnName = parts[0];
      const dataType = parts.slice(1).join(' ');

      scriptParts.push(`-- Column ${index + 1}: ${columnName}`);
      scriptParts.push(`IF NOT EXISTS (`);
      scriptParts.push(`    SELECT 1 FROM sys.columns `);
      scriptParts.push(`    WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') `);
      scriptParts.push(`    AND name = '${columnName}'`);
      scriptParts.push(`)`);
      scriptParts.push(`BEGIN`);
      scriptParts.push(`    ALTER TABLE [dbo].[${table}]`);
      scriptParts.push(`    ADD [${columnName}] ${dataType};`);
      scriptParts.push(`    PRINT 'Column ${columnName} added to ${table} successfully';`);
      scriptParts.push(`END`);
      scriptParts.push(`ELSE`);
      scriptParts.push(`BEGIN`);
      scriptParts.push(`    PRINT 'Column ${columnName} already exists in ${table} - skipping';`);
      scriptParts.push(`END`);
      scriptParts.push(`GO`);
      scriptParts.push(``);
    });

    // Verification Query
    scriptParts.push(`-- Verification Query for ${table}`);
    scriptParts.push(`SELECT `);
    scriptParts.push(`    COLUMN_NAME,`);
    scriptParts.push(`    DATA_TYPE,`);
    scriptParts.push(`    IS_NULLABLE,`);
    scriptParts.push(`    COLUMN_DEFAULT`);
    scriptParts.push(`FROM INFORMATION_SCHEMA.COLUMNS`);
    scriptParts.push(`WHERE TABLE_NAME = '${table}'`);
    scriptParts.push(`ORDER BY ORDINAL_POSITION;`);
    scriptParts.push(`GO`);

    return scriptParts.join('\n');
  };

  const generateSingleAlterScript = () => {
    if (!tableName.trim() || !columns.trim()) return;

    const columnLines = columns
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (columnLines.length === 0) return;

    return generateScriptForTable(tableName, columnLines);
  };

  const generateBulkAlterScript = () => {
    if (!bulkInput.trim()) return;

    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let scriptParts = [];
    let currentTable = null;
    let currentColumns = [];

    lines.forEach(line => {
      // Check if line is a table name (format: [TableName] or TableName:)
      if (line.startsWith('[') && line.endsWith(']')) {
        // Process previous table if exists
        if (currentTable && currentColumns.length > 0) {
          scriptParts.push(generateScriptForTable(currentTable, currentColumns));
          scriptParts.push('');
        }
        // Start new table
        currentTable = line.slice(1, -1);
        currentColumns = [];
      } else if (line.endsWith(':')) {
        // Process previous table if exists
        if (currentTable && currentColumns.length > 0) {
          scriptParts.push(generateScriptForTable(currentTable, currentColumns));
          scriptParts.push('');
        }
        // Start new table
        currentTable = line.slice(0, -1);
        currentColumns = [];
      } else {
        // It's a column definition
        if (currentTable) {
          currentColumns.push(line);
        }
      }
    });

    // Process last table
    if (currentTable && currentColumns.length > 0) {
      scriptParts.push(generateScriptForTable(currentTable, currentColumns));
    }

    return scriptParts.join('\n\n');
  };

  const handleGenerate = () => {
    let script = '';
    if (mode === 'single') {
      script = generateSingleAlterScript();
    } else {
      script = generateBulkAlterScript();
    }
    setGeneratedScript(script || '');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearAll = () => {
    setTableName('');
    setColumns('');
    setBulkInput('');
    setGeneratedScript('');
  };

  const countTables = () => {
    if (mode === 'single') return 1;
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    return lines.filter(l => (l.startsWith('[') && l.endsWith(']')) || l.endsWith(':')).length;
  };

  const countColumns = () => {
    if (mode === 'single') {
      return columns.split('\n').filter(l => l.trim()).length;
    } else {
      const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      return lines.filter(l => !l.startsWith('[') && !l.endsWith(':')).length;
    }
  };

  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center gap-2">
        🔧 ALTER TABLE Generator
      </h2>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-md mb-6">
        <p className="text-sm text-indigo-800">
          <span className="font-semibold">Smart Column Addition:</span> Generates ALTER TABLE scripts with automatic existence checks.
          Each column is verified before being added to prevent errors in production deployments.
        </p>
        <p className="text-xs text-indigo-700 mt-2">
          💡 <strong>Format:</strong> <code className="bg-indigo-100 px-1 rounded">ColumnName DataType [NULL/NOT NULL] [DEFAULT value]</code>
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        <button
          onClick={() => setMode('single')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'single'
            ? 'text-blue-600 border-blue-600'
            : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
        >
          Single Table
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'bulk'
            ? 'text-blue-600 border-blue-600'
            : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
        >
          Bulk Tables
        </button>
      </div>

      <div className="space-y-6">
        {mode === 'single' ? (
          <>
            {/* Single Table Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Table Name <span className="text-red-500">*</span>
              </label>
              <input
                className="input-modern max-w-md"
                type="text"
                placeholder="e.g., Customers"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Column Definitions <span className="text-slate-400 font-normal">(One per line)</span> <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-modern h-64 font-mono text-sm"
                placeholder={`Email NVARCHAR(255) NULL\nPhoneNumber VARCHAR(20) NULL\nCreatedDate DATETIME NOT NULL\nIsActive BIT NOT NULL DEFAULT 1\nLastModifiedBy INT NULL\nModifiedDate DATETIME DEFAULT GETDATE()`}
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-slate-500">
                  ✅ <strong>Supports:</strong> All data types, NULL/NOT NULL constraints, DEFAULT values
                </p>
                <p className="text-xs text-slate-500">
                  🔒 <strong>Safe:</strong> Each column is checked for existence before being added
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Bulk Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bulk Table Definitions <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-modern h-96 font-mono text-sm"
                placeholder={`[Customers]\nEmail NVARCHAR(255) NULL\nPhoneNumber VARCHAR(20) NULL\nCreatedDate DATETIME NOT NULL\n\n[Orders]\nOrderStatus VARCHAR(50) NULL\nShippingAddress NVARCHAR(500) NULL\nTrackingNumber VARCHAR(100) NULL\n\n[Products]\nSKU VARCHAR(50) NOT NULL\nBarcode VARCHAR(100) NULL\nStockQuantity INT DEFAULT 0`}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-slate-500">
                  📋 <strong>Format:</strong> Use <code className="bg-slate-200 px-1 rounded">[TableName]</code> or <code className="bg-slate-200 px-1 rounded">TableName:</code> to start a new table
                </p>
                <p className="text-xs text-slate-500">
                  📦 <strong>Bulk:</strong> Add columns to multiple tables in one script
                </p>
                <p className="text-xs text-slate-500">
                  🔒 <strong>Safe:</strong> Each column in each table is checked for existence
                </p>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={mode === 'single' ? (!tableName.trim() || !columns.trim()) : !bulkInput.trim()}
          >
            🚀 Generate ALTER Script
          </button>
          {generatedScript && (
            <button
              onClick={clearAll}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Generated Script Output */}
        {generatedScript && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-slate-900">
                📜 Generated ALTER TABLE Script
              </h3>
              <button
                className={`text-xs px-3 py-2 rounded border transition-colors ${copied
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                onClick={copyToClipboard}
              >
                {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>
            <div className="code-block">
              <textarea
                className="w-full h-96 p-4 bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none"
                value={generatedScript}
                readOnly
              />
            </div>

            {/* Script Stats */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-600 uppercase font-bold mb-1">Tables</div>
                <div className="text-2xl font-bold text-indigo-900">
                  {countTables()}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-xs text-blue-600 uppercase font-bold mb-1">Total Columns</div>
                <div className="text-2xl font-bold text-blue-900">
                  {countColumns()}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="text-xs text-green-600 uppercase font-bold mb-1">Script Lines</div>
                <div className="text-2xl font-bold text-green-900">
                  {generatedScript.split('\n').length}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="text-xs text-purple-600 uppercase font-bold mb-1">Safety Checks</div>
                <div className="text-2xl font-bold text-purple-900">
                  {countColumns()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- Main Tables Guide Component ---
const TablesGuide = () => {
  const [activeTab, setActiveTab] = useState("guide");
  const [expandedTerm, setExpandedTerm] = useState(null);

  const toggleTerm = (index) => {
    setExpandedTerm(expandedTerm === index ? null : index);
  };

  const terms = [
    {
      name: "Heap",
      description: "A table without a clustered index. Data is stored in no particular order.",
      impact: "Fast inserts, slow lookups.",
      color: "yellow",
      icon: "📦",
      basics: "Think of a Heap like a messy drawer where you just toss items in without organizing them. When you create a table without specifying a Primary Key or Clustered Index, SQL Server creates it as a Heap. Data is stored in whatever order it arrives, making inserts very fast but searches slower since there's no organization.",
      details: "A Heap is a table structure where data pages are not linked in a sorted order. New records are inserted wherever there is space. This makes inserts very fast because there is no overhead of maintaining order.",
      scenario: "Staging tables for high-speed bulk inserts (ETL) where data is inserted and then immediately moved/processed. Heaps are ideal when you are dumping data and don't need to query it by a specific key immediately.",
      code: `CREATE TABLE Staging_Logs (
    LogMsg VARCHAR(MAX)
) WITH (HEAP); -- No PK, No Clustered Index`
    },
    {
      name: "Clustered Index",
      description: "Sorts and stores the data rows in the table or view based on their key values.",
      impact: "Fast retrieval for ranges and specific keys.",
      color: "green",
      icon: "🗂️",
      basics: "A Clustered Index is like a phone book where names are sorted alphabetically. The data itself is physically arranged in order. When you define a Primary Key, SQL Server automatically creates a Clustered Index on it. This makes searching by that column very fast, but you can only have ONE clustered index per table since data can only be sorted one way physically.",
      details: "A Clustered Index determines the physical order of data in a table. The leaf nodes of the index contain the actual data pages. A table can have only one clustered index.",
      scenario: "Primary Keys on Identity columns or Date columns for sequential access. Most tables should have a clustered index on the Primary Key.",
      code: `CREATE CLUSTERED INDEX IX_Orders_OrderDate 
ON Orders(OrderDate);`
    },
    {
      name: "Identity Column",
      description: "A column that automatically generates numeric values.",
      impact: "Useful for surrogate primary keys.",
      color: "blue",
      icon: "🔢",
      basics: "An Identity column is like an automatic ticket dispenser - it gives each new row a unique number without you having to think about it. When you insert a new Employee, you don't specify the EmployeeID; SQL Server automatically assigns 1, 2, 3, etc. The syntax IDENTITY(1,1) means 'start at 1, increment by 1'.",
      details: "An Identity column is an auto-incrementing integer. You define a seed (starting value) and an increment. It handles concurrency automatically.",
      scenario: "Generating unique primary keys for Employees, Orders, or any entity where a natural unique key is missing or cumbersome.",
      code: `CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100)
);`
    },
    {
      name: "Computed Column",
      description: "A virtual column that is not physically stored in the table, unless marked PERSISTED.",
      impact: "Saves storage, but costs CPU on read.",
      color: "orange",
      icon: "🧮",
      basics: "A Computed Column is like a formula in Excel - it calculates its value based on other columns. For example, if you have Quantity and UnitPrice, you can create a TotalAmount column that automatically multiplies them. By default, it's calculated on-the-fly when you query it. Add PERSISTED to store the calculated value physically.",
      details: "Computed columns are derived from other columns in the same row. If marked PERSISTED, the value is calculated on write and stored physically, allowing it to be indexed.",
      scenario: "Calculating TotalAmount as Quantity * UnitPrice. This ensures consistency and simplifies queries.",
      code: `CREATE TABLE OrderDetails (
    Quantity INT,
    UnitPrice DECIMAL(10,2),
    TotalAmount AS (Quantity * UnitPrice) PERSISTED
);`
    },
    {
      name: "Temporal Table",
      description: "System-versioned table that keeps a full history of data changes.",
      impact: "Great for auditing, increases storage.",
      color: "blue",
      icon: "⏳",
      basics: "A Temporal Table is like having a time machine for your data. SQL Server automatically saves every version of every row whenever it changes. If someone updates a salary from $50k to $60k, both versions are kept with timestamps. You can then query 'What was John's salary on January 1st?' This is perfect for compliance and auditing requirements.",
      details: "Temporal tables automatically track the history of data changes. SQL Server maintains two tables: the current table and a history table.",
      scenario: "Auditing changes to sensitive data like Salaries or BankAccounts. You can query the state of data at any point in the past.",
      code: `CREATE TABLE Department (
    DeptID INT PRIMARY KEY,
    DeptName VARCHAR(50),
    SysStartTime DATETIME2 GENERATED ALWAYS AS ROW START,
    SysEndTime DATETIME2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime)
) WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.DepartmentHistory));`
    },
    {
      name: "CDC (Change Data Capture)",
      description: "Records insert, update, and delete activity applied to tables.",
      impact: "Enables efficient ETL processes.",
      color: "green",
      icon: "🔄",
      basics: "CDC (Change Data Capture) is like a security camera for your database - it records every INSERT, UPDATE, and DELETE that happens to a table. Instead of copying the entire table every hour to see what changed, CDC gives you a log of just the changes. This is much more efficient for syncing data to reporting systems or data warehouses.",
      details: "CDC records insert, update, and delete activity applied to tables. This makes the details of the changes available in an easily consumed relational format.",
      scenario: "Streaming changes to a Data Warehouse or Analytics system without having to query the entire source table.",
      code: `EXEC sys.sp_cdc_enable_table
    @source_schema = N'dbo',
    @source_name   = N'Orders',
    @role_name     = NULL;`
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-slate-900">Tables Guide</h1>
      <p className="text-slate-600 mb-8 text-lg">
        Mastering table design, optimization, and manipulation in SQL Server.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {['guide', 'terms', 'playground', 'alter'].map((tab) => (
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
            {tab === 'playground' && '🛠 Playground'}
            {tab === 'alter' && '🔧 ALTER TABLE'}
          </button>
        ))}
      </div>

      {/* Guide Tab */}
      {activeTab === 'guide' && (
        <div className="space-y-8">
          <InfoCard type="info">
            <strong>Corporate Best Practice:</strong> Always design tables with scalability and maintainability in mind. Use consistent naming conventions and appropriate data types to minimize storage footprint.
          </InfoCard>

          <SectionTitle>📖 Basics: What is a Table?</SectionTitle>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <p className="text-slate-700 leading-relaxed mb-4">
              A <strong>table</strong> is the fundamental building block of a database. Think of it like an Excel spreadsheet with rows and columns:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li><strong>Columns</strong> define what kind of data you store (e.g., Name, Age, Email)</li>
              <li><strong>Rows</strong> contain the actual data (e.g., one row per employee)</li>
              <li>Each column has a <strong>data type</strong> (INT for numbers, VARCHAR for text, etc.)</li>
            </ul>

            <SubSectionTitle>Creating Your First Table</SubSectionTitle>
            <p className="text-slate-700 leading-relaxed mb-2">
              Here's a simple example of creating an Employees table:
            </p>
            <CodeBlock>{`CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,      -- Unique identifier
    FirstName VARCHAR(50) NOT NULL,  -- Required field
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100),              -- Optional field
    Salary DECIMAL(10,2),            -- Numbers with 2 decimal places
    HireDate DATE
);`}</CodeBlock>

            <SubSectionTitle>Understanding Primary Keys</SubSectionTitle>
            <p className="text-slate-700 leading-relaxed mb-2">
              A <strong>Primary Key</strong> is a column (or combination of columns) that uniquely identifies each row. Rules:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li>Must be unique (no duplicates)</li>
              <li>Cannot be NULL (must have a value)</li>
              <li>Each table should have exactly ONE primary key</li>
              <li>Often an auto-incrementing number (IDENTITY column)</li>
            </ul>

            <SubSectionTitle>Common Data Types</SubSectionTitle>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-2">Numbers</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li><code>INT</code> - Whole numbers (-2B to 2B)</li>
                  <li><code>BIGINT</code> - Very large numbers</li>
                  <li><code>DECIMAL(10,2)</code> - Money (10 digits, 2 after decimal)</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-2">Text</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li><code>VARCHAR(50)</code> - Variable text up to 50 chars</li>
                  <li><code>NVARCHAR(100)</code> - Unicode text (supports all languages)</li>
                  <li><code>TEXT</code> - Very long text</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-2">Dates & Times</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li><code>DATE</code> - Just the date (2024-01-15)</li>
                  <li><code>DATETIME</code> - Date and time</li>
                  <li><code>TIME</code> - Just the time</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-2">Others</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li><code>BIT</code> - True/False (1/0)</li>
                  <li><code>UNIQUEIDENTIFIER</code> - GUID</li>
                </ul>
              </div>
            </div>

            <SubSectionTitle>Basic Operations (CRUD)</SubSectionTitle>
            <p className="text-slate-700 leading-relaxed mb-2">
              Once you have a table, you perform these basic operations:
            </p>
            <CodeBlock>{`-- CREATE (Insert new data)
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email)
VALUES (1, 'John', 'Doe', 'john@example.com');

-- READ (Query data)
SELECT * FROM Employees WHERE LastName = 'Doe';

-- UPDATE (Modify existing data)
UPDATE Employees SET Salary = 60000 WHERE EmployeeID = 1;

-- DELETE (Remove data)
DELETE FROM Employees WHERE EmployeeID = 1;`}</CodeBlock>
          </div>

          <SectionTitle>1. Naming Conventions</SectionTitle>
          <p className="text-slate-700 leading-relaxed">
            Consistency is key in enterprise environments.
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-2 mt-2">
            <li><strong>Tables:</strong> Use PascalCase and plural nouns (e.g., <code>Employees</code>, <code>SalesOrders</code>).</li>
            <li><strong>Columns:</strong> Use PascalCase (e.g., <code>FirstName</code>, <code>OrderDate</code>). Avoid spaces.</li>
            <li><strong>Keys:</strong> Prefix with PK/FK (e.g., <code>PK_Employees</code>, <code>FK_Orders_Customers</code>).</li>
            <li><strong>Indexes:</strong> Prefix with IX (e.g., <code>IX_Employees_LastName</code>).</li>
          </ul>

          <SectionTitle>2. Data Types Optimization</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <SubSectionTitle>Integer Types</SubSectionTitle>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><code>TINYINT</code>: 0 to 255 (1 byte) - Use for status codes.</li>
                <li><code>SMALLINT</code>: -32k to 32k (2 bytes).</li>
                <li><code>INT</code>: -2B to 2B (4 bytes) - Standard for IDs.</li>
                <li><code>BIGINT</code>: -9Q to 9Q (8 bytes) - Use only when necessary.</li>
              </ul>
            </div>
            <div>
              <SubSectionTitle>String Types</SubSectionTitle>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><code>VARCHAR(n)</code>: Variable ASCII data. Saves space over CHAR.</li>
                <li><code>NVARCHAR(n)</code>: Unicode data (2 bytes/char). Essential for global apps.</li>
                <li>Avoid <code>NVARCHAR(MAX)</code> unless storing large text blocks (prevents indexing).</li>
              </ul>
            </div>
          </div>

          <SectionTitle>3. Advanced Optimization Strategies</SectionTitle>

          <SubSectionTitle>Partitioning</SubSectionTitle>
          <p className="text-slate-700 leading-relaxed">
            Splits large tables into smaller, manageable parts based on a column (e.g., <code>OrderDate</code>).
            Improves query performance on large datasets by "partition elimination".
          </p>
          <CodeBlock>{`CREATE PARTITION FUNCTION myRangePF1 (datetime)
AS RANGE RIGHT FOR VALUES ('2023-01-01', '2024-01-01');`}</CodeBlock>

          <SubSectionTitle>Data Compression</SubSectionTitle>
          <p className="text-slate-700 leading-relaxed">
            Reduces storage and I/O by compressing data pages.
            <code>ROW</code> compression removes empty space from fixed-length types.
            <code>PAGE</code> compression uses dictionary-based compression (higher CPU, lower I/O).
          </p>
          <CodeBlock>{`ALTER TABLE SalesOrders REBUILD PARTITION = ALL
WITH (DATA_COMPRESSION = PAGE);`}</CodeBlock>

          <SectionTitle>4. Constraints & Integrity</SectionTitle>
          <CodeBlock>{`CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Salary DECIMAL(10, 2) CHECK (Salary > 0),
    DepartmentID INT NULL,
    
    CONSTRAINT PK_Employees PRIMARY KEY CLUSTERED (EmployeeID),
    CONSTRAINT UQ_Employees_Email UNIQUE (Email),
    CONSTRAINT FK_Employees_Departments FOREIGN KEY (DepartmentID)
        REFERENCES Departments(DepartmentID)
);`}</CodeBlock>
        </div>
      )}

      {/* Terms Tab */}
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
        <TablePlaygroundDynamic />
      )}

      {/* ALTER TABLE Tab */}
      {activeTab === 'alter' && (
        <AlterTableGenerator />
      )}
    </div>
  );
};

export default TablesGuide;
