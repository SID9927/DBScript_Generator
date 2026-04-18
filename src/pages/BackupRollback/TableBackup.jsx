import React from 'react';
import BackupOrchestrator from './BackupOrchestrator';
import SEO from '../../components/SEO';

const TableBackup = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
             <SEO title="Table Backup & Rollback | Developer Suite" description="Complete data and schema duplication cluster for SQL tables." />
             <BackupOrchestrator 
                type="table"
                title="Table Structure"
                subtitle="Complete data and schema duplication cluster."
                protocol="Backup creates a complete data clone using SELECT * INTO. The rollback sequence purges the active table and restores from the backup identity."
                generateBackup={(name, bName) => `
-- Backup Table: ${name}
IF EXISTS (SELECT * FROM sys.tables WHERE name = '${bName}')
BEGIN
    DROP TABLE [dbo].[${bName}];
END
GO

SELECT * INTO [dbo].[${bName}] FROM [dbo].[${name}];
GO`.trim()}
                generateRollback={(name, bName) => `
-- Rollback Table: ${name}
IF EXISTS (SELECT * FROM sys.tables WHERE name = '${bName}')
BEGIN
    IF EXISTS (SELECT * FROM sys.tables WHERE name = '${name}')
    BEGIN
        DROP TABLE [dbo].[${name}];
    END
    
    SELECT * INTO [dbo].[${name}] FROM [dbo].[${bName}];
END
GO`.trim()}
             />
        </div>
    );
};

export default TableBackup;
