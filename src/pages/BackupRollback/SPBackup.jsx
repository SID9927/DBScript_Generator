import React from 'react';
import BackupOrchestrator from './BackupOrchestrator';
import SEO from '../../components/SEO';

const SPBackup = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
             <SEO title="Stored Procedure Backup | Developer Suite" description="Generate secure SQL Server Stored Procedure backup and rollback scripts." />
             <BackupOrchestrator 
                type="procedure"
                title="Procedure Identity"
                subtitle="Safe schema renaming and restoration cluster."
                protocol="Backup renames existing procedures using sp_rename. The rollback procedure drops current active object and restores the original from the backup cluster."
                generateBackup={(name, bName) => `
IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${name}') 
AND NOT EXISTS (SELECT * FROM sys.procedures WHERE name = '${bName}') 
BEGIN
    EXEC sp_rename '${name}', '${bName}';
END
GO`.trim()}
                generateRollback={(name, bName) => `
IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${bName}') 
BEGIN
    IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${name}') 
        DROP PROCEDURE dbo.${name};

    EXEC sp_rename '${bName}', '${name}';
END
GO`.trim()}
             />
        </div>
    );
};

export default SPBackup;
