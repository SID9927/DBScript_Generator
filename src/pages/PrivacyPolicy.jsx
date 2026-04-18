import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const PolicySection = ({ title, children, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 shadow-xl relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-4">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-mono">0{index + 1}</span>
            {title}
        </h2>
        <div className="text-slate-400 leading-relaxed space-y-4 text-sm font-medium">
            {children}
        </div>
    </motion.div>
);

const PrivacyPolicy = () => {
    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 min-h-screen">
            <SEO title="Privacy Policy | Developer Suite" description="Advanced privacy protocol regarding client-side processing and data handling." />

            {/* Branded Header - Left Aligned Console Edition */}
            <header className="relative p-6 md:p-8 bg-slate-900 rounded-[3rem] overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6 text-left">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse" />
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl transform -rotate-6 border border-indigo-400/30 relative z-10">
                                🛡️
                            </div>
                        </div>
                        
                        <div className="space-y-1 pr-12 flex-shrink-0">
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                                PRIVACY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">PROTOCOL</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[8px] italic leading-tight">
                                System Integrity <span className="text-indigo-500/80">& Data Sovereignty</span>
                            </p>
                        </div>
                    </div>

                    {/* Specialized Privacy / Sandbox Console */}
                    <div className="flex items-center gap-6 bg-slate-950/40 px-6 py-4 rounded-[1.8rem] border border-white/5 backdrop-blur-md shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 border border-indigo-500/5 rounded-[1.8rem] animate-radar" />
                        
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-2 italic flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                Sandbox Security
                            </span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`w-1.5 h-3.5 rounded-sm skew-x-[-15deg] transition-all duration-500 ${i <= 6 ? 'bg-indigo-500/80 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-800" />

                        <div className="flex flex-col text-left min-w-[80px]">
                            <div className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 whitespace-nowrap">Local Encrypt</div>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-0.5">
                                    <div className="w-8 h-1 bg-indigo-500/20 rounded-full overflow-hidden">
                                        <motion.div animate={{ x: [-32, 32] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-full h-full bg-indigo-500" />
                                    </div>
                                    <div className="font-mono text-[8px] text-indigo-400/60 leading-none tracking-tighter uppercase font-black">ACTIVE.014</div>
                                </div>
                                <div className="text-lg">🔒</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Core Privacy Guarantee Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group"
            >
                <div className="absolute inset-0 border-2 border-indigo-500/5 rounded-[3rem] animate-radar" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic leading-none">Local-First Assurance</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase italic">Your Data Stays <span className="text-indigo-400">Locked</span> In Your Browser.</h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            The fundamental architecture of this suite is built on **Client-Side Processing**. We never transmit your database schema, table names, or generated SQL scripts to external servers. Your engineering workflow is entirely contained within your browser's local sandbox.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Zero Uplink", sub: "No Script Uploads" },
                            { label: "Sandbox Mode", sub: "Browser-Only RAM" },
                            { label: "AES Static", sub: "Local Persistence" },
                            { label: "Cluster Safe", sub: "Identity Protected" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-950/40 p-6 rounded-2xl border border-white/5">
                                <p className="text-sm font-black text-white tabular-nums tracking-tighter leading-none mb-2">{stat.label}</p>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] italic">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Policy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PolicySection title="Data Collection" index={0}>
                    <p>We collect minimal information only when you explicitly provide it:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span><strong className="text-slate-200">Contact Clusters:</strong> Information provided via contact forms is used solely to respond to your technical inquiries.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span><strong className="text-slate-200">Auth Identity:</strong> If you use Cloud Sync, your email is stored securely via Firebase to link your cross-device buffer.</span>
                        </li>
                    </ul>
                </PolicySection>

                <PolicySection title="Browser Persistence" index={1}>
                    <p>This suite utilizes <strong>Local Storage</strong> and <strong>Session Buffers</strong> to enhance the developer experience without server interaction:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Remembers your naming conventions, prefixes, and suffixes.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Maintains active script buffers during tab switches.</span>
                        </li>
                    </ul>
                </PolicySection>

                <PolicySection title="Cloud Synchronization" index={2}>
                    <p>When using the <strong>Cloud Sync (Sync Gateway)</strong> tool:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Data is encrypted at rest within the Firebase cluster.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>Synchronized content is only accessible via your verified developer identity.</span>
                        </li>
                    </ul>
                </PolicySection>

                <PolicySection title="External Links" index={3}>
                    <p>This platform may contain links to external engineering resources:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-indigo-500 mt-1">▹</span>
                            <span>We are not responsible for the privacy protocols of third-party domains (e.g., Microsoft Learn, SQL Documentation).</span>
                        </li>
                    </ul>
                </PolicySection>
            </div>

            {/* Footer Contact Note */}
            <footer className="text-center py-10">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-4">Encryption & Trust Protocol v{new Date().getFullYear()}.04</p>
                <div className="w-20 h-1 bg-indigo-500/20 mx-auto rounded-full" />
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
