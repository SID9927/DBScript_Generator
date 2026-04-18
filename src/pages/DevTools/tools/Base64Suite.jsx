import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ActionButton } from '../Components';
import { IconWrench } from '../../../components/Icons';

const Base64Suite = ({ input, setInput, output, setOutput, error, setError, base64Image, setBase64Image, onCopy, copied }) => {
    const fileInputRef = useRef(null);

    const handleImageToBase64 = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOutput(reader.result);
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBase64ToImage = () => {
        setError('');
        try {
            if (!input && !output) { setError("No payload detected"); return; }
            const payload = input || output;
            if (!payload.startsWith('data:image')) {
                if (payload.match(/^[A-Za-z0-9+/=]+$/)) setBase64Image(`data:image/png;base64,${payload}`);
                else setBase64Image(payload);
            } else setBase64Image(payload);
        } catch (err) {
            setError("Invalid Base64 string");
        }
    };

    return (
        <div className="space-y-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Cluster Operations</p>
                <button onClick={() => { setInput(''); setOutput(''); setError(''); setBase64Image(''); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="text-[9px] font-black text-slate-600 hover:text-red-500 uppercase transition-colors">Clear Engine</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Image ➔ Base64</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageToBase64} 
                        className="w-full bg-black/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 transition-all cursor-pointer" />
                </div>
                <div className="flex flex-col justify-end">
                    <ActionButton onClick={handleBase64ToImage}>Decode & Preview Base64</ActionButton>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Encoding Buffer</span>
                        <button onClick={() => onCopy(input || output)} className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase transition-colors">{copied ? 'Captured' : 'Capture'}</button>
                    </div>
                    <textarea value={input || output} onChange={e => setInput(e.target.value)} placeholder="Paste data for encoding / decoding..." 
                        className="flex-grow min-h-[450px] bg-black/40 border border-slate-800 rounded-[2rem] p-8 text-indigo-300/80 font-mono text-[11px] focus:border-indigo-500/30 transition-all custom-scrollbar outline-none resize-none leading-relaxed shadow-inner" />
                </div>
                <div className="flex flex-col space-y-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Visual Preview</span>
                    <div className="flex-grow min-h-[450px] bg-[#05070a] border border-slate-800/80 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative group/preview shadow-inner">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                        
                        {base64Image ? (
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                src={base64Image} 
                                className="max-w-[85%] max-h-[85%] object-contain rounded-xl shadow-[0_0_50px_rgba(79,70,229,0.15)] transition-transform duration-700 group-hover/preview:scale-105 relative z-10" 
                            />
                        ) : (
                            <div className="text-center space-y-8 relative z-10">
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-radar" />
                                    <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-radar [animation-delay:1.5s]" />
                                    <div className="w-24 h-24 bg-slate-900/80 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-600 relative z-20 backdrop-blur-sm group-hover/preview:border-indigo-500/30 transition-colors">
                                        <svg className="w-10 h-10 opacity-30 group-hover/preview:opacity-60 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] italic">Awaiting Payload</p>
                                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest italic leading-none">Initialize binary cluster for preview</p>
                                </div>
                            </div>
                        )}

                        {/* Corner Accents */}
                        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-slate-800 rounded-tl-sm pointer-events-none" />
                        <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-slate-800 rounded-tr-sm pointer-events-none" />
                        <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-slate-800 rounded-bl-sm pointer-events-none" />
                        <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-slate-800 rounded-br-sm pointer-events-none" />
                    </div>
                </div>
            </div>
            {error && <p className="text-red-400 text-center text-[10px] font-black uppercase tracking-widest mt-6 animate-pulse">!! {error} !!</p>}
        </div>
    );
};

export default Base64Suite;
