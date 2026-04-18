import React, { useState } from 'react';

export const CompactSelect = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className="relative space-y-1 text-left">
            {label && (
                <label className="text-[8px] font-black text-slate-500 tracking-[0.3em] mb-1 px-1 block italic leading-none uppercase">
                    {label}
                </label>
            )}
            
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] font-bold text-indigo-400 tracking-tight transition-all hover:border-indigo-500/40 text-left flex items-center justify-between group"
                >
                    <span className="truncate">{activeOption.label}</span>
                    <svg 
                        className={`w-3 h-3 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full left-0 w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl backdrop-blur-xl z-[70] animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-[9px] font-bold transition-all border-b border-slate-800/50 last:border-0 ${
                                            value === opt.value 
                                                ? 'bg-indigo-600/10 text-white' 
                                                : 'text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const ToggleSwitch = ({ active, onClick, label, sub }) => (
    <button 
        onClick={onClick}
        className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}
    >
        <div className="space-y-0.5">
            <div className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>{label}</div>
            <p className="text-[7px] font-bold text-slate-700 uppercase tracking-widest leading-none italic">{sub}</p>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-800'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${active ? 'left-[18px]' : 'left-0.5'}`} />
        </div>
    </button>
);
