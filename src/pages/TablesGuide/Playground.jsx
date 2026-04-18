import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock, CustomSelect } from './Components';

const TablePlayground = () => {
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

    // Operations state
    const [insertValues, setInsertValues] = useState({});
    const [updateValues, setUpdateValues] = useState({});
    const [updateCondition, setUpdateCondition] = useState("");
    const [deleteCondition, setDeleteCondition] = useState("");
    const [selectColumns, setSelectColumns] = useState("*");
    const [selectCondition, setSelectCondition] = useState("");

    const dataTypes = [
        { label: "INT", value: "INT" },
        { label: "BIGINT", value: "BIGINT" },
        { label: "NVARCHAR(50)", value: "NVARCHAR(50)" },
        { label: "NVARCHAR(MAX)", value: "NVARCHAR(MAX)" },
        { label: "DATETIME2", value: "DATETIME2" },
        { label: "DECIMAL(10,2)", value: "DECIMAL(10,2)" },
        { label: "BIT", value: "BIT" }
    ];

    const activeTable = tables[activeTableIndex];

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

    const updateColumn = (colIndex, field, value) => {
        const newTables = [...tables];
        newTables[activeTableIndex].columns[colIndex][field] = value;
        setTables(newTables);
    };

    const addColumn = () => {
        const newTables = [...tables];
        newTables[activeTableIndex].columns.push({ name: "NewCol", type: "INT", nullable: true, primaryKey: false });
        setTables(newTables);
    };

    const removeColumn = (colIndex) => {
        const newTables = [...tables];
        newTables[activeTableIndex].columns.splice(colIndex, 1);
        setTables(newTables);
    };

    const inputClasses = "w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-indigo-300 font-bold text-[11px] tracking-tight focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800";
    const labelClasses = "text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 px-1 block italic";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
             
             <div className="relative z-10 space-y-10">
                 {/* Workspace Header */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-900/40 transform rotate-12">🏗</div>
                             <div className="text-left">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-1">Architect Console</h3>
                                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Table <span className="text-indigo-400">Environment</span></h2>
                             </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm text-left">Industrial workspace for defining schema structures and testing transactional T-SQL operations.</p>
                     </div>
                     
                     <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 font-mono">Environment</div>
                            <div className="text-xs font-black text-indigo-400 uppercase italic">Live Workspace</div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-full" />
                            <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin" />
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        </div>
                     </div>
                 </div>

                 {/* Table Selection / Management */}
                 <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-800/50">
                     {tables.map((table, i) => (
                         <button
                            key={i}
                            onClick={() => setActiveTableIndex(i)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTableIndex === i ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'}`}
                         >
                             {table.tableName}
                         </button>
                     ))}
                     <button 
                        onClick={() => {
                            const newTable = { tableName: "NewEntity", columns: [{ name: "ID", type: "INT", nullable: false, primaryKey: true }] };
                            setTables([...tables, newTable]);
                            setActiveTableIndex(tables.length);
                        }}
                        className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                    >
                         + Add Entity
                     </button>
                 </div>

                 {/* Operation Tabs */}
                 <div className="flex gap-4">
                     {["CREATE", "INSERT", "UPDATE", "SELECT"].map(tab => (
                         <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2 ${activeTab === tab ? 'text-indigo-400 border-indigo-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                         >
                            {tab}
                         </button>
                     ))}
                 </div>

                 {/* Tab Content */}
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8 min-h-[400px]"
                    >
                        {activeTab === 'CREATE' && (
                            <div className="space-y-8">
                                <div className="max-w-xs">
                                    <label className={labelClasses}>Entity Identity (Name)</label>
                                    <input 
                                        type="text" 
                                        value={activeTable.tableName} 
                                        onChange={(e) => {
                                            const newTables = [...tables];
                                            newTables[activeTableIndex].tableName = e.target.value;
                                            setTables(newTables);
                                        }}
                                        className={inputClasses} 
                                    />
                                </div>
                                <div className="space-y-4">
                                     <div className="flex items-center justify-between px-1">
                                         <h4 className={labelClasses}>Structural Blueprint (Columns)</h4>
                                         <button onClick={addColumn} className="text-[8px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">+ New Field</button>
                                     </div>
                                     <div className="grid grid-cols-1 gap-3">
                                         {activeTable.columns.map((col, idx) => (
                                             <div key={idx} className="flex gap-4 items-end bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50 group">
                                                 <div className="flex-grow">
                                                     <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Field Name</label>
                                                     <input 
                                                        type="text" 
                                                        value={col.name} 
                                                        onChange={(e) => updateColumn(idx, 'name', e.target.value)}
                                                        className="bg-transparent text-white font-bold text-xs tracking-tight focus:outline-none w-full border-b border-slate-800 focus:border-indigo-500/50 pb-1"
                                                     />
                                                 </div>
                                                 <div className="w-32">
                                                     <CustomSelect
                                                        value={col.type}
                                                        options={dataTypes}
                                                        onChange={(val) => updateColumn(idx, 'type', val)}
                                                        compact
                                                     />
                                                 </div>
                                                 <div className="flex gap-4 pb-1 group-hover:opacity-100 opacity-60 transition-opacity">
                                                     <label className="flex items-center gap-2 cursor-pointer">
                                                         <input type="checkbox" checked={col.nullable} onChange={(e) => updateColumn(idx, 'nullable', e.target.checked)} className="form-checkbox bg-slate-800 border-slate-700 rounded text-indigo-600 focus:ring-0 w-3 h-3" />
                                                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Null</span>
                                                     </label>
                                                     <label className="flex items-center gap-2 cursor-pointer">
                                                         <input type="checkbox" checked={col.primaryKey} onChange={(e) => updateColumn(idx, 'primaryKey', e.target.checked)} className="form-checkbox bg-slate-800 border-slate-700 rounded text-indigo-600 focus:ring-0 w-3 h-3" />
                                                         <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-widest">PK</span>
                                                     </label>
                                                     <button onClick={() => removeColumn(idx)} className="text-red-500/40 hover:text-red-500 transition-colors ml-2">
                                                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                     </button>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                                <CodeBlock>{generateCreateSQL()}</CodeBlock>
                            </div>
                        )}

                        {activeTab === 'INSERT' && (
                             <div className="space-y-8">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {activeTable.columns.map(col => (
                                         <div key={col.name}>
                                             <label className={labelClasses}>{col.name}</label>
                                             <input 
                                                type="text" 
                                                value={insertValues[col.name] || ""} 
                                                onChange={(e) => setInsertValues({ ...insertValues, [col.name]: e.target.value })}
                                                className={inputClasses} 
                                                placeholder={`Value for ${col.type}`}
                                             />
                                         </div>
                                     ))}
                                 </div>
                                 <CodeBlock>{generateInsertSQL()}</CodeBlock>
                             </div>
                        )}

                        {activeTab === 'UPDATE' && (
                             <div className="space-y-8">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {activeTable.columns.map(col => (
                                         <div key={col.name}>
                                             <label className={labelClasses}>Set {col.name}</label>
                                             <input 
                                                type="text" 
                                                value={updateValues[col.name] || ""} 
                                                onChange={(e) => setUpdateValues({ ...updateValues, [col.name]: e.target.value })}
                                                className={inputClasses} 
                                             />
                                         </div>
                                     ))}
                                 </div>
                                 <div className="max-w-md">
                                     <label className={labelClasses}>Filter Constraint (WHERE)</label>
                                     <input 
                                        type="text" 
                                        value={updateCondition} 
                                        onChange={(e) => setUpdateCondition(e.target.value)}
                                        className={inputClasses} 
                                        placeholder="e.g. ID = 1"
                                     />
                                 </div>
                                 <CodeBlock>{generateUpdateSQL()}</CodeBlock>
                             </div>
                        )}

                        {activeTab === 'SELECT' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className={labelClasses}>Requested Telemetry (Columns)</label>
                                        <input type="text" value={selectColumns} onChange={(e) => setSelectColumns(e.target.value)} className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Filter Constraint (WHERE)</label>
                                        <input type="text" value={selectCondition} onChange={(e) => setSelectCondition(e.target.value)} className={inputClasses} />
                                    </div>
                                </div>
                                <CodeBlock>{`SELECT ${selectColumns} \nFROM ${activeTable.tableName}\n${selectCondition ? `WHERE ${selectCondition}` : ""};`}</CodeBlock>
                            </div>
                        )}
                    </motion.div>
                 </AnimatePresence>
             </div>
        </div>
    );
};

export default TablePlayground;
