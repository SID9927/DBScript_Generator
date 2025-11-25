import React from 'react';
import { Link } from 'react-router-dom';

const ModuleLinks = ({ basePath, modules }) => (
  <div className="flex gap-4 flex-wrap">
    {modules.map((mod, idx) => (
      <Link
        key={idx}
        to={mod.to.startsWith('/') ? mod.to : `${basePath}${mod.to}`}
      >
        <button className="btn-primary">
          {mod.name}
        </button>
      </Link>
    ))}
  </div>
);

export default ModuleLinks;

