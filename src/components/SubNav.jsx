import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SubNav = ({ basePath, links }) => {
  const location = useLocation();

  // Only render if current path starts with basePath
  if (!location.pathname.startsWith(basePath)) return null;

  const linkClass = ({ isActive }) =>
    `relative py-2 px-4 text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${
      isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
    }`;

  return (
    <nav className="bg-[#060b14]/40 border-b border-slate-800/40 px-4 md:px-8 backdrop-blur-md relative z-10 sticky top-[64px]">
      <div className="max-w-[1500px] mx-auto flex items-center h-12 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 border-r border-slate-800/60 pr-4 mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Modules</span>
        </div>
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
                    className="absolute inset-0 bg-slate-800/60 border border-slate-700/50 rounded-lg shadow-inner"
                    style={{ borderRadius: '8px' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default SubNav;

