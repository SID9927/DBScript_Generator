import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, InfoCard } from './Components';

const IndexGuide = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hero Bento Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <InfoCard type="info">
                        <strong>Architecture Protocol:</strong> An index is a specialized B-Tree data structure designed to minimize disk I/O by providing a calibrated path to specific records, drastically reducing query latency at the cost of disk footprint.
                    </InfoCard>
                </div>

                {/* Conceptual Card */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                     {/* Glass effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl shadow-lg">📖</div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-1">Conceptual Model</h3>
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">The Library <span className="text-indigo-400">Analogy</span></h2>
                            </div>
                        </div>

                        <p className="text-slate-400 font-medium leading-relaxed italic">
                            Imagine a national archive containing millions of records. Searching for a name row-by-row would take weeks. An index is the <span className="text-white font-bold underline decoration-indigo-500/50 decoration-2">alphabetical card catalog</span>—it points you directly to the correct cabinet, shelf, and folder in milliseconds.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                                 <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                     Precision Seek
                                 </div>
                                 <p className="text-[11px] text-slate-300 font-medium leading-relaxed">Finding "John Smith" across 1,000,000 entries: <span className="text-white font-black">~2ms</span> via B-Tree traversal.</p>
                             </div>
                             <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 hover:border-red-500/30 transition-all">
                                 <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                     Linear Scan
                                 </div>
                                 <p className="text-[11px] text-slate-300 font-medium leading-relaxed">Without indexing: Requires scanning <span className="text-white font-black">all rows</span> and high disk I/O.</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Quick Action Card */}
                <div className="lg:col-span-4 bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-indigo-900/40">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-4 opacity-80 italic">Standard Protocol</div>
                        <h3 className="text-2xl font-black tracking-tighter leading-none mb-4 uppercase">Initialize First <br/><span className="text-indigo-950">Index Link</span></h3>
                        <p className="text-xs font-bold text-indigo-100 leading-relaxed italic opacity-90">
                            Apply a Non-Clustered index to columns frequently utilized in WHERE or JOIN constraints.
                        </p>
                    </div>
                    <div className="relative z-10 pt-8">
                        <div className="bg-indigo-950/40 rounded-2xl p-4 border border-indigo-400/20">
                            <code className="text-[10px] font-mono leading-tight text-white block opacity-80">
                                CREATE NONCLUSTERED INDEX IX_Entity_Field ON Table(Field);
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pros/Cons Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <header className="flex items-center gap-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Performance Advantages</h3>
                    </header>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                        {[
                            { title: 'Sub-Millisecond Retrieval', desc: 'Accelerates SELECT operations and WHERE clause filter precision.' },
                            { title: 'Relation Optimization', desc: 'Optimizes JOIN and ORDER BY operations by utilizing pre-sorted structures.' },
                            { title: 'Integrity Enforcement', desc: 'Enforces Uniqueness at the structural level via Unique Constraints.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-800">
                                <span className="text-emerald-500 font-black italic mt-0.5">0{i+1}</span>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">{item.title}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <header className="flex items-center gap-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Trade-off Considerations</h3>
                    </header>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                        {[
                            { title: 'DML Degradation', desc: 'Increases overhead for INSERT, UPDATE, and DELETE operations as indexes must sync.' },
                            { title: 'Storage Footprint', desc: 'Consumes tangible disk space; large indexes can exceed table data size.' },
                            { title: 'Fragmental Decay', desc: 'Poorly maintained indexes lead to physical fragmentation and performance drop.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-800">
                                <span className="text-red-500 font-black italic mt-0.5">0{i+1}</span>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">{item.title}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                 <div className="relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-1 italic">Real-World Logic</h3>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Implementation <span className="text-indigo-600">Protocol</span></h2>
                        </div>
                        <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             Optimizer Preferred
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                         <div className="prose prose-invert max-w-none">
                            <p className="text-indigo-100/70 font-medium italic underline decoration-indigo-500/30 decoration-2 underline-offset-8">
                                Defined at the table level using the CREATE INDEX syntax. Usually, the SQL Server Query Optimizer automatically select the most efficient index to utilize during execution.
                            </p>
                         </div>
                         <CodeBlock>{`-- 1. Automatic Optimizer Selection
SELECT ID, Name FROM Employees WHERE Email = 'user@domain.com';

-- 2. Forced index (Manual Hint - NOT RECOMMENDED)
SELECT ID, Name FROM Employees WITH (INDEX(IX_Emp_Email))
WHERE Email = 'user@domain.com';`}</CodeBlock>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default IndexGuide;
