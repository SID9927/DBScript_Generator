import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock, CustomSelect } from './Components';

const TriggerPlayground = () => {
    const [name, setName] = useState("TR_Atomic_Auditor");
    const [target, setTarget] = useState("Employees");
    const [type, setType] = useState("AFTER");
    const [events, setEvents] = useState(["INSERT", "UPDATE"]);
    const [isDDL, setIsDDL] = useState(false);
    const [body, setBody] = useState("-- Implementation Logic\nINSERT INTO ChangeLog (User, Date, Action)\nVALUES (USER_NAME(), GETDATE(), 'MODIFIED');");

    const reactiveTypes = [
        { label: "AFTER (Post-DML)", value: "AFTER" },
        { label: "INSTEAD OF (Override)", value: "INSTEAD OF" },
    ];

    const ddlEvents = [
        { label: "CREATE_TABLE", value: "CREATE_TABLE" },
        { label: "ALTER_TABLE", value: "ALTER_TABLE" },
        { label: "DROP_TABLE", value: "DROP_TABLE" },
        { label: "GRANT_DATABASE", value: "GRANT_DATABASE" }
    ];

    const dmlEvents = ["INSERT", "UPDATE", "DELETE"];

    const toggleEvent = (e) => {
       if (events.includes(e)) setEvents(events.filter(ev => ev !== e));
       else setEvents([...events, e]);
    };

    const generateSQL = () => {
        if (isDDL) {
            return `CREATE TRIGGER ${name}\nON DATABASE\nFOR ${events.join(', ')}\nAS\nBEGIN\n    SET NOCOUNT ON;\n    ${body}\nEND;`;
        }
        const eventStr = events.join(', ');
        return `CREATE TRIGGER dbo.${name}\nON dbo.${target}\n${type} ${eventStr}\nAS\nBEGIN\n    SET NOCOUNT ON;\n    ${body}\nEND;`;
    };

    const labelClasses = "text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 px-1 block italic text-left";
    const inputClasses = "w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-red-400 font-bold text-[11px] tracking-tight focus:outline-none focus:border-red-500/50 transition-all placeholder:text-slate-800 text-left";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
             
             <div className="relative z-10 space-y-10">
                 {/* Workspace Header */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-red-900/40 transform rotate-12">🦾</div>
                             <div className="text-left">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-1">Event Orchestrator</h3>
                                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Reactive <span className="text-red-400">Environment</span></h2>
                             </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm text-left">Industrial workspace for defining automated responses to data mutations and structural alterations.</p>
                     </div>
                     
                     <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 font-mono">Status</div>
                            <div className="text-xs font-black text-red-400 uppercase italic">Armed & Ready</div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-red-500/10 rounded-full" />
                            <div className="absolute inset-0 border-t-2 border-red-500 rounded-full animate-spin" />
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex gap-4 p-1 bg-slate-950/50 rounded-2xl border border-slate-800 w-fit">
                                    {[
                                        { label: 'DML (Data)', val: false },
                                        { label: 'DDL (Schema)', val: true }
                                    ].map(opt => (
                                        <button 
                                            key={opt.label}
                                            onClick={() => {
                                                setIsDDL(opt.val);
                                                setEvents(opt.val ? ["DROP_TABLE"] : ["INSERT", "UPDATE"]);
                                            }}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDDL === opt.val ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className={labelClasses}>Trigger Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
                                </div>
                                
                                {!isDDL && (
                                    <>
                                        <div>
                                            <label className={labelClasses}>Target Entity (Table/View)</label>
                                            <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} className={inputClasses} />
                                        </div>
                                        <div>
                                            <CustomSelect 
                                                label="Execution Phase"
                                                value={type}
                                                options={reactiveTypes}
                                                onChange={setType}
                                                compact
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className={labelClasses}>Subscribed Events</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(isDDL ? ddlEvents : dmlEvents.map(e => ({ label: e, value: e }))).map((ev) => (
                                        <button
                                            key={ev.value}
                                            onClick={() => toggleEvent(ev.value)}
                                            className={`p-4 rounded-2xl border transition-all text-left group ${events.includes(ev.value) ? 'bg-red-600/10 border-red-500/50' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${events.includes(ev.value) ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>{ev.label}</span>
                                                {events.includes(ev.value) && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                            </div>
                                            <p className="text-[7px] font-bold text-slate-700 uppercase tracking-widest">Active listener</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                         </div>

                         <div className="space-y-4 text-left">
                            <label className={labelClasses}>Logic Execution Body</label>
                            <textarea 
                                value={body} 
                                onChange={(e) => setBody(e.target.value)}
                                className={`${inputClasses} font-mono h-40 resize-none py-4 leading-relaxed`} 
                                placeholder="T-SQL payload logic here..."
                            />
                         </div>

                         <div className="space-y-4">
                            <h4 className={labelClasses}>Generated Event Schema</h4>
                            <CodeBlock>{generateSQL()}</CodeBlock>
                         </div>
                    </div>
                 </div>
             </div>
        </div>
    );
};

export default TriggerPlayground;
