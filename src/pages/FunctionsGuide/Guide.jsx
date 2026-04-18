import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, InfoCard } from './Components';

const FunctionsGuide = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-left">
            {/* Bento Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <InfoCard type="warning">
                        <strong>Performance Alert:</strong> Scalar User-Defined Functions (UDFs) are notorious for "RBAR" (Row-By-Agonizing-Row) execution. Prioritize <strong>Inline Table-Valued Functions (iTVFs)</strong> for high-scale relational workloads.
                    </InfoCard>
                </div>

                {/* Conceptual Bento */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">🧬</div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-0.5 italic">Computed Logic</h3>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Atomic <span className="text-purple-400">Functions</span></h2>
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                                Think of a Function as a <span className="text-white font-bold underline decoration-purple-500/50 decoration-2">Modular Unit of Logic</span>. They accept parameters and return computed results, allowing you to encapsulate complex transformations directly within the T-SQL engine.
                            </p>
                        </div>
                    </div>

                    <div className="bg-purple-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-purple-900/40">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                         <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-100 mb-2 opacity-80">Execution Type</h4>
                            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none">Inline <br/>Optimization</h3>
                         </div>
                         <p className="text-[10px] font-bold text-purple-100 italic opacity-90 mt-4 leading-tight">
                            Treated as views by the optimizer. Zero context-switching penalty.
                         </p>
                    </div>
                </div>
            </div>

            {/* Implementation Bento */}
            <div className="space-y-6">
                <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Architectural specs</h3>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { title: 'Scalar UDFs', icon: '🔢', desc: 'Returns a single value. Best for complex calculations on independent data points.' },
                        { title: 'Inline TVFs', icon: '📊', desc: 'The gold standard. Parameterized logic that merges seamlessly into execution plans.' },
                        { title: 'Multi-Statement', icon: '📝', desc: 'Allows procedural logic (IF/WHILE) but acts as a performance "Black Box".' }
                    ].map((type, i) => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-purple-500/30 transition-all group">
                            <div className="text-xl mb-4 grayscale group-hover:grayscale-0 transition-all">{type.icon}</div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest italic mb-3">{type.title}</h4>
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{type.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Code Implementations */}
            <div className="space-y-6">
                 <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">UDF Implementation Patterns</h3>
                </header>
                
                <div className="bg-gradient-to-br from-slate-900 to-purple-950/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                         <div className="space-y-6">
                             <div className="space-y-2">
                                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Best-In-Class <span className="text-purple-400">iTVFs</span></h2>
                                 <p className="text-sm font-medium text-slate-500 italic leading-relaxed">Inline Table-Valued Functions (iTVFs) are the most efficient way to encapsulate reusable query logic without sacrificing performance.</p>
                             </div>
                             <div className="space-y-4">
                                 {[
                                     { label: 'SELECTABLE', desc: 'Use directly in FROM and JOIN clauses.' },
                                     { label: 'SARGABLE', desc: 'Maintain index-seek capabilities across filters.' },
                                     { label: 'PARALLEL', desc: 'Allows the engine to distribute work across cores.' },
                                     { label: 'OPTIMIZED', desc: 'Inlined into the calling query tree.' }
                                 ].map((op, i) => (
                                     <div key={i} className="flex items-center gap-4 group">
                                         <span className="text-[10px] font-black text-purple-500/40 group-hover:text-purple-500 transition-colors">0{i+1}</span>
                                         <div>
                                             <span className="text-xs font-black text-white uppercase tracking-widest mr-3 italic group-hover:text-purple-300 transition-colors">{op.label}</span>
                                             <span className="text-[10px] font-bold text-slate-600">{op.desc}</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="relative">
                              <CodeBlock>{`CREATE FUNCTION dbo.GetCustOrders(@ID INT)
RETURNS TABLE
AS
RETURN (
    SELECT OrderID, TotalAmount, Status
    FROM dbo.Orders
    WHERE CustomerID = @ID
      AND Status = 'Active'
);

-- How to implement in queries:
SELECT a.Name, b.OrderID
FROM dbo.Customers a
CROSS APPLY dbo.GetCustOrders(a.ID) b;`}</CodeBlock>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunctionsGuide;
