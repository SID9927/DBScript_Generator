import React from 'react'
import { Link } from 'react-router-dom';

const Home = ({ title }) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Select a Module</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* SP Section */}
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-medium mb-2">Backup and Rollback</h2>
          <ul className="space-y-1">
            <li><Link className="text-blue-600 hover:underline" to="/sp">Stored Procedure</Link></li>
            <li><Link className="text-blue-600 hover:underline" to="/table">Table</Link></li>
          </ul>
        </div>

        {/* Table Section */}
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-medium mb-2">Alter</h2>
          <ul className="space-y-1">
            <li><Link className="text-blue-600 hover:underline" to="/table">Table</Link></li>
          </ul>
        </div>

        {/*Index Section*/ }
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          {/* <h2 className="text-xl font-medium mb-2">Index</h2> */}
          <ul className="space-y-1">
            <li><Link className="text-xl font-medium hover:underline" to="/#">Index</Link></li>
          </ul>
        </div>

        {/*Trigger Section*/ }
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          {/* <h2 className="text-xl font-medium mb-2">Index</h2> */}
          <ul className="space-y-1">
            <li><Link className="text-xl font-medium hover:underline" to="/#">Trigger</Link></li>
          </ul>
        </div>

        {/*Performance Section*/ }
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-medium mb-2">Performance</h2>
          <ul className="space-y-1">
            <li><Link className="text-blue-600 hover:underline" to="/withnolock">With (NOLOCK)</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home
