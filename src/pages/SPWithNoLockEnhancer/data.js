export const performanceTerms = [
    {
        name: "WITH (NOLOCK)",
        description: "Bypasses shared locks to enable high-concurrency reads.",
        impact: "VITAL (Speed)",
        color: "emerald",
        icon: "🔓",
        basics: "The 'Speed Pass'. It tells SQL Server, 'I don’t want to wait for other people to finish their changes; just give me the data that is there right now.' It prevents your query from getting stuck behind a slow writers.",
        details: "Equivalent to READ UNCOMMITTED. It ignores X-locks and doesn't issue S-locks. Great for Reporting but dangerous for Financial logic due to Dirty Reads.",
        scenario: "Running a massive year-end report while the database is actively processing new sales.",
        code: `SELECT * FROM Orders WITH (NOLOCK);`
    },
    {
        name: "SARGable",
        description: "Search ARGument-able; query patterns that allow Index Seeks.",
        impact: "CRITICAL (I/O)",
        color: "amber",
        icon: "🎯",
        basics: "Being 'Smart'. It’s the difference between looking for a name in a phonebook (Index Seek) and reading every page of the phonebook from start to finish (Index Scan). Using functions on columns usually breaks this.",
        details: "Avoid wrapping columns in functions on the left side of the WHERE clause (e.g., YEAR(Date) = 2023). Use range comparisons instead.",
        scenario: "A query that took 5 minutes suddenly takes 5 milliseconds after changing a function to a range.",
        code: `WHERE Date >= '2023-01-01' AND Date < '2024-01-01'`
    },
    {
        name: "RCSI",
        description: "Read Committed Snapshot Isolation; versioning based concurrency.",
        impact: "ELITE (Architecture)",
        color: "indigo",
        icon: "📸",
        basics: "The 'Camera'. Instead of waiting or seeing dirty data, SQL Server gives you a 'photo' of how the data looked a split second ago (before the current change started). No blocking, No dirty reads.",
        details: "Uses TempDB to store versioned rows. Eliminates the need for NOLOCK in most modern applications while maintaining strict ACID compliance.",
        scenario: "Enabling this database-wide to fix 'Deadlock' issues without changing a single line of code.",
        code: `ALTER DATABASE [DB] SET READ_COMMITTED_SNAPSHOT ON;`
    },
    {
        name: "Parameter Sniffing",
        description: "Plan caching based on specific parameter distributions.",
        impact: "UNSTABLE (Latency)",
        color: "purple",
        icon: "👃",
        basics: "The 'Bad Memory'. SQL Server makes a plan based on the first person to call the procedure. If the first person asks for a tiny bit of data, and the next person asks for a mountain, the plan will be terrible for the second person.",
        details: "Results in erratic performance. Can be mitigated using OPTION (RECOMPILE), mask variables, or OPTIMIZE FOR hints.",
        scenario: "A report that is usually fast but 'randomly' takes forever until the server is restarted.",
        code: `OPTION (RECOMPILE); -- Forces fresh plan evaluation`
    },
    {
        name: "Implicit Conversion",
        description: "Performance cost when data types in JOIN/WHERE don't match.",
        impact: "DANGER (CPU)",
        color: "red",
        icon: "🔄",
        basics: "The 'Translator'. If you compare a Number column to a Text value, SQL Server has to translate every single row before comparing. This wastes a massive amount of CPU and kills index usage.",
        details: "Visible as a Warning in Execution Plans. Always match parameter types (e.g., VARCHAR vs NVARCHAR) exactly to column types.",
        scenario: "Finding that your CPU is at 100% because someone used an INT variable to search a VARCHAR column.",
        code: `-- Avoid: WHERE StringCol = @IntID\n-- Use: WHERE StringCol = CAST(@IntID AS VARCHAR)`
    }
];
