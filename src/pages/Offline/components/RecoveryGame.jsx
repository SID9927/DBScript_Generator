import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RecoveryGame = ({ onWin, onGameOver, level, onRestore, onBufferChange }) => {
    const [activeNodes, setActiveNodes] = useState([]);
    const timeoutRef = useRef(null);

    useEffect(() => {
        onBufferChange(activeNodes.length);
        if (activeNodes.length >= 8) {
            onGameOver();
        }
    }, [activeNodes, onBufferChange, onGameOver]);

    const levelConfig = [
        { interval: 1000 }, // L1
        { interval: 850 }, // L2
        { interval: 650 },  // L3
        { interval: 500 },  // L4
        { interval: 400 },  // L5
        { interval: 320 },  // L6
        { interval: 250 },  // L7
        { interval: 200 },  // L8
        { interval: 150 },  // L9
        { interval: 100 },  // L10 (Extreme)
    ];

    const currentInterval = levelConfig[level - 1]?.interval || 400;

    const spawnNode = () => {
        const nextTime = currentInterval + (Math.random() * 0.2 * currentInterval);
        timeoutRef.current = setTimeout(() => {
            const newNode = { 
                id: Math.random(), 
                x: Math.random() * 80 + 10, 
                y: Math.random() * 60 + 20
            };
            setActiveNodes(prev => [...prev, newNode]);
            spawnNode();
        }, nextTime);
    };

    useEffect(() => {
        spawnNode();
        return () => clearTimeout(timeoutRef.current);
    }, [level]);

    const handleClick = (id) => {
        setActiveNodes(prev => prev.filter(node => node.id !== id));
        onRestore();
    };

    return (
        <div className="relative w-full h-full">
            <AnimatePresence>
                {activeNodes.map(node => (
                    <motion.button
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 1.5, opacity: 0 }}
                        onClick={() => handleClick(node.id)}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group p-2"
                    >
                        <div className="relative w-9 h-9 flex items-center justify-center">
                            {/* Brand Shard Node */}
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 blur-md" />
                            <img 
                                src="/logoDB.png" 
                                alt="DB-Shard" 
                                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform select-none pointer-events-none" 
                            />
                        </div>
                    </motion.button>
                ))}
            </AnimatePresence>
            
            {/* Visual Warning for High Buffer */}
            {activeNodes.length >= 6 && (
                <div className="absolute inset-0 border-2 border-red-500/20 rounded-[3rem] pointer-events-none animate-pulse" />
            )}
        </div>
    );
};

export default RecoveryGame;
