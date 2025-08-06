import React, { useState } from 'react';

const RollbackScript = () => {
  const [spName, setSpName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [script, setScript] = useState('');

  const generateScript = () => {
    const backupName = `${spName}_${suffix}`;
    const sqlScript = `
IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${backupName}') 
BEGIN
    IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${spName}') 
        DROP PROCEDURE dbo.${spName};

    EXEC sp_rename '${backupName}', '${spName}';
END
GO`.trim();

    setScript(sqlScript);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Enter Stored Procedure Name"
        value={spName}
        onChange={(e) => setSpName(e.target.value)}
      />

      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Enter Backup Suffix (e.g. _bkup05082025)"
        value={suffix}
        onChange={(e) => setSuffix(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={generateScript}
      >
        Generate Rollback Script
      </button>

      <textarea
        className="w-full h-80 p-2 border border-gray-300 rounded font-mono"
        value={script}
        readOnly
      />
    </div>
  );
};

export default RollbackScript;