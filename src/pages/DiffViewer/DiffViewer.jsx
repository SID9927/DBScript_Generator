import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import DiffEditorWrapper from '../../components/DiffEditorWrapper';
import FolderCompare from '../../components/FolderCompare';
import { normalizeText } from '../../utils/textNormalizer';
import { IconRefresh } from '../../components/Icons';
import { CompactSelect, ToggleSwitch } from './Components';

const DiffViewer = () => {
    const [mode, setMode] = useState('text'); // 'text' | 'folder'
    const [leftText, setLeftText] = useState('');
    const [rightText, setRightText] = useState('');
    const [viewMode, setViewMode] = useState('raw'); // 'raw' | 'normalized'
    const [stats, setStats] = useState({ additions: 0, deletions: 0, changes: 0 });
    const [editorRef, setEditorRef] = useState(null);
    
    // Pro Settings
    const [options, setOptions] = useState({
        ignoreWhitespace: false,
        ignoreCase: false,
        ignoreComments: false,
        wordWrap: false,
        format: 'none',
        renderSideBySide: true,
        minimap: true
    });

    const getEditorContent = () => {
        if (viewMode === 'raw') {
            return { original: leftText, modified: rightText };
        }
        return {
            original: normalizeText(leftText, options),
            modified: normalizeText(rightText, options)
        };
    };

    const { original, modified } = getEditorContent();

    useEffect(() => {
        if (!editorRef) return;
        
        const updateStats = () => {
            const changes = editorRef.getLineChanges();
            if (changes) {
                let adds = 0;
                let dels = 0;
                changes.forEach(c => {
                    if (c.originalEndLineNumber === 0) adds += (c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1);
                    else if (c.modifiedEndLineNumber === 0) dels += (c.originalEndLineNumber - c.originalStartLineNumber + 1);
                    else {
                        adds += (c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1);
                        dels += (c.originalEndLineNumber - c.originalStartLineNumber + 1);
                    }
                });
                setStats({ additions: adds, deletions: dels, changes: changes.length });
            } else {
                setStats({ additions: 0, deletions: 0, changes: 0 });
            }
        };

        const disposable = editorRef.onDidUpdateDiff(updateStats);
        updateStats(); // Initial call
        
        return () => disposable.dispose();
    }, [editorRef, leftText, rightText, viewMode, options]);

    const handleFolderFileSelect = (item) => {
        if (item.leftFile && item.rightFile) {
            const r1 = new FileReader();
            r1.onload = e1 => {
                const r2 = new FileReader();
                r2.onload = e2 => {
                    setLeftText(e1.target.result);
                    setRightText(e2.target.result);
                    setMode('text');
                };
                r2.readAsText(item.rightFile);
            };
            r1.readAsText(item.leftFile);
        }
    };

    const jumpToChange = (direction) => {
        if (!editorRef) return;
        const navigator = editorRef.getNavigator();
        if (direction === 'next') navigator.next();
        else navigator.previous();
    };

    const formatOptions = [
        { label: "Plain Text", value: "none" },
        { label: "SQL Query (T-SQL)", value: "sql" },
        { label: "JSON Structure", value: "json" },
        { label: "XML Schema", value: "xml" }
    ];

    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
            <SEO 
                title="Quantum Diff Viewer | Developer Suite" 
                description="Advanced structural comparison tool for SQL, JSON, and text. Compare folders, normalize whitespace, and identify logical code differences."
            />

            {/* Branded Header - Slim Audit Edition */}
            <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 relative z-30 shadow-2xl">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white text-lg border border-slate-700 shadow-xl transform group transition-transform hover:rotate-6">
                            📟
                        </div>
                        <div className="text-left space-y-0.5">
                            <h1 className="text-lg font-black text-white tracking-tight uppercase italic flex items-center gap-2">
                                QUANTUM <span className="text-indigo-500">DIFF</span>
                                <span className="text-[10px] bg-indigo-600/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono not-italic tracking-widest">S-RANK</span>
                            </h1>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono leading-none">Structural Audit & Comparison Protocol</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
                        {[
                            { id: 'text', label: 'SOURCE COMPARE', color: 'indigo' },
                            { id: 'folder', label: 'FS ORCHESTRATOR', color: 'purple' }
                        ].map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === m.id ? `bg-${m.color}-600 text-white shadow-lg` : 'text-slate-600 hover:text-slate-400'}`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {mode === 'text' && (
                        <div className="flex items-center gap-3 bg-slate-950/50 p-2 rounded-2xl border border-slate-800/50">
                            {/* Navigation Protocol */}
                            <div className="flex items-center bg-slate-800 rounded-lg overflow-hidden border border-slate-700 mr-2 shadow-lg">
                                <button onClick={() => jumpToChange('prev')} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border-r border-slate-700" title="Prev Change (Alt+F5)">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                </button>
                                <button onClick={() => jumpToChange('next')} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Next Change (F5)">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>

                            <div className="flex items-center bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                <button onClick={() => setViewMode('raw')} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'raw' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Raw</button>
                                <button onClick={() => setViewMode('normalized')} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'normalized' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Norm</button>
                            </div>
                            <div className="w-px h-6 bg-slate-800" />
                            <div className="flex gap-1">
                                <button onClick={() => setLeftText(rightText)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-600 hover:text-white transition-colors" title="Clone Right to Left"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg></button>
                                <button onClick={() => { setLeftText(''); setRightText(''); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors group"><IconRefresh className="w-4 h-4 transition-transform group-hover:rotate-[-45deg]" /></button>
                                <button onClick={() => setRightText(leftText)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-600 hover:text-white transition-colors" title="Clone Left to Right"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg></button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
                {mode === 'text' ? (
                    <>
                        {/* Control Sidebar */}
                        <aside className="w-full lg:w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 p-6 pb-32 space-y-8 overflow-y-auto custom-scrollbar shadow-2xl z-20">
                            {/* Change Telemetry */}
                            <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-4">
                                <header className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Diff Telemetry</h3>
                                    <span className="text-[9px] font-mono text-indigo-400 font-bold">{stats.changes} BLOCKS</span>
                                </header>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl flex flex-col items-center">
                                        <span className="text-[8px] font-black text-emerald-500/60 uppercase mb-1 font-mono">Added</span>
                                        <span className="text-lg font-black text-emerald-400 italic font-mono">+{stats.additions}</span>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl flex flex-col items-center">
                                        <span className="text-[8px] font-black text-red-500/60 uppercase mb-1 font-mono">Removed</span>
                                        <span className="text-lg font-black text-red-400 italic font-mono">-{stats.deletions}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                     <header className="flex items-center gap-2 px-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Structural Grammar</h3>
                                    </header>
                                    <CompactSelect 
                                        label="Content Protocol"
                                        value={options.format}
                                        options={formatOptions}
                                        onChange={(v) => setOptions({...options, format: v})}
                                    />
                                </div>

                                <div className="space-y-4">
                                     <header className="flex items-center gap-2 px-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-indigo-500/30 decoration-2 italic">Logic Audit</h3>
                                    </header>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        <ToggleSwitch 
                                            active={options.renderSideBySide} 
                                            onClick={() => setOptions({...options, renderSideBySide: !options.renderSideBySide})}
                                            label="Side-by-Side"
                                            sub="Split Screen View"
                                        />
                                        <div className="h-px bg-slate-800/50 mx-2" />
                                        <ToggleSwitch 
                                            active={options.ignoreWhitespace} 
                                            onClick={() => setOptions({...options, ignoreWhitespace: !options.ignoreWhitespace})}
                                            label="Whitespace"
                                            sub="Collapse & Trim Audit"
                                        />
                                        <ToggleSwitch 
                                            active={options.ignoreCase} 
                                            onClick={() => setOptions({...options, ignoreCase: !options.ignoreCase})}
                                            label="Casing"
                                            sub="Case-Insensitive Match"
                                        />
                                        <ToggleSwitch 
                                            active={options.ignoreComments} 
                                            onClick={() => setOptions({...options, ignoreComments: !options.ignoreComments})}
                                            label="Comments"
                                            sub="Logic-Only Comparison"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                     <header className="flex items-center gap-2 px-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Viewport Control</h3>
                                    </header>
                                    <div className="grid grid-cols-1 gap-3">
                                        <ToggleSwitch 
                                            active={options.wordWrap} 
                                            onClick={() => setOptions({...options, wordWrap: !options.wordWrap})}
                                            label="Word Wrap"
                                            sub="Content Resizing"
                                        />
                                        <ToggleSwitch 
                                            active={options.minimap} 
                                            onClick={() => setOptions({...options, minimap: !options.minimap})}
                                            label="Minimap"
                                            sub="Structural Overview"
                                        />
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Editor Canvas */}
                        <div className="flex-grow relative bg-slate-900 overflow-hidden">
                             <DiffEditorWrapper
                                original={original}
                                modified={modified}
                                language={options.format === 'none' ? 'plaintext' : options.format}
                                options={{
                                    ...options,
                                    onMount: (editor) => setEditorRef(editor),
                                    onOriginalChange: (val) => {
                                        if (viewMode === 'raw') setLeftText(val);
                                    },
                                    onModifiedChange: (val) => {
                                        if (viewMode === 'raw') setRightText(val);
                                    }
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full p-8 bg-slate-900 overflow-y-auto custom-scrollbar">
                         <FolderCompare onFileSelect={handleFolderFileSelect} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default DiffViewer;
