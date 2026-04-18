import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Terms = ({ terms }) => {
    const [expandedTerm, setExpandedTerm] = useState(null);

    const toggleTerm = (index) => {
        setExpandedTerm(expandedTerm === index ? null : index);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 gap-4"
        >
            {terms.map((term, index) => (
                <div
                    key={index}
                    className={`bg-slate-900/40 border transition-all duration-300 rounded-[2rem] overflow-hidden group ${expandedTerm === index ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : 'border-slate-800/60 hover:border-slate-700'}`}
                >
                    <button
                        className="w-full p-6 flex items-center justify-between text-left relative z-10"
                        onClick={() => toggleTerm(index)}
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-950 border transition-transform duration-500 ${expandedTerm === index ? 'border-indigo-500/20 rotate-6 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-slate-800 group-hover:scale-110'}`}>
                                {term.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-black text-white text-lg tracking-tighter uppercase italic">{term.name}</h3>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                                        term.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        term.color === 'green' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        term.color === 'orange' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                        {term.impact}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{term.description}</p>
                            </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center transition-transform duration-500 ${expandedTerm === index ? 'rotate-180 border-indigo-500/30' : ''}`}>
                            <svg className={`w-4 h-4 transition-colors ${expandedTerm === index ? 'text-indigo-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    <AnimatePresence>
                        {expandedTerm === index && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-800/50"
                            >
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-950/30">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Operational Basics</h4>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">{term.basics}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Technical Deep-Dive</h4>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed italic">{term.details}</p>
                                        </div>
                                        <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/60">
                                            <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Production Scenario</h4>
                                            <p className="text-[10px] text-slate-300 font-bold leading-relaxed lowercase italic">"{term.scenario}"</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between mx-1">
                                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Contextual Payload</h4>
                                            <span className="text-[7px] font-black text-indigo-500/50 uppercase tracking-[0.2em]">SQL Standard</span>
                                        </div>
                                        <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner">
                                            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/50 flex items-center justify-between">
                                                <div className="flex gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/20" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">TSQL Terminal</span>
                                            </div>
                                            <pre className="p-4 text-indigo-400/80 font-mono text-[10px] leading-relaxed overflow-x-auto selection:bg-indigo-500/20">
                                                <code>{term.code}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </motion.div>
    );
};

export default Terms;
