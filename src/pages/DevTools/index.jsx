import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import Login from '../Login';
import { InfoHeader, ToolTabButton } from './Components';

// Sub-components
import Beautifier from './tools/Beautifier';
import Converter from './tools/Converter';
import Base64Suite from './tools/Base64Suite';
import DateEngine from './tools/DateEngine';
import CloudSync from './tools/CloudSync';

const DevTools = () => {
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('beautifier');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [base64Image, setBase64Image] = useState('');
  
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  const tabs = [
    { id: 'beautifier', name: 'Format & Minify', sub: 'Syntax Engine', icon: '📝' },
    { id: 'converter', name: 'JSON <-> XML', sub: 'Structure Map', icon: '🔄' },
    { id: 'base64', name: 'Base64 Suite', sub: 'Binary Cluster', icon: '🖼️' },
    { id: 'datetime', name: 'Date Engine', sub: 'Temporal Span', icon: '⏲️' },
    { id: 'cloud-clipboard', name: 'Cloud Sync', sub: 'Node Link', icon: '☁️' },
  ];

  const handleResetAll = () => {
    setInput(''); setOutput(''); setError(''); setBase64Image('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text || output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 min-h-screen">
      <SEO title="Utility Suite | Developer Suite" description="Local-first engineering tools for format, conversion, and calculation." />

      <InfoHeader 
        title="Utility & Diagnostic Suite"
        subtitle="Multi-purpose engineering diagnostic terminal."
      />

      <div className="flex flex-col lg:flex-row gap-10 items-start relative">
        {/* Sticky Navigation Sidebar */}
        <div className="lg:w-80 w-full flex-shrink-0 lg:sticky lg:top-24 z-20">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
                
                <div className="px-4 py-3 pb-5 text-left">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1.5 leading-none">Navigation Console</h3>
                    <div className="w-10 h-1 bg-indigo-500 rounded-full" />
                </div>

                <div className="space-y-1">
                    {tabs.map((tab) => (
                        <ToolTabButton 
                            key={tab.id}
                            active={activeTab === tab.id}
                            icon={tab.icon}
                            label={tab.name}
                            sub={tab.sub}
                            onClick={() => { setActiveTab(tab.id); handleResetAll(); }}
                        />
                    ))}
                </div>

                {/* Live Session Status */}
                <div className="mt-4 pt-4 border-t border-slate-800/50 px-2 pb-2">
                    <div className="bg-slate-950/50 rounded-[1.5rem] p-4 border border-slate-800/40 text-left relative overflow-hidden group/session">
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/session:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
                                </div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Live Cluster</span>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-tight mb-1 italic">Identity Shielded</h4>
                            <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.15em] leading-relaxed italic">100% LOCAL-FIRST PROTOCOL ACTIVE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Workspace Area */}
        <div 
            ref={contentRef}
            className="flex-grow w-full bg-slate-900 border border-slate-800 rounded-[3.5rem] p-8 md:p-14 shadow-2xl min-h-[800px] relative overflow-hidden group/workspace scroll-mt-24"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />           
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col h-full relative z-10"
                >
                    {activeTab === 'beautifier' && (
                        <Beautifier 
                            input={input} setInput={setInput} 
                            output={output} setOutput={setOutput} 
                            error={error} setError={setError} 
                            onReset={handleResetAll} onCopy={copyToClipboard} copied={copied} 
                        />
                    )}

                    {activeTab === 'converter' && (
                        <Converter 
                            input={input} setInput={setInput} 
                            output={output} setOutput={setOutput} 
                            error={error} setError={setError} 
                            onReset={handleResetAll} onCopy={copyToClipboard} copied={copied} 
                        />
                    )}

                    {activeTab === 'base64' && (
                        <Base64Suite 
                            input={input} setInput={setInput} 
                            output={output} setOutput={setOutput} 
                            error={error} setError={setError} 
                            base64Image={base64Image} setBase64Image={setBase64Image}
                            onCopy={copyToClipboard} copied={copied} 
                        />
                    )}

                    {activeTab === 'datetime' && (
                        <DateEngine 
                            onCopy={copyToClipboard} 
                            error={error} setError={setError} 
                        />
                    )}

                    {activeTab === 'cloud-clipboard' && (
                        <CloudSync 
                            currentUser={currentUser} 
                            setShowLoginModal={setShowLoginModal} 
                            onCopy={copyToClipboard} 
                            copied={copied} 
                            onResetAll={handleResetAll} 
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>

    <AnimatePresence>
        {showLoginModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLoginModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative z-10 w-full max-w-lg">
                    <Login isModal={true} onClose={() => setShowLoginModal(false)} />
                </motion.div>
            </div>
        )}
    </AnimatePresence>
    </>
  );
};

export default DevTools;
