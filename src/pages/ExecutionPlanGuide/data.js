export const executionPlanTerms = [
    {
        name: 'Index Seek',
        description: 'Primary high-speed data retrieval protocol.',
        icon: '🎯',
        color: 'green',
        impact: 'Very Efficient',
        basics: 'The engine uses a B-Tree index to pinpoint exactly where your rows are. This is the gold standard of data access.',
        details: 'Unlike a scan, which reads an entire structure, a seek navigates the branching nodes of an index. It only touches the level of pages necessary to satisfy the query predicate.',
        scenario: 'Searching for a specific EmployeeID in a table of 10 million records with a Clustered Index.',
        code: '-- Optimized Index Seek Pattern\nSELECT Name, Email \nFROM Employees WITH(INDEX(IX_EmployeeID))\nWHERE EmployeeID = 10452;'
    },
    {
        name: 'Index Scan',
        description: 'Linear search through an index structure.',
        icon: '📖',
        color: 'orange',
        impact: 'Moderate Cost',
        basics: 'The engine reads every single page of the index from start to finish. Slower than a seek but faster than a Table Scan.',
        details: 'Usually occurs when the WHERE clause is not highly selective or uses a non-SARGable operator (like LIKE "%text").',
        scenario: 'Searching for names that start with a specific character where no narrow index exists.',
        code: '-- Likely triggers an Index Scan\nSELECT Name \nFROM Employees \nWHERE Name LIKE "%son";'
    },
    {
        name: 'Table Scan',
        description: 'Complete read of all data pages in a Heap.',
        icon: '🚜',
        color: 'red',
        impact: 'High Cost',
        basics: 'Occurs on tables without Clustered Indexes (Heaps). Every block of data is read into memory.',
        details: 'Extremely I/O intensive. As the table grows, the query cost scales linearly. Always a candidate for Clustered Indexing.',
        scenario: 'A large logs table without any indexes being queried for a specific date range.',
        code: '-- Triggers Table Scan on a Heap\nSELECT LogMessage \nFROM SystemLogs \nWHERE LogDate > "2023-01-01";'
    },
    {
        name: 'Key Lookup',
        description: 'Fetching missing columns from the Clustered Index.',
        icon: '🔍',
        color: 'orange',
        impact: 'Hidden Debt',
        basics: 'The engine found a row in a non-clustered index, but that index didn\'t have all the columns needed. It has to "look up" the rest from the actual table.',
        details: 'Every lookup is an extra random I/O operation. If a query performs 1,000 lookups, it can be significantly slower than a single scan.',
        scenario: 'Selecting * using a non-clustered index that only contains "LastName".',
        code: '-- Triggers Key Lookup\n-- Fix: Add "FirstName" as an INCLUDED column to index\nSELECT FirstName, LastName \nFROM Users \nWHERE LastName = "Smith";'
    },
    {
        name: 'Nested Loops',
        description: 'Joining datasets through repeated iterations.',
        icon: '🔄',
        color: 'green',
        impact: 'Precision Join',
        basics: 'For every row in the first table, the engine searches for matching rows in the second table. Very fast for small inner datasets.',
        details: 'Typically selected when one side of the join is very small and the join column on the other side is indexed.',
        scenario: 'Joining a tiny "Categories" table to a large "Products" table using the CategoryID index.',
        code: '-- Efficient Nested Loop Join\nSELECT p.ProductName, c.CategoryName\nFROM Products p\nINNER JOIN Categories c ON p.CategoryID = c.CategoryID\nWHERE c.CategoryID = 5;'
    },
    {
        name: 'Hash Match',
        description: 'Memory-intensive join for large unsorted data.',
        icon: '🎲',
        color: 'orange',
        impact: 'RAM Intensive',
        basics: 'The engine builds a hash table in memory for one dataset and probes it with the other. Used for large joins that lack indexes.',
        details: 'Fastest for large, unsorted data but requires significant memory. Can spill to TempDB (Slow) if memory is insufficient.',
        scenario: 'Joining two massive tables on columns that have no indexes at all.',
        code: '-- Logic heavy join requiring Hash Match\nSELECT a.BigData, b.MassiveData\nFROM LargeTableA a\nINNER JOIN LargeTableB b ON a.UnindexedID = b.UnindexedID;'
    }
];
