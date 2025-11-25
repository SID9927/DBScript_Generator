import React, { useEffect, useState } from 'react';
import SubNav from '../components/SubNav';

const StoredProcedure = () => {
  const [spName, setSpName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [backupScript, setBackupScript] = useState('');
  const [rollbackScript, setRollbackScript] = useState('');
  const [defaultSuffix, setDefaultSuffix] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [bulkInput, setBulkInput] = useState('');
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [copiedRollback, setCopiedRollback] = useState(false);

  // Generate default suffix on component mount
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}${mm}${yyyy}`;
    setDefaultSuffix(`bkup${formattedDate}`);
  }, []);

  const generateSingleScript = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const actualSuffix = suffix.trim() !== '' ? suffix : defaultSuffix;
      const backupName = `${spName}_${actualSuffix}`;

      const sqlBackupScript = `
 IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${spName}') 
 AND NOT EXISTS (SELECT * FROM sys.procedures WHERE name = '${backupName}') 
 BEGIN
     EXEC sp_rename '${spName}', '${backupName}';
 END
 GO`.trim();

      const sqlRollbackScript = `
 IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${backupName}') 
 BEGIN
     IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${spName}') 
         DROP PROCEDURE dbo.${spName};
 
     EXEC sp_rename '${backupName}', '${spName}';
 END
 GO`.trim();

      setBackupScript(sqlBackupScript);
      setRollbackScript(sqlRollbackScript);
      setIsGenerating(false);
    }, 300);
  };

  const generateBulkScripts = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const actualSuffix = suffix.trim() !== '' ? suffix : defaultSuffix;
      const spNames = bulkInput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (spNames.length === 0) {
        setIsGenerating(false);
        return;
      }

      let backupScripts = [];
      let rollbackScripts = [];

      spNames.forEach(spName => {
        const backupName = `${spName}_${actualSuffix}`;

        backupScripts.push(`
-- Backup: ${spName}
IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${spName}') 
AND NOT EXISTS (SELECT * FROM sys.procedures WHERE name = '${backupName}') 
BEGIN
    EXEC sp_rename '${spName}', '${backupName}';
END
GO`);

        rollbackScripts.push(`
-- Rollback: ${spName}
IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${backupName}') 
BEGIN
    IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${spName}') 
        DROP PROCEDURE dbo.${spName};
    
    EXEC sp_rename '${backupName}', '${spName}';
END
GO`);
      });

      setBackupScript(backupScripts.join('\n\n').trim());
      setRollbackScript(rollbackScripts.join('\n\n').trim());
      setIsGenerating(false);
    }, 300);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'backup') {
        setCopiedBackup(true);
        setTimeout(() => setCopiedBackup(false), 2000);
      } else {
        setCopiedRollback(true);
        setTimeout(() => setCopiedRollback(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <SubNav />
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">
          Stored Procedure Backup & Rollback
        </h1>

        {/* Mode Selector */}
        <div className="flex gap-1 mb-8 border-b border-slate-200">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'single'
              ? 'text-blue-600 border-blue-600'
              : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
          >
            Single SP
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'bulk'
              ? 'text-blue-600 border-blue-600'
              : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
          >
            Bulk SPs
          </button>
        </div>

        <div className="space-y-6">
          {mode === 'single' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stored Procedure Name
                </label>
                <input
                  className="input-modern"
                  type="text"
                  placeholder="Enter Stored Procedure Name"
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Backup Suffix <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  className="input-modern"
                  type="text"
                  placeholder={`Default: ${defaultSuffix}`}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Leave empty to use default: {defaultSuffix}
                </p>
              </div>

              <div className="md:col-span-2">
                <button
                  className="btn-primary"
                  onClick={generateSingleScript}
                  disabled={!spName || isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Scripts'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stored Procedure Names <span className="text-slate-400 font-normal">(One per line)</span>
                </label>
                <textarea
                  className="input-modern h-48 font-mono text-sm"
                  placeholder={`USP_GetCustomers\nUSP_GetOrders\nUSP_GetProducts`}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Backup Suffix <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  className="input-modern max-w-md"
                  type="text"
                  placeholder={`Default: ${defaultSuffix}`}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Same suffix will be applied to all SPs. Default: {defaultSuffix}
                </p>
              </div>

              <div>
                <button
                  className="btn-primary"
                  onClick={generateBulkScripts}
                  disabled={!bulkInput.trim() || isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Bulk Scripts'}
                </button>
              </div>
            </div>
          )}

          {/* Scripts Output */}
          {(backupScript || rollbackScript) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t border-slate-200">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Backup Script
                  </h3>
                  <button
                    className={`text-xs px-2 py-1 rounded border ${copiedBackup ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    onClick={() => copyToClipboard(backupScript, 'backup')}
                  >
                    {copiedBackup ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
                <div className="code-block">
                  <textarea
                    className="w-full h-80 p-4 bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none"
                    value={backupScript}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Rollback Script
                  </h3>
                  <button
                    className={`text-xs px-2 py-1 rounded border ${copiedRollback ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    onClick={() => copyToClipboard(rollbackScript, 'rollback')}
                  >
                    {copiedRollback ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
                <div className="code-block">
                  <textarea
                    className="w-full h-80 p-4 bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none"
                    value={rollbackScript}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoredProcedure;
