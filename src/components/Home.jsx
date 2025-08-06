import React from 'react'
import { Link } from 'react-router-dom';

const Home = ({ title }) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Select a Module</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* SP Section */}
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-medium mb-2">Stored Procedures</h2>
          <ul className="space-y-1">
            <li><Link className="text-blue-600 hover:underline" to="/sp/backup">Backup SP</Link></li>
            <li><Link className="text-blue-600 hover:underline" to="/sp/rollback">Rollback SP</Link></li>
          </ul>
        </div>

        {/* Table Section */}
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-medium mb-2">Tables</h2>
          <ul className="space-y-1">
            <li><Link className="text-blue-600 hover:underline" to="/table/alter">Alter Table</Link></li>
            <li><Link className="text-blue-600 hover:underline" to="/table/backup">Backup Table</Link></li>
            <li><Link className="text-blue-600 hover:underline" to="/table/rollback">Rollback Table</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home
