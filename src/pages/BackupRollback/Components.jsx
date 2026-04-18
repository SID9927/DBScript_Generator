import React, { useState } from 'react';

export const StatCard = ({ label, value, icon, color = "emerald" }) => {
    const colorMap = {
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    };
    return (
        <div className={`p-4 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${colorMap[color]}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">{label}</span>
                <span className="text-sm">{icon}</span>
            </div>
            <div className="text-xl font-black tracking-tighter italic">{value}</div>
        </div>
    );
};

export const CodeEditor = ({ value, label, color = "emerald", onCopy, copied }) => {
    const colors = {
        emerald: "text-emerald-400 border-emerald-500/30",
        amber: "text-amber-500/80 border-amber-500/30",
    };
    return (
        <div className="space-y-3 text-left">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{label}</h3>
                </div>
                <button
                    onClick={onCopy}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${copied ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-950/50 text-slate-500 border-slate-800 hover:text-white hover:border-slate-700'}`}
                >
                    {copied ? 'Captured' : 'Copy Payload'}
                </button>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-[2rem] overflow-hidden group backdrop-blur-xl group-hover:border-slate-700 transition-all">
                <textarea
                    className={`w-full h-80 p-6 bg-transparent ${colors[color]} font-mono text-[13px] focus:outline-none resize-none leading-relaxed custom-scrollbar`}
                    value={value}
                    readOnly
                />
            </div>
        </div>
    );
};

export const InfoHeader = ({ type, title, subtitle, protocol }) => {
    const titleParts = title.split(' ');
    const mainTitle = titleParts.slice(0, -1).join(' ');
    const accentTitle = titleParts[titleParts.length - 1];

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                        {mainTitle} <span className="text-emerald-500">{accentTitle}</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic">{subtitle}</p>
                </div>
            </div>

            <div className="bg-emerald-900/10 border-emerald-500/10 backdrop-blur-md p-5 rounded-3xl flex items-center gap-5 max-w-xl text-left border-dashed border-2">
                <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-emerald-400 italic">!</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-200/70 font-bold italic">
                    <span className="text-emerald-400 uppercase tracking-widest block mb-1 text-[9px]">Data Protocol</span>
                    {protocol}
                </p>
            </div>
        </div>
    );
};
