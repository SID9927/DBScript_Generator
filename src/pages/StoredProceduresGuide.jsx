import React, { useState } from "react";

// --- Reusable Components ---
const CodeBlock = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative my-4">
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-slate-700 text-white px-2 py-1 text-xs rounded hover:bg-slate-600 transition-colors"
            >
                {copied ? "✅ Copied!" : "Copy"}
            </button>
            <pre className="bg-slate-900 text-blue-200 p-4 rounded-lg overflow-x-auto text-sm border border-slate-700">
                <code>{children}</code>
            </pre>
        </div>
    );
};

const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b border-slate-200 pb-2">
        {children}
    </h2>
);

const SubSectionTitle = ({ children }) => (
    <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-3">
        {children}
    </h3>
);

const InfoCard = ({ type = "info", children }) => {
    const styles = {
        info: "bg-blue-50 border-blue-500 text-blue-800",
        success: "bg-green-50 border-green-500 text-green-800",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
        danger: "bg-red-50 border-red-500 text-red-800",
    };
    return (
        <div className={`p-4 my-4 rounded-md border-l-4 ${styles[type]}`}>
            {children}
        </div>
    );
};

// --- Interactive Playground for Stored Procedures ---
const SPPlayground = () => {
    const [name, setName] = useState("USP_GetActiveEmployees");
    const [parameters, setParameters] = useState([
        { name: "IsActive", type: "Char", defaultValue: "1", mode: "INPUT" }
    ]);
    const [body, setBody] = useState(
        "SELECT EmployeeID, FirstName, LastName\nFROM Employees\nWHERE IsActive = @IsActive;"
    );
    const [useTransaction, setUseTransaction] = useState(false);
    const [useErrorHandling, setUseErrorHandling] = useState(false);
    const [isolationLevel, setIsolationLevel] = useState(""); // empty means optional
    const [noCount, setNoCount] = useState(true);

    const addParameter = () => {
        setParameters([...parameters, { name: "", type: "INT", defaultValue: "", mode: "INPUT" }]);
    };

    const removeParameter = (index) => {
        const updated = [...parameters];
        updated.splice(index, 1);
        setParameters(updated);
    };

    const updateParameter = (index, field, value) => {
        const updated = [...parameters];
        updated[index][field] = value;
        setParameters(updated);
    };

    const generateSQL = () => {
        const paramString = parameters
            .filter(p => p.name)
            .map(p => {
                const outputSuffix = p.mode === "OUTPUT" ? " OUTPUT" : "";
                return `@${p.name} ${p.type}${p.defaultValue ? ` = ${p.defaultValue}` : ""}${outputSuffix}`;
            })
            .join(",\n    ");

        let bodySQL = body;

        if (useTransaction) {
            bodySQL = `BEGIN TRANSACTION;\n\n${bodySQL}\n\nCOMMIT TRANSACTION;`;
        }

        if (useErrorHandling) {
            bodySQL = `BEGIN TRY\n    ${bodySQL.replace(/\n/g, "\n    ")}\nEND TRY\nBEGIN CATCH\n    ROLLBACK TRANSACTION;\n    INSERT INTO ErrorLogs (ErrorMessage, ErrorTime)\n    VALUES (ERROR_MESSAGE(), GETDATE());\n    THROW;\nEND CATCH`;
        }

        const isolationSQL = isolationLevel ? `SET TRANSACTION ISOLATION LEVEL ${isolationLevel};\n\n` : "";
        const noCountSQL = noCount ? "SET NOCOUNT ON;\n\n" : "SET NOCOUNT OFF;\n\n";

        return `CREATE PROCEDURE ${name}${paramString ? "\n" + paramString : ""}
AS
BEGIN
    ${noCountSQL}${isolationSQL}${bodySQL}
END;`;
    };

    return (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">🛠 Try It Yourself: Stored Procedure Generator</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-semibold text-slate-700">Procedure Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-modern w-full"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold text-slate-700">Parameters</label>
                    {parameters.map((param, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center flex-wrap">
                            <input
                                type="text"
                                placeholder="Name"
                                value={param.name}
                                onChange={(e) => updateParameter(index, "name", e.target.value)}
                                className="input-modern flex-1 min-w-[120px]"
                            />
                            <input
                                type="text"
                                placeholder="Type"
                                value={param.type}
                                onChange={(e) => updateParameter(index, "type", e.target.value)}
                                className="input-modern w-24"
                            />
                            <input
                                type="text"
                                placeholder="Default"
                                value={param.defaultValue}
                                onChange={(e) => updateParameter(index, "defaultValue", e.target.value)}
                                className="input-modern w-24"
                            />
                            <select
                                value={param.mode}
                                onChange={(e) => updateParameter(index, "mode", e.target.value)}
                                className="input-modern w-28"
                            >
                                <option value="INPUT">INPUT</option>
                                <option value="OUTPUT">OUTPUT</option>
                            </select>
                            <button
                                onClick={() => removeParameter(index)}
                                className="text-red-500 hover:text-red-700 px-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addParameter}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        + Add Parameter
                    </button>
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-4 mt-2">
                    <label className="flex items-center gap-2 text-slate-700">
                        <input
                            type="checkbox"
                            checked={useTransaction}
                            onChange={(e) => setUseTransaction(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        Use Transaction
                    </label>
                    <label className="flex items-center gap-2 text-slate-700">
                        <input
                            type="checkbox"
                            checked={useErrorHandling}
                            onChange={(e) => setUseErrorHandling(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        Use Error Handling & Logging
                    </label>
                    <label className="flex items-center gap-2 text-slate-700">
                        <input
                            type="checkbox"
                            checked={noCount}
                            onChange={(e) => setNoCount(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        SET NOCOUNT ON
                    </label>
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold text-slate-700">Transaction Isolation Level (Optional)</label>
                    <select
                        value={isolationLevel}
                        onChange={(e) => setIsolationLevel(e.target.value)}
                        className="input-modern w-full md:w-1/2"
                    >
                        <option value="">None</option>
                        <option value="READ UNCOMMITTED">READ UNCOMMITTED</option>
                        <option value="READ COMMITTED">READ COMMITTED</option>
                        <option value="REPEATABLE READ">REPEATABLE READ</option>
                        <option value="SERIALIZABLE">SERIALIZABLE</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold text-slate-700">Procedure Body (SQL)</label>
                    <textarea
                        rows="6"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="input-modern w-full font-mono text-sm"
                    />
                </div>
            </div>

            {/* Live Preview */}
            <CodeBlock>{generateSQL()}</CodeBlock>
        </div>
    );
};


// --- Main Guide Component ---
const StoredProceduresGuide = () => {
    const [activeTab, setActiveTab] = useState("guide");
    const [expandedTerm, setExpandedTerm] = useState(null);

    const toggleTerm = (index) => {
        setExpandedTerm(expandedTerm === index ? null : index);
    };

    const terms = [
        {
            name: "Parameter Sniffing",
            description: "SQL Server compiles a plan based on the first parameters passed, which may not be optimal for all cases.",
            impact: "Can cause sudden performance degradation.",
            color: "red",
            icon: "👃",
            basics: "Imagine you're planning a road trip based on the first destination you hear. If someone first says 'drive 2 miles to the store', you plan for a short trip. But then everyone else wants to go 200 miles away! Parameter Sniffing is when SQL Server creates a query plan based on the FIRST set of parameters it sees, which might not work well for other parameter values. This can make queries mysteriously slow.",
            details: "When a stored procedure is executed for the first time (or after recompilation), SQL Server 'sniffs' the parameter values to create an execution plan. If the first execution uses values that are not representative of typical data distribution (e.g., a date range returning 1 row vs 1 million rows), the cached plan might be terrible for subsequent runs.",
            scenario: "A 'GetOrders' report runs instantly for a single day query but times out when a user selects a full year, or vice versa, because it's using a plan optimized for the wrong data volume.",
            code: `CREATE PROCEDURE dbo.GetOrders @FromDate DATETIME
AS
BEGIN
    -- Fix: Use local variable to prevent sniffing
    DECLARE @LocalFromDate DATETIME = @FromDate;
    SELECT * FROM Orders WHERE OrderDate >= @LocalFromDate;
END`
        },
        {
            name: "SET NOCOUNT ON",
            description: "Suppresses the 'x rows affected' message after every statement.",
            impact: "Reduces network traffic and client processing overhead.",
            color: "green",
            icon: "🔇",
            basics: "Every time SQL Server runs a query, it normally sends back a message like '5 rows affected'. In a stored procedure with 20 statements, that's 20 extra messages sent over the network! SET NOCOUNT ON tells SQL Server 'don't send me those messages, just do the work'. This makes your procedures faster, especially over slow networks. Always put this as the first line in your stored procedures.",
            details: "By default, SQL Server sends a 'DONE_IN_PROC' message for every statement in a stored procedure (e.g., '1 row affected'). In complex procedures with loops or many statements, this generates significant network chatter.",
            scenario: "High-throughput transaction systems where every millisecond of network latency counts. Always include this as the first line in your SPs.",
            code: `CREATE PROCEDURE dbo.FastUpdate
AS
BEGIN
    SET NOCOUNT ON; -- 🚀 Performance boost
    UPDATE Users SET LastLogin = GETDATE();
END`
        },
        {
            name: "Dynamic SQL",
            description: "SQL code generated and executed at runtime (e.g., using sp_executesql).",
            impact: "Flexible but risky (SQL Injection) and hard to optimize.",
            color: "orange",
            icon: "🧨",
            basics: "Dynamic SQL is when you build a SQL query as a text string in your code and then execute it. It's like writing a recipe on the fly instead of following a cookbook. This is useful when you don't know ahead of time what columns to search or what tables to query. BUT it's dangerous - if you're not careful, hackers can inject malicious SQL into your query string (SQL Injection). Always use sp_executesql with parameters, never concatenate user input directly!",
            details: "Dynamic SQL allows you to construct query strings programmatically. It is useful for optional search filters but breaks the ownership chain and can be a security vulnerability if not parameterized.",
            scenario: "Building a search screen where users can filter by Name, Date, Status, or any combination of 10 different fields.",
            code: `DECLARE @SQL NVARCHAR(MAX) = N'SELECT * FROM Users WHERE 1=1';
IF @Name IS NOT NULL
    SET @SQL += N' AND Name = @Name';

-- Execute safely
EXEC sp_executesql @SQL, N'@Name NVARCHAR(50)', @Name;`
        },
        {
            name: "TVP (Table-Valued Parameter)",
            description: "Allows passing a table variable as a parameter to a stored procedure.",
            impact: "Efficient for bulk inserts/updates.",
            color: "blue",
            icon: "📊",
            basics: "Normally, you can only pass simple values to a stored procedure (like a number or a string). But what if you want to pass an entire table of data? That's what TVPs (Table-Valued Parameters) do! Instead of calling a procedure 100 times to insert 100 rows, you can pass all 100 rows at once in a single call. It's like handing someone a shopping list instead of telling them one item at a time.",
            details: "TVPs allow you to send multiple rows of data to a stored procedure in a single round trip, rather than calling the procedure repeatedly or constructing a giant XML/JSON string.",
            scenario: "Saving a complex Order with multiple OrderDetails (Line Items) in a single database call.",
            code: `/* 1. Create Type */
CREATE TYPE OrderItemType AS TABLE (
    ProductId INT, Quantity INT
);
GO

/* 2. Use in SP */
CREATE PROCEDURE dbo.SaveOrder
    @Items OrderItemType READONLY
AS
BEGIN
    INSERT INTO OrderDetails (ProductId, Quantity)
    SELECT ProductId, Quantity FROM @Items;
END`
        },
        {
            name: "Recompilation",
            description: "Forcing a new execution plan to be generated.",
            impact: "Fixes bad plans but consumes CPU.",
            color: "yellow",
            icon: "♻️",
            basics: "SQL Server normally saves (caches) the execution plan for a query so it doesn't have to figure out the best way to run it every time. But sometimes that saved plan becomes outdated or was bad to begin with. Recompilation forces SQL Server to throw away the old plan and create a fresh one. It's like asking for new directions instead of using old ones that might be wrong. The downside? Creating a new plan uses CPU, so don't do it unnecessarily.",
            details: "Sometimes a cached plan is so bad that it's better to pay the CPU cost to compile a new one. You can force this at the procedure level or statement level.",
            scenario: "A query inside an SP that targets a temporary table where the data volume varies wildly between executions.",
            code: `SELECT * FROM #TempResults
OPTION (RECOMPILE); -- New plan for this statement every time`
        },
        {
            name: "Output Parameter",
            description: "Returns a value back to the caller.",
            impact: "Faster than returning a result set for single values.",
            color: "blue",
            icon: "📤",
            basics: "Normally, a stored procedure returns data as a table (result set). But what if you just want to return a single value, like the ID of a newly created record? That's what Output Parameters are for. They're like function return values in programming. Instead of sending back a whole table, you just send back one number or string. This is much faster and uses less memory than returning a result set with one row.",
            details: "Output parameters allow a stored procedure to return scalar values (integers, strings, etc.) back to the calling application without the overhead of a result set.",
            scenario: "Returning the newly generated Identity ID after an INSERT operation.",
            code: `CREATE PROCEDURE dbo.InsertUser
    @Name NVARCHAR(50),
    @NewId INT OUTPUT
AS
BEGIN
    INSERT INTO Users (Name) VALUES (@Name);
    SET @NewId = SCOPE_IDENTITY();
END`
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-3 text-slate-900">Stored Procedures Guide</h1>
            <p className="text-slate-600 mb-8 text-lg">
                Enterprise-grade development practices for SQL Server Stored Procedures.
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
                {['guide', 'terms', 'playground'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === tab
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-blue-500'
                            }`}
                    >
                        {tab === 'guide' && '📚 Guide'}
                        {tab === 'terms' && '📖 Terms Dictionary'}
                        {tab === 'playground' && '🛠 Playground'}
                    </button>
                ))}
            </div>

            {/* Guide Tab */}
            {activeTab === 'guide' && (
                <div className="space-y-8">
                    <InfoCard type="info">
                        <strong>Corporate Best Practice:</strong> Treat Stored Procedures as an API for your database. They should handle data logic, security, and integrity, but avoid heavy business logic that belongs in the application layer.
                    </InfoCard>

                    <SectionTitle>📖 Basics: What is a Stored Procedure?</SectionTitle>
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                        <p className="text-slate-700 leading-relaxed mb-4">
                            A <strong>Stored Procedure (SP)</strong> is a saved collection of SQL statements that you can run as a single unit. Think of it like a recipe or a function in programming:
                        </p>
                        <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                            <li>You write the SQL code once and save it in the database</li>
                            <li>You can call it by name whenever you need it</li>
                            <li>It can accept <strong>parameters</strong> (inputs) and return results</li>
                            <li>The database compiles and optimizes it for better performance</li>
                        </ul>

                        <SubSectionTitle>Why Use Stored Procedures?</SubSectionTitle>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-4 rounded border border-green-200">
                                <h4 className="font-bold text-green-700 mb-2">✅ Benefits</h4>
                                <ul className="text-sm text-slate-700 space-y-1">
                                    <li>• Faster execution (pre-compiled)</li>
                                    <li>• Better security (hide SQL from users)</li>
                                    <li>• Reusable code (write once, use many times)</li>
                                    <li>• Reduced network traffic</li>
                                </ul>
                            </div>
                            <div className="bg-white p-4 rounded border border-green-200">
                                <h4 className="font-bold text-orange-700 mb-2">⚠️ When NOT to Use</h4>
                                <ul className="text-sm text-slate-700 space-y-1">
                                    <li>• Complex business logic (belongs in app)</li>
                                    <li>• Simple one-time queries</li>
                                    <li>• When debugging is critical</li>
                                </ul>
                            </div>
                        </div>

                        <SubSectionTitle>Your First Stored Procedure</SubSectionTitle>
                        <p className="text-slate-700 leading-relaxed mb-2">
                            Here's a simple example that gets all employees:
                        </p>
                        <CodeBlock>{`CREATE PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT EmployeeID, FirstName, LastName, Email
    FROM Employees;
END;

-- How to call it:
EXEC GetAllEmployees;`}</CodeBlock>

                        <SubSectionTitle>Adding Parameters</SubSectionTitle>
                        <p className="text-slate-700 leading-relaxed mb-2">
                            Parameters make stored procedures flexible. You can pass values to filter or customize the results:
                        </p>
                        <CodeBlock>{`CREATE PROCEDURE GetEmployeesByDepartment
    @DepartmentID INT          -- Input parameter
AS
BEGIN
    SELECT EmployeeID, FirstName, LastName
    FROM Employees
    WHERE DepartmentID = @DepartmentID;
END;

-- How to call it with a parameter:
EXEC GetEmployeesByDepartment @DepartmentID = 5;`}</CodeBlock>

                        <SubSectionTitle>Input vs Output Parameters</SubSectionTitle>
                        <div className="bg-white p-4 rounded border border-green-200 mb-4">
                            <p className="text-slate-700 mb-2">
                                <strong>INPUT parameters</strong> (default): You send data INTO the procedure
                            </p>
                            <p className="text-slate-700">
                                <strong>OUTPUT parameters</strong>: The procedure sends data BACK to you
                            </p>
                        </div>
                        <CodeBlock>{`CREATE PROCEDURE AddEmployee
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @NewEmployeeID INT OUTPUT    -- This will return a value
AS
BEGIN
    INSERT INTO Employees (FirstName, LastName)
    VALUES (@FirstName, @LastName);
    
    SET @NewEmployeeID = SCOPE_IDENTITY();  -- Get the new ID
END;

-- How to use OUTPUT parameter:
DECLARE @NewID INT;
EXEC AddEmployee 
    @FirstName = 'Jane', 
    @LastName = 'Smith',
    @NewEmployeeID = @NewID OUTPUT;
    
SELECT @NewID AS 'New Employee ID';`}</CodeBlock>

                        <SubSectionTitle>Common Patterns</SubSectionTitle>
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded border border-green-200">
                                <strong className="text-green-700">1. Always start with SET NOCOUNT ON</strong>
                                <p className="text-sm text-slate-600 mt-1">Prevents unnecessary "rows affected" messages, improving performance</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-green-200">
                                <strong className="text-green-700">2. Use TRY...CATCH for error handling</strong>
                                <p className="text-sm text-slate-600 mt-1">Gracefully handle errors instead of crashing</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-green-200">
                                <strong className="text-green-700">3. Use transactions for multiple operations</strong>
                                <p className="text-sm text-slate-600 mt-1">Ensure all-or-nothing execution (atomicity)</p>
                            </div>
                        </div>

                        <SubSectionTitle>Complete Example with Best Practices</SubSectionTitle>
                        <CodeBlock>{`CREATE PROCEDURE UpdateEmployeeSalary
    @EmployeeID INT,
    @NewSalary DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;  -- ✅ Best practice #1
    
    BEGIN TRY
        BEGIN TRANSACTION;  -- ✅ Best practice #3
        
        -- Validate input
        IF @NewSalary < 0
        BEGIN
            RAISERROR('Salary cannot be negative', 16, 1);
            RETURN;
        END
        
        -- Perform the update
        UPDATE Employees
        SET Salary = @NewSalary
        WHERE EmployeeID = @EmployeeID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH  -- ✅ Best practice #2
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        -- Re-throw the error
        THROW;
    END CATCH
END;`}</CodeBlock>
                    </div>

                    <SectionTitle>1. Essential Best Practices</SectionTitle>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <SubSectionTitle>Performance</SubSectionTitle>
                            <ul className="list-disc list-inside text-slate-700 space-y-2">
                                <li>Always use <code>SET NOCOUNT ON;</code> at the start.</li>
                                <li>Specify column names in SELECTs (no <code>SELECT *</code>).</li>
                                <li>Use <code>sp_executesql</code> for dynamic SQL to allow plan reuse.</li>
                                <li>Avoid cursors; use set-based logic instead.</li>
                            </ul>
                        </div>
                        <div>
                            <SubSectionTitle>Security & Maintenance</SubSectionTitle>
                            <ul className="list-disc list-inside text-slate-700 space-y-2">
                                <li>Use schema-qualified names (e.g., <code>dbo.Employees</code>).</li>
                                <li>Validate parameters early.</li>
                                <li>Use <code>TRY...CATCH</code> for robust error handling.</li>
                            </ul>
                        </div>
                    </div>

                    <SectionTitle>2. Handling Parameter Sniffing</SectionTitle>
                    <p className="text-slate-700 leading-relaxed">
                        When a procedure is compiled, SQL Server "sniffs" the parameter values to create an optimal plan.
                        If the first execution uses atypical values, the cached plan might be terrible for subsequent runs.
                    </p>
                    <SubSectionTitle>Solution 1: Local Variables</SubSectionTitle>
                    <CodeBlock>{`CREATE PROCEDURE dbo.GetOrders
    @FromDate DATETIME
AS
BEGIN
    -- Mask the parameter to prevent sniffing
    DECLARE @LocalFromDate DATETIME = @FromDate;

    SELECT * FROM Orders WHERE OrderDate >= @LocalFromDate;
END`}</CodeBlock>
                    <SubSectionTitle>Solution 2: OPTION (RECOMPILE)</SubSectionTitle>
                    <CodeBlock>{`SELECT * FROM Orders 
WHERE OrderDate >= @FromDate
OPTION (RECOMPILE); -- Generates a new plan every time (CPU heavy)`}</CodeBlock>

                    <SectionTitle>3. Robust Error Handling</SectionTitle>
                    <p className="text-slate-700 leading-relaxed">
                        In production, unhandled errors can leave transactions open, causing locks and blocking.
                    </p>
                    <CodeBlock>{`CREATE PROCEDURE dbo.UpdateSalary
    @EmpID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE dbo.Employees SET Salary = @Amount WHERE EmployeeID = @EmpID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        -- Log error details
        DECLARE @Msg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Msg, 16, 1);
    END CATCH
END`}</CodeBlock>

                    <SectionTitle>4. Dynamic SQL Done Right</SectionTitle>
                    <p className="text-slate-700 leading-relaxed">
                        Dynamic SQL is powerful but dangerous. Never concatenate user input directly.
                    </p>
                    <InfoCard type="danger">
                        <strong>Bad (SQL Injection Risk):</strong> <code>EXEC('SELECT * FROM Users WHERE Name = ''' + @Name + '''')</code>
                    </InfoCard>
                    <InfoCard type="success">
                        <strong>Good (Parameterized):</strong> Use <code>sp_executesql</code>.
                    </InfoCard>
                    <CodeBlock>{`DECLARE @SQL NVARCHAR(MAX);
DECLARE @Params NVARCHAR(MAX);

SET @SQL = N'SELECT * FROM dbo.Users WHERE UserName = @User';
SET @Params = N'@User NVARCHAR(50)';

EXEC sp_executesql @SQL, @Params, @User = @InputName;`}</CodeBlock>
                </div>
            )}

            {/* Terms Tab */}
            {activeTab === 'terms' && (
                <div className="grid grid-cols-1 gap-4">
                    {terms.map((term, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all"
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                                onClick={() => toggleTerm(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{term.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{term.name}</h3>
                                        <p className="text-sm text-slate-600">{term.description}</p>
                                    </div>
                                </div>
                                <div className="text-slate-400">
                                    {expandedTerm === index ? "▲" : "▼"}
                                </div>
                            </div>

                            {expandedTerm === index && (
                                <div className="p-4 bg-slate-50 border-t border-slate-100">
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-700 mb-1">💡 Basics (For Beginners)</h4>
                                        <p className="text-slate-600 leading-relaxed">{term.basics}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-700 mb-1">📘 Technical Details</h4>
                                        <p className="text-slate-600 leading-relaxed">{term.details}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-700 mb-1">🏢 Real-World Scenario</h4>
                                        <p className="text-slate-600 leading-relaxed">{term.scenario}</p>
                                    </div>

                                    <div className="mb-2">
                                        <h4 className="font-semibold text-slate-700 mb-1">💻 Example</h4>
                                        <CodeBlock>{term.code}</CodeBlock>
                                    </div>

                                    <div className="mt-4 pt-2 border-t border-slate-200">
                                        <span className="text-sm font-medium text-slate-500">Impact: </span>
                                        <span className={`text-sm font-medium ${term.color === 'red' ? 'text-red-600' :
                                            term.color === 'orange' ? 'text-orange-600' :
                                                term.color === 'yellow' ? 'text-yellow-600' :
                                                    term.color === 'green' ? 'text-green-600' :
                                                        'text-blue-600'
                                            }`}>{term.impact}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Playground Tab */}
            {activeTab === 'playground' && (
                <SPPlayground />
            )}
        </div>
    );
};

export default StoredProceduresGuide;
