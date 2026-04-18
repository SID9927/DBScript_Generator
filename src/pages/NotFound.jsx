import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AnimatedGradientBackground from '../components/ui/animated-gradient-background';

const NotFound = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#020617] overflow-hidden font-mono fixed inset-0 z-[2000]">
            <SEO title="404 - Transmission Failed" description="The requested repository coordinate does not exist in the current architecture." />

            {/* Warning Background */}
            <AnimatedGradientBackground 
                startingGap={100}
                Breathing={true}
                animationSpeed={0.015}
                gradientColors={["#0A0A0A", "#450a0a", "#7f1d1d", "#450a0a"]}
                gradientStops={[30, 50, 70, 100]}
                topOffset={0}
            />

            {/* Grid Backdrop */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                {/* Visual Identity */}
                <div className="relative inline-block mb-12">
                    <motion.div 
                        animate={{ 
                            textShadow: [
                                "0 0 0px rgba(239,68,68,0)", 
                                "0 0 30px rgba(239,68,68,0.4)", 
                                "0 0 0px rgba(239,68,68,0)"
                            ] 
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="text-[140px] md:text-[220px] font-black leading-none tracking-tighter text-transparent select-none italic"
                        style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
                    >
                        404
                    </motion.div>
                    
                    <div className="absolute -bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                        <motion.div 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl px-4 py-1 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.1)] skew-x-[-12deg]"
                        >
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] animate-pulse whitespace-nowrap">Endpoint Breach</span>
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-6 mb-16 px-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">PAGE_NOT_FOUND</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[12px] leading-relaxed max-w-sm mx-auto italic opacity-80">
                        The requested page doesn't exist or has been moved to another sector. Don't worry, let's get you back to headquarters.
                    </p>
                </div>

                <div className="flex items-center justify-center px-10">
                    <Link to="/" className="px-16 py-6 bg-red-600 hover:bg-red-500 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl shadow-red-900/40 active:scale-95">
                        Return to Home
                    </Link>
                </div>

                {/* Diagnostics Status Footer */}
                <div className="mt-20 pt-10 border-t border-red-500/10 flex items-center justify-center gap-12 opacity-60">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 leading-none">ErrorCode</span>
                        <span className="text-sm font-black text-red-500 uppercase tracking-tighter italic">0x404_VOID</span>
                    </div>
                    <div className="w-px h-8 bg-red-500/10" />
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 leading-none">Coordinate</span>
                        <span className="text-sm font-black text-white uppercase tracking-tighter italic">NULL_PTR</span>
                    </div>
                    <div className="w-px h-8 bg-red-500/10" />
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 leading-none">Access</span>
                        <span className="text-sm font-black text-amber-500 uppercase tracking-tighter italic">REVOKED</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
