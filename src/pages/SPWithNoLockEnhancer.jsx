import React, { useState } from 'react'

const SPWithNoLockEnhancer = () => {
  const [inputSP, setInputSP] = useState('');
  const [outputSP, setOutputSP] = useState('');

  const addNoLockToTables = (sql) => {
  const lines = sql.split('\n');

  const updatedLines = lines.map((line) => {
    // Remove any existing WITH (NOLOCK)
    const cleanedLine = line.replace(/\s+WITH\s*\(\s*NOLOCK\s*\)/gi, '');

    // Match JOINs with or without alias
    return cleanedLine.replace(
      /\b(FROM|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN)\s+((?:\w+\.)?\w+)(\s+(?:AS\s+)?\w+)?/i,
      (match, joinType, tableName, aliasPart = '') => {
        return `${joinType} ${tableName}${aliasPart} WITH (NOLOCK)`;
      }
    );
  });

  return updatedLines.join('\n');
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
