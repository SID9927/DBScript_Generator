import React, { useState } from "react";

// --- Reusable Components (same as in other guides) ---
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
                className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded hover:bg-gray-600"
            >
                {copied ? "✅ Copied!" : "Copy"}
            </button>
            <pre className="bg-gray-900 text-green-200 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{children}</code>
            </pre>
        </div>
    );
};

const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-gray-300 pb-2">
        {children}
    </h2>
);

const SubSectionTitle = ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
        {children}
    </h3>
);

const InfoCard = ({ type = "info", children }) => {
    const styles = {
        info: "bg-blue-50 border-blue-500 text-blue-700",
        success: "bg-green-50 border-green-500 text-green-700",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
        danger: "bg-red-50 border-red-500 text-red-700",
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
        <div className="p-6 bg-gray-50 border rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🛠 Try It Yourself: Stored Procedure Generator</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-semibold">Procedure Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold">Parameters</label>
                    {parameters.map((param, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Name"
                                value={param.name}
                                onChange={(e) => updateParameter(index, "name", e.target.value)}
                                className="border p-2 rounded flex-1"
                            />
                            <input
                                type="text"
                                placeholder="Type"
                                value={param.type}
                                onChange={(e) => updateParameter(index, "type", e.target.value)}
                                className="border p-2 rounded w-24"
                            />
                            <input
                                type="text"
                                placeholder="Default"
                                value={param.defaultValue}
                                onChange={(e) => updateParameter(index, "defaultValue", e.target.value)}
                                className="border p-2 rounded w-24"
                            />
                            <select
                                value={param.mode}
                                onChange={(e) => updateParameter(index, "mode", e.target.value)}
                                className="border p-2 rounded w-28"
                            >
                                <option value="INPUT">INPUT</option>
                                <option value="OUTPUT">OUTPUT</option>
                            </select>
                            <button
                                onClick={() => removeParameter(index)}
                                className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addParameter}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        + Add Parameter
                    </button>
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-4 mt-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={useTransaction}
                            onChange={(e) => setUseTransaction(e.target.checked)}
                        />
                        Use Transaction
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={useErrorHandling}
                            onChange={(e) => setUseErrorHandling(e.target.checked)}
                        />
                        Use Error Handling & Logging
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={noCount}
                            onChange={(e) => setNoCount(e.target.checked)}
                        />
                        SET NOCOUNT ON
                    </label>
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold">Transaction Isolation Level (Optional)</label>
                    <select
                        value={isolationLevel}
                        onChange={(e) => setIsolationLevel(e.target.value)}
                        className="border p-2 rounded w-64"
                    >
                        <option value="">None</option>
                        <option value="READ UNCOMMITTED">READ UNCOMMITTED</option>
                        <option value="READ COMMITTED">READ COMMITTED</option>
                        <option value="REPEATABLE READ">REPEATABLE READ</option>
                        <option value="SERIALIZABLE">SERIALIZABLE</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold">Procedure Body (SQL)</label>
                    <textarea
                        rows="4"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full border p-2 rounded"
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
    return (
        <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Stored Procedures</h1>
            <p className="text-gray-700 leading-relaxed">
                A Stored Procedure (SP) is a precompiled collection of SQL statements that can be executed as a single
                unit. They help encapsulate logic, improve performance, and promote reusability.
            </p>

            <InfoCard type="info">
                <strong>Definition:</strong> A stored procedure is like a function in programming — you call it by name,
                pass parameters, and it executes predefined SQL.
            </InfoCard>

            <SectionTitle>Why Use Stored Procedures?</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-green-600 mb-2">✅ Advantages</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Encapsulates complex SQL logic in one place.</li>
                        <li>Improves performance (precompiled execution plan).</li>
                        <li>Enhances security (control access at SP level).</li>
                        <li>Supports reusability and modularity.</li>
                        <li>Reduces network traffic (less raw SQL sent from app).</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Limitations</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Debugging stored procedures can be harder than application code.</li>
                        <li>Can become a “black box” if overused for business logic.</li>
                        <li>Version control and deployment need extra care.</li>
                    </ul>
                </div>
            </div>

            <SectionTitle>Examples of Stored Procedures</SectionTitle>

            <SubSectionTitle>1. Simple Stored Procedure</SubSectionTitle>
            <CodeBlock>{`CREATE PROCEDURE USP_GetEmployees
AS
BEGIN
    SELECT EmployeeID, FirstName, LastName
    FROM Employees;
END;`}</CodeBlock>

            <SubSectionTitle>2. Parameterized Stored Procedure</SubSectionTitle>
            <CodeBlock>{`CREATE PROCEDURE USP_GetEmployeeById
    @EmpId INT
AS
BEGIN
    SELECT EmployeeID, FirstName, LastName
    FROM Employees
    WHERE EmployeeID = @EmpId;
END;`}</CodeBlock>

            <SubSectionTitle>3. Stored Procedure with Output Parameter</SubSectionTitle>
            <CodeBlock>{`CREATE PROCEDURE USP_GetEmployeeCount
    @DeptId INT,
    @Count INT OUTPUT
AS
BEGIN
    SELECT @Count = COUNT(*)
    FROM Employees
    WHERE DepartmentID = @DeptId;
END;`}</CodeBlock>

            <SubSectionTitle>4. Stored Procedure with NOCOUNT ON / OFF</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                <code>SET NOCOUNT ON</code> prevents SQL Server from sending messages about the number of rows affected, improving performance by reducing extra network traffic.
            </p>
            <CodeBlock>{`CREATE PROCEDURE USP_UpdateDepartment
    @DeptId INT,
    @DeptName NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON; -- ✅ Prevents "X rows affected" messages

    UPDATE Departments
    SET DepartmentName = @DeptName
    WHERE DepartmentID = @DeptId;

    -- SET NOCOUNT OFF; (default behavior)
END;`}</CodeBlock>

            <SubSectionTitle>5. Stored Procedure with Transactions</SubSectionTitle>
            <CodeBlock>{`CREATE PROCEDURE USP_UpdateSalary
    @EmpId INT,
    @NewSalary DECIMAL(10,2)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE Employees
        SET Salary = @NewSalary
        WHERE EmployeeID = @EmpId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;`}</CodeBlock>

            <SubSectionTitle>6. Transaction Isolation</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                Transaction isolation levels control how changes made by one transaction are seen by others. Common levels: <strong>READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.</strong>
            </p>
            <CodeBlock>{`CREATE PROCEDURE USP_UpdateStock
    @ProductId INT,
    @Quantity INT
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; -- strictest level

    BEGIN TRANSACTION;

    UPDATE Products
    SET Stock = Stock - @Quantity
    WHERE ProductID = @ProductId;

    COMMIT TRANSACTION;
END;`}</CodeBlock>

            <SubSectionTitle>4. Temp Tables in SP</SubSectionTitle>
            <p className="text-gray-700 leading-relaxed">
                Temporary tables (<code>#Temp</code>) are used inside stored procedures to store intermediate results.
                They are automatically dropped when the procedure ends (or when the session ends).
            </p>
            <CodeBlock>{`CREATE PROCEDURE USP_GetTopDepartments
AS
BEGIN
    CREATE TABLE #DeptStats (
        DeptId INT,
        EmployeeCount INT
    );

    INSERT INTO #DeptStats
    SELECT DepartmentID, COUNT(*)
    FROM Employees
    GROUP BY DepartmentID;

    SELECT TOP 5 * FROM #DeptStats ORDER BY EmployeeCount DESC;
END;`}</CodeBlock>

            <InfoCard type="warning">
                <strong>Tip:</strong> Use stored procedures for critical operations and database logic, but keep them small and focused.
            </InfoCard>

            {/* Playground */}
            <SPPlayground />
        </div>
    );
};

export default StoredProceduresGuide;
