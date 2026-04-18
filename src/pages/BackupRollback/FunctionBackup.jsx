import React from 'react';
import BackupOrchestrator from './BackupOrchestrator';
import SEO from '../../components/SEO';

const FunctionBackup = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
             <SEO title="Function Backup & Rollback | Developer Suite" description="Safe schema renaming and restoration cluster for Scalar and Table-Valued functions." />
             <BackupOrchestrator 
                type="function"
                title="Function Signature"
                subtitle="High-fidelity logic preservation cluster."
                protocol="Backup renames functions using sp_rename. Rollback drops the active function and restores from the backup node to ensure logic continuity."
                generateBackup={(name, bName) => `
-- Backup Function: ${name}
IF EXISTS (SELECT * FROM sys.objects WHERE (type = 'FN' OR type = 'TF' OR type = 'IF') AND name = '${name}') 
AND NOT EXISTS (SELECT * FROM sys.objects WHERE (type = 'FN' OR type = 'TF' OR type = 'IF') AND name = '${bName}') 
BEGIN
    EXEC sp_rename '${name}', '${bName}';
END
GO`.trim()}
                generateRollback={(name, bName) => `
-- Rollback Function: ${name}
IF EXISTS (SELECT * FROM sys.objects WHERE (type = 'FN' OR type = 'TF' OR type = 'IF') AND name = '${bName}') 
BEGIN
    IF EXISTS (SELECT * FROM sys.objects WHERE (type = 'FN' OR type = 'TF' OR type = 'IF') AND name = '${name}') 
        DROP FUNCTION dbo.${name};

    EXEC sp_rename '${bName}', '${name}';
END
GO`.trim()}
             />
        </div>
    );
};

export default FunctionBackup;
