import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IconBackup,
  IconTable,
  IconStoredProcedure,
  IconSearch,
  IconChart,
  IconLightning,
  IconEye,
  IconRocket,
  IconCompare,
  IconEdit,
  IconFunction,
  IconWrench
} from './Icons';
import SEO from './SEO';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  const modules = [
    { name: 'Backup & Rollback', to: '/backup&rollback/sp', description: 'SP and Table script generation.', icon: <IconBackup />, color: 'blue' },
    { name: 'Table Utilities', to: '/alter-table', description: 'Create/Alter tables in bulk.', icon: <IconEdit />, color: 'purple' },
    { name: 'Table Guide', to: '/table-guide', description: 'DDL & DML best practices.', icon: <IconTable />, color: 'indigo' },
    { name: 'Stored Procedures', to: '/stored-procedures-guide', description: 'Transactions & logic.', icon: <IconStoredProcedure />, color: 'teal' },
    { name: 'Function Master', to: '/function-guide', description: 'Scalar & TVF patterns.', icon: <IconFunction />, color: 'pink' },
    { name: 'Query Indexing', to: '/indexes', description: 'Optimization techniques.', icon: <IconSearch />, color: 'orange' },
    { name: 'Execution Plans', to: '/execution-plan', description: 'Query cost analysis.', icon: <IconChart />, color: 'rose' },
    { name: 'Trigger Logic', to: '/triggers', description: 'Database automation.', icon: <IconLightning />, color: 'amber' },
    { name: 'View Manager', to: '/views', description: 'Virtual table abstractions.', icon: <IconEye />, color: 'cyan' },
    { name: 'Performance+', to: '/withnolock', description: 'NOLOCK & locking fixes.', icon: <IconRocket />, color: 'fuchsia' },
    { name: 'Diff Viewer', to: '/diff-viewer', description: 'Script comparison tool.', icon: <IconCompare />, color: 'slate' },
    { name: 'Dev Toolbox', to: '/devtools', description: 'JSON, XML, TS utilities.', icon: <IconWrench />, color: 'yellow' }
  ];

  const getColorClasses = (color) => {
    const map = {
        blue: 'from-blue-500/20 text-blue-400 border-blue-500/20',
        purple: 'from-purple-500/20 text-purple-400 border-purple-500/20',
        indigo: 'from-indigo-500/20 text-indigo-400 border-indigo-500/20',
        teal: 'from-teal-500/20 text-teal-400 border-teal-500/20',
        pink: 'from-pink-500/20 text-pink-400 border-pink-500/20',
        orange: 'from-orange-500/20 text-orange-400 border-orange-500/20',
        rose: 'from-rose-500/20 text-rose-400 border-rose-500/20',
        amber: 'from-amber-500/20 text-amber-400 border-amber-500/20',
        cyan: 'from-cyan-500/20 text-cyan-400 border-cyan-500/20',
        fuchsia: 'from-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/20',
        slate: 'from-slate-500/20 text-slate-400 border-slate-500/20',
        yellow: 'from-yellow-500/20 text-yellow-400 border-yellow-500/20',
    };
    return map[color] || map.blue;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-200 p-4 md:p-8">
      <SEO title="Home" description="Compact SQL Server developer suite." />
      
      <div className="max-w-[1400px] mx-auto">
        {/* Modernized Technical Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/60 pb-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
               <div className="relative w-12 h-12 bg-[#0a0f1a] rounded-lg border border-slate-700 flex items-center justify-center font-black text-xl text-white shadow-xl">
                 DB
               </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-widest uppercase">
                Playground
              </h1>
              <div className="flex items-center gap-4 mt-1">
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">SQL Server Ecosystem</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-6 bg-slate-900/50 border border-slate-800/50 px-5 py-2.5 rounded-full shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Runtime</span>
                  <span className="text-xs font-bold text-slate-300">v2.4.0</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Status</span>
                  <div className="flex items-center gap-1.5">
                     <span className="text-xs font-bold text-emerald-500 tracking-tight">READY</span>
                     <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
             </div>
          </div>
        </header>

        {/* High-Density Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {modules.map((module) => {
            const colorClass = getColorClasses(module.color);
            return (
              <motion.div key={module.to} variants={itemVariants}>
                <Link to={module.to} className="group block h-full">
                  <div className="h-full bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/10 hover:border-slate-700 transition-all relative overflow-hidden flex flex-col group-hover:shadow-lg group-hover:shadow-blue-500/5">
                    
                    {/* Compact Icon */}
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} bg-opacity-10 border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                      {React.cloneElement(module.icon, { className: 'w-5 h-5' })}
                    </div>

                    <h2 className="text-[15px] font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {module.name}
                    </h2>
                    <p className="text-[11px] text-slate-500 leading-normal group-hover:text-slate-400 transition-colors flex-grow">
                      {module.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Go to tool</span>
                      <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* Subtle corner accent */}
                    <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity rounded-bl-3xl`} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
