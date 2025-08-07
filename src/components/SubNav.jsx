import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

const SubNav = () => {
  const location = useLocation();

  const renderLinks = () => {
    if (location.pathname.startsWith('/sp')) {
      return (
        <>
          <NavLink to="/sp" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>Stored Procedure</NavLink>
        </>
      );
    }
    if (location.pathname.startsWith('/table')) {
      return (
        <>
          <NavLink to="/table" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>Table</NavLink>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="bg-gray-100 px-6 py-2 flex gap-4 border-b">
      <NavLink to="/sp" className={({ isActive }) => isActive ? 'font-semibold text-blue-600' : ''}>
        SP
      </NavLink>
      <NavLink to="/table" className={({ isActive }) => isActive ? 'font-semibold text-blue-600' : ''}>
        Table
      </NavLink>
    </nav>
  );
};

export default SubNav
