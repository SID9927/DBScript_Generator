import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SEO from '../../components/SEO';

// Subcomponents
import Dashboard from './components/Dashboard';
import RecoveryGame from './components/RecoveryGame';
import RecoveryLogs from './components/RecoveryLogs';
import SignalHandshake from './components/SignalHandshake';
import StartModal from './components/StartModal';
import AnimatedGradientBackground from '../../components/ui/animated-gradient-background';

const Offline = () => {
    const [restoredCount, setRestoredCount] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [level, setLevel] = useState(1);
    const [bufferCount, setBufferCount] = useState(0);
    const [showingLevelUp, setShowingLevelUp] = useState(false);
    const [logs, setLogs] = useState(["[SYSTEM] DB Playground uplink severed.", "[SYSTEM] Initializing emergency protocol Tier-1..."]);

    const handleRestore = () => {
        const newCount = restoredCount + 1;
        setRestoredCount(newCount);
        
        const thresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        if (thresholds.includes(newCount)) {
            if (newCount === 100) {
                setWin(true);
            } else {
                setShowingLevelUp(true);
                const nextLvl = level + 1;
                setLevel(nextLvl);
                setLogs(prev => [`[ALERT] Level ${nextLvl} Signal Rebuild Initialized...`, ...prev.slice(0, 10)]);
                setTimeout(() => setShowingLevelUp(false), 1200);
            }
        } else {
            const logMsgs = ["Shard synced.", "Buffer stabilized.", "Cache verified.", "Packet injected.", "Schema mapping..."];
            setLogs(prev => [logMsgs[Math.floor(Math.random() * logMsgs.length)], ...prev.slice(0, 10)]);
        }
    };

    const handleBufferChange = useCallback((count) => {
        setBufferCount(count);
    }, []);

    const resetGame = () => {
        setRestoredCount(0);
        setBufferCount(0);
        setGameOver(false);
        setWin(false);
        setLevel(1);
        setShowingLevelUp(false);
        setGameStarted(true);
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center p-4 overflow-hidden font-mono fixed inset-0 z-[999] bg-black">
            <SEO title="Signal Recovery | DB Playground" />

            {/* Premium Animated Backdrop */}
            <AnimatedGradientBackground 
                startingGap={110}
                Breathing={true}
                animationSpeed={0.02}
                gradientColors={[
                    "#0A0A0A",
                    "#2979FF",
                    "#FF80AB",
                    "#FF6D00",
                    "#FFD600",
                    "#00E676",
                    "#3D5AFE"
                ]}
                gradientStops={[35, 50, 60, 70, 80, 90, 100]}
                topOffset={0}
            />

            {/* Start Interface */}
            <AnimatePresence>
                {!gameStarted && <StartModal onStart={() => setGameStarted(true)} />}
            </AnimatePresence>

            <div className="w-full h-full max-w-5xl relative z-10 flex flex-col gap-4 py-4">
                {/* Header Section */}
                <Dashboard 
                    level={level} 
                    restoredCount={restoredCount} 
                    bufferCount={bufferCount}
                    onReset={resetGame}
                    onExit={() => setGameStarted(false)}
                />

                {/* Main Content (Game Area) */}
                <div className="relative flex-grow bg-slate-950/80 border border-slate-700/50 rounded-[3rem] overflow-hidden shadow-2xl flex flex-shrink-0">
                    <AnimatePresence mode="wait">
                        {!gameOver && !win && !showingLevelUp && gameStarted && (
                            <RecoveryGame 
                                level={level}
                                onRestore={handleRestore}
                                onGameOver={() => setGameOver(true)}
                                onWin={() => setWin(true)}
                                onBufferChange={handleBufferChange}
                            />
                        )}
                    </AnimatePresence>

                    {/* Transitions & Overlays */}
                    <AnimatePresence>
                        {showingLevelUp && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-md z-30 font-black">
                                <motion.h3 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-4xl text-white uppercase italic tracking-tighter mb-2">SIGNAL_REBUILD</motion.h3>
                                <p className="text-indigo-500 text-[9px] uppercase tracking-[0.4em]">Advancing to Level {level}</p>
                            </motion.div>
                        )}

                        {(gameOver || win) && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center z-[100] p-12 text-center font-mono">
                                <div className="max-w-xs w-full">
                                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center text-3xl border ${win ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                        {win ? '✔' : '✖'}
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{win ? 'SYNC_DONE' : 'OVERFLOW'}</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                                            <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Total</p>
                                            <p className="text-2xl font-black text-white leading-none">{restoredCount}</p>
                                        </div>
                                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                                            <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Max Level</p>
                                            <p className="text-2xl font-black text-indigo-400 leading-none">{level}</p>
                                        </div>
                                    </div>
                                    <button onClick={resetGame} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-xl">Re-attempt Protocol</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Section */}
                <div className="flex-shrink-0 flex gap-4 items-end h-28">
                    <RecoveryLogs logs={logs} />
                    <SignalHandshake />
                </div>
            </div>
        </div>
    );
};

export default Offline;
