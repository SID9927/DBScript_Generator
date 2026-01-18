import React, { useState, useRef, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import DiffEditorWrapper from '../components/DiffEditorWrapper';
import FolderCompare from '../components/FolderCompare';
import { normalizeText } from '../utils/textNormalizer';

// Icons for the toolbar
const IconSettings = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const DiffViewer = () => {
    const [mode, setMode] = useState('text'); // 'text' | 'folder'
    const [leftText, setLeftText] = useState('');
    const [rightText, setRightText] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Pro Settings
    const [options, setOptions] = useState({
        ignoreWhitespace: false, // Monoco Native
        ignoreCase: false, // Normalizer
        ignoreComments: false, // Normalizer
        wordWrap: false, // Editor Display
        format: 'none' // 'none', 'sql', 'json', 'xml'
    });

    const [viewMode, setViewMode] = useState('raw'); // 'raw' | 'normalized'

    // Computed properties for the editor
    const getEditorContent = () => {
        // Raw Mode: Return text exactly as is.
        // We rely on Monaco's native "ignoreTrimWhitespace" option for visual whitespace ignoring in this mode.
        if (viewMode === 'raw') {
            return {
                original: leftText,
                modified: rightText
            };
        }

        // Normalized Mode: Apply all aggressive transformations (Case, Comments, Whitespace Collapse, Formatting)
        const filterOptions = {
            ...options,
            format: options.format, // Apply selected grammar formatting
            ignoreWhitespace: options.ignoreWhitespace // Apply manual normalization (collapse) if requested
        };

        return {
            original: normalizeText(leftText, filterOptions),
            modified: normalizeText(rightText, filterOptions)
        };
    };

    const { original, modified } = getEditorContent();

    const handleFolderFileSelect = (item) => {
        if (item.leftFile && item.rightFile) {
            const r1 = new FileReader(); // Simple nested callbacks for now
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
        } else {
            // Handle Orphans? Show empty string for missing file?
            // For now just alert or log.
            console.log("Orphan file selected");
        }
    };

    return (
        <div className="h-screen bg-slate-900 text-slate-200 flex flex-col font-sans overflow-hidden">
            <SEO
                title="Diff Viewer"
                description="Compare text and code with an advanced line-by-line difference viewer."
            />
            {/* Header */}
            <header className="h-14 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md flex items-center px-4 justify-between z-20 shadow-sm">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Quantum Diff <span className="text-xs bg-slate-700 text-slate-300 px-1 py-0.5 rounded ml-2 font-mono">PRO</span>
                    </h1>

                    <div className="flex bg-slate-700/50 rounded p-1 gap-1 border border-slate-600/50">
                        <button onClick={() => setMode('text')} className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${mode === 'text' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Text</button>
                        <button onClick={() => setMode('folder')} className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${mode === 'folder' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Folder</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {mode === 'text' && (
                        <>
                            {/* Bi-directional Actions */}
                            <div className="flex bg-slate-700/50 rounded p-1 mr-2 border border-slate-600/50">
                                <button
                                    onClick={() => setLeftText(rightText)}
                                    className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                                    title="Copy All to Left (←)"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                                </button>
                                <div className="w-px bg-slate-600 mx-1"></div>
                                <button
                                    onClick={() => setRightText(leftText)}
                                    className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                                    title="Copy All to Right (→)"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                </button>
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-slate-700/50 rounded p-1 mr-2 border border-slate-600/50">
                                <button onClick={() => setViewMode('raw')} className={`px-3 py-1 rounded text-xs font-medium transition-all ${viewMode === 'raw' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>Raw Source</button>
                                <button onClick={() => setViewMode('normalized')} className={`px-3 py-1 rounded text-xs font-medium transition-all ${viewMode === 'normalized' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>Normalized</button>
                            </div>

                            {/* Settings Toggle */}
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className={`p-2 rounded hover:bg-slate-700 transition-colors ${settingsOpen ? 'text-blue-400 bg-slate-700' : 'text-slate-400'}`}
                                title="Session Settings"
                            >
                                <IconSettings />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Session Settings Panel */}
            <AnimatePresence>
                {settingsOpen && mode === 'text' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-800 border-b border-slate-700 overflow-hidden"
                    >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {/* Group 1: Comparison Rules */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display & Rules</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                                        <input type="checkbox" checked={options.wordWrap} onChange={e => setOptions({ ...options, wordWrap: e.target.checked })} className="rounded bg-slate-900 border-slate-600 accent-blue-500" />
                                        Word Wrap
                                    </label>
                                    <div className="h-px bg-slate-700 my-2"></div>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                                        <input type="checkbox" checked={options.ignoreWhitespace} onChange={e => setOptions({ ...options, ignoreWhitespace: e.target.checked })} className="rounded bg-slate-900 border-slate-600 accent-blue-500" />
                                        Ignore Whitespace
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                                        <input type="checkbox" checked={options.ignoreCase} onChange={e => setOptions({ ...options, ignoreCase: e.target.checked })} className="rounded bg-slate-900 border-slate-600 accent-blue-500" />
                                        Ignore Case
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                                        <input type="checkbox" checked={options.ignoreComments} onChange={e => setOptions({ ...options, ignoreComments: e.target.checked })} className="rounded bg-slate-900 border-slate-600 accent-blue-500" />
                                        Ignore Comments
                                    </label>
                                </div>
                            </div>

                            {/* Group 2: Formatters */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Grammar / Format</h3>
                                <select
                                    value={options.format}
                                    onChange={e => setOptions({ ...options, format: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 outline-none focus:border-blue-500"
                                >
                                    <option value="none">None (Plain Text)</option>
                                    <option value="sql">SQL Query (T-SQL)</option>
                                    <option value="json">JSON</option>
                                    <option value="xml">XML</option>
                                </select>
                                <p className="text-xs text-slate-400 mt-2">
                                    Select a grammar to enable structural formatting in "Normalized View".
                                </p>
                            </div>

                            {/* Group 3: Info */}
                            <div className="text-xs text-slate-500 border-l border-slate-700 pl-4">
                                <p className="mb-2"><strong className="text-slate-400">Raw Source:</strong> Compares text exactly as pasting.</p>
                                <p><strong className="text-slate-400">Normalized:</strong> Applies formatting and rules before comparison to show logical differences.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <main className="flex-1 overflow-hidden relative flex">
                {mode === 'text' ? (
                    <div className="flex-1 flex flex-col h-full">
                        {/* Inputs (Only visible if empty? or togglable? Let's hide if we have content to maximize diff space, showing a restart button? Or split view?) 
                            Ideally, similar to tools: Top half inputs, Bottom half diff. 
                            OR: Just 2-pane editor that IS the input.
                            Monaco IS editable. So we just pass the text in.
                        */}
                        <DiffEditorWrapper
                            original={original}
                            modified={modified}
                            language={options.format === 'none' ? 'plaintext' : options.format}
                            options={{
                                ignoreWhitespace: options.ignoreWhitespace,
                                wordWrap: options.wordWrap,
                                onOriginalChange: (val) => {
                                    if (viewMode === 'raw') setLeftText(val);
                                },
                                onModifiedChange: (val) => {
                                    if (viewMode === 'raw') setRightText(val);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-full p-4">
                        <FolderCompare onFileSelect={handleFolderFileSelect} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default DiffViewer;
