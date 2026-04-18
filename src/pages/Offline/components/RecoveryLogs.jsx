import React from 'react';
import { motion } from 'framer-motion';

const RecoveryLogs = ({ logs }) => {
    return (
        <div className="flex-grow bg-slate-950/90 border border-slate-800/80 px-6 py-4 rounded-[1.8rem] text-left h-full overflow-hidden relative shadow-inner">
            <div className="absolute top-4 right-6 text-[7px] font-black text-green-500 uppercase tracking-widest italic">Live Rebuild Logs</div>
            <div className="flex flex-col-reverse h-full">
                {logs.map((l, i) => (
                    <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 0.5 }} key={i} className={`text-[8px] mb-1 font-bold ${i === 0 ? 'text-green-500 opacity-100' : 'text-slate-600 opacity-20'}`}>
                        <span className="mr-2">{'>'}</span> {l}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecoveryLogs;
