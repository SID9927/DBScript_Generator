import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InfoHeader = ({ title, subtitle, protocol }) => {
    const titleParts = title.split(' ');
    const mainTitle = titleParts.slice(0, -1).join(' ');
    const accentTitle = titleParts[titleParts.length - 1];

    return (
        <header className="relative p-6 md:p-8 bg-slate-900 rounded-[3rem] overflow-hidden group shadow-2xl mb-10">
            {/* Background Effects - More subtle indigo/violet glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-600/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-10 animate-pulse" />
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-slate-800 rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl transform -rotate-12 border border-indigo-400/20 relative z-10 group-hover:rotate-0 transition-transform duration-500">
                             🔧
                        </div>
                    </div>
                    
                    <div className="space-y-2 pr-12 flex-shrink-0 text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {mainTitle} <span className="text-transparent pr-2 bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">{accentTitle}</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] italic leading-tight">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Compact Protocol Console - Refined Sky/Indigo scheme */}
                <div className="flex items-center gap-8 bg-slate-950/60 px-8 py-5 rounded-[2.2rem] border border-white/5 backdrop-blur-xl shadow-inner relative overflow-hidden group/console">
                    <div className="absolute inset-0 border border-indigo-500/5 rounded-[2.2rem] animate-radar" />
                    
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 italic flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Diagnostic Link
                        </span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={`w-2 h-5 rounded-sm skew-x-[-20deg] transition-all duration-700 ${i <= 5 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-slate-800'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="w-px h-10 bg-slate-800" />

                    <div className="flex flex-col text-left">
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 whitespace-nowrap leading-none">System Load</div>
                        <div className="flex items-baseline gap-0.5 leading-none">
                            <span className="text-2xl font-black text-white tabular-nums tracking-tighter">04</span>
                            <span className="text-xs font-black text-indigo-400">ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export const ToolTabButton = ({ active, icon, label, sub, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full group relative flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 ${
            active 
            ? 'bg-indigo-600/10 text-white shadow-lg' 
            : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
        }`}
    >
        <div className={`w-10 h-10 flex items-center justify-center text-lg bg-slate-950/80 rounded-xl border transition-all duration-500 shrink-0 ${
            active 
            ? 'border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)] text-indigo-400' 
            : 'border-slate-800 group-hover:border-slate-700'
        }`}>
            {icon}
        </div>
        <div className="text-left font-sans">
            <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{label}</div>
            <div className={`text-[8px] font-bold uppercase tracking-[0.15em] transition-colors leading-none ${active ? 'text-indigo-400/80' : 'text-slate-600 group-hover:text-indigo-400/40'}`}>
                {sub}
            </div>
        </div>
        <AnimatePresence>
            {active && (
                <motion.div layoutId="activeTabPill" className="absolute inset-0 border border-indigo-500/20 rounded-2xl bg-indigo-500/[0.02]" />
            )}
        </AnimatePresence>
    </button>
);

export const ActionButton = ({ onClick, children, active, className }) => (
    <button
        onClick={onClick}
        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            active 
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' 
            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
        } ${className}`}
    >
        {children}
    </button>
);

export const ResultCard = ({ label, value, color = "indigo", copy }) => (
    <div className={`p-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-md relative group hover:border-${color}-500/20 transition-all text-left`}>
        <div className="flex items-center justify-between mb-3 text-left">
            <p className={`text-[9px] font-black text-${color}-500/60 uppercase tracking-widest italic leading-none`}>{label}</p>
            {copy && (
                <button onClick={() => copy(value)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] bg-slate-950 px-2 py-1 rounded-md text-slate-500 hover:text-slate-300 uppercase font-black border border-slate-800">Copy</button>
            )}
        </div>
        <p className="text-xl font-black text-slate-100 tracking-tighter break-all">{value}</p>
    </div>
);

export const DualEditor = ({ input, setInput, output, error, onReset, onCopy, copied, inputPlaceholder = "Paste payload raw...", outputPlaceholder = "Result stream..." }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-grow">
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-3 text-left">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Transmission Buffer</span>
                <button onClick={onReset} className="text-[9px] font-black text-slate-600 hover:text-red-500 uppercase transition-colors">Clear</button>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={inputPlaceholder} 
                className="flex-grow min-h-[550px] bg-black/40 border border-slate-800 rounded-[2.5rem] p-10 text-indigo-300/80 font-mono text-[11px] focus:border-indigo-500/30 transition-all custom-scrollbar outline-none resize-none leading-relaxed shadow-inner" />
        </div>
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-3 text-left">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Processed Payload</span>
                <button onClick={() => onCopy(output)} className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase transition-colors">{copied ? 'Captured' : 'Capture'}</button>
            </div>
            <div className="flex-grow relative group overflow-hidden bg-slate-950/60 border border-slate-800/80 rounded-[2.5rem] shadow-inner">
                <textarea readOnly value={error || output} placeholder={outputPlaceholder} 
                    className={`w-full h-full p-10 bg-transparent font-mono text-[11px] focus:outline-none resize-none leading-relaxed custom-scrollbar ${error ? 'text-red-400' : 'text-emerald-400/80'}`} />
            </div>
        </div>
    </div>
);
