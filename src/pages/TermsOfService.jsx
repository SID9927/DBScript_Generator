import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ClauseSection = ({ title, children, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 shadow-xl relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-4">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-mono">§{index + 1}</span>
            {title}
        </h2>
        <div className="text-slate-400 leading-relaxed space-y-4 text-sm font-medium">
            {children}
        </div>
    </motion.div>
);

const TermsOfService = () => {
    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 min-h-screen">
            <SEO title="Terms of Service | Developer Suite" description="Operational guidelines and liability limitations for the SQL Server Developer Suite." />

            {/* Branded Header - Left Aligned Console Edition */}
            <header className="relative p-6 md:p-8 bg-slate-900 rounded-[3rem] overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6 text-left">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse" />
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl transform -rotate-6 border border-indigo-400/30 relative z-10">
                                📜
                            </div>
                        </div>
                        
                        <div className="space-y-1 pr-12 flex-shrink-0">
                            <h1 className="text-2xl md:text-3xl  font-black text-white tracking-tighter uppercase italic leading-none">
                                TERMS OF <span className="text-transparent pr-2 bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">SERVICE</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[8px] italic leading-tight">
                                User License <span className="text-indigo-500/80">& Operational Guidelines</span>
                            </p>
                        </div>
                    </div>

                    {/* Operational Console */}
                    <div className="flex items-center gap-6 bg-slate-950/40 px-6 py-4 rounded-[1.8rem] border border-white/5 backdrop-blur-md shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 border border-indigo-500/5 rounded-[1.8rem] animate-radar" />
                        
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-2 italic flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                Legal Compliance
                            </span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`w-1.5 h-3.5 rounded-sm skew-x-[-15deg] transition-all duration-500 opacity-60 ${i <= 6 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-800" />

                        <div className="flex flex-col text-left">
                            <div className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5 whitespace-nowrap">Status</div>
                            <div className="flex items-center gap-1.5 leading-none">
                                <span className="text-base font-black text-emerald-400 tabular-nums tracking-tighter">BINDING</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Risk Disclosure / Disclaimer Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-600/5 border border-rose-500/20 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-opacity opacity-50 group-hover:opacity-100" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)] animate-pulse" />
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest italic leading-none">Operational Risk Protocol</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase italic">Always <span className="text-rose-500">Verify</span> Before Execution.</h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Scripts generated by this suite are provided for productivity purposes only. You are solely responsible for verifying the integrity of any generated code in a **non-production** environment before deployment. The platform carries no liability for data corruption or system downtime.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "AS-IS BASIS", sub: "No Warranty Included" },
                            { label: "ZERO LIABILITY", sub: "No Consequential Damage" },
                            { label: "USER PROXY", sub: "Final Execution Role" },
                            { label: "TEST FIRST", sub: "Required Protocol" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-950/60 p-6 rounded-2xl border border-rose-500/10">
                                <p className="text-sm font-black text-white tabular-nums tracking-tighter leading-none mb-2">{stat.label}</p>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] italic">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Terms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ClauseSection title="Code Use License" index={0}>
                    <p>By utilizing this suite, you are granted a non-exclusive license to use the generated patterns under these conditions:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>The generated scripts may be used for personal or commercial projects.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>You may not redistribute the core logic engine of this platform as a separate product.</span>
                        </li>
                    </ul>
                </ClauseSection>

                <ClauseSection title="Technical Accuracy" index={1}>
                    <p>While we strive for perfect script generation, SQL Server environments vary significantly:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>We do not guarantee that every generated script will be compatible with your specific SQL Server version or collation.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Users must provide accurate table and column metadata to ensure correct DDL generation.</span>
                        </li>
                    </ul>
                </ClauseSection>

                <ClauseSection title="Intellectual Property" index={2}>
                    <p>This platform and its proprietary styling are part of a private developer suite:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>All UI components, design systems, and logic flows are the property of the platform developers.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Source code for the platform itself is not open for redistribution.</span>
                        </li>
                    </ul>
                </ClauseSection>

                <ClauseSection title="Operational Changes" index={3}>
                    <p>We reserve the right to evolve the platform protocols:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Terms may be updated to reflect new tools or regulatory requirements.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Continued use of the Synchronous Cluster implies acceptance of updated terms.</span>
                        </li>
                    </ul>
                </ClauseSection>
            </div>

            {/* Footer Compliance Note */}
            <footer className="text-center py-10">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-4">Legal Compliance Cluster v{new Date().getFullYear()}.04</p>
                <div className="w-20 h-1 bg-indigo-500/20 mx-auto rounded-full" />
            </footer>
        </div>
    );
};

export default TermsOfService;
