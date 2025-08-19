import React, { useEffect, useState } from 'react'

const StoredProcedure = () => {

   const [spName, setSpName] = useState('');
   const [suffix, setSuffix] = useState('');
   const [backupScript, setBackupScript] = useState('');
   const [rollbackScript, setRollbackScript] = useState('');
   const [defaultSuffix, setDefaultSuffix] = useState('');
 
   // Generate default suffix on component mount
  useEffect(() => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const formattedDate = `${dd}${mm}${yyyy}`;
  setDefaultSuffix(`bkup${formattedDate}`);
}, []);

   const generateScript = () => {
      const actualSuffix = suffix.trim() !== '' ? suffix : defaultSuffix;
      const backupName = `${spName}_${actualSuffix}`;
 
     // Generate Backup Script
     const sqlBackupScript = `
 IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${spName}') 
 AND NOT EXISTS (SELECT * FROM sys.procedures WHERE name = '${backupName}') 
 BEGIN
     EXEC sp_rename '${spName}', '${backupName}';
 END
 GO`.trim();
 
     // Generate Rollback Script
     const sqlRollbackScript = `
 IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${backupName}') 
 BEGIN
     IF EXISTS (SELECT * FROM sys.procedures WHERE name = '${spName}') 
         DROP PROCEDURE dbo.${spName};
 
     EXEC sp_rename '${backupName}', '${spName}';
 END
 GO`.trim();
 
     setBackupScript(sqlBackupScript);
     setRollbackScript(sqlRollbackScript);
 
   };
 
   return (
     <div className="p-6 max-w-7xl mx-auto space-y-4">
       <div className="space-y-2">
         <input
           className="w-full p-2 border border-gray-300 rounded"
           type="text"
           placeholder="Enter Stored Procedure Name"
           value={spName}
           onChange={(e) => setSpName(e.target.value)}
         />
 
         <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          placeholder={`Enter Backup Suffix (default: ${defaultSuffix})`}
          value={suffix}
          onChange={(e) => setSuffix(e.target.value)}
        />
 
         <button
           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
           onClick={generateScript}
         >
           Generate Scripts
         </button>
       </div>
 
       {/* Flexbox Layout for Textareas */}
       <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1">
           <h3 className="text-md font-semibold mb-2">Backup Script</h3>
           <textarea
             className="w-full h-80 p-2 border border-gray-300 rounded font-mono"
             value={backupScript}
             readOnly
           />
         </div>
 
         <div className="flex-1">
           <h3 className="text-md font-semibold mb-2">Rollback Script</h3>
           <textarea
             className="w-full h-80 p-2 border border-gray-300 rounded font-mono"
             value={rollbackScript}
             readOnly
           />
         </div>
       </div>
     </div>
   );
 };

export default StoredProcedure
