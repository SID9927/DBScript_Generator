import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import { IconRefresh } from '../../components/Icons';
import { InfoHeader, OperationCard, StatBox } from './Components';

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
        scriptParts.push(`-- Status: TRANSACTIONAL BUFFER`);
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
            scriptParts.push(`    PRINT 'SUCCESS: Table ${table} created';`);
            scriptParts.push(`END`);
            scriptParts.push(`ELSE PRINT 'SKIP: Table ${table} already exists';`);
            scriptParts.push(`GO`);
        } else {
            columnLines.forEach((columnDef, index) => {
                const parts = columnDef.trim().split(/\s+/);
                if (parts.length < 2) return;
                const columnName = parts[0];
                const fullType = parts.slice(1).join(' ');
                const defaultRegex = /\s+DEFAULT\s+[\w\W]+$/i;
                const hasDefault = defaultRegex.test(fullType);
                let typeForAlter = fullType;

                if (hasDefault) {
                    const match = fullType.match(defaultRegex);
                    if (match) typeForAlter = fullType.substring(0, match.index).trim();
                }

                if (operationType === 'smart') {
                    scriptParts.push(`IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') AND name = '${columnName}')`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ADD [${columnName}] ${fullType};`);
                    scriptParts.push(`ELSE`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ALTER COLUMN [${columnName}] ${typeForAlter};`);
                } else if (operationType === 'add') {
                    scriptParts.push(`IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') AND name = '${columnName}')`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ADD [${columnName}] ${fullType};`);
                } else if (operationType === 'update') {
                    scriptParts.push(`IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[${table}]') AND name = '${columnName}')`);
                    scriptParts.push(`    ALTER TABLE [dbo].[${table}] ALTER COLUMN [${columnName}] ${typeForAlter};`);
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
            if (currentTable && currentColumns.length > 0) scriptParts.push(generateScriptForTable(currentTable, currentColumns));
            script = scriptParts.join('\n\n');
        }
        setGeneratedScript(script);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-[1500px] mx-auto p-6 lg:p-10 space-y-10 min-h-screen">
            <SEO title="Table Architect | Developer Suite" description="Generate transformation-safe ALTER and CREATE TABLE payloads." />

            <InfoHeader 
                title="Table Architect"
                subtitle="High-fidelity schema transformation hub."
                protocol="Supporting intelligent upsert logic (Add/Alter) and absolute definition creation. Uses IF NOT EXISTS safety gates for transactional stability across production environments."
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Control Panel */}
                <div className="xl:col-span-5 space-y-8 xl:sticky xl:top-24">
                    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                        
                        {/* Tab Switcher */}
                        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-10 w-fit mx-auto relative z-10">
                            {['alter', 'create'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => { setMainTab(t); setGeneratedScript(''); }}
                                    className={`px-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${mainTab === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {t === 'alter' ? 'Mutation [ALTER]' : 'Definition [CREATE]'}
                                    {mainTab === t && <motion.div layoutId="t" className="absolute inset-0 bg-violet-600 rounded-xl -z-10 shadow-lg shadow-violet-900/40" />}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {mainTab === 'alter' && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-8 grid grid-cols-3 gap-4">
                                    <OperationCard id="smart" title="Smart Upsert" desc="Logic: Add | Alter" color="indigo" active={operationType === 'smart'} onClick={() => setOperationType('smart')} />
                                    <OperationCard id="add" title="Pure Add" desc="Logic: Add Only" color="emerald" active={operationType === 'add'} onClick={() => setOperationType('add')} />
                                    <OperationCard id="update" title="Pure Alter" desc="Logic: Alter Only" color="amber" active={operationType === 'update'} onClick={() => setOperationType('update')} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6 text-left">
                            <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                                {['single', 'bulk'].map(m => (
                                    <button key={m} onClick={() => setMode(m)} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'text-white bg-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-400'}`}>
                                        {m === 'single' ? 'Single Table' : 'Bulk Tables'}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {mode === 'single' ? (
                                    <motion.div key="s" className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Registry Node</label>
                                            <input className="w-full bg-black/40 border border-slate-800 rounded-xl px-5 py-4 text-violet-400 font-bold text-sm focus:border-violet-500/30 transition-all font-mono" placeholder="Schema.Table_Entity" value={tableName} onChange={e => setTableName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Column Definitions</label>
                                            <textarea className="w-full h-80 bg-black/40 border border-slate-800 rounded-2xl px-5 py-5 text-violet-300/80 font-mono text-[11px] resize-none focus:border-violet-500/30 transition-all custom-scrollbar leading-relaxed" 
                                                placeholder="[ColumnName] [DataType] [Constraints]&#10;Example:&#10;ID INT PRIMARY KEY&#10;UserName VARCHAR(100) NOT NULL&#10;CreatedAt DATETIME DEFAULT GETDATE()" 
                                                value={columns} onChange={e => setColumns(e.target.value)} />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="b" className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Bulk Tables Cluster</label>
                                        <textarea className="w-full h-[530px] bg-black/40 border border-slate-800 rounded-[2.5rem] px-6 py-6 text-violet-300/80 font-mono text-[11px] resize-none focus:border-violet-500/30 transition-all custom-scrollbar leading-relaxed" 
                                            placeholder="[Table_A]&#10;ID INT PRIMARY KEY&#10;Value NVARCHAR(MAX)&#10;&#10;[Table_B]&#10;Code INT&#10;Active BIT DEFAULT 1" 
                                            value={bulkInput} onChange={e => setBulkInput(e.target.value)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pt-6 flex gap-4">
                                <button onClick={handleGenerate} className="flex-1 py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-violet-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 group">
                                    <svg className="w-4 h-4 transition-transform group-hover:scale-125 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor font-black"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Compile Schema Payload
                                </button>
                                <button onClick={() => { setTableName(''); setColumns(''); setBulkInput(''); setGeneratedScript(''); }} className="w-16 bg-slate-900 hover:bg-slate-800 text-red-500 rounded-[1.5rem] border border-slate-800 flex items-center justify-center transition-all group">
                                    <IconRefresh className="w-5 h-5 transition-transform group-hover:rotate-[-180deg]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="xl:col-span-7 space-y-8">
                    <AnimatePresence mode="wait">
                        {generatedScript ? (
                            <motion.div key="o" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                                <div className="grid grid-cols-3 gap-6">
                                    <StatBox label="Protocol" value={mainTab === 'alter' ? 'MUTATION' : 'DEFINITION'} />
                                    <StatBox label="Registry Nodes" value={mode === 'single' ? 1 : generatedScript.split('-- ============================================').length - 1} />
                                    <StatBox label="Complexity" value={`${generatedScript.split('\n').filter(l => l.trim()).length} Ops`} />
                                </div>

                                <div className="space-y-4">
                                     <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)] animate-pulse" />
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Compiled SQL Payload</h3>
                                        </div>
                                        <button onClick={copyToClipboard} className={`px-6 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white hover:border-slate-700'}`}>
                                            {copied ? 'Captured' : 'Copy Registry'}
                                        </button>
                                    </div>
                                    <div className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                                        </div>
                                        <textarea readOnly className="w-full h-[650px] p-10 bg-transparent text-violet-400/90 font-mono text-[13px] focus:outline-none resize-none leading-relaxed custom-scrollbar selection:bg-violet-500/30" value={generatedScript} />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[750px] flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800/40 rounded-[4rem] text-center space-y-10 bg-slate-900/5 group hover:border-violet-500/20 transition-all">
                                <div className="w-28 h-28 bg-slate-900/80 rounded-[2.5rem] flex items-center justify-center text-slate-700 border-2 border-slate-800 relative transition-all group-hover:border-violet-500/40 shadow-2xl">
                                    {/* Radar Waves - Expanding Outwards */}
                                    <div className="absolute inset-0 border-2 border-violet-500/30 rounded-[2.5rem] animate-radar" />
                                    <div className="absolute inset-0 border-2 border-violet-500/20 rounded-[2.5rem] animate-radar [animation-delay:1s]" />
                                    <div className="absolute inset-0 border-2 border-violet-500/10 rounded-[2.5rem] animate-radar [animation-delay:2s]" />

                                    <motion.div 
                                        animate={{ y: [0, -12, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10"
                                    >
                                        <svg className="w-14 h-14 text-violet-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor font-thin">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </motion.div>
                                </div>
                                <div className="space-y-4">
                                     <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic underline decoration-slate-800/30 underline-offset-8">Terminal Idle</h3>
                                     <p className="text-xs text-slate-600 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed italic">
                                        Awaiting table schema mutation. Define your entities to generate transaction-safe transformation payloads for high-load production clusters.
                                     </p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AlterTableGenerator;
