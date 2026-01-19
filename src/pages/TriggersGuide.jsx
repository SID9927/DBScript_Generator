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
    <div className={`p - 4 my - 4 rounded - md border - l - 4 ${styles[type]} `}>
      {children}
    </div>
  );
};

// --- Interactive Playground for Triggers ---
const TriggerPlayground = () => {
  const [name, setName] = useState("TR_AuditInsert");
  const [table, setTable] = useState("Employees");
  const [event, setEvent] = useState("AFTER INSERT");
  const [body, setBody] = useState("INSERT INTO AuditLog (Action, Date)\nVALUES ('Insert', GETDATE());");

  const generateSQL = () => {
    return `CREATE TRIGGER ${name}
ON ${table}
${event}
AS
BEGIN
    ${body}
END; `;
  };

  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">🛠 Try It Yourself: Trigger Generator</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold text-slate-300">Trigger Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-slate-300">Table Name</label>
          <input
            type="text"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-slate-300">Trigger Event</label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="AFTER INSERT">AFTER INSERT</option>
            <option value="AFTER UPDATE">AFTER UPDATE</option>
            <option value="AFTER DELETE">AFTER DELETE</option>
            <option value="INSTEAD OF INSERT">INSTEAD OF INSERT</option>
            <option value="INSTEAD OF UPDATE">INSTEAD OF UPDATE</option>
            <option value="INSTEAD OF DELETE">INSTEAD OF DELETE</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-slate-300">Trigger Body (SQL)</label>
          <textarea
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      </div>

      {/* Live Preview */}
      <CodeBlock>{generateSQL()}</CodeBlock>
    </div>
  );
};

