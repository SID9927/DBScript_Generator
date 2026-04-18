export const spTerms = [
    {
        name: "Parameter Sniffing",
        description: "Execution plan compilation based on initial parameter values.",
        impact: "CRITICAL (Stability)",
        color: "amber",
        icon: "👃",
        basics: "Imagine planning a road trip based ONLY on the first person's destination. If they say '2 miles', you bring no snacks. If the next person says '200 miles', you're in trouble! SQL Server sniffs the first parameter and locks in a plan. If that plan doesn't fit future values, performance crashes.",
        details: "Occurs when SQL Server generates an execution plan optimized for a specific set of parameters. If the data distribution is high-variance, the cached plan can be sub-optimal for other values.",
        scenario: "A report that runs fast for small customers but times out for massive enterprise clients.",
        code: `CREATE PROCEDURE dbo.SafeGet\n    @ID INT\nAS\nBEGIN\n    -- Mask the parameter to prevent sniffing\n    DECLARE @LocalID INT = @ID;\n    SELECT * FROM Data WHERE ID = @LocalID;\nEND`
    },
    {
        name: "SET NOCOUNT ON",
        description: "Suppresses 'x rows affected' network messages.",
        impact: "VITAL (Throughput)",
        color: "emerald",
        icon: "🔇",
        basics: "Every time SQL runs a line, it sends a tiny '1 row affected' message back. In a big procedure, that's a lot of useless chatter. SET NOCOUNT ON silences this, making your procedures leaner and faster.",
        details: "Stops the DONE_IN_PROC message from being sent to the client. This reduces network overhead and prevents complex front-end frameworks from misinterpreting multiple return messages.",
        scenario: "High-frequency API calls where every bit of network latency adds up.",
        code: `CREATE PROCEDURE dbo.LeanUpdate\nAS\nBEGIN\n    SET NOCOUNT ON; -- The first line of every SP\n    UPDATE Sessions SET Status = 'Active';\nEND`
    },
    {
        name: "TVP",
        description: "Passing table variables as parameters to procedures.",
        impact: "ELITE (Bulk Ops)",
        color: "indigo",
        icon: "📊",
        basics: "Instead of calling a procedure 100 times to insert 100 people, just send one list! Table-Valued Parameters (TVPs) let you pass an entire table in a single trip. It's like handing a grocery list instead of shouting items one by one.",
        details: "Allows multiple rows of data to be sent in a single round trip. Much more efficient than multiple calls or passing giant XML/JSON strings.",
        scenario: "Saving a complex Invoice with 50 line items in one transaction.",
        code: `/* 1. Define Type */\nCREATE TYPE ItemList AS TABLE (ID INT, Qty INT);\n\n/* 2. Use in SP */\nCREATE PROCEDURE dbo.SaveList\n    @Items ItemList READONLY\nAS...`
    },
    {
        name: "Recompilation",
        description: "Forcing a new execution plan generation at runtime.",
        impact: "RECOVERY (Logic)",
        color: "purple",
        icon: "♻️",
        basics: "Sometimes a stored plan is 'stale' or broken. Recompilation throws it away and asks SQL for new directions. It uses more CPU but ensures you have the absolute best path for the current data.",
        details: "Forces SQL Server to ignore the cache. Can be done at the procedure level (WITH RECOMPILE) or statement level (OPTION RECOMPILE).",
        scenario: "Queries targeting temporary tables where the volume changes by millions of rows daily.",
        code: `SELECT * FROM #Batch\nOPTION (RECOMPILE); -- Fresh plan every time`
    },
    {
        name: "Dynamic SQL",
        description: "Constructing and executing SQL strings at runtime.",
        impact: "DANGER (Security)",
        color: "amber",
        icon: "🧨",
        basics: "Power but dangerous. It lets you write code that writes code. Used for flexible search filters. MUST be handled with sp_executesql to avoid SQL Injection hackers.",
        details: "Building queries as NVARCHAR(MAX). It bypasses plan reuse if not parameterized and requires EXECUTE permissions on underlying tables.",
        scenario: "Building a complex 'Search everything' filter with 20 optional toggles.",
        code: `DECLARE @SQL NVARCHAR(MAX) = N'SELECT * FROM Log WHERE ID = @ID';\nEXEC sp_executesql @SQL, N'@ID INT', @ID = 5;`
    }
];
