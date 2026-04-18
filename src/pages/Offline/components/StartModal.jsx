import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StartModal = ({ onStart }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] text-center max-w-sm shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full -mt-20" />
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner text-indigo-500 font-mono italic">📡</div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">SIGNAL_LOST</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed italic">
                        Uplink failure detected. Play the recovery game to rebuild your data shards and stabilize the connection.
                    </p>
                    <button onClick={onStart} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-xl shadow-indigo-900/40 active:scale-95 transition-all">
                        Play Recovery Game
                    </button>
                    <button onClick={() => window.location.reload()} className="w-full py-3 mt-4 text-[9px] text-slate-700 font-bold uppercase tracking-widest hover:text-slate-500 transition-colors">
                        Retry Connection
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StartModal;
