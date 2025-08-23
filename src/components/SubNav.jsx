import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SubNav = ({ basePath, links }) => {
  const location = useLocation();

  // Only render if current path starts with basePath
  if (!location.pathname.startsWith(basePath)) return null;

  const linkClass = ({ isActive }) =>
    isActive ? 'font-semibold text-blue-600' : 'text-gray-700 hover:text-blue-500';

  return (
    <nav className="bg-gray-100 px-6 py-2 flex gap-4 border-b">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to.startsWith('/') ? link.to : `${basePath}${link.to}`}
          className={linkClass}
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default SubNav;
