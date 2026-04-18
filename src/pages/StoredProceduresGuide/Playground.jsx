import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock, CustomSelect } from './Components';

const SPPlayground = () => {
    const [name, setName] = useState("USP_ProcessTransaction");
    const [parameters, setParameters] = useState([
        { name: "AccountID", type: "INT", defaultValue: "", mode: "INPUT" },
        { name: "Amount", type: "DECIMAL(18,2)", defaultValue: "0.00", mode: "INPUT" }
    ]);
    const [body, setBody] = useState("-- Implementation Logic Here\nUPDATE Accounts SET Balance = Balance - @Amount WHERE ID = @AccountID;");
    
    // Config Flags
    const [useTransaction, setUseTransaction] = useState(true);
    const [useErrorHandling, setUseErrorHandling] = useState(true);
    const [noCount, setNoCount] = useState(true);
    const [isolationLevel, setIsolationLevel] = useState("READ COMMITTED");

    const isolationOptions = [
        { label: "None", value: "" },
        { label: "READ UNCOMMITTED", value: "READ UNCOMMITTED" },
        { label: "READ COMMITTED", value: "READ COMMITTED" },
        { label: "REPEATABLE READ", value: "REPEATABLE READ" },
        { label: "SERIALIZABLE", value: "SERIALIZABLE" },
    ];

    const generateSQL = () => {
        const paramString = parameters
            .filter(p => p.name)
            .map(p => {
                const outputSuffix = p.mode === "OUTPUT" ? " OUTPUT" : "";
                return `@${p.name} ${p.type}${p.defaultValue ? ` = ${p.defaultValue}` : ""}${outputSuffix}`;
            })
            .join(",\n    ");

        let bodySQL = body;

        if (useTransaction) {
            bodySQL = `BEGIN TRANSACTION;\n\n    ${bodySQL.replace(/\n/g, "\n    ")}\n\n    COMMIT TRANSACTION;`;
        }

        if (useErrorHandling) {
            bodySQL = `BEGIN TRY\n    ${bodySQL.replace(/\n/g, "\n    ")}\nEND TRY\nBEGIN CATCH\n    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;\n    -- Custom Error Handling Logic\n    THROW;\nEND CATCH`;
        }

        const isolationSQL = isolationLevel ? `SET TRANSACTION ISOLATION LEVEL ${isolationLevel};\n    ` : "";
        const noCountSQL = noCount ? "SET NOCOUNT ON;\n    " : "SET NOCOUNT OFF;\n    ";

        return `CREATE PROCEDURE dbo.${name}${parameters.length > 0 ? "\n    " + paramString : ""}\nAS\nBEGIN\n    ${noCountSQL}${isolationSQL}${bodySQL}\nEND;`;
    };

    const updateParameter = (index, field, value) => {
        const newParams = [...parameters];
        newParams[index][field] = value;
        setParameters(newParams);
    };

    const inputClasses = "w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-emerald-400 font-bold text-[11px] tracking-tight focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800";
    const labelClasses = "text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 px-1 block italic";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
             
             <div className="relative z-10 space-y-10">
                 {/* Workspace Header */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-900/40 transform rotate-12">🧪</div>
                             <div className="text-left">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1">Procedure Architect</h3>
                                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Logic <span className="text-emerald-400">Environment</span></h2>
                             </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm text-left">Industrial workspace for defining pre-compiled database procedures with robust error handling and transactional guards.</p>
                     </div>
                     
                     <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 font-mono">Status</div>
                            <div className="text-xs font-black text-emerald-400 uppercase italic">Ready to Compile</div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full" />
                            <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin" />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClasses}>Procedure Entity Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <h4 className={labelClasses}>Deployment Guardrails</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { label: 'Atomic Transaction', checked: useTransaction, setter: setUseTransaction },
                                            { label: 'Global Error Handling', checked: useErrorHandling, setter: setUseErrorHandling },
                                            { label: 'Suppress Feedback (NOCOUNT)', checked: noCount, setter: setNoCount }
                                        ].map((opt, i) => (
                                            <label key={i} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800 group hover:border-emerald-500/30 transition-all cursor-pointer">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">{opt.label}</span>
                                                <input 
                                                    type="checkbox" 
                                                    checked={opt.checked} 
                                                    onChange={(e) => opt.setter(e.target.checked)}
                                                    className="form-checkbox bg-slate-800 border-slate-700 rounded text-emerald-600 focus:ring-0 w-4 h-4 ml-4"
                                                />
                                            </label>
                                        ))}
                                        <div className="sm:col-span-1">
                                            <CustomSelect 
                                                label="Isolation Guard"
                                                value={isolationLevel}
                                                options={isolationOptions}
                                                onChange={setIsolationLevel}
                                                compact
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className={labelClasses}>Parameter Definitions</h4>
                                    <button 
                                        onClick={() => setParameters([...parameters, { name: "NewParam", type: "INT", defaultValue: "", mode: "INPUT" }])}
                                        className="text-[8px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors"
                                    >
                                        + Append Field
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                    {parameters.map((param, idx) => (
                                        <div key={idx} className="bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50 group flex flex-col gap-4">
                                            <div className="flex items-end gap-3">
                                                <div className="flex-grow">
                                                    <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Param Name</label>
                                                    <input 
                                                        type="text" 
                                                        value={param.name} 
                                                        onChange={(e) => updateParameter(idx, 'name', e.target.value)}
                                                        className="bg-transparent text-white font-bold text-xs tracking-tight focus:outline-none w-full border-b border-slate-800 focus:border-emerald-500/50 pb-1"
                                                    />
                                                </div>
                                                <div className="w-24">
                                                    <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Data Type</label>
                                                    <input 
                                                        type="text" 
                                                        value={param.type} 
                                                        onChange={(e) => updateParameter(idx, 'type', e.target.value)}
                                                        className="bg-transparent text-emerald-400 font-bold text-xs tracking-tight focus:outline-none w-full border-b border-slate-800 focus:border-emerald-500/50 pb-1"
                                                    />
                                                </div>
                                                <button onClick={() => setParameters(parameters.filter((_, i) => i !== idx))} className="text-red-500/40 hover:text-red-500 transition-colors mb-1">
                                                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-4">
                                                    {["INPUT", "OUTPUT"].map(mode => (
                                                        <button 
                                                            key={mode}
                                                            onClick={() => updateParameter(idx, 'mode', mode)}
                                                            className={`text-[8px] font-black uppercase tracking-widest transition-colors ${param.mode === mode ? 'text-emerald-500' : 'text-slate-700 hover:text-slate-500'}`}
                                                        >
                                                            {mode}
                                                        </button>
                                                    ))}
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="Default (Opt)"
                                                    value={param.defaultValue}
                                                    onChange={(e) => updateParameter(idx, 'defaultValue', e.target.value)}
                                                    className="bg-transparent text-right text-slate-500 text-[9px] font-bold focus:outline-none placeholder:text-slate-800"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         </div>

                         <div className="space-y-4 text-left">
                            <label className={labelClasses}>Core Implementation Logic (T-SQL)</label>
                            <textarea 
                                value={body} 
                                onChange={(e) => setBody(e.target.value)}
                                className={`${inputClasses} font-mono h-40 resize-none py-4 leading-relaxed`} 
                            />
                         </div>

                         <div className="space-y-4">
                            <h4 className={labelClasses}>Generated Result Protocol</h4>
                            <CodeBlock>{generateSQL()}</CodeBlock>
                         </div>
                    </div>
                 </div>
             </div>
        </div>
    );
};

export default SPPlayground;