// --- Main Guide Component ---
const TriggersGuide = () => {
  const [activeTab, setActiveTab] = useState("guide");
  const [expandedTerm, setExpandedTerm] = useState(null);

  const toggleTerm = (index) => {
    setExpandedTerm(expandedTerm === index ? null : index);
  };

  const terms = [
    {
      name: "AFTER Trigger",
      description: "Fires after the triggering action (INSERT, UPDATE, DELETE) has completed.",
      impact: "Used for auditing and cascading changes.",
      color: "green",
      icon: "⏭️",
      basics: "An AFTER trigger waits until the data is actually written to the table before it runs. If the write fails, the trigger never runs. It's like sending a 'Thank You' email only after the payment has successfully gone through.",
      details: "The most common type of trigger. It runs after the constraint checks and the DML operation. If the trigger fails, the entire transaction (including the original DML) is rolled back.",
      scenario: "Logging a record into an 'AuditLog' table whenever a new 'Employee' is added.",
      code: `CREATE TRIGGER TR_Audit_Insert
ON Employees
AFTER INSERT
AS
BEGIN
    INSERT INTO AuditLog(Msg) VALUES('New employee added');
END; `
    },
    {
      name: "INSTEAD OF Trigger",
      description: "Fires in place of the triggering action.",
      impact: "Overrides default behavior.",
      color: "orange",
      icon: "🛑",
      basics: "An INSTEAD OF trigger intercepts the action and does something else instead. It's like a bouncer at a club who stops you at the door and says 'Wait, I'll handle this'. The original action (like DELETE) doesn't happen unless the trigger explicitly does it.",
      details: "Often used on Views to make them updatable. It completely replaces the standard action. You must perform the INSERT/UPDATE/DELETE manually inside the trigger if you want it to happen.",
      scenario: "Preventing deletion of 'VIP' customers, or redirecting inserts from a View to the underlying tables.",
      code: `CREATE TRIGGER TR_Prevent_Delete
ON Employees
INSTEAD OF DELETE
AS
BEGIN
    PRINT 'Deletions are not allowed!';
END; `
    },
    {
      name: "Magic Tables (inserted & deleted)",
      description: "Virtual tables available only within a trigger.",
      impact: "Crucial for accessing data changes.",
      color: "blue",
      icon: "🪄",
      basics: "Inside a trigger, SQL Server gives you two magical tables: 'inserted' and 'deleted'. 'inserted' holds the new data coming in. 'deleted' holds the old data going out. For an UPDATE, you get both (old data in 'deleted', new data in 'inserted').",
      details: "These are memory-resident tables that exist only during the execution of the trigger. They have the same structure as the table being modified.",
      scenario: "Comparing 'inserted.Salary' vs 'deleted.Salary' to see if a raise was given.",
      code: `SELECT * FROM inserted; --Shows new values
SELECT * FROM deleted; --Shows old values`
    },
    {
      name: "DDL Trigger",
      description: "Fires in response to schema changes (CREATE, ALTER, DROP).",
      impact: "Prevents unauthorized schema changes.",
      color: "red",
      icon: "🏗️",
      basics: "Standard triggers watch for data changes. DDL Triggers watch for structure changes. If someone tries to DROP a table or ALTER a column, a DDL trigger can catch it and say 'No way!'.",
      details: "Scoped to the Database or the Server. Useful for enforcing change control policies.",
      scenario: "Preventing developers from dropping tables in the Production database.",
      code: `CREATE TRIGGER TR_Prevent_Drop_Table
ON DATABASE
FOR DROP_TABLE
AS
BEGIN
ROLLBACK;
    PRINT 'Table dropping is disabled.';
END; `
    },
    {
      name: "Recursive Trigger",
      description: "A trigger that fires another trigger (or itself).",
      impact: "Can cause complex chains or loops.",
      color: "purple",
      icon: "🔄",
      basics: "If Trigger A updates Table B, and Table B has Trigger C, then Trigger A causes Trigger C to fire. This is recursion. It can be useful but also dangerous if it creates an infinite loop.",
      details: "Controlled by the 'recursive triggers' database option. SQL Server limits recursion depth to 32 to prevent infinite loops.",
      scenario: "Updating a 'Parent' table when a 'Child' is updated, which might trigger another update.",
      code: `ALTER DATABASE MyDB
SET RECURSIVE_TRIGGERS ON; `
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <SEO
        title="Trigger Guide"
        description="Learn about SQL Server triggers: AFTER vs INSTEAD OF, INSERT/UPDATE/DELETE events, and best practices."
      />

      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Triggers</h1>
        <p className="text-slate-400 text-lg">
          Automating database actions with SQL Server Triggers.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700">
        {['guide', 'terms', 'playground'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px - 6 py - 3 font - semibold transition - all ${activeTab === tab
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-blue-300'
              } `}
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
            <strong>Definition:</strong> A trigger is a special kind of stored procedure that automatically executes when an event (INSERT, UPDATE, DELETE) occurs on a table or view.
          </InfoCard>

          <SectionTitle>📖 Basics: What is a Trigger?</SectionTitle>
          <div className="bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded-r-lg">
            <p className="text-slate-300 leading-relaxed mb-4">
              A <strong>Trigger</strong> is like an automatic alarm that goes off when something happens to your data. When you INSERT, UPDATE, or DELETE a row in a table, the trigger automatically runs code in response. You don't have to call it - it just fires automatically.
            </p>

            <SubSectionTitle>Real-World Analogy</SubSectionTitle>
            <p className="text-slate-300 leading-relaxed mb-4">
              Think of a trigger like a motion-sensor light. When you walk past (the event), the light automatically turns on (the trigger fires). You didn't flip a switch - it just happened automatically. Similarly, when you modify data in a table, the trigger automatically executes.
            </p>

            <SubSectionTitle>Your First Trigger</SubSectionTitle>
            <p className="text-slate-300 leading-relaxed mb-2">
              Let's create a trigger that logs every time someone deletes an employee:
            </p>
            <CodeBlock>{`-- Create an audit log table first
CREATE TABLE EmployeeAuditLog(
  LogID INT IDENTITY(1, 1) PRIMARY KEY,
  EmployeeID INT,
  Action VARCHAR(50),
  ActionDate DATETIME DEFAULT GETDATE()
);

--Create the trigger
CREATE TRIGGER trg_AfterDeleteEmployee
ON Employees
AFTER DELETE-- Fires AFTER a delete happens
AS
BEGIN
--Insert a log entry for each deleted employee
    INSERT INTO EmployeeAuditLog(EmployeeID, Action)
    SELECT EmployeeID, 'DELETED'
    FROM deleted; -- 'deleted' is a special table with the deleted rows
END;

--Now when you delete an employee:
DELETE FROM Employees WHERE EmployeeID = 5;
--The trigger automatically logs it!`}</CodeBlock>

            <SubSectionTitle>When to Use Triggers</SubSectionTitle>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800 p-4 rounded border border-green-500/30">
                <h4 className="font-bold text-green-400 mb-2">✅ Good Use Cases</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Audit logging (who changed what, when)</li>
                  <li>• Enforcing complex business rules</li>
                  <li>• Maintaining calculated/derived data</li>
                  <li>• Preventing invalid data changes</li>
                </ul>
              </div>
              <div className="bg-slate-800 p-4 rounded border border-red-500/30">
                <h4 className="font-bold text-red-400 mb-2">❌ Avoid Triggers For</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Complex business logic (use SPs instead)</li>
                  <li>• Things that can be done with constraints</li>
                  <li>• Performance-critical operations</li>
                  <li>• Anything that could cause infinite loops</li>
                </ul>
              </div>
            </div>

            <SubSectionTitle>AFTER vs INSTEAD OF Triggers</SubSectionTitle>
            <div className="space-y-3 mb-4">
              <div className="bg-slate-800 p-4 rounded border border-orange-500/30">
                <h4 className="font-bold text-orange-400">AFTER Trigger</h4>
                <p className="text-sm text-slate-300 mt-1">Runs AFTER the INSERT/UPDATE/DELETE completes. The data is already changed.</p>
                <p className="text-sm text-slate-300 mt-1"><strong>Example:</strong> Log the change after it happens</p>
              </div>
              <div className="bg-slate-800 p-4 rounded border border-orange-500/30">
                <h4 className="font-bold text-orange-400">INSTEAD OF Trigger</h4>
                <p className="text-sm text-slate-300 mt-1">Runs INSTEAD of the INSERT/UPDATE/DELETE. The original operation doesn't happen unless you do it in the trigger.</p>
                <p className="text-sm text-slate-300 mt-1"><strong>Example:</strong> Prevent deletion, or redirect it to an archive table</p>
              </div>
            </div>

            <SubSectionTitle>Special Tables: 'inserted' and 'deleted'</SubSectionTitle>
            <div className="bg-slate-800 p-4 rounded border border-orange-500/30 mb-4">
              <p className="text-slate-300 mb-2">Inside a trigger, you have access to two special tables:</p>
              <ul className="text-sm text-slate-300 space-y-1 ml-4">
                <li>• <strong className="text-orange-400">inserted</strong> - Contains the NEW values (for INSERT and UPDATE)</li>
                <li>• <strong className="text-orange-400">deleted</strong> - Contains the OLD values (for DELETE and UPDATE)</li>
              </ul>
            </div>

            <CodeBlock>{`-- Example: Prevent salary decrease
CREATE TRIGGER trg_PreventSalaryDecrease
ON Employees
AFTER UPDATE
AS
BEGIN
    IF EXISTS(
  SELECT 1
        FROM inserted i
        JOIN deleted d ON i.EmployeeID = d.EmployeeID
        WHERE i.Salary < d.Salary-- New salary is less than old salary
)
BEGIN
RAISERROR('Salary cannot be decreased!', 16, 1);
        ROLLBACK TRANSACTION;
END
END; `}</CodeBlock>

            <SubSectionTitle>⚠️ Important Warnings</SubSectionTitle>
            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded">
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• <strong>Triggers are invisible</strong> - Developers might not know they exist, causing confusion</li>
                <li>• <strong>Can slow down operations</strong> - Every INSERT/UPDATE/DELETE now has extra work</li>
                <li>• <strong>Hard to debug</strong> - Errors in triggers can be tricky to trace</li>
                <li>• <strong>Use sparingly!</strong> - Only when constraints or stored procedures won't work</li>
              </ul>
            </div>

            <SubSectionTitle>Viewing Existing Triggers</SubSectionTitle>
            <CodeBlock>{`-- See all triggers on a table
EXEC sp_helptrigger 'Employees';

--See all triggers in the database
SELECT name, parent_id, type_desc
FROM sys.triggers; `}</CodeBlock>
          </div>

          <SectionTitle>Types of Triggers</SectionTitle>

          <SubSectionTitle>1. AFTER Triggers</SubSectionTitle>
          <p className="text-slate-300 leading-relaxed">
            These triggers run after an operation (INSERT, UPDATE, DELETE) is completed successfully.
          </p>
          <CodeBlock>{`CREATE TRIGGER TR_AfterInsert
ON Employees
AFTER INSERT
AS
BEGIN
    INSERT INTO AuditLog(Action, Date)
VALUES('Insert', GETDATE());
END; `}</CodeBlock>

          <SubSectionTitle>2. INSTEAD OF Triggers</SubSectionTitle>
          <p className="text-slate-300 leading-relaxed">
            These triggers override the normal behavior of an operation. For example, you can stop a DELETE or
            replace it with custom logic.
          </p>
          <CodeBlock>{`CREATE TRIGGER TR_InsteadOfDelete
ON Employees
INSTEAD OF DELETE
AS
BEGIN
--Prevent deletion and log instead
    INSERT INTO AuditLog(Action, Date)
VALUES('Attempted Delete', GETDATE());
END; `}</CodeBlock>

          <SectionTitle>When to Use Triggers?</SectionTitle>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>For audit logging (track who made changes and when).</li>
            <li>To enforce complex business rules that constraints cannot handle.</li>
            <li>To prevent unwanted operations (like accidental deletes).</li>
          </ul>

          <InfoCard type="warning">
            <strong>Tip:</strong> Use triggers carefully. They can make debugging harder and slow down DML
            operations if overused. Prefer constraints or application logic when possible.
          </InfoCard>
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
                    <h4 className="font-semibold text-slate-300 mb-1">💡 Basics (For Beginners)</h4>
                    <p className="text-slate-400 leading-relaxed">{term.basics}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-300 mb-1">📘 Technical Details</h4>
                    <p className="text-slate-400 leading-relaxed">{term.details}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-300 mb-1">🏢 Real-World Scenario</h4>
                    <p className="text-slate-400 leading-relaxed">{term.scenario}</p>
                  </div>

                  <div className="mb-2">
                    <h4 className="font-semibold text-slate-300 mb-1">💻 Example</h4>
                    <CodeBlock>{term.code}</CodeBlock>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-700">
                    <span className="text-sm font-medium text-slate-500">Impact: </span>
                    <span className={`text - sm font - medium ${term.color === 'red' ? 'text-red-400' :
                      term.color === 'orange' ? 'text-orange-400' :
                        term.color === 'yellow' ? 'text-yellow-400' :
                          term.color === 'green' ? 'text-green-400' :
                            'text-blue-400'
                      } `}>{term.impact}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Playground Tab */}
      {activeTab === 'playground' && (
        <TriggerPlayground />
      )}
    </div>
  );
};

export default TriggersGuide;
