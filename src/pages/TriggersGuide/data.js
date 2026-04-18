export const triggerTerms = [
    {
        name: "AFTER Trigger",
        description: "Fires post-DML completion; the primary tool for auditing.",
        impact: "VITAL (Audit)",
        color: "emerald",
        icon: "⏭️",
        basics: "The 'Observer'. It waits until the row is successfully changed before it acts. If the original action fails, the trigger never fires. Perfect for history logs or keeping separate totals in sync.",
        details: "Executes after all constraints (Primary Key, Foreign Key) are validated. If the trigger code fails, the entire transaction is rolled back.",
        scenario: "Automatically adding a row to 'AuditLog' whenever an 'Employee' record is updated.",
        code: `CREATE TRIGGER TR_LogUpdate\nON Employees AFTER UPDATE AS\nBEGIN\n    INSERT INTO AuditLog SELECT * FROM inserted;\nEND`
    },
    {
        name: "INSTEAD OF Trigger",
        description: "Intercepts and replaces the original DML operation.",
        impact: "ELITE (Override)",
        color: "orange",
        icon: "🛑",
        basics: "The 'Interceptor'. It stops the original action (like DELETE) and does whatever you tell it to do instead. It's like a bouncer saying 'Wait, I'll handle that deletion differently'.",
        details: "Commonly used on Views to redirect updates to underlying base tables. Only one INSTEAD OF trigger per action (INSERT/UPDATE/DELETE) is allowed per table/view.",
        scenario: "Soft-deletes: Instead of deleting a customer, the trigger updates a 'IsActive' flag to 0.",
        code: `CREATE TRIGGER TR_SoftDelete\nON Sales INSTEAD OF DELETE AS\nBEGIN\n    UPDATE Sales SET Deleted = 1 WHERE ID IN (SELECT ID FROM deleted);\nEND`
    },
    {
        name: "Magic Tables",
        description: "Virtual tables 'inserted' and 'deleted' representing data state.",
        impact: "CRITICAL (Data)",
        color: "indigo",
        icon: "🪄",
        basics: "The 'Time Machine'. Inside a trigger, SQL gives you two temporary tables. 'inserted' shows the brand new data; 'deleted' shows exactly what was there before. Comparison is key here.",
        details: "Memory-resident structures. For UPDATES, 'deleted' has the old values and 'inserted' has the new ones. For INSERTS, only 'inserted' is populated.",
        scenario: "Checking if a price was lowered by more than 50% by comparing inserted vs deleted.",
        code: `IF EXISTS(SELECT 1 FROM inserted i JOIN deleted d ON i.ID = d.ID WHERE i.Price < d.Price * 0.5)...`
    },
    {
        name: "DDL Trigger",
        description: "Fires in response to schema changes like CREATE or DROP.",
        impact: "CRITICAL (Security)",
        color: "red",
        icon: "🏗️",
        basics: "The 'Gatekeeper'. Instead of watching data, it watches the structure of the database. It can prevent people from dropping tables or changing column types accidentally.",
        details: "Scoped to DATABASE or SERVER. Can use EVENTDATA() to capture details about the structural change attempt.",
        scenario: "Preventing anyone from dropping the 'Finance' table in the Production environment.",
        code: `CREATE TRIGGER TR_LockTables\nON DATABASE FOR DROP_TABLE AS\nBEGIN\n    ROLLBACK; PRINT 'DROP DENIED!';\nEND`
    },
    {
        name: "Recursive Trigger",
        description: "A trigger that initiates an action firing itself or another trigger.",
        impact: "DANGER (Stability)",
        color: "purple",
        icon: "🔄",
        basics: "The 'Chain Reaction'. If Trigger A updates a table that Trigger A is watching, it fires again. It can create infinite loops if not handled carefully. SQL Server limits this to 32 levels deep.",
        details: "Controlled by database settings (RECURSIVE_TRIGGERS). Can be direct (Trigger A -> Trigger A) or indirect (Trigger A -> Trigger B -> Trigger A).",
        scenario: "Updating a 'TotalChildCount' on a parent whenever a child is added, which might trigger another rollup.",
        code: `ALTER DATABASE [DB] SET RECURSIVE_TRIGGERS ON;`
    }
];
