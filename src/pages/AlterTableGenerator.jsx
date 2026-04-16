import React, { useState } from 'react';
import SEO from '../components/SEO';
import SubNav from '../components/SubNav';
import { motion, AnimatePresence } from 'framer-motion';

const AlterTableGenerator = () => {
    const [mainTab, setMainTab] = useState('alter'); // 'alter' or 'create'
    const [mode, setMode] = useState('single'); // 'single' or 'bulk'
    const [operationType, setOperationType] = useState('smart'); // 'smart', 'add', 'update'
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState('');
    const [bulkInput, setBulkInput] = useState('');
    const [generatedScript, setGeneratedScript] = useState('');
    const [copied, setCopied] = useState(false);

    const generateScriptForTable = (table, columnLines) => {
        let scriptParts = [];
        scriptParts.push(`-- ============================================`);
        scriptParts.push(`-- ${mainTab === 'alter' ? 'ALTER' : 'CREATE'} TABLE: ${table}`); 
        scriptParts.push(`-- Generated: ${new Date().toLocaleString()}`);
        scriptParts.push(`-- Total Columns: ${columnLines.length}`);
        scriptParts.push(`-- ============================================`);
        scriptParts.push(``);

        if (mainTab === 'create') {
            scriptParts.push(`IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID(N'[dbo].[${table}]'))`);
            scriptParts.push(`BEGIN`);
            scriptParts.push(`    CREATE TABLE [dbo].[${table}] (`);
            columnLines.forEach((col, idx) => {
                const isLast = idx === columnLines.length - 1;
                scriptParts.push(`        [${col.trim().split(' ')[0]}] ${col.trim().split(' ').slice(1).join(' ')}${isLast ? '' : ','}`);
            });
            scriptParts.push(`    );`);
            scriptParts.push(`    PRINT 'Table ${table} created successfully';`);
            scriptParts.push(`END`);
            scriptParts.push(`ELSE`);
            scriptParts.push(`BEGIN`);
            scriptParts.push(`    PRINT 'Table ${table} already exists - skipped CREATE';`);
            scriptParts.push(`END`);
            scriptParts.push(`GO`);
        } else {
            columnLines.forEach((columnDef, index) => {
                const parts = columnDef.trim().split(/\s+/);
                const columnName = parts[0];
                const fullType = parts.slice(1).join(' ');
                const defaultRegex = /\s+DEFAULT\s+[\w\W]+$/i;
                const hasDefault = defaultRegex.test(fullType);
                let typeForAlter = fullType;

                if (hasDefault) {
                    const match = fullType.match(defaultRegex);
                    if (match) typeForAlter = fullType.substring(0, match.index).trim();
                }

                scriptParts.push(`-- Column ${index + 1}: ${columnName}`);
                if (operationType === 'smart') {
                    scriptParts.push(`IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') AND name = '${columnName}')`);
                    scriptParts.push(`BEGIN`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ADD [${columnName}] ${fullType};`);
                    scriptParts.push(`END ELSE BEGIN`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ALTER COLUMN [${columnName}] ${typeForAlter};`);
                    scriptParts.push(`END`);
                } else if (operationType === 'add') {
                    scriptParts.push(`IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') AND name = '${columnName}')`);
                    scriptParts.push(`BEGIN`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ADD [${columnName}] ${fullType};`);
                    scriptParts.push(`END`);
                } else if (operationType === 'update') {
                    scriptParts.push(`IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') AND name = '${columnName}')`);
                    scriptParts.push(`BEGIN`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ALTER COLUMN [${columnName}] ${typeForAlter};`);
                    scriptParts.push(`END`);
                }
                scriptParts.push(`GO`);
            });
        }
        return scriptParts.join('\n');
    };

    const handleGenerate = () => {
        let script = '';
        if (mode === 'single') {
            if (!tableName.trim() || !columns.trim()) return;
            const columnLines = columns.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            script = generateScriptForTable(tableName, columnLines);
        } else {
            if (!bulkInput.trim()) return;
            const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            let scriptParts = [];
            let currentTable = null;
            let currentColumns = [];
            lines.forEach(line => {
                if ((line.startsWith('[') && line.endsWith(']')) || line.endsWith(':')) {
                    if (currentTable && currentColumns.length > 0) {
                        scriptParts.push(generateScriptForTable(currentTable, currentColumns));
                    }
                    currentTable = line.replace(/[\[\]:]/g, '');
                    currentColumns = [];
                } else {
                    if (currentTable) currentColumns.push(line);
                }
            });
            if (currentTable && currentColumns.length > 0) {
                scriptParts.push(generateScriptForTable(currentTable, currentColumns));
            }
            script = scriptParts.join('\n\n');
        }
        setGeneratedScript(script);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setTableName('');
        setColumns('');
        setBulkInput('');
        setGeneratedScript('');
    };

    return (
        <>
            <SEO title={`${mainTab === 'alter' ? 'Alter' : 'Create'} Table Generator`} description="Generate SQL Server table scripts safely." />
            <SubNav />
            <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-900 text-slate-200">
                {/* ... (rest of the header remains) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase">
                            Table <span className="text-blue-500">Utilities</span>
                        </h1>
                        <p className="text-slate-400 mt-1">Efficiently manage table structures and schemas.</p>
                    </div>
                    <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 h-fit">
                        <button 
                            onClick={() => { setMainTab('alter'); setGeneratedScript(''); }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mainTab === 'alter' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white'}`}
                        >
                            Alter Table
                        </button>
                        <button 
                            onClick={() => { setMainTab('create'); setGeneratedScript(''); }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mainTab === 'create' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white'}`}
                        >
                            Create Table
                        </button>
                    </div>
                </div>

                {mainTab === 'alter' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { id: 'smart', title: 'Smart Upsert', emoji: '🧠', color: 'indigo', desc: 'ADD if missing, ALTER if exists.' },
                            { id: 'add', title: 'Add Only', emoji: '➕', color: 'green', desc: 'Only adds missing columns.' },
                            { id: 'update', title: 'Update Only', emoji: '✏️', color: 'blue', desc: 'Only alters existing columns.' }
                        ].map(op => (
                            <button
                                key={op.id}
                                onClick={() => setOperationType(op.id)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${operationType === op.id ? `border-${op.color}-500 bg-${op.color}-900/20` : 'border-slate-800 bg-slate-800/50 grayscale hover:grayscale-0'}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{op.emoji}</span>
                                    <h3 className={`font-bold ${operationType === op.id ? `text-${op.color}-400` : 'text-slate-300'}`}>{op.title}</h3>
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase font-black leading-tight tracking-widest">{op.desc}</p>
                            </button>
                        ))}
                    </motion.div>
                )}

                <div className="flex gap-1 mb-8 border-b border-slate-700">
                    <button onClick={() => setMode('single')} className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${mode === 'single' ? 'text-blue-400 border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Single Table</button>
                    <button onClick={() => setMode('bulk')} className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${mode === 'bulk' ? 'text-blue-400 border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>Bulk Entry</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                        {mode === 'single' ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Table Name</label>
                                    <input className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" placeholder="e.g. Customers" value={tableName} onChange={(e) => setTableName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Column Definitions (e.g. Email VARCHAR(255) NULL)</label>
                                    <textarea 
                                        className="w-full h-80 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs shadow-inner" 
                                        placeholder={`Email VARCHAR(255) NULL
CreatedAt DATETIME NOT NULL
Status BIT DEFAULT 1`} 
                                        value={columns} 
                                        onChange={(e) => setColumns(e.target.value)} 
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bulk Entry (use [TableName] or TableName:)</label>
                                <textarea 
                                    className="w-full h-[500px] bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs shadow-inner" 
                                    placeholder={`[Customers]
Email VARCHAR(255)

[Orders]
Total DECIMAL(18,2)`} 
                                    value={bulkInput} 
                                    onChange={(e) => setBulkInput(e.target.value)} 
                                />
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={handleGenerate} className="flex-grow py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95">Generate SQL Script</button>
                            <button onClick={handleReset} className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 text-xs">Reset</button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Generated Output</label>
                            {generatedScript && (
                                <button onClick={copyToClipboard} className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                                </button>
                            )}
                        </div>
                        <div className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative min-h-[500px]">
                            {generatedScript ? (
                                <textarea readOnly className="w-full h-full bg-transparent text-blue-400 font-mono text-xs focus:outline-none resize-none leading-relaxed" value={generatedScript} />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                                    <div className="w-16 h-16 border-4 border-dashed border-slate-600 rounded-full animate-spin mb-4" />
                                    <p className="font-mono text-xs uppercase tracking-widest">Awaiting Generation...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlterTableGenerator;
