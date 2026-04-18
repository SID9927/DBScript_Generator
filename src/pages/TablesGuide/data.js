export const tableTerms = [
    {
        name: "Heap",
        description: "A table without a clustered index. Data is stored in no particular order.",
        impact: "HIGH (Insert Speed)",
        color: "amber",
        icon: "📦",
        basics: "Think of a Heap like a messy drawer where you just toss items in without organizing them. When you create a table without specifying a Primary Key or Clustered Index, SQL Server creates it as a Heap. Data is stored in whatever order it arrives, making inserts very fast but searches slower since there's no organization.",
        details: "A Heap is a table structure where data pages are not linked in a sorted order. New records are inserted wherever there is space. This makes inserts very fast because there is no overhead of maintaining order.",
        scenario: "Staging tables for high-speed bulk inserts (ETL) where data is dumped and processed later.",
        code: `CREATE TABLE Staging_Logs (\n    LogMsg NVARCHAR(MAX)\n) WITH (HEAP); -- No PK, No Clustered Index`
    },
    {
        name: "Clustered Index",
        description: "Sorts and stores the data rows in the table based on their key values.",
        impact: "VITAL (Physical Order)",
        color: "emerald",
        icon: "🗂️",
        basics: "A Clustered Index is like a phone book where names are sorted alphabetically. The data itself is physically arranged in order. When you define a Primary Key, SQL Server automatically creates a Clustered Index on it. You can only have ONE per table since data can only be sorted one way physically.",
        details: "Determines the physical order of data in a table. The leaf nodes of the index contain the actual data pages. A table can have only one clustered index.",
        scenario: "Primary Keys on Identity columns or Date columns for sequential access.",
        code: `CREATE CLUSTERED INDEX IX_Orders_OrderDate \nON Orders(OrderDate);`
    },
    {
        name: "Identity Column",
        description: "A column that automatically generates numeric values.",
        impact: "STANDARD (Auto-PK)",
        color: "indigo",
        icon: "🔢",
        basics: "An Identity column is like an automatic ticket dispenser - it gives each new row a unique number without you having to think about it. When you insert a new Employee, you don't specify the ID; SQL Server assigns 1, 2, 3 automatically.",
        details: "An auto-incrementing integer. You define a seed (starting value) and an increment (IDENTITY(1,1)). It handles concurrency automatically.",
        scenario: "Generating unique primary keys for Employees, Orders, or any entity.",
        code: `CREATE TABLE Employees (\n    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,\n    Name NVARCHAR(100)\n);`
    },
    {
        name: "Computed Column",
        description: "A virtual column that is not physically stored, unless marked PERSISTED.",
        impact: "OPTIMIZATION (Logic)",
        color: "amber",
        icon: "🧮",
        basics: "A Computed Column is like a formula in Excel - it calculates its value based on other columns. For example, if you have Quantity and Price, the Total column multiplies them automatically.",
        details: "Derived from other columns in the same row. If marked PERSISTED, the value is calculated on write and stored physically, allowing it to be indexed.",
        scenario: "Calculating TotalAmount as (Quantity * UnitPrice) to ensure consistency.",
        code: `CREATE TABLE OrderDetails (\n    Quantity INT,\n    UnitPrice DECIMAL(10,2),\n    TotalAmount AS (Quantity * UnitPrice) PERSISTED\n);`
    },
    {
        name: "Temporal Table",
        description: "System-versioned table that keeps a full history of changes.",
        impact: "CRITICAL (Auditing)",
        color: "indigo",
        icon: "⏳",
        basics: "A Temporal Table is like having a time machine for your data. SQL Server automatically saves every version of every row whenever it changes. Perfect for compliance and auditing.",
        details: "Tracks history automatically. Maintain two tables: the current table and a history table. Query using FOR SYSTEM_TIME.",
        scenario: "Auditing changes to sensitive data like Salaries or Bank Accounts.",
        code: `CREATE TABLE Department (\n    DeptID INT PRIMARY KEY,\n    DeptName VARCHAR(50),\n    SysStartTime DATETIME2 GENERATED ALWAYS AS ROW START,\n    SysEndTime DATETIME2 GENERATED ALWAYS AS ROW END,\n    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime)\n) WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.DepartmentHistory));`
    },
    {
        name: "CDC",
        description: "Records insert, update, and delete activity applied to tables.",
        impact: "ELITE (ETL Sync)",
        color: "emerald",
        icon: "🔄",
        basics: "CDC (Change Data Capture) is like a security camera for your database - it records every change. Useful for syncing data to reporting systems efficiently.",
        details: "Records activity and makes it available in an easily consumed relational format. Much more efficient than full table scans.",
        scenario: "Streaming changes to a Data Warehouse or Analytics system in real-time.",
        code: `EXEC sys.sp_cdc_enable_table\n    @source_schema = N'dbo',\n    @source_name   = N'Orders',\n    @role_name     = NULL;`
    }
];
