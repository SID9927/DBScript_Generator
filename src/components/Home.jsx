import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, staggerItem, cardHover } from '../utils/animations';

const Home = ({ title }) => {
  const modules = [
    {
      name: 'Backup and Rollback',
      to: '/backup&rollback',
      description: 'Generate backup and rollback scripts for stored procedures and tables',
      icon: '🔄',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Table Guide',
      to: '/table-guide',
      description: 'Comprehensive guide for table operations, DDL, and DML',
      icon: '📊',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Stored Procedures Guide',
      to: '/stored-procedures-guide',
      description: 'Learn about stored procedures, transactions, and best practices',
      icon: '⚙️',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Index Guide',
      to: '/indexes',
      description: 'Master database indexes for optimal query performance',
      icon: '🔍',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      name: 'Execution Plan Guide',
      to: '/execution-plan',
      description: 'Learn to read and optimize SQL Server execution plans',
      icon: '📈',
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      name: 'Trigger Guide',
      to: '/triggers',
      description: 'Understanding and implementing database triggers',
      icon: '⚡',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'View Guide',
      to: '/views',
      description: 'Create and manage database views effectively',
      icon: '👁️',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Performance: WITH (NOLOCK)',
      to: '/withnolock',
      description: 'Enhance stored procedures with NOLOCK hints',
      icon: '🚀',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <motion.div
      className="p-8 max-w-7xl mx-auto"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-5xl font-extrabold mb-3 gradient-text text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        DB Script Generator
      </motion.h1>

      <motion.p
        className="text-center text-gray-600 mb-12 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Your comprehensive toolkit for database script generation and management
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {modules.map((module, index) => (
          <motion.div
            key={module.to}
            variants={staggerItem}
            whileHover="hover"
            initial="rest"
          >
            <Link to={module.to}>
              <motion.div
                className="relative group h-full"
                variants={cardHover}
              >
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}></div>

                {/* Card content */}
                <div className="relative bg-white rounded-2xl p-6 h-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  {/* Icon */}
                  <motion.div
                    className="text-5xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {module.icon}
                  </motion.div>

                  {/* Title */}
                  <h2 className={`text-xl font-bold mb-2 bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent`}>
                    {module.name}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {module.description}
                  </p>

                  {/* Arrow indicator */}
                  <motion.div
                    className="absolute bottom-4 right-4 text-gray-400 group-hover:text-indigo-600"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Home;

