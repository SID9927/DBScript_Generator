export const viewTerms = [
    {
        name: "Standard View",
        description: "A virtual table defined by a saved query; metadata only.",
        impact: "VITAL (Abstraction)",
        color: "sky",
        icon: "🖼️",
        basics: "The 'Shortcut'. It doesn't store any data itself; it just remembers a specific SELECT statement. When you query the view, SQL Server quickly runs the underlying query. Perfect for hiding complex joins from end-users.",
        details: "Non-materialized. Always reflects the live state of the underlying tables. Can be joined with other tables/views as if it were a physical entity.",
        scenario: "Hiding sensitive 'Salary' columns from a general 'EmployeeInfo' dashboard.",
        code: `CREATE VIEW vw_Staff AS\nSELECT Name, Dept FROM Employees;`
    },
    {
        name: "Indexed View",
        description: "A view materialized on disk through a Unique Clustered Index.",
        impact: "ELITE (Performance)",
        color: "emerald",
        icon: "⚡",
        basics: "The 'Snapshot'. Unlike a standard view, this one actually saves its results to disk. It's automatically updated whenever the source tables change. It combines the speed of a table with the logic of a query.",
        details: "Requires WITH SCHEMABINDING. The first index must be a Unique Clustered Index. Great for pre-calculating complex aggregations in reporting environments.",
        scenario: "Fast-tracking a dashboard that calculates SUM(Sales) across 50 million rows.",
        code: `CREATE VIEW vw_Totals WITH SCHEMABINDING AS\nSELECT ID, SUM(Amt) FROM dbo.Sells GROUP BY ID;\nCREATE UNIQUE CLUSTERED INDEX IX_V ON vw_Totals(ID);`
    },
    {
        name: "Partitioned View",
        description: "A UNION ALL of horizontally partitioned data across tables.",
        impact: "CRITICAL (Scale)",
        color: "indigo",
        icon: "🧩",
        basics: "The 'Container'. It stitches together several smaller tables (like 'Sales2023' and 'Sales2024') making them look like one giant table. Great for managing massive datasets without creating a single monstrous table.",
        details: "Supported across multiple servers (Distributed Partitioned Views). The optimizer can prune specific tables from the plan based on check constraints.",
        scenario: "Querying historical archive tables alongside active production data seamlessly.",
        code: `CREATE VIEW vw_AllYears AS\nSELECT * FROM Sales2022 UNION ALL SELECT * FROM Sales2023;`
    },
    {
        name: "Schema Binding",
        description: "Prevents structural changes to underlying tables.",
        impact: "CRITICAL (Stability)",
        color: "red",
        icon: "🔒",
        basics: "The 'Safety Lock'. It creates a dependency that prevents anyone from dropping or changing the tables that the view relies on. If you try to change a column used by the view, SQL Server will block you.",
        details: "Mandatory for Indexed Views. Requires the use of two-part names (dbo.TableName) in the SELECT statement.",
        scenario: "Ensuring an automated financial report never breaks due to a junior dev renaming a column.",
        code: `CREATE VIEW vw_Fixed WITH SCHEMABINDING AS\nSELECT ID FROM dbo.Hardware;`
    },
    {
        name: "Updatable View",
        description: "A view that supports INSERT, UPDATE, or DELETE operations.",
        impact: "MODERATE (Logic)",
        color: "amber",
        icon: "✍️",
        basics: "The 'Proxy'. In some cases, you can actually save data *through* the view into the real table. It only works if the view is simple (no joins, no groups, no distincts).",
        details: "Modifications can only affect one underlying table at a time. INSTEAD OF triggers can be used to make complex views updatable.",
        scenario: "Allowing a specific department to update only their own contact info via a filtered view.",
        code: `UPDATE vw_SalesContacts SET Phone = '555-0101' WHERE ID = 5;`
    }
];
