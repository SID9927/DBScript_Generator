import React from 'react';
import ModuleLinks from './ModuleLinks';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animations';

const BackupRollbackHome = () => {
  const modules = [
    { name: 'Stored Procedure', to: '/backup&rollback/sp' },
    { name: 'Table', to: '/backup&rollback/table' },
  ];

  return (
    <motion.div
      className="p-8"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-bold mb-6 gradient-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Backup & Rollback
      </motion.h1>
      <ModuleLinks basePath="/backup&rollback" modules={modules} />
    </motion.div>
  );
};

export default BackupRollbackHome;

