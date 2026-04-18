import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, CustomSelect } from './Components';

const IndexPlayground = () => {
    const [type, setType] = useState("clustered");
    const [table, setTable] = useState("Employees");
    const [columns, setColumns] = useState("EmployeeID");
    const [filter, setFilter] = useState("");
    const [includeColumns, setIncludeColumns] = useState("");

    const indexOptions = [
        { label: "Clustered Index", value: "clustered" },
        { label: "Non-Clustered Index", value: "nonclustered" },
        { label: "Unique Index", value: "unique" },
        { label: "Filtered Index", value: "filtered" },
        { label: "Columnstore Index", value: "columnstore" }
    ];

    const generateSQL = () => {
        const colName = columns.replace(/,/g, "_").replace(/\s/g, "");
        switch (type) {
            case "clustered":
                return `CREATE CLUSTERED INDEX IX_${table}_${colName}\nON ${table} (${columns});`;
            case "nonclustered":
                return `CREATE NONCLUSTERED INDEX IX_${table}_${colName}\nON ${table} (${columns})\n${includeColumns ? `INCLUDE (${includeColumns})` : ""};`;
            case "unique":
                return `CREATE UNIQUE NONCLUSTERED INDEX UQ_${table}_${colName}\nON ${table} (${columns});`;
            case "filtered":
                return `CREATE NONCLUSTERED INDEX IX_${table}_${colName}\nON ${table} (${columns})\nWHERE ${filter || "IsActive = 1"};`;
            case "columnstore":
                return `CREATE CLUSTERED COLUMNSTORE INDEX CCI_${table}\nON ${table};`;
            default:
                return "-- Select an index type";
        }
    };

    const inputClasses = "w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-indigo-300 font-bold text-sm tracking-tight focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800 selection:bg-indigo-500/30";
    const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 px-1 block italic lowercase first-letter:uppercase";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
             
             <div className="relative z-10 space-y-12">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-900/40 transform rotate-12">🛠</div>
                             <div>
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-1">Interactive Forge</h3>
                                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Index Syntax <span className="text-indigo-400">Generator</span></h2>
                             </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm">Calibrate structural parameters to generate industrial-grade T-SQL blueprints.</p>
                     </div>
                     
                     <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 font-mono">Protocol</div>
                            <div className="text-xs font-black text-indigo-400 uppercase italic">Active Generator</div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-full" />
                            <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin" />
                            <div className="absolute inset-2 border-b-2 border-indigo-400/30 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <CustomSelect
                        label="Architecture Type"
                        value={type}
                        options={indexOptions}
                        onChange={setType}
                    />

                    <div className="space-y-2">
                        <label className={labelClasses}>Entity Name (Table)</label>
                        <input
                            type="text"
                            value={table}
                            onChange={(e) => setTable(e.target.value)}
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={labelClasses}>Primary Keys / Columns</label>
                        <input
                            type="text"
                            value={columns}
                            onChange={(e) => setColumns(e.target.value)}
                            placeholder="e.g., ID, CreatedAt"
                            className={inputClasses}
                        />
                    </div>

                    {type === "nonclustered" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 lg:col-span-3">
                            <label className={labelClasses}>Included Telemetry (Columns)</label>
                            <input
                                type="text"
                                value={includeColumns}
                                onChange={(e) => setIncludeColumns(e.target.value)}
                                placeholder="Columns to satisfy query coverage"
                                className={inputClasses}
                            />
                        </motion.div>
                    )}

                    {type === "filtered" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 lg:col-span-3">
                            <label className={labelClasses}>Filter Constraint (WHERE)</label>
                            <input
                                type="text"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                placeholder="e.g., StatusID = 1 OR IsArchived = 0"
                                className={inputClasses}
                            />
                        </motion.div>
                    )}
                 </div>

                 <div className="space-y-4">
                    <header className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Generated T-SQL Payload</h3>
                        </div>
                        <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-widest">Syntax: SQL Server 2022+</span>
                    </header>
                    <CodeBlock>{generateSQL()}</CodeBlock>
                 </div>
             </div>
        </div>
    );
};

export default IndexPlayground;
