import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock, CustomSelect } from './Components';

const ViewPlayground = () => {
    const [name, setName] = useState("vw_ExecutiveDashboard");
    const [source, setSource] = useState("Employees");
    const [columns, setColumns] = useState("Name, Dept, Salary_Grade");
    const [filter, setFilter] = useState("IsActive = 1");
    const [isIndexed, setIsIndexed] = useState(false);
    const [useSchemaBinding, setUseSchemaBinding] = useState(false);

    const generateSQL = () => {
        const binding = (useSchemaBinding || isIndexed) ? "\nWITH SCHEMABINDING" : "";
        const whereClause = filter ? `\nWHERE ${filter}` : "";
        
        let sql = `CREATE VIEW dbo.${name}${binding}\nAS\nSELECT ${columns}\nFROM dbo.${source}${whereClause};`;

        if (isIndexed) {
            sql += `\n\nGO\n\n-- Materialization Protocol\nCREATE UNIQUE CLUSTERED INDEX IX_${name}\nON dbo.${name} (ID); -- Assuming ID is in SELECT list`;
        }
        
        return sql;
    };

    const labelClasses = "text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 px-1 block italic text-left";
    const inputClasses = "w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-sky-400 font-bold text-[11px] tracking-tight focus:outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-800 text-left";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
             
             <div className="relative z-10 space-y-10">
                 {/* Workspace Header */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-sky-900/40 transform rotate-12">📐</div>
                             <div className="text-left">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500 mb-1">Projection Architect</h3>
                                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Virtual <span className="text-sky-400">Environment</span></h2>
                             </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm text-left">Industrial workspace for defining architectural projections and data materialization schemas.</p>
                     </div>
                     
                     <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 font-mono">Telemetry</div>
                            <div className="text-xs font-black text-sky-400 uppercase italic">Active Projection</div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-sky-500/10 rounded-full" />
                            <div className="absolute inset-0 border-t-2 border-sky-500 rounded-full animate-spin" />
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex gap-4 p-1 bg-slate-950/50 rounded-2xl border border-slate-800 w-fit">
                                    {[
                                        { label: 'Standard', val: false },
                                        { label: 'Indexed (Materialized)', val: true }
                                    ].map(opt => (
                                        <button 
                                            key={opt.label}
                                            onClick={() => setIsIndexed(opt.val)}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isIndexed === opt.val ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className={labelClasses}>View Entity Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
                                </div>
                                
                                <div>
                                    <label className={labelClasses}>Primary Source Table</label>
                                    <input type="text" value={source} onChange={(e) => setSource(e.target.value)} className={inputClasses} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                     <label className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800 group hover:border-sky-500/30 transition-all cursor-pointer">
                                        <div className="space-y-0.5 text-left">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-sky-400 transition-colors">SCHEMABINDING Guard</span>
                                            <p className="text-[7px] text-slate-700 font-bold uppercase tracking-widest leading-none italic">Locks underlying base structures</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={useSchemaBinding || isIndexed} 
                                            disabled={isIndexed}
                                            onChange={(e) => setUseSchemaBinding(e.target.checked)}
                                            className="form-checkbox bg-slate-800 border-slate-700 rounded text-sky-600 focus:ring-0 w-4 h-4 ml-4"
                                        />
                                    </label>

                                    <div className="p-6 bg-slate-950/30 rounded-2xl border border-slate-800 space-y-4 text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Architectural Summary</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-bold text-slate-400 leading-relaxed italic border-l-2 border-slate-800 pl-3">
                                                {isIndexed ? " materializing this view will store results on disk and automatically sync them with base tables." : "This standard view will serve as a virtual projection, executing the underlying query on each request."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-4">
                                <label className={labelClasses}>Projected Columns</label>
                                <textarea 
                                    value={columns} 
                                    onChange={(e) => setColumns(e.target.value)}
                                    className={`${inputClasses} h-24 resize-none py-4 leading-relaxed font-mono`} 
                                    placeholder="Comma separated column list..."
                                />
                            </div>
                            <div className="space-y-4 text-left">
                                <label className={labelClasses}>Filtering Conditions (WHERE)</label>
                                <textarea 
                                    value={filter} 
                                    onChange={(e) => setFilter(e.target.value)}
                                    className={`${inputClasses} h-24 resize-none py-4 leading-relaxed font-mono`} 
                                    placeholder="Predicate logic here..."
                                />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className={labelClasses}>Generated Projection Blueprint</h4>
                            <CodeBlock>{generateSQL()}</CodeBlock>
                         </div>
                    </div>
                 </div>
             </div>
        </div>
    );
};

export default ViewPlayground;
