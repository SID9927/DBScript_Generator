import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { IconWrench, IconLightning, IconFunction } from '../components/Icons';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitted(true);
        setIsSubmitting(false);
    };

    const categories = [
        { name: 'Support', icon: <IconWrench className="w-6 h-6" />, desc: 'Technical help & bug reports', color: 'indigo' },
        { name: 'Feedback', icon: <IconLightning className="w-6 h-6" />, desc: 'Suggestions & feature ideas', color: 'sky' },
        { name: 'Say Hello', icon: <IconFunction className="w-6 h-6" />, desc: 'General inquiries', color: 'slate' }
    ];

    if (submitted) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto border border-emerald-500/20 shadow-inner">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight italic">MESSAGE SENT!</h2>
                    <p className="text-slate-400 font-medium mb-10 leading-relaxed text-sm">
                        Thank you for reaching out. We've received your message.
                    </p>
                    <button
                        onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-indigo-900/40"
                    >
                        Send Another Message
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 min-h-screen">
            <SEO title="Contact Us" description="Get in touch with the DB Playground team." />

            {/* Compact Header */}
            <header className="relative p-6 md:p-8 bg-slate-900 rounded-[3rem] overflow-hidden group shadow-2xl border border-slate-800/50">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Connect</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-1 uppercase italic">
                            Get in <span className="text-transparent pr-2 bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Touch</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-[11px] max-w-md leading-relaxed uppercase tracking-widest italic">
                            Have a question, feedback, or want to say hello?
                        </p>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 bg-slate-950/60 px-6 py-4 rounded-3xl border border-white/5 shadow-inner">
                        <div className="text-left">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 leading-none">Response Time</p>
                            <p className="text-xl font-black text-white leading-none tracking-tighter">&lt; 24 Hours</p>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="text-2xl opacity-60">📡</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Side: Compact Bento Hub - Vertically Aligned */}
                <div className="lg:col-span-4 space-y-3 mt-2">
                    <div className="grid grid-cols-1 gap-3">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-5 bg-slate-900 border border-slate-800/50 rounded-[2rem] relative overflow-hidden transition-all hover:bg-slate-800/40 hover:-translate-y-1 shadow-xl"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all`} />
                                <div className="relative z-10 flex flex-col items-start gap-4 text-left">
                                    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-indigo-400 border border-slate-800 group-hover:border-indigo-500/50 transition-all shadow-inner relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opaicty-0 group-hover:opacity-100 transition-opacity" />
                                        {React.cloneElement(cat.icon, { className: 'w-5 h-5' })}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-widest mb-0.5">{cat.name}</h4>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider italic leading-tight">{cat.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                   
                </div>

                {/* Right Side: Command Terminal */}
                <div className="lg:col-span-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-[3.5rem] overflow-hidden shadow-2xl relative"
                    >
                        {/* Control Window Header */}
                        <div className="bg-slate-950/40 border-b border-white/5 px-8 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                                </div>
                                <div className="w-px h-3 bg-slate-800 mx-2" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Command Terminal v2.04</span>
                            </div>
                            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic">Input Authorized</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 relative z-10 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group/field">
                                    <label className="absolute -top-3 left-6 px-3 bg-slate-900 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] group-focus-within/field:text-indigo-400 transition-colors z-20">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="Enter your handle..."
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-indigo-100 placeholder:text-slate-800 outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold shadow-inner"
                                        />
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/field:text-indigo-500/30 transition-colors">👤</div>
                                    </div>
                                </div>

                                <div className="relative group/field">
                                    <label className="absolute -top-3 left-6 px-3 bg-slate-900 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] group-focus-within/field:text-indigo-400 transition-colors z-20">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="name@nexus.com"
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-indigo-100 placeholder:text-slate-800 outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold shadow-inner"
                                        />
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/field:text-indigo-500/30 transition-colors">✉️</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group/field">
                                <label className="absolute -top-3 left-10 px-3 bg-slate-900 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] group-focus-within/field:text-indigo-400 transition-colors z-20">Message Content</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="Write your message here..."
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-[2.5rem] px-8 py-6 text-indigo-100 placeholder:text-slate-800 outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold shadow-inner resize-none leading-relaxed"
                                />
                            </div>

                            <div className="space-y-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-indigo-900/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] pointer-events-none" />
                                    {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                                    {!isSubmitting && <span className="text-lg">→</span>}
                                </button>
                                <div className="flex items-center gap-4 px-4 opacity-50">
                                    <div className="flex-grow h-px bg-slate-800" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Secure Session Protocol</span>
                                    </div>
                                    <div className="flex-grow h-px bg-slate-800" />
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
