import React, { useEffect, useState } from 'react';
import SubNav from '../components/SubNav';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, staggerItem } from '../utils/animations';

const Tables = () => {
  const [tableName, setTableName] = useState('');
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
      const backupName = `${tableName}_${actualSuffix}`;

      // Backup Script: Create a copy of the table with all data
      const sqlBackupScript = `
-- Backup Table: ${tableName}
-- Creates a complete copy of the table structure and data

-- Check if backup table already exists, if so drop it
IF EXISTS (SELECT * FROM sys.tables WHERE name = '${backupName}')
BEGIN
    DROP TABLE [dbo].[${backupName}];
END
GO

-- Create backup table with all data
SELECT * 
INTO [dbo].[${backupName}]
FROM [dbo].[${tableName}];
GO

-- Verify backup
SELECT COUNT(*) AS BackupRowCount FROM [dbo].[${backupName}];
GO`.trim();

      // Rollback Script: Restore from backup
      const sqlRollbackScript = `
-- Rollback Table: ${tableName}
-- Restores table from backup copy

-- Check if backup exists
IF EXISTS (SELECT * FROM sys.tables WHERE name = '${backupName}')
BEGIN
    -- Drop current table if exists
    IF EXISTS (SELECT * FROM sys.tables WHERE name = '${tableName}')
    BEGIN
        DROP TABLE [dbo].[${tableName}];
    END
    
    -- Restore from backup
    SELECT * 
    INTO [dbo].[${tableName}]
    FROM [dbo].[${backupName}];
    
    -- Verify restoration
    SELECT COUNT(*) AS RestoredRowCount FROM [dbo].[${tableName}];
    
    PRINT 'Table ${tableName} restored successfully from ${backupName}';
END
ELSE
BEGIN
    PRINT 'ERROR: Backup table ${backupName} does not exist!';
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
      const tableNames = bulkInput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (tableNames.length === 0) {
        setIsGenerating(false);
        return;
      }

      let backupScripts = [];
      let rollbackScripts = [];

      tableNames.forEach(tableName => {
        const backupName = `${tableName}_${actualSuffix}`;

        backupScripts.push(`
-- ============================================
-- Backup Table: ${tableName}
-- ============================================

-- Check if backup table already exists, if so drop it
IF EXISTS (SELECT * FROM sys.tables WHERE name = '${backupName}')
BEGIN
    DROP TABLE [dbo].[${backupName}];
END
GO

-- Create backup table with all data
SELECT * 
INTO [dbo].[${backupName}]
FROM [dbo].[${tableName}];
GO

-- Verify backup
SELECT COUNT(*) AS BackupRowCount_${tableName} FROM [dbo].[${backupName}];
GO`);

        rollbackScripts.push(`
-- ============================================
-- Rollback Table: ${tableName}
-- ============================================

-- Check if backup exists
IF EXISTS (SELECT * FROM sys.tables WHERE name = '${backupName}')
BEGIN
    -- Drop current table if exists
    IF EXISTS (SELECT * FROM sys.tables WHERE name = '${tableName}')
    BEGIN
        DROP TABLE [dbo].[${tableName}];
    END
    
    -- Restore from backup
    SELECT * 
    INTO [dbo].[${tableName}]
    FROM [dbo].[${backupName}];
    
    -- Verify restoration
    SELECT COUNT(*) AS RestoredRowCount_${tableName} FROM [dbo].[${tableName}];
    
    PRINT 'Table ${tableName} restored successfully';
END
ELSE
BEGIN
    PRINT 'ERROR: Backup table ${backupName} does not exist!';
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
          Table Backup & Rollback
        </motion.h1>

        <motion.div
          className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-blue-800">
            <strong>💡 How it works:</strong> Backup creates a complete copy of your table with all data using <code className="bg-blue-100 px-1 rounded">SELECT * INTO</code>.
            Rollback restores the original table from the backup copy.
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-3 font-semibold transition-all ${mode === 'single'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-cyan-500'
              }`}
          >
            📝 Single Table
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-3 font-semibold transition-all ${mode === 'bulk'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-cyan-500'
              }`}
          >
            📋 Bulk Tables
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
                  Table Name
                </label>
                <input
                  className="input-modern"
                  type="text"
                  placeholder="Enter Table Name (e.g., Customers)"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
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
                  Backup table will be named: <strong>{tableName || 'TableName'}_{suffix || defaultSuffix}</strong>
                </p>
              </motion.div>

              <motion.div variants={staggerItem}>
                <motion.button
                  className="btn-primary w-full md:w-auto"
                  onClick={generateSingleScript}
                  disabled={!tableName || isGenerating}
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
                  Table Names (One per line)
                </label>
                <textarea
                  className="input-modern h-48 font-mono text-sm custom-scrollbar"
                  placeholder={`Enter multiple table names, one per line:\n\nCustomers\nOrders\nProducts\nInventory\nOrderDetails`}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter one table name per line
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
                  Same suffix will be applied to all tables. Default: {defaultSuffix}
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
                <h3 className="text-lg font-semibold mb-3 text-cyan-700">
                  📝 Backup Script
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Creates a complete copy of the table with all data
                </p>
                <div className="relative">
                  <textarea
                    className="w-full h-96 p-4 border-2 border-cyan-200 rounded-xl font-mono text-sm bg-gradient-to-br from-gray-50 to-cyan-50 focus:outline-none focus:border-cyan-400 transition-colors custom-scrollbar"
                    value={backupScript}
                    readOnly
                  />
                  <motion.button
                    className={`absolute top-2 right-2 px-3 py-1 text-white text-xs rounded-lg transition-colors ${copiedBackup ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-700'
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
                <h3 className="text-lg font-semibold mb-3 text-blue-700">
                  🔄 Rollback Script
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Restores the original table from backup
                </p>
                <div className="relative">
                  <textarea
                    className="w-full h-96 p-4 border-2 border-blue-200 rounded-xl font-mono text-sm bg-gradient-to-br from-gray-50 to-blue-50 focus:outline-none focus:border-blue-400 transition-colors custom-scrollbar"
                    value={rollbackScript}
                    readOnly
                  />
                  <motion.button
                    className={`absolute top-2 right-2 px-3 py-1 text-white text-xs rounded-lg transition-colors ${copiedRollback ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
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

export default Tables;
