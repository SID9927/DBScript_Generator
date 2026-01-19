import React from 'react';
import ModuleLinks from './ModuleLinks';

const BackupRollbackHome = () => {
  const modules = [
    { name: 'Stored Procedure', to: '/backup&rollback/sp' },
    { name: 'Table', to: '/backup&rollback/table' },
    { name: 'Function', to: '/backup&rollback/function' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Backup & Rollback
      </h1>
      <ModuleLinks basePath="/backup&rollback" modules={modules} />
    </div>
  );
};

export default BackupRollbackHome;

