import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, InfoCard } from './Components';

const ViewsGuide = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-left">
            {/* Bento Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <InfoCard type="info">
                        <strong>Architectural Standard:</strong> Views provide an abstraction layer. Use them to decouple application code from physical schema changes, enforce row/column security, and simplify complex relational joins.
                    </InfoCard>
                </div>

                {/* Conceptual Bento */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-2xl">🖼️</div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500 mb-0.5 italic">The Projection Tier</h3>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Virtual <span className="text-sky-400">Projections</span></h2>
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                                Think of a View as a <span className="text-white font-bold underline decoration-sky-500/50 decoration-2">Modular Lens</span>. They don't store data physically (unless indexed); instead, they provide a curated, security-hardened perspective of your raw relational tables.
                            </p>
                        </div>
                    </div>

                    <div className="bg-sky-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-sky-900/40">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                         <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-100 mb-2 opacity-80">Security Protocol</h4>
                            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none">Schema <br/>Abstraction</h3>
                         </div>
                         <p className="text-[10px] font-bold text-sky-100 italic opacity-90 mt-4 leading-tight">
                            Show what is needed. Hide what is sensitive.
                         </p>
                    </div>
                </div>
            </div>

            {/* Implementation Bento */}
            <div className="space-y-6">
                <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Projection strategies</h3>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {[
                        { title: 'Standard View', icon: '🖼️', desc: 'Metadata only. Simplifies complex logic without storage cost.' },
                        { title: 'Indexed View', icon: '⚡', desc: 'Materialized results. Drastic speed for reporting & aggregates.' },
                        { title: 'Partitioned', icon: '🧩', desc: 'Stitches distributed tables into a single entity.' },
                        { title: 'System Metadata', icon: '⚙️', desc: 'Exposes internal engine telemetry and structure.' }
                    ].map((type, i) => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-sky-500/30 transition-all group">
                            <div className="text-xl mb-4 grayscale group-hover:grayscale-0 transition-all">{type.icon}</div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest italic mb-3">{type.title}</h4>
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{type.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Materialization Bento */}
            <div className="space-y-6">
                 <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">The Materialization Protocol</h3>
                </header>
                
                <div className="bg-gradient-to-br from-slate-900 to-sky-950/20 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                         <div className="space-y-6">
                             <div className="space-y-2">
                                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Indexed <span className="text-sky-400">Views</span></h2>
                                 <p className="text-sm font-medium text-slate-500 italic leading-relaxed">Turn a virtual query into a physical asset. By adding a unique clustered index, the data is persisted and maintained by the engine.</p>
                             </div>
                             <div className="space-y-4">
                                 {[
                                     { label: 'PERSISTENCE', desc: 'Data is stored on disk for O(1) retrieval.' },
                                     { label: 'AUTO-UPDATE', desc: 'Engine maintains sync with base tables.' },
                                     { label: 'AGGREGATES', icon: '📊', desc: 'Pre-calculate SUM, COUNT, and totals.' },
                                     { label: 'SCHEMABINDING', icon: '🔒', desc: 'Mandatory structural lockdown.' }
                                 ].map((op, i) => (
                                     <div key={i} className="flex items-center gap-4 group">
                                         <span className="text-[10px] font-black text-sky-500/40 group-hover:text-sky-500 transition-colors">0{i+1}</span>
                                         <div>
                                             <span className="text-xs font-black text-white uppercase tracking-widest mr-3 italic group-hover:text-sky-300 transition-colors">{op.label}</span>
                                             <span className="text-[10px] font-bold text-slate-600">{op.desc}</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="relative">
                              <CodeBlock>{`CREATE VIEW dbo.vw_SalesTotal
WITH SCHEMABINDING
AS
SELECT 
    ProductID, 
    SUM(Amount) as Total,
    COUNT_BIG(*) as Count
FROM dbo.Sales
GROUP BY ProductID;

-- Materialize the view
CREATE UNIQUE CLUSTERED INDEX IX_vw_SalesTotal
ON dbo.vw_SalesTotal(ProductID);`}</CodeBlock>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewsGuide;
