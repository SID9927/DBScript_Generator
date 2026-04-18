import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCard, CodeEditor, InfoHeader } from './Components';
import { IconRefresh } from '../../components/Icons';

const BackupOrchestrator = ({ type, title, subtitle, protocol, generateBackup, generateRollback }) => {
    const [name, setName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [defaultSuffix, setDefaultSuffix] = useState('');
    const [mode, setMode] = useState('single');
    const [bulkInput, setBulkInput] = useState('');
    const [backupScript, setBackupScript] = useState('');
    const [rollbackScript, setRollbackScript] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState({ backup: false, rollback: false });

    useEffect(() => {
        const today = new Date();
        const formatted = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;
        setDefaultSuffix(`bkup${formatted}`);
    }, []);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const actualSuffix = suffix.trim() || defaultSuffix;
            let backups = [];
            let rollbacks = [];

            const entities = mode === 'single' ? [name] : bulkInput.split('\n').map(l => l.trim()).filter(l => l);
            
            entities.forEach(entity => {
                const bName = `${entity}_${actualSuffix}`;
                backups.push(generateBackup(entity, bName));
                rollbacks.push(generateRollback(entity, bName));
            });

            setBackupScript(backups.join('\n\n').trim());
            setRollbackScript(rollbacks.join('\n\n').trim());
            setIsGenerating(false);
        }, 400);
    };

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied({ ...copied, [key]: true });
            setTimeout(() => setCopied({ ...copied, [key]: false }), 2000);
        });
    };

    const clearAll = () => {
        setName(''); setSuffix(''); setBulkInput(''); setBackupScript(''); setRollbackScript('');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <InfoHeader type={type} title={title} subtitle={subtitle} protocol={protocol} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Controls */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 text-left">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        
                        <div className="flex p-1 bg-slate-950/50 border border-slate-800 rounded-2xl mb-8">
                            {['single', 'bulk'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${mode === m ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {m === 'single' ? `Single ${type}` : `Bulk ${type}`}
                                    {mode === m && <motion.div layoutId="modePill" className="absolute inset-0 bg-emerald-600/10 border border-emerald-500/20 rounded-xl -z-10" />}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                {mode === 'single' ? (
                                    <motion.div key="s" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Source Identity</label>
                                        <input
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-emerald-400 font-bold text-sm focus:border-emerald-500/30 transition-all font-mono"
                                            placeholder="USP_SystemLogic" value={name} onChange={e => setName(e.target.value)}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div key="b" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Entity Cluster (Line separated)</label>
                                        <textarea
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-emerald-400 font-bold text-xs h-48 resize-none focus:border-emerald-500/30 transition-all font-mono custom-scrollbar"
                                            placeholder="Entity_01\nEntity_02" value={bulkInput} onChange={e => setBulkInput(e.target.value)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Versioning Suffix</label>
                                <input
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-slate-400 font-bold text-sm focus:border-emerald-500/30 transition-all"
                                    placeholder={`Auto: ${defaultSuffix}`} value={suffix} onChange={e => setSuffix(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || (mode === 'single' ? !name : !bulkInput.trim())}
                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isGenerating ? 'Compiling Registry...' : '🚀 Initialize Recovery'}
                                </button>
                                {(backupScript || rollbackScript) && (
                                    <button onClick={clearAll} className="w-14 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-2xl flex items-center justify-center transition-all group border border-slate-700">
                                        <IconRefresh className="w-5 h-5 transition-transform group-hover:rotate-[-180deg]" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-800/50 space-y-3 opacity-60">
                             <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-600">
                                <span>Registry Node</span>
                                <span className="text-emerald-500 font-mono truncate max-w-[120px]">{name || 'Null'}</span>
                             </div>
                             <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-600">
                                <span>Suffix Identity</span>
                                <span className="text-emerald-500 font-mono">{suffix || defaultSuffix}</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence mode="wait">
                        {backupScript || rollbackScript ? (
                            <motion.div key="output" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-6">
                                    <StatCard label="Cluster Count" value={mode === 'single' ? 1 : bulkInput.split('\n').filter(l => l.trim()).length} icon="📦" />
                                    <StatCard label="Total Payload" value={`${backupScript.split('\n').length + rollbackScript.split('\n').length} Lines`} icon="📜" />
                                    <StatCard label="Safety Gates" value={((backupScript.match(/IF EXISTS/g) || []).length + (rollbackScript.match(/IF EXISTS/g) || []).length)} icon="🛡️" />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                    <CodeEditor value={backupScript} label="Safety Backup Payload" onCopy={() => copyToClipboard(backupScript, 'backup')} copied={copied.backup} />
                                    <CodeEditor value={rollbackScript} label="Rollback Sequence" color="amber" onCopy={() => copyToClipboard(rollbackScript, 'rollback')} copied={copied.rollback} />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[600px] flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800/40 rounded-[3rem] text-center space-y-8 group hover:border-emerald-500/20 transition-all">
                                <div className="w-24 h-24 bg-slate-900/40 rounded-[2.5rem] flex items-center justify-center text-slate-700 border-2 border-slate-800 relative transition-all group-hover:border-emerald-500/40 shadow-2xl">
                                    {/* Radar Waves - Expanding Outwards */}
                                    <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-[2.5rem] animate-radar" />
                                    <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-[2.5rem] animate-radar [animation-delay:1s]" />
                                    <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-[2.5rem] animate-radar [animation-delay:2s]" />

                                    <motion.div 
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10"
                                    >
                                        <svg className="w-12 h-12 text-emerald-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor font-thin">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2 2 4 6 4s6-2 6-4V7M4 7c0 2 2 4 6 4s6-2 6-4M4 7c0-2 2-4 6-4s6 2 6 4m0 5c0 2 2 4 6 4s6-2 6-4V5c0-2 2-4 6-4s6 2 6 4" />
                                        </svg>
                                    </motion.div>
                                </div>
                                <div className="space-y-4">
                                     <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic underline decoration-slate-800/30 underline-offset-8">Buffer Idle</h3>
                                     <p className="text-xs text-slate-600 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed italic">
                                        Awaiting entity identity. Initialize a procedure or table cluster to generate high-fidelity backup and rollback scripts.
                                     </p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default BackupOrchestrator;
