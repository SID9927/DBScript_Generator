import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock } from './Components';

const TermsDictionary = ({ terms }) => {
    const [expandedTerm, setExpandedTerm] = useState(null);

    return (
        <div className="space-y-4">
            {terms.map((term, index) => (
                <div
                    key={index}
                    className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-indigo-500/30"
                >
                    <div
                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                        onClick={() => setExpandedTerm(expandedTerm === index ? null : index)}
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-3xl border border-slate-800 transition-transform group-hover:scale-110">
                                {term.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">{term.name}</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{term.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                term.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                term.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                                term.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                                term.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                'bg-slate-800 text-slate-400 border-slate-700'
                             }`}>
                                {term.impact}
                             </div>
                             <div className={`w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-600 transition-transform duration-500 ${expandedTerm === index ? 'rotate-180 bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : ''}`}>
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                             </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {expandedTerm === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-800"
                            >
                                <div className="p-8 bg-slate-950/30 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Fundamental Logic</h4>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{term.basics}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Technical Specification</h4>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{term.details}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Strategic Scenario</h4>
                                            </div>
                                            <p className="text-xs font-bold text-indigo-400 leading-relaxed italic opacity-80">{term.scenario}</p>
                                        </div>

                                        <div className="space-y-4">
                                             <div className="flex items-center gap-3">
                                                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">T-SQL Implementation</h4>
                                            </div>
                                            <CodeBlock>{term.code}</CodeBlock>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export default TermsDictionary;
