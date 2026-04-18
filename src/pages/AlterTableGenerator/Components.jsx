import React from 'react';

export const InfoHeader = ({ title, subtitle, protocol }) => {
    const titleParts = title.split(' ');
    const mainTitle = titleParts.slice(0, -1).join(' ');
    const accentTitle = titleParts[titleParts.length - 1];

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6 text-left">
                <div className="text-left">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                        {mainTitle} <span className="text-violet-500">{accentTitle}</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic">{subtitle}</p>
                </div>
            </div>

            <div className="bg-violet-900/10 border-violet-500/10 backdrop-blur-md p-5 rounded-3xl flex items-center gap-5 max-w-xl text-left border-dashed border-2">
                <div className="w-8 h-8 rounded-2xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-violet-400 italic">!</span>
                </div>
                <p className="text-[11px] leading-relaxed text-violet-200/70 font-bold italic">
                    <span className="text-violet-400 uppercase tracking-widest block mb-1 text-[9px]">Schema Protocol</span>
                    {protocol}
                </p>
            </div>
        </div>
    );
};

export const OperationCard = ({ id, title, desc, color, active, onClick }) => {
    const colorMap = {
        indigo: "border-indigo-500/50 bg-indigo-500/5 text-indigo-400",
        emerald: "border-emerald-500/50 bg-emerald-500/5 text-emerald-400",
        amber: "border-amber-500/50 bg-amber-500/5 text-amber-400",
    };
    
    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-[1.5rem] border-2 text-left transition-all relative overflow-hidden group ${active ? colorMap[color] : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'}`}
        >
            <h3 className={`text-[10px] font-black uppercase mb-1 ${active ? '' : 'text-slate-500'}`}>{title}</h3>
            <p className="text-[7px] text-slate-600 uppercase font-black leading-tight tracking-[0.2em]">{desc}</p>
            {active && (
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${color}-500 shadow-[0_0_10px_rgba(var(--${color}-500-rgb),0.5)]`} />
            )}
        </button>
    );
};

export const StatBox = ({ label, value }) => (
    <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl backdrop-blur-sm text-left group hover:border-violet-500/30 transition-all">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-3 italic">{label}</p>
        <p className="text-2xl font-black text-slate-200 tracking-tighter group-hover:text-violet-400 transition-colors">{value}</p>
    </div>
);
