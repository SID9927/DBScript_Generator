import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock, CustomSelect } from './Components';

const FunctionPlayground = () => {
    const [name, setName] = useState("UDF_CalculateRisk");
    const [parameters, setParameters] = useState([
        { name: "Score", type: "INT" },
        { name: "Multiplier", type: "DECIMAL(5,2)" }
    ]);
    const [body, setBody] = useState("RETURN @Score * @Multiplier;");
    const [isTableValued, setIsTableValued] = useState(false);
    const [returnType, setReturnType] = useState("DECIMAL(18,2)");
    const [useSchemaBinding, setUseSchemaBinding] = useState(true);

    const generateSQL = () => {
        const paramString = parameters
            .filter(p => p.name)
            .map(p => `@${p.name} ${p.type}`)
            .join(",\n    ");

        const bindingSQL = useSchemaBinding ? "\nWITH SCHEMABINDING" : "";

        if (isTableValued) {
            return `CREATE FUNCTION dbo.${name} (\n    ${paramString}\n)\nRETURNS TABLE${bindingSQL}\nAS\nRETURN (\n    ${body.replace(/RETURN /g, '')}\n);`;
        } else {
            return `CREATE FUNCTION dbo.${name} (\n    ${paramString}\n)\nRETURNS ${returnType}${bindingSQL}\nAS\nBEGIN\n    ${body}\nEND;`;
        }
    };

    const updateParameter = (index, field, value) => {
        const newParams = [...parameters];
        newParams[index][field] = value;
        setParameters(newParams);
    };

    const inputClasses = "w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-purple-400 font-bold text-[11px] tracking-tight focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-800";
    const labelClasses = "text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 px-1 block italic";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
             
             <div className="relative z-10 space-y-10">
                 {/* Workspace Header */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-900/40 transform rotate-12">🧪</div>
                             <div className="text-left">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-1">Module Designer</h3>
                                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Functional <span className="text-purple-400">Blueprint</span></h2>
                             </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm text-left">Industrial workspace for defining modular logic units and parameterized query expansions.</p>
                     </div>
                     
                     <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 font-mono">Environment</div>
                            <div className="text-xs font-black text-purple-400 uppercase italic">Active Designer</div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-purple-500/10 rounded-full" />
                            <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin" />
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex gap-4 p-1 bg-slate-950/50 rounded-2xl border border-slate-800 w-fit">
                                    {[
                                        { label: 'Scalar', val: false },
                                        { label: 'Inline TVF', val: true }
                                    ].map(opt => (
                                        <button 
                                            key={opt.label}
                                            onClick={() => {
                                                setIsTableValued(opt.val);
                                                setBody(opt.val ? "SELECT * FROM Table WHERE ID = @Param" : "RETURN @Param * 1.5;");
                                            }}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isTableValued === opt.val ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className={labelClasses}>Module Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
                                </div>
                                
                                {!isTableValued && (
                                    <div>
                                        <label className={labelClasses}>Return Type Specification</label>
                                        <input type="text" value={returnType} onChange={(e) => setReturnType(e.target.value)} className={inputClasses} placeholder="e.g. MONEY, INT, BIT" />
                                    </div>
                                )}

                                <label className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800 group hover:border-purple-500/30 transition-all cursor-pointer">
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-purple-400 transition-colors">Enforce Schema Binding</span>
                                        <p className="text-[7px] text-slate-700 font-bold uppercase tracking-widest leading-none italic">Prevents breaking structural changes</p>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={useSchemaBinding} 
                                        onChange={(e) => setUseSchemaBinding(e.target.checked)}
                                        className="form-checkbox bg-slate-800 border-slate-700 rounded text-purple-600 focus:ring-0 w-4 h-4 ml-4"
                                    />
                                </label>
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className={labelClasses}>Input Schema (Params)</h4>
                                    <button 
                                        onClick={() => setParameters([...parameters, { name: "NewParam", type: "INT" }])}
                                        className="text-[8px] font-black text-purple-500 uppercase tracking-widest hover:text-purple-400 transition-colors"
                                    >
                                        + Add Param
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                    {parameters.map((param, idx) => (
                                        <div key={idx} className="bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50 group flex items-end gap-3 transition-colors hover:border-purple-500/20">
                                            <div className="flex-grow">
                                                <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Name</label>
                                                <input 
                                                    type="text" 
                                                    value={param.name} 
                                                    onChange={(e) => updateParameter(idx, 'name', e.target.value)}
                                                    className="bg-transparent text-white font-bold text-xs tracking-tight focus:outline-none w-full border-b border-slate-800 focus:border-purple-500/50 pb-1"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <label className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Data Type</label>
                                                <input 
                                                    type="text" 
                                                    value={param.type} 
                                                    onChange={(e) => updateParameter(idx, 'type', e.target.value)}
                                                    className="bg-transparent text-purple-400 font-bold text-xs tracking-tight focus:outline-none w-full border-b border-slate-800 focus:border-purple-500/50 pb-1"
                                                />
                                            </div>
                                            <button onClick={() => setParameters(parameters.filter((_, i) => i !== idx))} className="text-red-500/40 hover:text-red-500 transition-colors mb-1">
                                                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         </div>

                         <div className="space-y-4 text-left">
                            <label className={labelClasses}>Functional Logic Implementation</label>
                            <textarea 
                                value={body} 
                                onChange={(e) => setBody(e.target.value)}
                                className={`${inputClasses} font-mono h-40 resize-none py-4 leading-relaxed`} 
                                placeholder={isTableValued ? "SELECT statement here..." : "RETURN expression here..."}
                            />
                         </div>

                         <div className="space-y-4">
                            <h4 className={labelClasses}>Compiled Functional Schema</h4>
                            <CodeBlock>{generateSQL()}</CodeBlock>
                         </div>
                    </div>
                 </div>
             </div>
        </div>
    );
};

export default FunctionPlayground;
