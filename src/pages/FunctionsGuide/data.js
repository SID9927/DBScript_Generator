export const functionTerms = [
    {
        name: "Scalar Function",
        description: "Returns a single atomic value from specified inputs.",
        impact: "DANGER (Performance)",
        color: "amber",
        icon: "🔢",
        basics: "A Scalar Function is like a mini-calculator. You give it inputs, and it gives you back ONE answer. Great for math or formatting, but dangerous on big tables because it runs once for every single row—potentially millions of times!",
        details: "User-Defined Scalar Functions can prevent parallel execution plans in older SQL versions. Since SQL Server 2019, many can be inlined, but they still carry overhead compared to native expressions.",
        scenario: "Calculating 'TotalTax' for a single row in an invoice report.",
        code: `CREATE FUNCTION dbo.AddTax(@Val MONEY)\nRETURNS MONEY AS\nBEGIN\n    RETURN @Val * 1.15;\nEND`
    },
    {
        name: "Inline TVF",
        description: "Returns a table result set; treated as a view by the optimizer.",
        impact: "ELITE (Scalability)",
        color: "emerald",
        icon: "📊",
        basics: "The 'Superhero' of functions. It returns a whole list of rows like a View, but accepts parameters. Because it's 'Inline', SQL Server can peek inside and optimize it perfectly. Always use this instead of Scalar functions when possible.",
        details: "An iTVF is expanded into the main query by the optimizer, meaning no context-switching overhead. It supports parallel plans and is highly sargable.",
        scenario: "Fetching all 'ActiveOrders' for a specific CustomerID dynamically.",
        code: `CREATE FUNCTION dbo.GetCustOrders(@ID INT)\nRETURNS TABLE AS\nRETURN (\n    SELECT * FROM Orders WHERE CID = @ID\n);`
    },
    {
        name: "Determinism",
        description: "Guarantees identical output for identical input parameters.",
        impact: "VITAL (Indexing)",
        color: "indigo",
        icon: "🎲",
        basics: "Deterministic functions are reliable: 2+2 always equals 4. Nondeterministic ones are like asking 'what time is it?'—the answer changes. SQL Server only allows you to index (save) results of Deterministic functions.",
        details: "Affects whether the function can be used in Indexed Views or Persisted Computed Columns. GETDATE() is nondeterministic; SQUARE() is deterministic.",
        scenario: "Trying to index a 'YearOfBirth' column based on a birthday instead of a 'CurrentAge' column.",
        code: `-- Deterministic\nCREATE FUNCTION dbo.Squared(@N INT)\nRETURNS INT AS ...`
    },
    {
        name: "Schema Binding",
        description: "Locks underlying structures to prevent breaking changes.",
        impact: "CRITICAL (Stability)",
        color: "purple",
        icon: "🔒",
        basics: "Like a legal contract between your function and your tables. It says 'You cannot delete or change these tables while my function relies on them'. This prevents accidentally breaking your logic when altering the database.",
        details: "WITH SCHEMABINDING is required for indexing the results of a function. It also provides a minor performance boost as it bypasses some metadata checks.",
        scenario: "A multi-billion dollar calculation that must not break if a junior dev tries to rename the 'Sales' table.",
        code: `CREATE FUNCTION dbo.CalcProfit()\nRETURNS MONEY\nWITH SCHEMABINDING\nAS ...`
    },
    {
        name: "UDF Inlining",
        description: "Automatic transformation of scalar logic into relational expressions.",
        impact: "ELITE (Optimization)",
        color: "emerald",
        icon: "🧬",
        basics: "A new feature in SQL 2019. It automatically fixes the 'slow scalar' problem by pulling your function code directly into the main query. It's like the database automatically optimizing your bad code for you.",
        details: "Available in SQL Server 2019+. It targets T-SQL scalar UDFs, converting them into subqueries or joins during compilation to enable parallelism and better estimates.",
        scenario: "Upgrading an old database to SQL 2019 and seeing all your scalar functions suddenly run 10x faster.",
        code: `-- No code changes needed!\n-- Check sys.sql_modules.is_inlineable`
    }
];
