import React, { useEffect, useState } from 'react'

const Tables = () => {
   const [tableName, setTableName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [backupScript, setBackupScript] = useState('');
  const [rollbackScript, setRollbackScript] = useState('');
  const [defaultSuffix, setDefaultSuffix] = useState('');

  // Generate default suffix on component mount
    useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}${mm}${yyyy}`;
    setDefaultSuffix(`bkup${formattedDate}`);
  }, []);

  const generateTableScripts = () => {
    const actualSuffix = suffix.trim() !== '' ? suffix : defaultSuffix; // Use default if empty
    const backupName = `${tableName}_${actualSuffix}`;

    const tableBackup = `
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableName}') 
AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${backupName}')
BEGIN
    SELECT * INTO ${backupName} FROM ${tableName};
END
GO`.trim();

    const tableRollback = `
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${backupName}')
BEGIN
    DROP TABLE ${tableName};
    SELECT * INTO ${tableName} FROM ${backupName};
END
GO`.trim();

    setBackupScript(tableBackup);
    setRollbackScript(tableRollback);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Enter Table Name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        placeholder={`Enter Backup Suffix (default: ${defaultSuffix})`} //  Show dynamic hint
        value={suffix}
        onChange={(e) => setSuffix(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={generateTableScripts}
      >
        Generate
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-md font-semibold">Backup Script:</h3>
          <textarea
            className="w-full h-80 p-2 border border-gray-300 rounded font-mono"
            value={backupScript}
            readOnly
          />
        </div>

        <div>
          <h3 className="text-md font-semibold">Rollback Script:</h3>
          <textarea
            className="w-full h-80 p-2 border border-gray-300 rounded font-mono"
            value={rollbackScript}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Tables
