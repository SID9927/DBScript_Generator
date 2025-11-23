import React, { useEffect, useState } from 'react';
import SubNav from '../components/SubNav';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, staggerItem } from '../utils/animations';

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
      <motion.div
        className="p-8 max-w-7xl mx-auto"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold mb-6 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Stored Procedure Backup & Rollback
        </motion.h1>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-3 font-semibold transition-all ${mode === 'single'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-500'
              }`}
          >
            📝 Single SP
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-3 font-semibold transition-all ${mode === 'bulk'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-500'
              }`}
          >
            📋 Bulk SPs
          </button>
        </div>

        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {mode === 'single' ? (
            <>
              <motion.div variants={staggerItem}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stored Procedure Name
                </label>
                <input
                  className="input-modern"
                  type="text"
                  placeholder="Enter Stored Procedure Name"
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                />
              </motion.div>

              <motion.div variants={staggerItem}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Backup Suffix (Optional)
                </label>
                <input
                  className="input-modern"
                  type="text"
                  placeholder={`Default: ${defaultSuffix}`}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to use default: {defaultSuffix}
                </p>
              </motion.div>

              <motion.div variants={staggerItem}>
                <motion.button
                  className="btn-primary w-full md:w-auto"
                  onClick={generateSingleScript}
                  disabled={!spName || isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⚙️
                      </motion.span>
                      Generating...
                    </span>
                  ) : (
                    'Generate Scripts'
                  )}
                </motion.button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div variants={staggerItem}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stored Procedure Names (One per line)
                </label>
                <textarea
                  className="input-modern h-48 font-mono text-sm custom-scrollbar"
                  placeholder={`Enter multiple SP names, one per line:\n\nUSP_GetCustomers\nUSP_GetOrders\nUSP_GetProducts\nUSP_UpdateInventory`}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter one stored procedure name per line
                </p>
              </motion.div>

              <motion.div variants={staggerItem}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Backup Suffix (Optional)
                </label>
                <input
                  className="input-modern"
                  type="text"
                  placeholder={`Default: ${defaultSuffix}`}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Same suffix will be applied to all SPs. Default: {defaultSuffix}
                </p>
              </motion.div>

              <motion.div variants={staggerItem}>
                <motion.button
                  className="btn-primary w-full md:w-auto"
                  onClick={generateBulkScripts}
                  disabled={!bulkInput.trim() || isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⚙️
                      </motion.span>
                      Generating...
                    </span>
                  ) : (
                    'Generate Bulk Scripts'
                  )}
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Scripts Output */}
          {(backupScript || rollbackScript) && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h3 className="text-lg font-semibold mb-3 text-indigo-700">
                  📝 Backup Script
                </h3>
                <div className="relative">
                  <textarea
                    className="w-full h-80 p-4 border-2 border-indigo-200 rounded-xl font-mono text-sm bg-gradient-to-br from-gray-50 to-indigo-50 focus:outline-none focus:border-indigo-400 transition-colors custom-scrollbar"
                    value={backupScript}
                    readOnly
                  />
                  <motion.button
                    className={`absolute top-2 right-2 px-3 py-1 text-white text-xs rounded-lg transition-colors ${copiedBackup ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    onClick={() => copyToClipboard(backupScript, 'backup')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedBackup ? '✓ Copied!' : '📋 Copy'}
                  </motion.button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                  🔄 Rollback Script
                </h3>
                <div className="relative">
                  <textarea
                    className="w-full h-80 p-4 border-2 border-purple-200 rounded-xl font-mono text-sm bg-gradient-to-br from-gray-50 to-purple-50 focus:outline-none focus:border-purple-400 transition-colors custom-scrollbar"
                    value={rollbackScript}
                    readOnly
                  />
                  <motion.button
                    className={`absolute top-2 right-2 px-3 py-1 text-white text-xs rounded-lg transition-colors ${copiedRollback ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    onClick={() => copyToClipboard(rollbackScript, 'rollback')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedRollback ? '✓ Copied!' : '📋 Copy'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default StoredProcedure;
