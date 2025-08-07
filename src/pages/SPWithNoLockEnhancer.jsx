import React, { useState } from 'react'

const SPWithNoLockEnhancer = () => {
  const [inputSP, setInputSP] = useState('');
  const [outputSP, setOutputSP] = useState('');

   const addNoLockToTables = (sql) => {
    return sql.replace(
      /\b(FROM|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN)\s+((?:\w+\.)?\w+)(?:\s+WITH\s*\(\s*NOLOCK\s*\))?\s*(?:AS\s+)?(\w+)?/gi,
      (match, joinType, tableName, alias) => {
        // ✅ If already has WITH (NOLOCK), skip adding again
        if (/WITH\s*\(\s*NOLOCK\s*\)/i.test(match)) {
          return match;
        }

        let replacement = `${joinType} ${tableName} WITH (NOLOCK)`;
        if (alias && alias.toUpperCase() !== 'WITH') {
          replacement += ` ${alias}`;
        }

        return replacement;
      }
    );
  };

  const handleScan = () => {
    const enhancedSP = addNoLockToTables(inputSP);
    setOutputSP(enhancedSP);
  };


  return (
    <div className="flex h-screen relative">
      {/* Left Panel */}
      <div className="w-1/2 p-4 border-r border-gray-300 relative">
        <h2 className="text-xl font-bold mb-2">Paste Stored Procedure</h2>
        <textarea
          className="w-full h-[85%] p-2 border rounded resize-none"
          value={inputSP}
          onChange={(e) => setInputSP(e.target.value)}
          placeholder="Paste your SP here..."
        />

        {/* Bottom-left Scan Button */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={handleScan}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Scan & Enhance
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-2">Enhanced SP (with NOLOCK)</h2>
        <textarea
          className="w-full h-[95%] p-2 border rounded resize-none bg-gray-100 text-gray-800"
          value={outputSP}
          readOnly
        />
      </div>
    </div>
  );
};

export default SPWithNoLockEnhancer
