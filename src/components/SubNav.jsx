import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SubNav = ({ basePath, links }) => {
  const location = useLocation();

  // Only render if current path starts with basePath
  if (!location.pathname.startsWith(basePath)) return null;

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-slate-900 font-medium border-b-2 border-blue-600 pb-2'
      : 'text-slate-500 hover:text-slate-700 pb-2 transition-colors duration-200';

  return (
    <nav className="bg-white border-b border-slate-200 px-6 pt-4 mb-6">
      <div className="max-w-7xl mx-auto flex gap-8">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to.startsWith('/') ? link.to : `${basePath}${link.to}`}
            className={linkClass}
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default SubNav;

