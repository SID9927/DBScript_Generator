import React, { useState } from "react";

// --- Reusable Components (you can reuse from IndexesGuide file if shared) ---
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
END;`;
  };

  return (
    <div className="p-6 bg-gray-50 border rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🛠 Try It Yourself: Trigger Generator</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">Trigger Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Table Name</label>
          <input
            type="text"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Trigger Event</label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full border p-2 rounded"
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
          <label className="block mb-2 font-semibold">Trigger Body (SQL)</label>
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
const TriggersGuide = () => {
  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Triggers</h1>
      <p className="text-gray-700 leading-relaxed">
        A trigger is a special kind of stored procedure that automatically executes when an event (INSERT,
        UPDATE, DELETE) occurs on a table or view.
      </p>

      <InfoCard type="info">
        <strong>Definition:</strong> Triggers are used to enforce business rules, maintain audit logs, and
        automatically respond to changes in data.
      </InfoCard>

      <SectionTitle>Types of Triggers</SectionTitle>

      <SubSectionTitle>1. AFTER Triggers</SubSectionTitle>
      <p className="text-gray-700 leading-relaxed">
        These triggers run after an operation (INSERT, UPDATE, DELETE) is completed successfully.
      </p>
      <CodeBlock>{`CREATE TRIGGER TR_AfterInsert
ON Employees
AFTER INSERT
AS
BEGIN
    INSERT INTO AuditLog (Action, Date)
    VALUES ('Insert', GETDATE());
END;`}</CodeBlock>

      <SubSectionTitle>2. INSTEAD OF Triggers</SubSectionTitle>
      <p className="text-gray-700 leading-relaxed">
        These triggers override the normal behavior of an operation. For example, you can stop a DELETE or
        replace it with custom logic.
      </p>
      <CodeBlock>{`CREATE TRIGGER TR_InsteadOfDelete
ON Employees
INSTEAD OF DELETE
AS
BEGIN
    -- Prevent deletion and log instead
    INSERT INTO AuditLog (Action, Date)
    VALUES ('Attempted Delete', GETDATE());
END;`}</CodeBlock>

      <SectionTitle>When to Use Triggers?</SectionTitle>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>For audit logging (track who made changes and when).</li>
        <li>To enforce complex business rules that constraints cannot handle.</li>
        <li>To prevent unwanted operations (like accidental deletes).</li>
      </ul>

      <InfoCard type="warning">
        <strong>Tip:</strong> Use triggers carefully. They can make debugging harder and slow down DML
        operations if overused. Prefer constraints or application logic when possible.
      </InfoCard>

      {/* Interactive Playground */}
      <TriggerPlayground />
    </div>
  );
};

export default TriggersGuide;
