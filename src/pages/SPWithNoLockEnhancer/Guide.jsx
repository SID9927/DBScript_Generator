import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, InfoCard } from './Components';

const PerformanceGuide = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-left">
            {/* Bento Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <InfoCard type="warning">
                        <strong>Performance Guard:</strong> <code>WITH (NOLOCK)</code> is a temporary patch, not a silver bullet. prioritize <strong>SARGable query patterns</strong> and <strong>RCSI (Snapshot Isolation)</strong> for sustainable database concurrency.
                    </InfoCard>
                </div>

                {/* Conceptual Bento */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">⚡</div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-0.5 italic">The Performance Tier</h3>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Optimized <span className="text-amber-400">Concurrency</span></h2>
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                                Performance is the art of <span className="text-white font-bold underline decoration-amber-500/50 decoration-2">Reducing Resistance</span>. Whether it’s bypassing locks with hints or ensuring index usage via SARGable code, every millisecond saved at the engine level scales exponentially in production.
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-amber-900/40">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                         <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-100 mb-2 opacity-80">Security Protocol</h4>
                            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none">Shared <br/>Lock Bypass</h3>
                         </div>
                         <p className="text-[10px] font-bold text-amber-100 italic opacity-90 mt-4 leading-tight">
                            Eliminate writer-blockage for heavy analytics and reporting logic.
                         </p>
                    </div>
                </div>
            </div>

            {/* Strategy Bento */}
            <div className="space-y-6">
                <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Optimization pillars</h3>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {[
                        { title: 'Lock Hints', icon: '🔓', desc: 'Control shared/exclusive access manually via NOLOCK or ROWLOCK.' },
                        { title: 'SARGability', icon: '🎯', desc: 'Writing predicates that the query optimizer can easily map to indexes.' },
                        { title: 'Isolation', icon: '📸', desc: 'Moving from lock-based to version-based concurrency (RCSI).' },
                        { title: 'Data Types', icon: '🔄', desc: 'Preventing implicit conversion overhead in joins and filters.' }
                    ].map((type, i) => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-amber-500/30 transition-all group">
                            <div className="text-xl mb-4 grayscale group-hover:grayscale-0 transition-all">{type.icon}</div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest italic mb-3">{type.title}</h4>
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{type.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* SARGability Bento */}
            <div className="space-y-6">
                 <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">SARGable Engineering</h3>
                </header>
                
                <div className="bg-gradient-to-br from-slate-900 to-amber-950/20 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                         <div className="space-y-6 text-left">
                             <div className="space-y-2">
                                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Index <span className="text-amber-400">Seeking</span> vs Scanning</h2>
                                 <p className="text-sm font-medium text-slate-500 italic leading-relaxed font-mono">Ensure the optimizer can use your indexes. Avoid "Black Box" column expressions in WHERE clauses.</p>
                             </div>
                             <div className="space-y-4">
                                 {[
                                     { label: 'RANGE SEARCH', desc: 'Use >= and < instead of DATEPART or YEAR.' },
                                     { label: 'NO FUNCTIONS', desc: 'Keep columns clean on the left side of equals.' },
                                     { label: 'WILDCARDS', desc: 'Only use trailing wildcards (LIKE "Text%").' },
                                     { label: 'COLUMN MATCH', desc: 'Match parameter types to column types exactly.' }
                                 ].map((op, i) => (
                                     <div key={i} className="flex items-center gap-4 group">
                                         <span className="text-[10px] font-black text-amber-500/40 group-hover:text-amber-500 transition-colors">0{i+1}</span>
                                         <div>
                                             <span className="text-xs font-black text-white uppercase tracking-widest mr-3 italic group-hover:text-amber-300 transition-colors">{op.label}</span>
                                             <span className="text-[10px] font-bold text-slate-600">{op.desc}</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="relative">
                              <CodeBlock>{`/* ❌ ANTI-PATTERN: Scans whole index */
SELECT Name FROM Orders 
WHERE YEAR(OrderDate) = 2023;

/* ✅ SARGABLE: Seeks specific range */
SELECT Name FROM Orders 
WHERE OrderDate >= '2023-01-01' 
  AND OrderDate < '2024-01-01';`}</CodeBlock>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceGuide;
