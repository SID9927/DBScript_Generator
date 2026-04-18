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
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const categories = [
    {
      title: "Core Operations",
      tools: [
        { name: 'Backup & Rollback', to: '/backup&rollback/sp', description: 'Scripts for Stored Procedures, Functions and Tables.', icon: <IconBackup />, color: 'blue', size: 'large' },
        { name: 'Table Utilities', to: '/alter-table', description: 'Bulk schema management.', icon: <IconEdit />, color: 'purple', size: 'medium' },
        { name: 'Dev Toolbox', to: '/devtools', description: 'Shared utility suite.', icon: <IconWrench />, color: 'yellow', size: 'medium' },
      ]
    },
    {
      title: "Optimization & Analysis",
      tools: [
        { name: 'Execution Plans', to: '/execution-plan', description: 'Visual cost analysis.', icon: <IconChart />, color: 'rose', size: 'medium' },
        { name: 'Query Indexing', to: '/indexes', description: 'Index optimization.', icon: <IconSearch />, color: 'orange', size: 'small' },
        { name: 'Diff Viewer', to: '/diff-viewer', description: 'Script comparison.', icon: <IconCompare />, color: 'slate', size: 'small' },
      ]
    },
    {
      title: "Guidelines & DDL",
      tools: [
        { name: 'Table Guide', to: '/table-guide', description: 'Best practices for DDL.', icon: <IconTable />, color: 'indigo', size: 'small' },
        { name: 'Stored Procedures', to: '/stored-procedures-guide', description: 'Logic & Transactions.', icon: <IconStoredProcedure />, color: 'teal', size: 'small' },
        { name: 'Function Master', to: '/function-guide', description: 'Scalar & TVF patterns.', icon: <IconFunction />, color: 'pink', size: 'small' },
        { name: 'Trigger Logic', to: '/triggers', description: 'Database automation.', icon: <IconLightning />, color: 'amber', size: 'small' },
        { name: 'View Manager', to: '/views', description: 'Virtual abstractions.', icon: <IconEye />, color: 'cyan', size: 'small' },
        { name: 'Performance+', to: '/withnolock', description: 'NOLOCK & locking fixes.', icon: <IconRocket />, color: 'fuchsia', size: 'small' }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const map = {
        blue: 'from-blue-500/10 text-blue-400 border-blue-500/20 bg-blue-500/5',
        purple: 'from-purple-500/10 text-purple-400 border-purple-500/20 bg-purple-500/5',
        indigo: 'from-indigo-500/10 text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
        teal: 'from-teal-500/10 text-teal-400 border-teal-500/20 bg-teal-500/5',
        pink: 'from-pink-500/10 text-pink-400 border-pink-500/20 bg-pink-500/5',
        orange: 'from-orange-500/10 text-orange-400 border-orange-500/20 bg-orange-500/5',
        rose: 'from-rose-500/10 text-rose-400 border-rose-500/20 bg-rose-500/5',
        amber: 'from-amber-500/10 text-amber-400 border-amber-500/20 bg-amber-500/5',
        cyan: 'from-cyan-500/10 text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
        fuchsia: 'from-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5',
        slate: 'from-slate-500/10 text-slate-400 border-slate-500/20 bg-slate-500/5',
        yellow: 'from-yellow-500/10 text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
    };
    return map[color] || map.blue;
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-200">
      <SEO title="Home" description="Advanced SQL Server developer control center." />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1500px] mx-auto p-3 md:p-6 relative">
        {/* Modern Command Header */}
        <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-0.5 bg-blue-600/10 border border-blue-500/20 rounded-full">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Platform Console</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter leading-none">
              Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Database</span> Developer Suite
            </h1>
            <p className="max-w-3xl text-xs text-slate-500 font-medium leading-relaxed">
              Highly specialized utility cluster for SQL Server optimization, script generation, and architectural guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/30 backdrop-blur-md border border-slate-800/40 p-1 rounded-xl">
            <div className="px-5 py-3 rounded-lg bg-slate-800/20 border border-slate-700/20">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 leading-none">System Status</p>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-emerald-400 tracking-tighter">ONLINE</span>
                <div className="h-3 w-px bg-slate-700/50" />
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">v2.4.0-REL</span>
              </div>
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Section 1: Core Toolset - Bento Master */}
          {categories[0].tools.map((tool, idx) => {
            const colorClass = getColorClasses(tool.color);
            return (
              <motion.div 
                key={tool.to} 
                variants={itemVariants}
                className={`${tool.size === 'large' ? 'md:col-span-4 lg:col-span-3 lg:row-span-2' : 'md:col-span-2 lg:col-span-3'}`}
              >
                <Link to={tool.to} className="group relative block h-full">
                  <div className="h-full bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-5 flex flex-col transition-all duration-500 hover:bg-slate-800/20 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 group-hover:bg-grid-white/[0.02]">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} border flex items-center justify-center mb-4 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      {React.cloneElement(tool.icon, { className: 'w-5 h-5' })}
                    </div>
                    
                    <div className="space-y-1.5">
                      <h2 className={`font-black text-white transition-colors duration-300 group-hover:text-blue-400 ${tool.size === 'large' ? 'text-xl tracking-tighter' : 'text-base tracking-tight'}`}>
                        {tool.name}
                      </h2>
                      <p className={`text-slate-500 leading-relaxed font-medium transition-colors duration-300 group-hover:text-slate-400 ${tool.size === 'large' ? 'text-xs line-clamp-2' : 'text-[11px] line-clamp-1'}`}>
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 flex items-center gap-2 text-[8px] font-black text-blue-500 uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      Launch
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                      </svg>
                    </div>

                    {tool.size === 'large' && (
                      <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                         {React.cloneElement(tool.icon, { className: 'w-20 h-20' })}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}

          {/* Section 2: Architecture & Analysis */}
          <div className="md:col-span-4 lg:col-span-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 pt-10">
            <div className="col-span-full border-b border-slate-800/50 pb-4 flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Architecture & Analysis</span>
               <div className="flex-grow h-px bg-slate-800/50" />
            </div>
            
            {categories[1].tools.map((tool) => {
              const colorClass = getColorClasses(tool.color);
              return (
                <motion.div key={tool.to} variants={itemVariants} className="col-span-2 md:col-span-2 lg:col-span-2">
                  <Link to={tool.to} className="group block h-full">
                    <div className="h-full bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 hover:bg-slate-800/40 hover:border-slate-700 transition-all relative group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-500/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} border flex items-center justify-center shrink-0 shadow-inner`}>
                          {React.cloneElement(tool.icon, { className: 'w-4.5 h-4.5' })}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis uppercase tracking-tight">
                            {tool.name}
                          </h3>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate group-hover:text-slate-400 transition-colors italic">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Section 3: Engineering Guidelines */}
          <div className="md:col-span-4 lg:col-span-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 pt-10 pb-10">
            <div className="col-span-full border-b border-slate-800/50 pb-4 flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Engineering Guidelines</span>
               <div className="flex-grow h-px bg-slate-800/50" />
            </div>
            
            {categories[2].tools.map((tool) => {
              const colorClass = getColorClasses(tool.color);
              return (
                <motion.div key={tool.to} variants={itemVariants} className="col-span-2 md:col-span-2 lg:col-span-2">
                  <Link to={tool.to} className="group block h-full">
                    <div className="h-full bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 hover:bg-slate-800/40 hover:border-slate-700 transition-all relative group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-blue-500/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} border flex items-center justify-center shrink-0 shadow-inner`}>
                          {React.cloneElement(tool.icon, { className: 'w-4.5 h-4.5' })}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis uppercase tracking-tight">
                            {tool.name}
                          </h3>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate group-hover:text-slate-400 transition-colors italic">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
