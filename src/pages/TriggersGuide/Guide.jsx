import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock, InfoCard } from './Components';

const TriggersGuide = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-left">
            {/* Bento Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <InfoCard type="danger">
                        <strong>Architecture Warning:</strong> Triggers are "invisible" logic. Overusing them can lead to non-deterministic side effects and extreme performance degradation. Prioritize <strong>Check Constraints</strong> or <strong>Service Broker</strong> for complex asynchronous tasks.
                    </InfoCard>
                </div>

                {/* Conceptual Bento */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">🔥</div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-0.5 italic">The Reactive Tier</h3>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Event <span className="text-red-400">Automation</span></h2>
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                                Think of a Trigger as a <span className="text-white font-bold underline decoration-red-500/50 decoration-2">Modular Guard</span>. They automatically respond to data changes (DML) or structural changes (DDL), enforcing integrity rules that standard constraints cannot touch.
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-red-900/40">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                         <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-100 mb-2 opacity-80">Security Protocol</h4>
                            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none">Atomic <br/>Rollbacks</h3>
                         </div>
                         <p className="text-[10px] font-bold text-red-100 italic opacity-90 mt-4 leading-tight">
                            One failure in a trigger rolls back the entire transaction.
                         </p>
                    </div>
                </div>
            </div>

            {/* Implementation Bento */}
            <div className="space-y-6">
                <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Reactive strategies</h3>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {[
                        { title: 'DML: AFTER', icon: '⏭️', desc: 'Reacts after success. Ideal for audit logging.' },
                        { title: 'DML: INSTEAD', icon: '🛑', desc: 'Overrides the action. Perfect for soft deletes.' },
                        { title: 'DDL: SCHEMA', icon: '🏗️', desc: 'Protects table structures and security.' },
                        { title: 'LOGON', icon: '🔑', desc: 'Controls session access and limit concurrent users.' }
                    ].map((type, i) => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-red-500/30 transition-all group">
                            <div className="text-xl mb-4 grayscale group-hover:grayscale-0 transition-all">{type.icon}</div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest italic mb-3">{type.title}</h4>
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{type.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Magic Tables Bento */}
            <div className="space-y-6">
                 <header className="flex items-center gap-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">The Temporal State Engine</h3>
                </header>
                
                <div className="bg-gradient-to-br from-slate-900 to-red-950/20 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                         <div className="space-y-8">
                             <div className="space-y-2">
                                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">The <span className="text-red-400">Magic</span> Tables</h2>
                                 <p className="text-sm font-medium text-slate-500 italic leading-relaxed">Inside a trigger, SQL Server provides virtual, memory-resident tables representing the "Before" and "After" state of your data.</p>
                             </div>
                             
                             <div className="grid grid-cols-1 gap-4">
                                 <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                     <div className="space-y-1">
                                         <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] italic">INSERTED</h4>
                                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono italic">NEW_STATE_TELEMETRY</p>
                                     </div>
                                     <div className="text-[10px] font-black text-white bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Active for INSERT/UPDATE</div>
                                 </div>

                                 <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-red-500/30 transition-all">
                                     <div className="space-y-1">
                                         <h4 className="text-xs font-black text-red-400 uppercase tracking-[0.2em] italic">DELETED</h4>
                                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono italic">OLD_STATE_CACHE</p>
                                     </div>
                                     <div className="text-[10px] font-black text-white bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Active for DELETE/UPDATE</div>
                                 </div>
                             </div>
                         </div>

                         <div className="relative">
                              <CodeBlock>{`CREATE TRIGGER TR_PreventSalaryDrop
ON Payroll AFTER UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        JOIN deleted d ON i.EmpID = d.EmpID
        WHERE i.Salary < d.Salary
    )
    BEGIN
        RAISERROR('Salary decreases are prohibited!', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;`}</CodeBlock>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TriggersGuide;
