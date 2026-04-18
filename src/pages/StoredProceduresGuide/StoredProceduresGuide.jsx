import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';

// Sub-components
import Guide from './Guide';
import Terms from './Terms';
import Playground from './Playground';
import { spTerms } from './data';

const StoredProceduresGuide = () => {
    const [activeTab, setActiveTab] = useState('guide');
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeTab]);

    const tabs = [
        { id: 'guide', name: 'Strategic Guide', icon: '⚡', sub: 'Pre-Compiled Logic' },
        { id: 'terms', name: 'Terms Dictionary', icon: '📖', sub: 'Technical Schema' },
        { id: 'playground', name: 'Procedure Architect', icon: '🧪', sub: 'Logic Engineering' }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <SEO 
                title="SQL Stored Procedures Guide | Developer Suite" 
                description="Master SQL Server Stored Procedures, optimized execution plans, parameter sniffing, and transaction integrity. The ultimate guide for T-SQL logic encapsulation."
            />

            {/* Branded Header - Slim Edition */}
            <header className="relative p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 animate-pulse" />
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white text-xl shadow-xl transform -rotate-6 border border-emerald-400/30 relative z-10">
                                ⚡
                            </div>
                        </div>
                        
                        <div className="space-y-1 pr-12 text-left">
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic leading-none">
                                STORED <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 pr-2">PROCEDURES</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] italic leading-tight">
                                High-performance <span className="text-emerald-500/80">logic encapsulation</span> architecture protocol
                            </p>
                        </div>
                    </div>

                    {/* Compact Protocol Console */}
                    <div className="flex items-center gap-6 bg-slate-950/40 px-6 py-4 rounded-[1.8rem] border border-slate-800/40 backdrop-blur-md shadow-inner">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2 italic flex items-center gap-1.5 font-mono">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                Execution Status
                            </span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`w-1.5 h-4 rounded-sm skew-x-[-15deg] transition-all duration-500 ${i <= 5 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-800" />

                        <div className="flex flex-col text-left">
                            <div className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5 whitespace-nowrap font-mono">Reliability Grade</div>
                            <div className="flex items-baseline gap-0.5 leading-none">
                                <span className="text-xl font-black text-white tabular-nums">S</span>
                                <span className="text-xs font-black text-emerald-500">+</span>
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
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1 italic">Logic Hub</h3>
                            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                        </div>
                        
                        <div className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-emerald-600/10 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                                >
                                    <div className={`w-10 h-10 flex items-center justify-center text-xl bg-slate-950 rounded-xl border transition-all duration-500 ${activeTab === tab.id ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-800 group-hover:border-slate-700'}`}>
                                        {tab.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black uppercase tracking-widest leading-none">{tab.name}</div>
                                        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-emerald-400/60 transition-colors mt-1.5">{tab.sub}</div>
                                    </div>
                                    <AnimatePresence>
                                        {activeTab === tab.id && (
                                            <motion.div layoutId="spTabPill" className="absolute inset-0 border-2 border-emerald-500/20 rounded-2xl shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]" />
                                        )}
                                    </AnimatePresence>
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-800/50 px-2 pb-2">
                             <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/40 text-left">
                                 <div className="flex items-center gap-2 mb-3">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">Plan Cache Active</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight italic">Compiled &gt; Cached &gt; Executed</p>
                                 <p className="text-[8px] text-slate-600 font-medium uppercase tracking-widest mt-1">Audit Protocol V4</p>
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
                            {activeTab === 'terms' && <Terms terms={spTerms} />}
                            {activeTab === 'playground' && <Playground />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StoredProceduresGuide;
