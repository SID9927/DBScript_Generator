import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { IconTrash } from '../../../components/Icons';

const CloudSync = ({ currentUser, setShowLoginModal, onCopy, copied, onResetAll }) => {
    const [cloudContent, setCloudContent] = useState('');
    const [syncStatus, setSyncStatus] = useState('Standby');
    const [cloudLoading, setCloudLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        const userDocRef = doc(db, 'clipboards', currentUser.uid);
        setSyncStatus('Syncing...');
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (document.activeElement?.id !== 'cloud-textarea') setCloudContent(data.text || '');
                setSyncStatus('Synced');
            } else {
                setDoc(userDocRef, { text: '', updatedAt: new Date() });
                setCloudContent('');
                setSyncStatus('Active');
            }
            setCloudLoading(false);
        }, (error) => {
            setSyncStatus('Sync Error');
            setCloudLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const handleCloudChange = async (e) => {
        const newText = e.target.value;
        setCloudContent(newText);
        setSyncStatus('Saving...');
        if (currentUser) {
            try {
                await setDoc(doc(db, 'clipboards', currentUser.uid), {
                    text: newText,
                    updatedAt: new Date(),
                    lastDevice: navigator.userAgent
                }, { merge: true });
                setSyncStatus('Saved');
            } catch (error) {
                setSyncStatus('Save Fail');
            }
        }
    };

    if (!currentUser) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-10">
                <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center text-slate-700 relative">
                <div className="absolute inset-0 border border-indigo-500/10 rounded-[2rem] animate-radar" />
                <svg className="w-10 h-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Auth Gateway Locked</h3>
                <p className="text-[10px] text-slate-500 max-w-xs font-bold uppercase tracking-widest mx-auto leading-relaxed italic">Initialize developer identity to access cross-device synchronization clusters.</p>
                </div>
                <button 
                onClick={() => setShowLoginModal(true)}
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/20 active:scale-95"
                >
                Access Terminal
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-950 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center relative">
                        <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl animate-radar" />
                        <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                    </div>
                    <div className="text-left">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Active Node Cluster</p>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${syncStatus === 'Synced' || syncStatus === 'Saved' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                            <span className="text-sm font-black text-slate-200 tracking-tight">{currentUser.email}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <button 
                        onClick={() => { setCloudContent(''); handleCloudChange({ target: { value: '' } }); onResetAll(); }} 
                        className="p-4 bg-slate-900 border border-slate-800 text-slate-600 hover:text-red-400 rounded-xl transition-all"
                    >
                        <IconTrash className="w-5 h-5" />
                    </button>
                    <button onClick={() => onCopy(cloudContent)} className="px-8 py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20">{copied ? 'Captured' : 'Capture Cluster'}</button>
                </div>
            </div>
            <textarea id="cloud-textarea" value={cloudContent} onChange={handleCloudChange} placeholder="Remote cluster buffer synced across all devices..." 
                className="flex-grow bg-black/40 border border-slate-800 rounded-[3rem] p-10 text-emerald-400/80 font-mono text-[13px] focus:border-emerald-500/30 transition-all custom-scrollbar outline-none resize-none leading-relaxed" />
        </div>
    );
};

export default CloudSync;
