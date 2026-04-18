import React, { useState, useRef } from 'react';
import { parseAndAnalyzePlan } from '../../utils/executionPlanParser';
import { CodeBlock } from './Components';

const Analyzer = () => {
    const [executionPlan, setExecutionPlan] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [fileName, setFileName] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setExecutionPlan(content);
                try {
                    const result = parseAndAnalyzePlan(content);
                    setAnalysis(result);
                } catch (error) {
                    console.error("Parsing error:", error);
                    alert("Failed to parse the execution plan. Ensure it is a valid .sqlplan (XML) file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const analyzeManual = () => {
        if (!executionPlan.trim()) return;
        try {
            const result = parseAndAnalyzePlan(executionPlan);
            setAnalysis(result);
        } catch (error) {
            alert("Invalid XML format.");
        }
    };

    const resetAnalysis = () => {
        setAnalysis(null);
        setExecutionPlan('');
        setFileName(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                    <span className="w-8 h-px bg-indigo-500/30" />
                    Plan <span className="text-indigo-500">Analyzer</span>
                </h2>
                {analysis && (
                    <button 
                        onClick={resetAnalysis}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all shadow-lg shadow-red-900/10"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Wipe Terminal
                    </button>
                )}
            </div>

            {!analysis && (
                <div className="space-y-8">
                    {/* Upload Section BENTO */}
                    <div 
                        className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-12 text-center group cursor-pointer hover:border-indigo-500/40 transition-all duration-500 hover:bg-slate-900/40 relative overflow-hidden" 
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="absolute inset-0 bg-indigo-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-20 h-20 bg-slate-950 rounded-3xl border border-slate-800 mx-auto flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-2xl">
                                📂
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Upload <span className="text-indigo-500">.sqlplan</span></h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Drag & drop or select XML source</p>
                            </div>
                            <input type="file" accept=".sqlplan,.xml" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
                            <div className="pt-2">
                                <span className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20">
                                    Initiate Scanner
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-grow h-px bg-slate-800/50" />
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Protocol Fallback</span>
                        <div className="flex-grow h-px bg-slate-800/50" />
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Manual Payload Input</h4>
                                <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mt-0.5">Paste raw XML plan content</p>
                            </div>
                        </div>
                        <textarea
                            className="w-full h-40 p-6 bg-slate-950/50 border border-slate-800 rounded-3xl font-mono text-xs text-indigo-300 placeholder:text-slate-800 outline-none focus:border-indigo-500/50 transition-all custom-scrollbar selection:bg-indigo-500/20"
                            placeholder="<ShowPlanXML ...>"
                            value={executionPlan}
                            onChange={(e) => setExecutionPlan(e.target.value)}
                        />
                        <button
                            className="w-full py-4 bg-slate-900/50 border border-slate-800 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={analyzeManual}
                            disabled={!executionPlan.trim()}
                        >
                            Analyze Terminal Data
                        </button>
                    </div>
                </div>
            )}

            {analysis && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {/* AI Summary Section */}
                    <div className="bg-slate-900/40 border border-indigo-500/20 backdrop-blur-xl rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-indigo-950 rounded-2xl border border-indigo-500/30 flex items-center justify-center text-3xl">🤖</div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-1">Intelligence Protocol</h3>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">AI Analysis <span className="text-indigo-400">Insight</span></h2>
                                </div>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <div className="space-y-4 text-indigo-200/90 leading-relaxed font-medium text-sm">
                                    {analysis.aiSummary.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black hover:text-indigo-400">$1</strong>') }}></p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'Total Cost', value: analysis.summary.cost.toFixed(2), icon: '📊', color: 'indigo' },
                            { label: 'Cached Size', value: `${analysis.summary.cachedPlanSize} KB`, icon: '💾', color: 'blue' },
                            { label: 'Compile CPU', value: `${analysis.summary.compileCPU} ms`, icon: '⚡', color: 'amber' },
                            { label: 'Compile RAM', value: `${analysis.summary.compileMemory} KB`, icon: '🧠', color: 'purple' },
                            { label: 'Max DOP', value: analysis.summary.degreeOfParallelism, icon: '🚀', color: 'emerald' }
                        ].map((stat, i) => (
                            <div key={i} className={`bg-slate-900/40 border border-slate-800/60 rounded-[1.8rem] p-5 group hover:border-indigo-500/30 transition-all`}>
                                <div className="text-xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{stat.icon}</div>
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className="text-2xl font-black text-white tracking-tighter">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations and Indexes */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5 space-y-6">
                            <header className="flex items-center gap-2 px-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actionable Protocol</h3>
                            </header>
                            <div className="space-y-4">
                                {analysis.recommendations.map((rec, idx) => (
                                    <div key={idx} className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 group hover:border-emerald-500/30 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${rec.type === 'Index' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : rec.type === 'Memory' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{rec.type}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-300 font-bold leading-relaxed">{rec.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-12 space-y-6">
                            {analysis.missingIndexes.map((idx, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-4 hover:border-red-500/30 transition-all group overflow-hidden relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">{idx.table}</h4>
                                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-1">Impact: {idx.impact.toFixed(1)}%</span>
                                        </div>
                                        <button onClick={() => navigator.clipboard.writeText(idx.createScript)} className="px-4 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] hover:bg-slate-700 hover:text-white transition-all shadow-xl">Copy Script</button>
                                    </div>
                                    <CodeBlock>{idx.createScript}</CodeBlock>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottlenecks Table */}
                    <div className="space-y-6">
                         <header className="flex items-center gap-2 px-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Computational Bottlenecks</h3>
                        </header>
                        <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2rem] overflow-hidden backdrop-blur-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-950/60 border-b border-slate-800">
                                            <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Operator Identity</th>
                                            <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Relative Cost</th>
                                            <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Anomaly Detection</th>
                                            <th className="p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Optimization Protocol</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {analysis.expensiveOperations.map((op, i) => (
                                            <tr key={i} className="hover:bg-slate-800/20 transition-colors group">
                                                <td className="p-5">
                                                    <span className="text-xs font-black text-white uppercase tracking-tighter italic group-hover:text-indigo-400 transition-colors">{op.op}</span>
                                                </td>
                                                <td className="p-5 border-x border-slate-800/50">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                       <div className="text-[10px] font-black text-white">{op.costPercent}%</div>
                                                       <div className="w-16 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50"><div className={`h-full ${parseFloat(op.costPercent) > 50 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${op.costPercent}%` }}></div></div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <div className={`text-[9px] font-bold tracking-tight px-3 py-1 rounded-xl bg-opacity-10 border ${op.issue.toLowerCase().includes('high') ? 'bg-red-500 text-red-300 border-red-500/20' : 'bg-indigo-500 text-indigo-300 border-indigo-500/20'}`}>{op.issue}</div>
                                                </td>
                                                <td className="p-5 text-[10px] text-slate-400 font-medium leading-relaxed italic truncate max-w-xs">{op.suggestion}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analyzer;
