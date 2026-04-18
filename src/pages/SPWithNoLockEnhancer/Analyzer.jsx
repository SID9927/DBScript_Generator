import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock } from './Components';
import { analyzeSP } from "../../utils/sqlStaticAnalyzer";

const PerformanceAnalyzer = () => {
    const [inputSP, setInputSP] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        if (!inputSP.trim()) return;
        setIsAnalyzing(true);
        
        // Simulating engine processing
        setTimeout(() => {
            const analysis = analyzeSP(inputSP);
            setAnalysisResult(analysis);
            setIsAnalyzing(false);
        }, 800);
    };

    const labelClasses = "text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1 px-1 block italic text-left";
    const inputClasses = "w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-amber-400 font-bold text-[13px] tracking-tight focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-800 font-mono text-left";

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
             
             <div className="relative z-10 space-y-10">
                 {/* Workspace Header */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-900/40 transform rotate-12">🔍</div>
                             <div className="text-left">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-1">Heuristic Engine</h3>
                                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Code <span className="text-amber-400">Scanner</span></h2>
                             </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-sm text-left">Industrial workspace for auditing Procedure logic and identifying locking contention risks.</p>
                     </div>
                     
                     <div className="flex items-center gap-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                        <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 font-mono">Engine Status</div>
                            <div className="text-xs font-black text-amber-400 uppercase italic">{isAnalyzing ? 'Processing Payload' : 'Standby Mode'}</div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-amber-500/10 rounded-full" />
                            <div className={`absolute inset-0 border-t-2 border-amber-500 rounded-full ${isAnalyzing ? 'animate-spin' : ''}`} />
                            <div className={`w-1.5 h-1.5 rounded-full bg-amber-500 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12 space-y-8">
                         <div className="space-y-4">
                            <label className={labelClasses}>Procedure Entity Logic</label>
                            <textarea 
                                value={inputSP} 
                                onChange={(e) => setInputSP(e.target.value)}
                                className={`${inputClasses} h-64 resize-none leading-relaxed custom-scrollbar`} 
                                placeholder="Paste T-SQL payload here..."
                            />
                         </div>

                         <div className="flex items-center gap-4">
                            <button 
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !inputSP.trim()}
                                className="px-10 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-900/40 flex items-center gap-3 active:scale-95"
                            >
                                {isAnalyzing ? 'Scanning Architecture...' : '🚀 Execute Analysis'}
                            </button>
                            {analysisResult && (
                                <button 
                                    onClick={() => { setInputSP(""); setAnalysisResult(null); }}
                                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Clear Buffer
                                </button>
                            )}
                         </div>

                         <AnimatePresence>
                             {analysisResult && (
                                 <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                 >
                                     {/* Grade Card */}
                                     <div className="bg-gradient-to-br from-slate-900 to-amber-900/20 border border-amber-500/30 rounded-[2.5rem] p-10 relative overflow-hidden">
                                         <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] -mr-24 -mt-24" />
                                         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                                             <div className="md:col-span-2 space-y-4">
                                                 <div className="flex items-center gap-3">
                                                     <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                                     <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Efficiency Telemetry</h3>
                                                 </div>
                                                 <p className="text-sm font-medium text-slate-300 italic leading-relaxed">{analysisResult.summary}</p>
                                             </div>
                                             <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
                                                 <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 font-mono italic">Final Grade</div>
                                                 <div className={`text-5xl font-black italic tracking-tighter ${analysisResult.score >= 90 ? 'text-emerald-400' : analysisResult.score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                                                     {analysisResult.score}%
                                                 </div>
                                             </div>
                                         </div>

                                         <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-slate-800/50 text-left">
                                             {[
                                                 { label: "Lines Audited", val: analysisResult.metrics.linesOfCode },
                                                 { label: "Structural Complexity", val: analysisResult.metrics.complexity },
                                                 { label: "Execution Risk", val: analysisResult.metrics.estimatedExecutionRisk, isRisk: true }
                                             ].map((m, i) => (
                                                 <div key={i}>
                                                     <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 font-mono italic">{m.label}</div>
                                                     <div className={`text-xl font-black italic tracking-tighter ${m.isRisk ? (m.val === 'Low' ? 'text-emerald-400' : m.val === 'Medium' ? 'text-amber-400' : 'text-red-400') : 'text-white'}`}>{m.val}</div>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>

                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                         {/* Critical Warnings */}
                                         <div className="space-y-4">
                                             <h4 className={labelClasses}>Critical Logic Warnings</h4>
                                             <div className="space-y-3">
                                                 {analysisResult.issues.length > 0 ? analysisResult.issues.map((issue, idx) => (
                                                     <div key={idx} className="bg-red-500/5 border border-red-500/20 p-5 rounded-3xl space-y-3 group hover:border-red-500/40 transition-all">
                                                         <div className="flex items-center gap-3">
                                                              <span className="text-[10px] font-black px-2 py-0.5 bg-red-500 text-white rounded uppercase italic">Critical</span>
                                                              {issue.line && <span className="text-[9px] font-mono font-bold text-slate-500">Line {issue.line}</span>}
                                                         </div>
                                                         <p className="text-[11px] font-bold text-red-200/80 leading-relaxed italic">{issue.message}</p>
                                                         {issue.suggestion && (
                                                             <div className="p-3 bg-slate-900/50 rounded-2xl border border-red-500/10 text-[10px] font-bold text-emerald-400 italic">
                                                                 💡 Fix: {issue.suggestion}
                                                             </div>
                                                         )}
                                                     </div>
                                                 )) : (
                                                     <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl text-center">
                                                         <span className="text-xl block mb-2">🎉</span>
                                                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Zero Architectural Violations</p>
                                                     </div>
                                                 )}
                                             </div>
                                         </div>

                                         {/* Strategy Optimizations */}
                                         <div className="space-y-4">
                                            <h4 className={labelClasses}>Strategy Optimizations</h4>
                                            <div className="space-y-3">
                                                 {analysisResult.suggestions.map((sugg, idx) => (
                                                     <div key={idx} className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-3xl flex gap-4 hover:border-amber-500/40 transition-all group">
                                                         <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500/40 group-hover:text-amber-400 transition-colors">💡</div>
                                                         <div className="space-y-1">
                                                             <h5 className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">{sugg.type} Pattern</h5>
                                                             <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">{sugg.message}</p>
                                                         </div>
                                                     </div>
                                                 ))}
                                            </div>
                                         </div>
                                     </div>
                                 </motion.div>
                             )}
                         </AnimatePresence>
                    </div>
                 </div>
             </div>
        </div>
    );
};

export default PerformanceAnalyzer;
