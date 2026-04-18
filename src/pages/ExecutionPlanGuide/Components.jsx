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
        <div className="relative my-4">
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-slate-700/50 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-600 transition-colors backdrop-blur-sm border border-slate-600/30"
            >
                {copied ? "✅ Copied" : "Copy"}
            </button>
            <pre className="bg-slate-950 text-indigo-300/80 p-6 rounded-2xl overflow-x-auto text-xs border border-slate-800 shadow-inner selection:bg-indigo-500/20">
                <code>{children}</code>
            </pre>
        </div>
    );
};

export const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-black text-white mt-12 mb-6 tracking-tighter uppercase italic flex items-center gap-3">
        <span className="w-8 h-px bg-indigo-500/30" />
        {children}
    </h2>
);

export const SubSectionTitle = ({ children }) => (
    <h3 className="text-lg font-black text-slate-300 mt-8 mb-4 tracking-tight uppercase">
        {children}
    </h3>
);

export const InfoCard = ({ type = "info", children }) => {
    const styles = {
        info: "bg-indigo-900/10 border-indigo-500/20 text-indigo-200",
        success: "bg-emerald-900/10 border-emerald-500/20 text-emerald-200",
        warning: "bg-amber-900/10 border-amber-500/20 text-amber-200",
        danger: "bg-red-900/10 border-red-500/20 text-red-200",
    };
    return (
        <div className={`p-6 my-6 rounded-[2rem] border backdrop-blur-sm ${styles[type]}`}>
            {children}
        </div>
    );
};
