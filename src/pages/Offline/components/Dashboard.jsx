import React from 'react';

const Dashboard = ({ level, restoredCount, onReset, onExit, bufferCount }) => {
    return (
        <div className="bg-slate-900/90 border border-slate-700/50 px-8 py-5 rounded-[2.5rem] flex items-center justify-between backdrop-blur-xl shadow-2xl flex-shrink-0">
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                    <img src="/logoDB.png" alt="DB Logo" className="w-12 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex flex-col text-left">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Status</span>
                    <span className="text-[10px] font-black text-indigo-400 uppercase italic leading-none animate-pulse">Running</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex flex-col text-left">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Level</span>
                    <span className="text-sm font-black text-white italic leading-none">{level}</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex flex-col text-left">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Buffer Load</span>
                    <span className={`text-sm font-black tabular-nums leading-none ${bufferCount >= 6 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
                        {bufferCount}/8
                    </span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex flex-col text-left">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">Shards</span>
                    <span className="text-sm font-black text-white tabular-nums leading-none">{restoredCount}</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={onReset} className="px-4 py-2 bg-slate-950 border border-slate-800 text-[8px] font-black text-slate-600 uppercase rounded-xl hover:text-indigo-400 hover:border-indigo-500/30 transition-all">Restart</button>
                <button onClick={onExit} className="px-4 py-2 bg-slate-950 border border-slate-800 text-[8px] font-black text-slate-600 uppercase rounded-xl hover:text-white transition-all">Exit</button>
            </div>
        </div>
    );
};

export default Dashboard;
