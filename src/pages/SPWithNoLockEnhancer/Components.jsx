import React, { useState } from 'react';

export const CodeBlock = ({ children }) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <div className="relative group/code my-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover/code:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2 font-mono"
                    >
                        {copied ? (
                            <>
                                <span className="text-emerald-500">Copied</span>
                                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </>
                        ) : (
                            <>
                                <span>Copy Payload</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                            </>
                        )}
                    </button>
                </div>
                <pre className="p-6 text-[13px] md:text-sm font-mono leading-relaxed overflow-x-auto custom-scrollbar">
                    <code className="text-amber-200">{children}</code>
                </pre>
            </div>
        </div>
    );
};

export const InfoCard = ({ type = "info", children }) => {
    const styles = {
        info: "bg-sky-500/10 border-sky-500/20 text-sky-400",
        success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        danger: "bg-red-500/10 border-red-500/20 text-red-400",
    };
    
    return (
        <div className={`p-6 rounded-[2rem] border-2 border-dashed ${styles[type]} backdrop-blur-sm relative overflow-hidden group text-left`}>
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                    {type === 'info' && '💎'}
                    {type === 'success' && '✨'}
                    {type === 'warning' && '⚡'}
                    {type === 'danger' && '🔥'}
                </div>
                <div className="text-[11px] font-bold tracking-tight leading-relaxed uppercase italic opacity-90">{children}</div>
            </div>
        </div>
    );
};
