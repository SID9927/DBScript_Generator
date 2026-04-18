export const indexTerms = [
    {
        name: "Clustered Index",
        description: "Sorts and stores the data rows in the table based on their key values.",
        impact: "VITAL (Physical Order)",
        color: "emerald",
        icon: "📚",
        basics: "Imagine a phone book. The entries are sorted alphabetically by name. This is a Clustered Index. The data itself is the index. You can only have one per table because data can only be sorted in one order physically.",
        details: "The leaf nodes of a clustered index contain the data pages of the underlying table. Searching by the clustered index key is the fastest way to retrieve a row.",
        scenario: "Primary Key on 'EmployeeID' or 'OrderDate' for sequential access.",
        code: `CREATE CLUSTERED INDEX IX_Employees_ID \nON Employees(EmployeeID);`
    },
    {
        name: "Non-Clustered Index",
        description: "A separate structure that points to the data rows.",
        impact: "HIGH (Query Speed)",
        color: "indigo",
        icon: "🔖",
        basics: "Imagine the index at the back of a textbook. It lists keywords and page numbers. To find 'Photosynthesis', you look in the index, get the page number, and then flip to that page. This is a Non-Clustered Index. The index is separate from the data.",
        details: "Contains the index key values and row locators (pointers) to the data. You can have multiple non-clustered indexes on a table.",
        scenario: "Searching for Employees by 'LastName' or 'Email' when the table is sorted by 'EmployeeID'.",
        code: `CREATE NONCLUSTERED INDEX IX_Employees_LastName \nON Employees(LastName);`
    },
    {
        name: "Unique Index",
        description: "Ensures that the index key contains no duplicate values.",
        impact: "CRITICAL (Integrity)",
        color: "purple",
        icon: "1️⃣",
        basics: "A Unique Index is like a rule that says 'No two people can have the same Social Security Number'. It prevents duplicate entries in the indexed column.",
        details: "Automatically created when you define a PRIMARY KEY or UNIQUE constraint. Can be clustered or non-clustered.",
        scenario: "Ensuring 'Email' addresses are unique in the Users table.",
        code: `CREATE UNIQUE INDEX IX_Users_Email \nON Users(Email);`
    },
    {
        name: "Filtered Index",
        description: "An optimized non-clustered index, especially suited to cover queries that select from a well-defined subset of data.",
        impact: "OPTIMIZATION (Subset)",
        color: "amber",
        icon: "🔍",
        basics: "A Filtered Index is like an index that only includes 'Active' employees. If you never search for 'Inactive' employees, why waste space indexing them? It uses a WHERE clause.",
        details: "Reduces index maintenance costs and storage size compared to full-table indexes. Great for sparse columns (many NULLs).",
        scenario: "Indexing 'EndDate' only for projects that are actually finished, or 'ManagerID' only for active employees.",
        code: `CREATE NONCLUSTERED INDEX IX_Employees_Active \nON Employees(ManagerID) \nWHERE IsActive = 1;`
    },
    {
        name: "Covering Index",
        description: "A non-clustered index that includes all columns needed for a query.",
        impact: "ELITE (No Lookup)",
        color: "emerald",
        icon: "☂️",
        basics: "A Covering Index is like having the answer written right in the index so you don't even have to flip to the page. If an index has all the data you asked for, SQL Server doesn't need to touch the table at all.",
        details: "Uses the INCLUDE clause to add non-key columns to the leaf level of the non-clustered index.",
        scenario: "A query that selects 'FirstName' and 'LastName' based on 'Email'. Indexing 'Email' and including 'FirstName' and 'LastName' covers the query.",
        code: `CREATE NONCLUSTERED INDEX IX_Employees_Email_Includes\nON Employees(Email)\nINCLUDE (FirstName, LastName);`
    },
    {
        name: "Heap",
        description: "A table without a clustered index.",
        impact: "NATIVE (Standard)",
        color: "slate",
        icon: "📦",
        basics: "A Heap is a pile of data with no order. New rows are just thrown in wherever there's space. It's fast to add data, but slow to find it later.",
        details: "Data is stored in no particular order. Useful for staging tables where data is inserted and then processed/moved.",
        scenario: "Staging tables for bulk data imports.",
        code: `CREATE TABLE Staging_Data (\n    RawData NVARCHAR(MAX)\n); -- No Primary Key defined`
    }
];
