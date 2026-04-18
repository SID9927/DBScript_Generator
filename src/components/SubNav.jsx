import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SubNav = ({ basePath, links }) => {
  const location = useLocation();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(currentScrollY < lastScrollY);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Only render if current path starts with basePath
  if (!location.pathname.startsWith(basePath)) return null;

  const currentModule = links.find(link => location.pathname === link.to)?.name || 'Select Module';

  return (
    <motion.div 
      animate={{ top: isNavbarVisible ? 80 : 20 }}
      transition={{ duration: 0.4, type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed left-0 right-0 z-[40] flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto">
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-slate-700/50 p-1.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.1)] flex items-center gap-1 group">
          
          {/* Module Indicator / Label */}
          <div className="pl-4 pr-3 py-2 items-center gap-2 border-r border-slate-700/50 mr-1 hidden md:flex">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Backup Protocol</span>
          </div>

          {/* Segmented Toggle Group */}
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `relative px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center rounded-2xl ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
               {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/30 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SubNav;
