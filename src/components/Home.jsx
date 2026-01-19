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
  IconFunction
} from './Icons';
import SEO from './SEO';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const modules = [
    {
      name: 'Backup and Rollback',
      to: '/backup&rollback/sp',
      description: 'Generate backup and rollback scripts for stored procedures and tables.',
      icon: <IconBackup className="w-8 h-8" />,
      color: 'from-cyan-400 to-blue-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Alter Table',
      to: '/alter-table',
      description: 'Smart utilities to safely ADD or ALTER columns in bulk.',
      icon: <IconEdit className="w-8 h-8" />,
      color: 'from-violet-400 to-purple-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Table',
      to: '/table-guide',
      description: 'Comprehensive guide for table operations, DDL, and DML.',
      icon: <IconTable className="w-8 h-8" />,
      color: 'from-blue-400 to-indigo-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Stored Procedures',
      to: '/stored-procedures-guide',
      description: 'Learn about stored procedures, transactions, and best practices.',
      icon: <IconStoredProcedure className="w-8 h-8" />,
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Function',
      to: '/function-guide',
      description: 'Master Scalar and Table-Valued Functions (TVFs) with best practices.',
      icon: <IconFunction className="w-8 h-8" />,
      color: 'from-pink-400 to-rose-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Index',
      to: '/indexes',
      description: 'Master database indexes for optimal query performance.',
      icon: <IconSearch className="w-8 h-8" />,
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Execution Plan',
      to: '/execution-plan',
      description: 'Learn to read and optimize SQL Server execution plans.',
      icon: <IconChart className="w-8 h-8" />,
      color: 'from-rose-400 to-pink-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Trigger',
      to: '/triggers',
      description: 'Understanding and implementing database triggers.',
      icon: <IconLightning className="w-8 h-8" />,
      color: 'from-yellow-400 to-amber-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'View',
      to: '/views',
      description: 'Create and manage database views effectively.',
      icon: <IconEye className="w-8 h-8" />,
      color: 'from-sky-400 to-cyan-500',
      bg: 'bg-slate-800'
    },
    {
      name: 'Performance',
      to: '/withnolock',
      description: 'Enhance stored procedures with NOLOCK hints.',
      icon: <IconRocket className="w-8 h-8" />,
      color: 'from-fuchsia-400 to-purple-600',
      bg: 'bg-slate-800'
    },
    {
      name: 'Diff Viewer',
      to: '/diff-viewer',
      description: 'Compare text files line-by-line with a futuristic interface. (WIP)',
      icon: <IconCompare className="w-8 h-8" />,
      color: 'from-gray-400 to-slate-400',
      bg: 'bg-slate-800'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 relative overflow-hidden">
      <SEO
        title="Home"
        description="Empowering developers to master databases and boost productivity. Your ultimate toolkit for SQL Server management."
      />
      {/* Dark Mode Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 py-16 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
              DB PlayGround
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-slate-400 max-w-5xl mx-auto leading-relaxed border-b border-transparent hover:border-slate-700 inline-block pb-1 transition-colors"
          >
            Your ultimate toolkit for database management, optimization, and script generation.
          </motion.p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <motion.div
              key={module.to}
              variants={itemVariants}
            >
              <Link to={module.to} className="group block h-full">
                <div className="relative h-full bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-blue-900/20">

                  {/* Card content */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <div className={`text-transparent bg-clip-text bg-gradient-to-br ${module.color}`}>
                        {/* Render Icon cloned with fill color matching gradient (via text color class) */}
                        <div className={`text-slate-200 group-hover:text-white transition-colors [&>svg]:fill-current`}>
                          {React.cloneElement(module.icon, { className: 'w-7 h-7' })}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="text-slate-600 group-hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-200 mb-3 group-hover:text-white transition-colors">
                    {module.name}
                  </h2>

                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                    {module.description}
                  </p>

                  {/* Hover Gradient Overlay (Subtle) */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
