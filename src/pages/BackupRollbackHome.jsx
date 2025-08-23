import React from 'react';
import ModuleLinks from './ModuleLinks';

const BackupRollbackHome = () => {
  const modules = [
    { name: 'Stored Procedure', to: '/backup&rollback/sp' },
    { name: 'Table', to: '/backup&rollback/table' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Backup & Rollback</h1>
      <ModuleLinks basePath="/backup&rollback" modules={modules} />
    </div>
  );
};

export default BackupRollbackHome;
