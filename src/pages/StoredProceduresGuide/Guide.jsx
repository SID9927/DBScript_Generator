import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, InfoCard } from './Components';

const SPGuide = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Bento Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <InfoCard type="info">
                        <strong>Engineering Protocol:</strong> Stored Procedures serve as the Database API. Encapsulate business logic within the storage tier to enforce security, atomicity, and pre-compiled execution paths.
                    </InfoCard>
                </div>

                {/* Conceptual Bento */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-4 text-left">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">⚡</div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-0.5 italic">The Logic Tier</h3>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Pre-Compiled <span className="text-emerald-400">Execution</span></h2>
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                                Think of a Stored Procedure as a <span className="text-white font-bold underline decoration-emerald-500/50 decoration-2">High-Performance Recipe</span>. Instead of sending raw SQL Every time, you send a single command. SQL Server optimizes the plan once and executes it lightning fast.
                            </p>
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-emerald-900/40">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                         <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100 mb-2 opacity-80">Security Protocol</h4>
                            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none">Attack Surface <br/>Reduction</h3>
                         </div>
                         <p className="text-[10px] font-bold text-emerald-500 bg-white px-3 py-1 rounded-full w-fit italic mt-4">
                            Prevents SQL Injection
                         </p>
                    </div>
                </div>
            </div>

            {/* Core Benefits Bento */}
            <div className="space-y-6">
                <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-left">Architectural Advantages</h3>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    {[
                        { title: 'Performance', icon: '🚀', items: ['Plan Caching', 'Less Network Churn', 'Atomic Logic'] },
                        { title: 'Security', icon: '🛡️', items: ['No Straight Table Access', 'Parameterization', 'Audit Logging'] },
                        { title: 'Maintainability', icon: '🛠️', items: ['Write Once, Use Many', 'Centralized Fixes', 'Strong Typing'] },
                        { title: 'Concurrency', icon: '🔄', items: ['Locking Granularity', 'Isolation Control', 'TVP Batching'] }
                    ].map((type, i) => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-emerald-500/30 transition-all group">
                            <div className="text-xl mb-4 grayscale group-hover:grayscale-0 transition-all">{type.icon}</div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest italic mb-3">{type.title}</h4>
                            <ul className="space-y-1.5">
                                {type.items.map((item, j) => (
                                    <li key={j} className="text-[10px] font-bold text-slate-500 tracking-tight flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactional Integrity */}
            <div className="space-y-6">
                 <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-left">Atomic Engineering</h3>
                </header>
                
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
                         <div className="space-y-6">
                             <div className="space-y-2">
                                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Robust <span className="text-emerald-400">Transactions</span></h2>
                                 <p className="text-sm font-medium text-slate-500 italic leading-relaxed">Ensure atomic success: All operations succeed or everything rolls back. Critical for financial and state-based integrity.</p>
                             </div>
                             <div className="space-y-4">
                                 {[
                                     { label: 'TRY-CATCH', desc: 'Graceful failure recovery and logging.' },
                                     { label: 'BEGIN TRAN', desc: 'Secure the current data state.' },
                                     { label: 'OUTPUT', desc: 'Return telemetry to the caller.' },
                                     { label: 'NOCOUNT ON', desc: 'Optimize by silencing feedback messages.' }
                                 ].map((op, i) => (
                                     <div key={i} className="flex items-center gap-4 group">
                                         <span className="text-[10px] font-black text-emerald-500/40 group-hover:text-emerald-500 transition-colors">0{i+1}</span>
                                         <div>
                                             <span className="text-xs font-black text-white uppercase tracking-widest mr-3 italic group-hover:text-emerald-300 transition-colors">{op.label}</span>
                                             <span className="text-[10px] font-bold text-slate-600">{op.desc}</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="relative">
                              <CodeBlock>{`CREATE PROCEDURE dbo.ProcessPayment
    @UserID INT, @Amount DECIMAL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        UPDATE Wallet SET Balance -= @Amount WHERE ID = @UserID;
        INSERT INTO Logs VALUES (@UserID, 'Paid', @Amount);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        THROW;
    END CATCH
END;`}</CodeBlock>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SPGuide;
