import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SubNav = ({ basePath, links }) => {
  const location = useLocation();

  // Only render if current path starts with basePath
  if (!location.pathname.startsWith(basePath)) return null;

  const linkClass = ({ isActive }) =>
    `relative py-1 sm:py-1.5 px-2.5 sm:px-4 text-[9px] sm:text-[12px] font-black uppercase tracking-[0.1em] sm:tracking-widest transition-all duration-300 flex items-center rounded-lg ${
      isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
    }`;

  return (
    <nav className="bg-[#060b14]/80 border-b border-slate-800/40 backdrop-blur-xl relative z-40 sticky top-[64px]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center py-2 sm:py-0 px-3 sm:px-6 gap-2">
        {/* Module Indicator - Minimalist for Wrap Layout */}
        <div className="flex items-center gap-1.5 sm:border-r border-slate-800/60 sm:pr-4 sm:mr-3 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Modules</span>
        </div>
        
        {/* Wrapped Links Container - No Scroll */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
            >
               {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="subnav-pill"
                      className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SubNav;

