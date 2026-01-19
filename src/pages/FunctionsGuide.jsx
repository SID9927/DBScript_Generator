import React, { useState } from "react";
import SEO from '../components/SEO';

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
    <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-slate-700 pb-2">
        {children}
    </h2>
);

const SubSectionTitle = ({ children }) => (
    <h3 className="text-xl font-semibold text-slate-300 mt-6 mb-3">
        {children}
    </h3>
);

const InfoCard = ({ type = "info", children }) => {
    const styles = {
        info: "bg-blue-900/20 border-blue-500/50 text-blue-200",
        success: "bg-green-900/20 border-green-500/50 text-green-200",
        warning: "bg-yellow-900/20 border-yellow-500/50 text-yellow-200",
        danger: "bg-red-900/20 border-red-500/50 text-red-200",
    };
    return (
        <div className={`p-4 my-4 rounded-md border-l-4 ${styles[type]}`}>
            {children}
        </div>
    );
};

// --- Interactive Playground for Scalar Functions ---
const FunctionPlayground = () => {
    const [name, setName] = useState("dbo.CalculateTax");
    const [parameters, setParameters] = useState([
        { name: "Amount", type: "DECIMAL(10,2)", defaultValue: "" }
    ]);
    const [returnType, setReturnType] = useState("DECIMAL(10,2)");
    const [body, setBody] = useState("RETURN @Amount * 0.15;");
    const [isTableValued, setIsTableValued] = useState(false);

    const addParameter = () => {
        setParameters([...parameters, { name: "", type: "INT", defaultValue: "" }]);
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
            .map(p => `@${p.name} ${p.type}`)
            .join(",\n    ");

        if (isTableValued) {
            return `CREATE FUNCTION ${name} (
    ${paramString}
)
RETURNS TABLE
AS
RETURN
(
    ${body}
);`;
        } else {
            return `CREATE FUNCTION ${name} (
    ${paramString}
)
RETURNS ${returnType}
AS
BEGIN
    ${body}
END;`;
        }
    };

    return (
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">🛠 Try It Yourself: Function Generator</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2 text-slate-300">
                        <input
                            type="radio"
                            checked={!isTableValued}
                            onChange={() => setIsTableValued(false)}
                            name="funcType"
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        Scalar Function
                    </label>
                    <label className="flex items-center gap-2 text-slate-300">
                        <input
                            type="radio"
                            checked={isTableValued}
                            onChange={() => setIsTableValued(true)}
                            name="funcType"
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        Inline Table-Valued Function (TVF)
                    </label>
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-slate-300">Function Name (with Schema)</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {!isTableValued && (
                    <div>
                        <label className="block mb-2 font-semibold text-slate-300">Return Type</label>
                        <input
                            type="text"
                            value={returnType}
                            onChange={(e) => setReturnType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                )}

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold text-slate-300">Parameters</label>
                    {parameters.map((param, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center flex-wrap">
                            <input
                                type="text"
                                placeholder="Name"
                                value={param.name}
                                onChange={(e) => updateParameter(index, "name", e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
                            />
                            <input
                                type="text"
                                placeholder="Type"
                                value={param.type}
                                onChange={(e) => updateParameter(index, "type", e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
                            />
                            <button
                                onClick={() => removeParameter(index)}
                                className="text-red-400 hover:text-red-300 px-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addParameter}
                        className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                        + Add Parameter
                    </button>
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold text-slate-300">Function Body (SQL)</label>
                    <textarea
                        rows="6"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                        placeholder={isTableValued ? "SELECT ... FROM ..." : "RETURN ..."}
                    />
                </div>
            </div>

            {/* Live Preview */}
            <CodeBlock>{generateSQL()}</CodeBlock>
        </div>
    );
};

// --- Main Guide Component ---
const FunctionsGuide = () => {
    const [activeTab, setActiveTab] = useState("guide");
    const [expandedTerm, setExpandedTerm] = useState(null);

    const toggleTerm = (index) => {
        setExpandedTerm(expandedTerm === index ? null : index);
    };

    const terms = [
        {
            name: "Scalar Function",
            description: "A function that returns a single value (e.g., a number, string, or date).",
            impact: "Can cause performance issues if used in WHERE clauses or JOINs.",
            color: "orange",
            icon: "🔢",
            basics: "A Scalar Function is like a calculator. You give it some inputs (like two numbers), and it gives you back ONE answer (like their sum). It's great for simple math or formatting text, but be careful! If you use it on a table with a million rows, it runs a million times, which can be very slow.",
            details: "User-Defined Scalar Functions (UDFs) historically prevented parallel query execution plans. SQL Server 2019+ introduced 'Scalar UDF Inlining' to fix this, but older versions suffer significant text-book performance penalties.",
            scenario: "Calculating a 'TotalWithTax' amount for a single invoice display.",
            code: `CREATE FUNCTION dbo.AddTax(@Amount MONEY)
RETURNS MONEY
AS
BEGIN
    RETURN @Amount * 1.10;
END`
        },
        {
            name: "Table-Valued Function (TVF)",
            description: "A function that returns a table result set.",
            impact: "Excellent for code reuse and parameterized views.",
            color: "green",
            icon: "📊",
            basics: "A Table-Valued Function (TVF) is like a view that accepts parameters. Instead of just returning one value, it returns a whole list of rows and columns. It's super useful when you need to get a list of things (like 'Get Orders for User X') and you want to reuse that logic in many places.",
            details: "Inline TVFs (iTVF) are treated like views by the optimizer and are highly performant. Multi-Statement TVFs (mstVF) can have performance issues because SQL Server treats them as black boxes with low cardinality estimates.",
            scenario: "Retrieving a list of active orders for a specific CustomerID.",
            code: `CREATE FUNCTION dbo.GetCustomerOrders(@CustID INT)
RETURNS TABLE
AS
RETURN (
    SELECT * FROM Orders WHERE CustomerID = @CustID
);`
        },
        {
            name: "Deterministic vs. Nondeterministic",
            description: "Whether a function always returns the same result for the same input.",
            impact: "Affects indexing and caching.",
            color: "blue",
            icon: "🎲",
            basics: "A Deterministic function is reliable: 2 + 2 always equals 4. If you ask it the same question, you always get the same answer. A Nondeterministic function is like rolling dice or asking 'what time is it?'. The answer changes even if you ask the same way. SQL Server likes Deterministic functions better because it can save (index) the results.",
            details: "GETDATE() is nondeterministic. ABS() is deterministic. Only deterministic functions can be used in Indexed Views or Computed Columns that are persisted.",
            scenario: "Trying to index a computed column that uses GETDATE() will fail because the value changes every second.",
            code: `-- Nondeterministic
CREATE FUNCTION dbo.GetRandom() RETURNS FLOAT
AS BEGIN RETURN RAND() END

-- Deterministic
CREATE FUNCTION dbo.Square(@N INT) RETURNS INT
AS BEGIN RETURN @N * @N END`
        },
        {
            name: "Schema Binding",
            description: "Locks the underlying database objects so they cannot be dropped or modified.",
            impact: "Prevents breaking changes.",
            color: "yellow",
            icon: "🔒",
            basics: "Imagine you build a house (Function) on top of a foundation (Table). If someone removes the foundation, your house collapses! Schema Binding is like a legal contract that says 'You cannot destroy this foundation while my house is still here'. It prevents people from dropping tables or columns that your function relies on.",
            details: "WITH SCHEMABINDING binds the function to the schema of the referenced objects. It provides a performance boost in some cases and is required for creating indices on computed columns calling the function.",
            scenario: "Creating a critical function for financial calculations that must not break if someone tries to alter the 'Transactions' table.",
            code: `CREATE FUNCTION dbo.GetTotalSales()
RETURNS MONEY
WITH SCHEMABINDING
AS
BEGIN
    SELECT SUM(Amount) FROM dbo.Sales; -- dbo.Sales cannot be dropped now
END`
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <SEO
                title="SQL Functions Guide"
                description="Master SQL Server Functions: Scalar, Table-Valued, Determinism, and Performance Best Practices."
            />

            <header className="space-y-2">
                <h1 className="text-4xl font-bold mb-3 text-white">Functions</h1>
                <p className="text-slate-400 mb-8 text-lg">
                    Comprehensive guide to User-Defined Functions (UDFs) in SQL Server.
                </p>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-700">
                {['guide', 'terms', 'playground'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === tab
                            ? 'text-blue-400 border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-blue-300'
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
                    <InfoCard type="warning">
                        <strong>Performance Warning:</strong> Scalar functions can act as "performance killers" in large queries because they may force row-by-row execution. Use Inline Table-Valued Functions (iTVFs) whenever possible.
                    </InfoCard>

                    <SectionTitle>📖 Basics: What is a Function?</SectionTitle>
                    <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
                        <p className="text-slate-300 leading-relaxed mb-4">
                            A <strong>User-Defined Function (UDF)</strong> is a routine that accepts parameters, performs an action (like a calculation), and returns the result of that action as a value.
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
                            <li><strong>Scalar Functions:</strong> Return a single value.</li>
                            <li><strong>Table-Valued Functions (TVF):</strong> Return a table of data (like a parameterized view).</li>
                        </ul>

                        <SubSectionTitle>Function vs. Stored Procedure</SubSectionTitle>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-800 p-4 rounded border border-blue-500/30">
                                <h4 className="font-bold text-blue-400 mb-2">Function</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    <li>• Must return a value</li>
                                    <li>• Can be used IN a SELECT statement</li>
                                    <li>• Cannot modify database state (INSERT/UPDATE/DELETE)</li>
                                    <li>• Used for calculations/computations</li>
                                </ul>
                            </div>
                            <div className="bg-slate-800 p-4 rounded border border-green-500/30">
                                <h4 className="font-bold text-green-400 mb-2">Stored Procedure</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    <li>• Can return nothing or multiple result sets</li>
                                    <li>• Cannot be used inside a SELECT</li>
                                    <li>• Can modify database state</li>
                                    <li>• Used for business logic/transactions</li>
                                </ul>
                            </div>
                        </div>

                        <SubSectionTitle>1. Scalar Functions</SubSectionTitle>
                        <p className="text-slate-700 leading-relaxed mb-2">
                            Best for simple calculations on single values.
                        </p>
                        <CodeBlock>{`CREATE FUNCTION dbo.GetFullName
(
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50)
)
RETURNS NVARCHAR(101)
AS
BEGIN
    RETURN @FirstName + ' ' + @LastName;
END;

-- Usage:
SELECT dbo.GetFullName(FirstName, LastName) FROM Employees;`}</CodeBlock>

                        <SubSectionTitle>2. Inline Table-Valued Functions (iTVF)</SubSectionTitle>
                        <p className="text-slate-700 leading-relaxed mb-2">
                            The superhero of functions! They are fast, efficient, and act like parameterized views.
                        </p>
                        <CodeBlock>{`CREATE FUNCTION dbo.GetOrdersByDate
(
    @OrderDate DATE
)
RETURNS TABLE
AS
RETURN (
    SELECT OrderID, CustomerID, TotalAmount
    FROM Orders
    WHERE OrderDate = @OrderDate
);

-- Usage:
SELECT * FROM dbo.GetOrdersByDate('2023-01-01');`}</CodeBlock>

                        <SubSectionTitle>3. Multi-Statement Table-Valued Functions (mstVF)</SubSectionTitle>
                        <p className="text-slate-700 leading-relaxed mb-2">
                            More powerful (allows variable logic) but slower. Use only when iTVF isn't possible.
                        </p>
                        <CodeBlock>{`CREATE FUNCTION dbo.GetRecentLargeOrders (@MinAmount MONEY)
RETURNS @ResultTable TABLE (OrderID INT, Amount MONEY)
AS
BEGIN
    INSERT INTO @ResultTable
    SELECT OrderID, TotalAmount 
    FROM Orders 
    WHERE TotalAmount > @MinAmount;

    RETURN;
END;`}</CodeBlock>
                    </div>

                    <SectionTitle>⚡ Performance Best Practices</SectionTitle>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <SubSectionTitle>Do This ✅</SubSectionTitle>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>Use <strong>Inline TVFs</strong> instead of Scalar functions in SELECT lists when possible.</li>
                                <li>Use <strong>WITH SCHEMABINDING</strong> to prevent broken dependencies.</li>
                                <li>Keep functions deterministic if you want to index their results.</li>
                            </ul>
                        </div>
                        <div>
                            <SubSectionTitle>Avoid This ❌</SubSectionTitle>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>Don't call Scalar functions in the <code>WHERE</code> clause on large tables (sargability issue).</li>
                                <li>Avoid Multi-Statement TVFs for simple queries.</li>
                                <li>Don't perform INSERT/UPDATE/DELETE inside functions (you can't anyway!).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms Tab */}
            {activeTab === 'terms' && (
                <div className="grid grid-cols-1 gap-4">
                    {terms.map((term, index) => (
                        <div
                            key={index}
                            className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden transition-all"
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/50"
                                onClick={() => toggleTerm(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{term.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{term.name}</h3>
                                        <p className="text-sm text-slate-400">{term.description}</p>
                                    </div>
                                </div>
                                <div className="text-slate-500">
                                    {expandedTerm === index ? "▲" : "▼"}
                                </div>
                            </div>

                            {expandedTerm === index && (
                                <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-300 mb-1">💡 Basics</h4>
                                        <p className="text-slate-400 leading-relaxed">{term.basics}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-300 mb-1">📘 Technical Details</h4>
                                        <p className="text-slate-400 leading-relaxed">{term.details}</p>
                                    </div>

                                    <div className="mb-2">
                                        <h4 className="font-semibold text-slate-300 mb-1">💻 Example</h4>
                                        <CodeBlock>{term.code}</CodeBlock>
                                    </div>

                                    <div className="mt-4 pt-2 border-t border-slate-700">
                                        <span className="text-sm font-medium text-slate-500">Impact: </span>
                                        <span className={`text-sm font-medium ${term.color === 'red' ? 'text-red-400' :
                                            term.color === 'orange' ? 'text-orange-400' :
                                                term.color === 'yellow' ? 'text-yellow-400' :
                                                    term.color === 'green' ? 'text-green-400' :
                                                        'text-blue-400'
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
                <FunctionPlayground />
            )}
        </div>
    );
};

export default FunctionsGuide;
