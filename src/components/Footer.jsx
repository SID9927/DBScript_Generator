import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        if (window.innerWidth < 768) {
            setOpenSection(openSection === section ? null : section);
        }
    };

    const sections = [
        {
            id: 'links1',
            title: 'Quick Links',
            links: [
                { name: 'Home', href: '/' },
                { name: 'Backup & Rollback', href: '/backup&rollback/sp' },
                { name: 'Table Utilities', href: '/alter-table' },
                { name: 'Stored Procedures', href: '/stored-procedures-guide' },
                { name: 'Function', href: '/function-guide' }
            ]
        },
        {
            id: 'links2',
            title: 'Explore Tools',
            links: [
                { name: 'Index Master', href: '/indexes' },
                { name: 'Execution Plan', href: '/execution-plan' },
                { name: 'Trigger logic', href: '/triggers' },
                { name: 'View Admin', href: '/views' },
                { name: 'Performance+', href: '/withnolock' }
            ]
        }
    ];

    return (
        <footer className="bg-[#0a0f1a] border-t border-slate-800/60 text-slate-300 mt-auto">
            <div className="max-w-[1400px] mx-auto px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-8">
                    
                    {/* Compact Brand Section */}
                    <div className="md:col-span-2 space-y-4">
                        <img src="/logoDB.png" alt="DB Playground Logo" className="h-7 w-auto opacity-90" />
                        <p className="text-slate-500 text-[12px] leading-relaxed max-w-sm font-medium">
                            Professional SQL Server ecosystem for architects and database developers.
                        </p>
                        <div className="pt-2 flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Docs:</span>
                           <a href="https://docs.microsoft.com/sql" target="_blank" rel="noopener noreferrer" 
                              className="text-[11px] font-bold text-slate-500 hover:text-blue-500 transition-colors border-b border-slate-800 hover:border-blue-500 pb-0.5">
                              Microsoft SQL Server
                           </a>
                        </div>
                    </div>

                    {/* Responsive Mobile Accordion Links */}
                    {sections.map((sec) => (
                        <div key={sec.id} className="border-b md:border-none border-slate-800/50 last:border-none">
                            <button 
                                onClick={() => toggleSection(sec.id)}
                                className="w-full flex items-center justify-between py-3 md:py-0 md:mb-4 group text-left"
                            >
                                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">
                                    {sec.title}
                                </h4>
                                <svg 
                                    className={`w-3 h-3 text-slate-600 md:hidden transform transition-transform duration-300 ${openSection === sec.id ? 'rotate-180 text-blue-500' : ''}`} 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            <div className={`
                                overflow-hidden transition-all duration-300 md:max-h-full
                                ${openSection === sec.id ? 'max-h-64 pb-4 opacity-100' : 'max-h-0 md:opacity-100 opacity-0'}
                            `}>
                                <ul className="space-y-2">
                                    {sec.links.map(link => (
                                        <li key={link.href}>
                                            <a href={link.href} className="text-slate-500 hover:text-blue-400 text-[11px] font-semibold transition-colors flex items-center gap-2 group/item">
                                                <div className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Bottom Mark */}
                <div className="mt-8 pt-6 border-t border-slate-800/60">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[10px] sm:text-[9px] font-black uppercase tracking-[0.15em]">
                           <p className="text-slate-700">© {currentYear} DB PLAYGROUND</p>
                           <div className="flex items-center gap-4 sm:gap-6">
                              <div className="hidden sm:block w-px h-3 bg-slate-800" />
                              <a href="/privacy-policy" className="text-slate-700 hover:text-slate-400 transition-colors">Privacy</a>
                              <a href="/terms-of-service" className="text-slate-700 hover:text-slate-400 transition-colors">Terms</a>
                              <a href="/contact" className="text-slate-700 hover:text-slate-400 transition-colors">Contact</a>
                           </div>
                        </div>
                        
                        {/* THE SIGNATURE - Optimized for Mobile */}
                        <div className="text-[7px] sm:text-[9px] font-mono text-slate-800 uppercase tracking-[0.3em] sm:tracking-[0.5em] pointer-events-none select-none opacity-80 whitespace-nowrap">
                            Conceived, Designed & Developed by Siddharth
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimal Accent Bar */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30" />
        </footer>
    );
};

export default Footer;