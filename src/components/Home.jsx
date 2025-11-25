import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconBackup,
  IconTable,
  IconStoredProcedure,
  IconSearch,
  IconChart,
  IconLightning,
  IconEye,
  IconRocket
} from './Icons';

const Home = () => {
  const modules = [
    {
      name: 'Backup and Rollback',
      to: '/backup&rollback',
      description: 'Generate backup and rollback scripts for stored procedures and tables.',
      icon: <IconBackup className="w-8 h-8 text-blue-600" />
    },
    {
      name: 'Table Guide',
      to: '/table-guide',
      description: 'Comprehensive guide for table operations, DDL, and DML.',
      icon: <IconTable className="w-8 h-8 text-blue-600" />
    },
    {
      name: 'Stored Procedures',
      to: '/stored-procedures-guide',
      description: 'Learn about stored procedures, transactions, and best practices.',
      icon: <IconStoredProcedure className="w-8 h-8 text-blue-600" />
    },
    {
      name: 'Index Guide',
      to: '/indexes',
      description: 'Master database indexes for optimal query performance.',
      icon: <IconSearch className="w-8 h-8 text-blue-600" />
    },
    {
      name: 'Execution Plan',
      to: '/execution-plan',
      description: 'Learn to read and optimize SQL Server execution plans.',
      icon: <IconChart className="w-8 h-8 text-blue-600" />
    },
    {
      name: 'Trigger Guide',
      to: '/triggers',
      description: 'Understanding and implementing database triggers.',
      icon: <IconLightning className="w-8 h-8 text-blue-600" />
    },
    {
      name: 'View Guide',
      to: '/views',
      description: 'Create and manage database views effectively.',
      icon: <IconEye className="w-8 h-8 text-blue-600" />
    },
    {
      name: 'Performance',
      to: '/withnolock',
      description: 'Enhance stored procedures with NOLOCK hints.',
      icon: <IconRocket className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          DB Script Generator
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Your comprehensive toolkit for database script generation and management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link
            key={module.to}
            to={module.to}
            className="group block h-full"
          >
            <div className="bg-white border border-slate-200 rounded-lg p-6 h-full hover:border-blue-400 hover:shadow-md transition-all duration-200">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg inline-block group-hover:bg-blue-100 transition-colors">
                {module.icon}
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {module.name}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {module.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

