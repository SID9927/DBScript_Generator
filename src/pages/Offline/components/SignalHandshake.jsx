import React from 'react';
import { motion } from 'framer-motion';

const SignalHandshake = () => {
    return (
        <div className="w-60 bg-slate-950/90 border border-slate-800 p-4 rounded-[1.8rem] h-full flex flex-col justify-between items-center relative overflow-hidden">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest relative z-10">Uplink Handshake</span>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <svg width="100%" height="40" viewBox="0 0 200 40" className="text-emerald-500">
                    <motion.path
                        d="M 0 20 L 20 20 L 25 10 L 30 30 L 35 20 L 60 20 L 70 5 L 80 35 L 90 20 L 120 20 L 130 15 L 140 25 L 150 20 L 200 20"
                        fill="none" stroke="currentColor" strokeWidth="1.5"
                        initial={{ pathLength: 0, strokeDasharray: "10 5" }}
                        animate={{ pathLength: [0, 1, 0], strokeDashoffset: [0, 100] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.path
                        d="M 0 20 L 20 20 L 25 10 L 30 30 L 35 20 L 60 20 L 70 5 L 80 35 L 90 20 L 120 20 L 130 15 L 140 25 L 150 20 L 200 20"
                        fill="none" stroke="currentColor" strokeWidth="1"
                        className="opacity-50 blur-[1px]"
                        animate={{ strokeDashoffset: [100, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
            </div>

            <div className="flex items-center gap-2 relative z-10 mb-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Syncing...</span>
            </div>
        </div>
    );
};

export default SignalHandshake;
