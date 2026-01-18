import React, { useState } from 'react';
import SEO from '../components/SEO';
import SubNav from '../components/SubNav';

const AlterTableGenerator = () => {
    const [mode, setMode] = useState('single'); // 'single' or 'bulk'
    const [operationType, setOperationType] = useState('smart'); // 'smart', 'add', 'update'
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
        scriptParts.push(`-- Operation: ${operationType.toUpperCase()}`);
        scriptParts.push(`-- Generated: ${new Date().toLocaleString()}`);
        scriptParts.push(`-- Total Columns: ${columnLines.length}`);
        scriptParts.push(`-- ============================================`);
        scriptParts.push(``);

        // Process each column
        columnLines.forEach((columnDef, index) => {
            const parts = columnDef.trim().split(/\s+/);
            const columnName = parts[0];
            const fullType = parts.slice(1).join(' ');

            // Extract Type for ALTER COLUMN (removing DEFAULT clause if present)
            const defaultRegex = /\s+DEFAULT\s+[\w\W]+$/i;
            const hasDefault = defaultRegex.test(fullType);
            let typeForAlter = fullType;

            if (hasDefault) {
                const match = fullType.match(defaultRegex);
                if (match) {
                    typeForAlter = fullType.substring(0, match.index).trim();
                }
            }

            scriptParts.push(`-- Column ${index + 1}: ${columnName}`);

            if (operationType === 'smart') {
                scriptParts.push(`IF NOT EXISTS (`);
                scriptParts.push(`    SELECT 1 FROM sys.columns `);
                scriptParts.push(`    WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') `);
                scriptParts.push(`    AND name = '${columnName}'`);
                scriptParts.push(`)`);
                scriptParts.push(`BEGIN`);
                scriptParts.push(`    -- Column does not exist, ADD it`);
                scriptParts.push(`    ALTER TABLE [dbo].[${table}]`);
                scriptParts.push(`    ADD [${columnName}] ${fullType};`);
                scriptParts.push(`    PRINT 'Column ${columnName} added to ${table} successfully';`);
                scriptParts.push(`END`);
                scriptParts.push(`ELSE`);
                scriptParts.push(`BEGIN`);
                scriptParts.push(`    -- Column exists, UPDATE definition`);
                scriptParts.push(`    ALTER TABLE [dbo].[${table}]`);
                scriptParts.push(`    ALTER COLUMN [${columnName}] ${typeForAlter};`);
                scriptParts.push(`    PRINT 'Column ${columnName} updated in ${table} successfully';`);
                scriptParts.push(`END`);
            } else if (operationType === 'add') {
                scriptParts.push(`IF NOT EXISTS (`);
                scriptParts.push(`    SELECT 1 FROM sys.columns `);
                scriptParts.push(`    WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') `);
                scriptParts.push(`    AND name = '${columnName}'`);
                scriptParts.push(`)`);
                scriptParts.push(`BEGIN`);
                scriptParts.push(`    ALTER TABLE [dbo].[${table}]`);
                scriptParts.push(`    ADD [${columnName}] ${fullType};`);
                scriptParts.push(`    PRINT 'Column ${columnName} added to ${table} successfully';`);
                scriptParts.push(`END`);
                scriptParts.push(`ELSE`);
                scriptParts.push(`BEGIN`);
                scriptParts.push(`    PRINT 'Column ${columnName} already exists in ${table} - skipped ADD';`);
                scriptParts.push(`END`);
            } else if (operationType === 'update') {
                scriptParts.push(`IF EXISTS (`);
                scriptParts.push(`    SELECT 1 FROM sys.columns `);
                scriptParts.push(`    WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') `);
                scriptParts.push(`    AND name = '${columnName}'`);
                scriptParts.push(`)`);
                scriptParts.push(`BEGIN`);
                scriptParts.push(`    ALTER TABLE [dbo].[${table}]`);
                scriptParts.push(`    ALTER COLUMN [${columnName}] ${typeForAlter};`);
                scriptParts.push(`    PRINT 'Column ${columnName} udpated in ${table} successfully';`);
                scriptParts.push(`END`);
                scriptParts.push(`ELSE`);
                scriptParts.push(`BEGIN`);
                scriptParts.push(`    PRINT 'Column ${columnName} does not exist in ${table} - skipped UPDATE';`);
                scriptParts.push(`END`);
            }

            scriptParts.push(`GO`);
            scriptParts.push(``);
        });



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
            if (line.startsWith('[') && line.endsWith(']')) {
                if (currentTable && currentColumns.length > 0) {
                    scriptParts.push(generateScriptForTable(currentTable, currentColumns));
                    scriptParts.push('');
                }
                currentTable = line.slice(1, -1);
                currentColumns = [];
            } else if (line.endsWith(':')) {
                if (currentTable && currentColumns.length > 0) {
                    scriptParts.push(generateScriptForTable(currentTable, currentColumns));
                    scriptParts.push('');
                }
                currentTable = line.slice(0, -1);
                currentColumns = [];
            } else {
                if (currentTable && line) {
                    currentColumns.push(line);
                }
            }
        });

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
        <>
            <SEO
                title="Alter Table Generator"
                description="Generate SQL Server ALTER TABLE scripts safely. Add columns with default constraint checks."
            />
            <SubNav />
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-white">
                    ALTER TABLE Script Generator
                </h1>

                <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-md mb-8">
                    <p className="text-sm text-indigo-300">
                        <span className="font-semibold text-indigo-200">Safe Script Generation:</span> Generate ALTER TABLE scripts that automatically check for existence.
                        Choose to Add new columns safely, Update existing ones, or use Smart Mode to handle both cases.
                    </p>
                    <p className="text-xs text-indigo-400 mt-2">
                        💡 <strong>Format:</strong> <code className="bg-indigo-900/40 px-1 rounded text-indigo-200">ColumnName DataType [NULL/NOT NULL] [DEFAULT value]</code>
                    </p>
                </div>

                {/* Operation Selector */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => setOperationType('smart')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${operationType === 'smart'
                            ? 'border-indigo-500 bg-indigo-900/20 shadow-sm shadow-indigo-900/20'
                            : 'border-slate-700 hover:border-indigo-500/50 bg-slate-800/50'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">🧠</span>
                            <h3 className={`font-bold ${operationType === 'smart' ? 'text-indigo-400' : 'text-slate-300'}`}>Smart Upsert</h3>
                        </div>
                        <p className="text-xs text-slate-400">
                            Checks existence: <br />
                            <strong>Missing?</strong> → ADD<br />
                            <strong>Exists?</strong> → UPDATE (Alter)
                        </p>
                    </button>

                    <button
                        onClick={() => setOperationType('add')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${operationType === 'add'
                            ? 'border-green-500 bg-green-900/20 shadow-sm shadow-green-900/20'
                            : 'border-slate-700 hover:border-green-500/50 bg-slate-800/50'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">➕</span>
                            <h3 className={`font-bold ${operationType === 'add' ? 'text-green-400' : 'text-slate-300'}`}>Add Columns</h3>
                        </div>
                        <p className="text-xs text-slate-400">
                            Safely adds new columns only.<br />
                            <strong>Exists?</strong> → Skips with message<br />
                            <strong>Missing?</strong> → ADD
                        </p>
                    </button>

                    <button
                        onClick={() => setOperationType('update')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${operationType === 'update'
                            ? 'border-blue-500 bg-blue-900/20 shadow-sm shadow-blue-900/20'
                            : 'border-slate-700 hover:border-blue-500/50 bg-slate-800/50'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">✏️</span>
                            <h3 className={`font-bold ${operationType === 'update' ? 'text-blue-400' : 'text-slate-300'}`}>Update Columns</h3>
                        </div>
                        <p className="text-xs text-slate-400">
                            Modifies existing columns only.<br />
                            <strong>Exists?</strong> → ALTER COLUMN<br />
                            <strong>Missing?</strong> → Skips with message
                        </p>
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-1 mb-8 border-b border-slate-700">
                    <button
                        onClick={() => setMode('single')}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'single'
                            ? 'text-blue-400 border-blue-500'
                            : 'text-slate-400 border-transparent hover:text-slate-200'
                            }`}
                    >
                        Single Table
                    </button>
                    <button
                        onClick={() => setMode('bulk')}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'bulk'
                            ? 'text-blue-400 border-blue-500'
                            : 'text-slate-400 border-transparent hover:text-slate-200'
                            }`}
                    >
                        Bulk Tables
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {mode === 'single' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Table Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        type="text"
                                        placeholder="e.g., Customers"
                                        value={tableName}
                                        onChange={(e) => setTableName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Column Definitions <span className="text-slate-500 font-normal">(One per line)</span> <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm h-96"
                                        placeholder={`Email NVARCHAR(255) NULL\nPhoneNumber VARCHAR(20) NULL\nCreatedDate DATETIME NOT NULL\nIsActive BIT NOT NULL DEFAULT 1`}
                                        value={columns}
                                        onChange={(e) => setColumns(e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Bulk Table Definitions <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm h-[500px]"
                                    placeholder={`[Customers]\nEmail NVARCHAR(255) NULL\n\n[Orders]\nOrderStatus VARCHAR(50) NULL\n\n[Products]\nSKU VARCHAR(50) NOT NULL`}
                                    value={bulkInput}
                                    onChange={(e) => setBulkInput(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                className="btn-primary w-full md:w-auto"
                                onClick={handleGenerate}
                                disabled={mode === 'single' ? (!tableName.trim() || !columns.trim()) : !bulkInput.trim()}
                            >
                                Generate {operationType === 'smart' ? 'Smart' : operationType === 'add' ? 'Add' : 'Update'} Script
                            </button>
                            {generatedScript && (
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 text-red-600 hover:text-red-800 border border-slate-200 rounded-md hover:bg-red-50 transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="relative">
                        {generatedScript ? (
                            <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                        Generated SQL
                                    </h3>
                                    <button
                                        className={`text-xs px-3 py-2 rounded border transition-colors ${copied
                                            ? 'bg-green-900/20 text-green-400 border-green-800'
                                            : 'bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700'
                                            }`}
                                        onClick={copyToClipboard}
                                    >
                                        {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                                    </button>
                                </div>
                                <div className="flex-1 bg-slate-800/80 rounded-lg p-4 shadow-inner overflow-hidden flex flex-col border border-slate-700">
                                    <textarea
                                        className="w-full h-full bg-transparent text-blue-300 font-mono text-sm focus:outline-none resize-none"
                                        value={generatedScript}
                                        readOnly
                                    />
                                </div>
                                <div className="text-xs text-slate-500 mt-2 text-right">
                                    {countTables()} tables • {countColumns()} columns generated
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-600 p-8 min-h-[400px]">
                                <span className="text-4xl mb-4 grayscale opacity-50">📜</span>
                                <p>Generated script will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlterTableGenerator;
