import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';

// Sub-components
import Guide from './Guide';
import Terms from './Terms';
import Analyzer from './Analyzer';
import { executionPlanTerms } from './data';

const ExecutionPlanGuide = () => {
    const [activeTab, setActiveTab] = useState('guide');
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeTab]);

    const tabs = [
        { id: 'guide', name: 'Basics Guide', icon: '📖', sub: 'Core Principles' },
        { id: 'terms', name: 'Terms Dictionary', icon: '🧠', sub: 'Operator Logic' },
        { id: 'analyzer', name: 'Plan Analyzer', icon: '🚀', sub: 'Interactive Scan' }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <SEO 
                title="SQL Execution Plan Analyzer | Developer Suite" 
                description="Modern Execution Plan analyzer and dictionary for SQL Server optimization. High-fidelity insights and operator guides."
            />

            {/* Branded Header - Compact Edition */}
            <header className="relative p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse" />
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white text-xl shadow-xl transform -rotate-6 border border-indigo-400/30 relative z-10">
                                📊
                            </div>
                        </div>
                        
                        <div className="space-y-1 pr-12 flex-shrink-0 text-left">
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-normal uppercase italic leading-none">
                                SQL EXECUTION <span className="text-transparent pr-2 bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">PLAN</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] italic leading-tight">
                                High-fidelity <span className="text-indigo-500/80">bottleneck detection</span> protocol
                            </p>
                        </div>
                    </div>

                    {/* Compact Protocol Console */}
                    <div className="flex items-center gap-6 bg-slate-950/40 px-6 py-4 rounded-[1.8rem] border border-slate-800/40 backdrop-blur-md shadow-inner">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-2 italic flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                                Protocol
                            </span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`w-1.5 h-4 rounded-sm skew-x-[-15deg] transition-all duration-500 ${i <= 4 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-800" />

                        <div className="flex flex-col text-left">
                            <div className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5 whitespace-nowrap">System Integrity</div>
                            <div className="flex items-baseline gap-0.5 leading-none">
                                <span className="text-xl font-black text-white tabular-nums">100</span>
                                <span className="text-xs font-black text-indigo-500">%</span>
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
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Navigation Console</h3>
                            <div className="w-8 h-1 bg-indigo-500 rounded-full" />
                        </div>
                        
                        <div className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-indigo-600/10 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                                >
                                    <div className={`w-10 h-10 flex items-center justify-center text-xl bg-slate-950 rounded-xl border transition-all duration-500 ${activeTab === tab.id ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-slate-800 group-hover:border-slate-700'}`}>
                                        {tab.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black uppercase tracking-widest">{tab.name}</div>
                                        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-indigo-400/60 transition-colors">{tab.sub}</div>
                                    </div>
                                    <AnimatePresence>
                                        {activeTab === tab.id && (
                                            <motion.div layoutId="activeTabPill" className="absolute inset-0 border-2 border-indigo-500/20 rounded-2xl shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]" />
                                        )}
                                    </AnimatePresence>
                                </button>
                            ))}
                        </div>
                        
                        {/* Live Session Status */}
                        <div className="mt-4 pt-4 border-t border-slate-800/50 px-2 pb-2">
                             <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/40 text-left">
                                 <div className="flex items-center gap-2 mb-3">
                                     <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                                     </div>
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live Session</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight italic">Identity Protected</p>
                                 <p className="text-[8px] text-slate-600 font-medium uppercase tracking-widest mt-1">100% Client-Side Execution</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div 
                    ref={contentRef}
                    className="flex-grow w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[700px] scroll-mt-24"
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
                            {activeTab === 'terms' && <Terms terms={executionPlanTerms} />}
                            {activeTab === 'analyzer' && <Analyzer />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ExecutionPlanGuide;
