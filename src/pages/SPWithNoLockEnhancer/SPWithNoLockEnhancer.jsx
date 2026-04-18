import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';

// Sub-components
import Guide from './Guide';
import Terms from './Terms';
import Analyzer from './Analyzer';
import { performanceTerms } from './data';

const PerformanceEnhancerMain = () => {
    const [activeTab, setActiveTab] = useState('guide');
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeTab]);

    const tabs = [
        { id: 'guide', name: 'Strategic Guide', icon: '⚡', sub: 'The Concurrency Tier' },
        { id: 'terms', name: 'Terms Dictionary', icon: '📖', sub: 'Optimization Vocabulary' },
        { id: 'playground', name: 'Performance Engine', icon: '🔍', sub: 'A.I. Architectural Audit' }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <SEO 
                title="SQL Performance Hub | Developer Suite" 
                description="Optimize Stored Procedures for high concurrency. Learn about NOLOCK, RCSI, SARGable queries, and architectural performance patterns."
            />

            {/* Branded Header - Slim Edition */}
            <header className="relative p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-visible">
                    <div className="flex items-center gap-6">
                        <div className="relative flex-shrink-0 text-left">
                            <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 animate-pulse" />
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white text-xl shadow-xl transform -rotate-6 border border-amber-400/30 relative z-10">
                                ⚡
                            </div>
                        </div>
                        
                        <div className="space-y-1 pr-12 text-left">
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic leading-none">
                                PERFORMANCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 pr-2">ENGINE</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] italic leading-tight">
                                Industrial grade <span className="text-amber-500/80">query optimization</span> and audit protocol
                            </p>
                        </div>
                    </div>

                    {/* Compact Protocol Console */}
                    <div className="flex items-center gap-6 bg-slate-950/40 px-6 py-4 rounded-[1.8rem] border border-slate-800/40 backdrop-blur-md shadow-inner">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-2 italic flex items-center gap-1.5 font-mono">
                                <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                Efficiency Active
                            </span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`w-1.5 h-4 rounded-sm skew-x-[-15deg] transition-all duration-500 ${i <= 6 ? 'bg-amber-500' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-800" />

                        <div className="flex flex-col text-left">
                            <div className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5 whitespace-nowrap font-mono">Optimization Grade</div>
                            <div className="flex items-baseline gap-0.5 leading-none">
                                <span className="text-xl font-black text-white tabular-nums">S</span>
                                <span className="text-xs font-black text-amber-500">+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                {/* Sticky Navigation Sidebar */}
                <div className="lg:w-80 w-full flex-shrink-0 lg:sticky lg:top-24 z-20">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 shadow-2xl space-y-2">
                        <div className="px-4 py-3 pb-5 text-left">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1 italic">Optimizer Hub</h3>
                            <div className="w-8 h-1 bg-amber-500 rounded-full" />
                        </div>
                        
                        <div className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-amber-600/10 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                                >
                                    <div className={`w-10 h-10 flex items-center justify-center text-xl bg-slate-950 rounded-xl border transition-all duration-500 ${activeTab === tab.id ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-800 group-hover:border-slate-700'}`}>
                                        {tab.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black uppercase tracking-widest leading-none text-left">{tab.name}</div>
                                        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-amber-400/60 transition-colors mt-1.5 text-left">{tab.sub}</div>
                                    </div>
                                    <AnimatePresence>
                                        {activeTab === tab.id && (
                                            <motion.div layoutId="perfTabPill" className="absolute inset-0 border-2 border-amber-500/20 rounded-2xl shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]" />
                                        )}
                                    </AnimatePresence>
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-800/50 px-2 pb-2">
                             <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/40 text-left">
                                 <div className="flex items-center gap-2 mb-3 text-left">
                                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">SARGability Scan V12</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight italic">Scan &gt; Identify &gt; Accelerate</p>
                                 <p className="text-[8px] text-slate-600 font-medium uppercase tracking-widest mt-1">Audit Protocol V9</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div 
                    ref={contentRef}
                    className="flex-grow w-full bg-slate-900 border border-slate-800 rounded-[3.5rem] p-8 md:p-12 shadow-2xl min-h-[700px] overflow-hidden scroll-mt-24"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'guide' && <Guide />}
                            {activeTab === 'terms' && <Terms terms={performanceTerms} />}
                            {activeTab === 'playground' && <Analyzer />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PerformanceEnhancerMain;
