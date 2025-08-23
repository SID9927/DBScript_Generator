import React from 'react';
import { Link } from 'react-router-dom';

const ModuleLinks = ({ basePath, modules }) => (
  <div className="flex gap-4">
    {modules.map((mod, idx) => (
      <Link
        key={idx}
        to={mod.to.startsWith('/') ? mod.to : `${basePath}${mod.to}`}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {mod.name}
      </Link>
    ))}
  </div>
);

export default ModuleLinks;
