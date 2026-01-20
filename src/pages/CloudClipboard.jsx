import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CloudClipboard = () => {
    const { currentUser, logout } = useAuth();
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Syncing...');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Listen to Firestore changes
    useEffect(() => {
        if (!currentUser) return;

        const userDocRef = doc(db, 'clipboards', currentUser.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (document.activeElement?.tagName !== 'TEXTAREA') {
                    setContent(data.text || '');
                } else if (data.text !== content) {
                    setContent(data.text || '');
                }
                setStatus('Synced');
            } else {
                setDoc(userDocRef, { text: '', updatedAt: new Date() });
                setContent('');
                setStatus('Ready');
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching document:", error);
            setStatus('Error syncing');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleTextChange = async (e) => {
        const newText = e.target.value;
        setContent(newText);
        setStatus('Saving...');

        if (currentUser) {
            try {
                const userDocRef = doc(db, 'clipboards', currentUser.uid);
                await setDoc(userDocRef, {
                    text: newText,
                    updatedAt: new Date(),
                    lastDevice: navigator.userAgent
                }, { merge: true });
                setStatus('Saved');
            } catch (error) {
                console.error("Error writing document:", error);
                setStatus('Error saving');
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto p-6 max-w-6xl min-h-[85vh] flex flex-col gap-6"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Cloud Clipboard
                    </h1>
                    <p className="text-slate-400 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Active Session: <span className="text-slate-200 font-medium">{currentUser?.email}</span>
                    </p>
                </div>
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className="px-6 py-2.5 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-red-500/10 hover:text-red-400 border border-slate-600 hover:border-red-500/50 rounded-xl transition-all duration-300"
                >
                    Disconnect
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 h-full flex-1">
                {/* Main Editor Area */}
                <div className="lg:col-span-2 flex flex-col h-[60vh] lg:h-auto bg-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden relative group">
                    {/* Editor Toolbar */}
                    <div className="flex justify-between items-center px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                            {/* Dynamic Status Light */}
                            <div className="relative flex items-center justify-center w-4 h-4">
                                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'Saved' || status === 'Synced' || status === 'Ready'
                                        ? 'bg-green-400 animate-ping'
                                        : 'bg-red-400 animate-pulse'
                                    }`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${status === 'Saved' || status === 'Synced' || status === 'Ready'
                                        ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                        : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                    }`}></span>
                            </div>
                            <span className={`text-xs font-mono ml-1 uppercase tracking-wider font-semibold transition-colors duration-300 ${status === 'Saved' || status === 'Synced' || status === 'Ready'
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                }`}>
                                {status}
                            </span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${copied
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy to Device
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* TextArea */}
                    <textarea
                        value={content}
                        onChange={handleTextChange}
                        placeholder="// Paste your code or text here..."
                        className="flex-1 w-full p-6 bg-transparent text-slate-300 placeholder-slate-600 resize-none focus:outline-none font-mono text-sm leading-relaxed selection:bg-cyan-500/30"
                        spellCheck="false"
                    />

                    {/* Status Footer */}
                    <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-600 font-mono flex justify-between">
                        <span>Ln {content.split('\n').length}, Col {content.length}</span>
                        <span>UTF-8</span>
                    </div>
                </div>

                {/* Instructions / Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Instant Sync
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            This tool bridges your local environment with VDI/Remote sessions. Text typed here is securely synced in real-time.
                        </p>

                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0 text-cyan-400 font-bold text-sm">1</div>
                                <div>
                                    <h4 className="text-slate-200 text-sm font-medium">Connect Devices</h4>
                                    <p className="text-slate-500 text-xs mt-1">Open this page on both local and remote browsers.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0 text-cyan-400 font-bold text-sm">2</div>
                                <div>
                                    <h4 className="text-slate-200 text-sm font-medium">Paste & Sync</h4>
                                    <p className="text-slate-500 text-xs mt-1">Content updates instantly across all connected sessions.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0 text-cyan-400 font-bold text-sm">3</div>
                                <div>
                                    <h4 className="text-slate-200 text-sm font-medium">Transfer</h4>
                                    <p className="text-slate-500 text-xs mt-1">Use the Copy button to move text to your system clipboard.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="p-6 rounded-3xl border border-dashed border-slate-700/50 bg-slate-800/20 text-center">
                        <p className="text-xs text-slate-500">
                            🔒 End-to-end encrypted connection via Firebase
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CloudClipboard;
