import React, { useEffect, useState } from 'react';
import SubNav from '../components/SubNav';
import SEO from '../components/SEO';

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

  const clearAll = () => {
    setSpName('');
    setSuffix('');
    setBackupScript('');
    setRollbackScript('');
    setBulkInput('');
  };

  return (
    <>
      <SEO
        title="Stored Procedure Backup"
        description="Safely generate backup and rollback scripts for SQL Server Stored Procedures. Supports bulk generation."
      />
      <SubNav />
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Stored Procedure Backup & Rollback
        </h1>

        {/* Mode Selector */}
        <div className="flex gap-1 mb-8 border-b border-slate-700">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'single'
              ? 'text-blue-400 border-blue-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
          >
            Single SP
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${mode === 'bulk'
              ? 'text-blue-400 border-blue-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
          >
            Bulk SPs
          </button>
        </div>

        <div className="space-y-6">
          {mode === 'single' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Stored Procedure Name
                </label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 warning-transition"
                  type="text"
                  placeholder="Enter Stored Procedure Name"
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Backup Suffix <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="text"
                  placeholder={`Default: ${defaultSuffix}`}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Leave empty to use default: {defaultSuffix}
                </p>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  className="btn-primary"
                  onClick={generateSingleScript}
                  disabled={!spName || isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Scripts'}
                </button>
                {(backupScript || rollbackScript) && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-red-600 hover:text-red-800 border border-slate-200 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Stored Procedure Names <span className="text-slate-500 font-normal">(One per line)</span>
                </label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm h-48"
                  placeholder={`USP_GetCustomers\nUSP_GetOrders\nUSP_GetProducts`}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Backup Suffix <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-md"
                  type="text"
                  placeholder={`Default: ${defaultSuffix}`}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Same suffix will be applied to all SPs. Default: {defaultSuffix}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn-primary"
                  onClick={generateBulkScripts}
                  disabled={!bulkInput.trim() || isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Bulk Scripts'}
                </button>
                {(backupScript || rollbackScript) && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-red-600 hover:text-red-800 border border-slate-200 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scripts Output */}
          {(backupScript || rollbackScript) && (
            <div className="mt-12 pt-8 border-t border-slate-700">
              {/* Summary Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Procedures
                  </div>
                  <div className="text-2xl font-bold text-slate-200">
                    {mode === 'single' ? (spName ? 1 : 0) : bulkInput.split('\n').filter(l => l.trim()).length}
                  </div>
                </div>

                <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Total Objects
                  </div>
                  <div className="text-2xl font-bold text-slate-200">
                    {mode === 'single' ? (spName ? 1 : 0) : bulkInput.split('\n').filter(l => l.trim()).length}
                  </div>
                </div>

                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Script Lines
                  </div>
                  <div className="text-2xl font-bold text-slate-200">
                    {backupScript.split('\n').length + rollbackScript.split('\n').length}
                  </div>
                </div>

                <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                    Safety Checks
                  </div>
                  <div className="text-2xl font-bold text-slate-200">
                    {
                      ((backupScript.match(/IF EXISTS/g) || []).length +
                        (backupScript.match(/IF NOT EXISTS/g) || []).length +
                        (rollbackScript.match(/IF EXISTS/g) || []).length +
                        (rollbackScript.match(/IF NOT EXISTS/g) || []).length)
                    }
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Backup Script
                    </h3>
                    <button
                      className={`text-xs px-2 py-1 rounded border transition-colors ${copiedBackup ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700'}`}
                      onClick={() => copyToClipboard(backupScript, 'backup')}
                    >
                      {copiedBackup ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                  <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                    <textarea
                      className="w-full h-80 p-4 bg-transparent text-blue-300 font-mono text-sm focus:outline-none resize-none"
                      value={backupScript}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Rollback Script
                    </h3>
                    <button
                      className={`text-xs px-2 py-1 rounded border transition-colors ${copiedRollback ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700'}`}
                      onClick={() => copyToClipboard(rollbackScript, 'rollback')}
                    >
                      {copiedRollback ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                  <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                    <textarea
                      className="w-full h-80 p-4 bg-transparent text-blue-300 font-mono text-sm focus:outline-none resize-none"
                      value={rollbackScript}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div >
    </>
  );
};

export default StoredProcedure;
