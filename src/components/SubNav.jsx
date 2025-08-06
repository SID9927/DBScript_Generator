import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

const SubNav = () => {
  const location = useLocation();

  const renderLinks = () => {
    if (location.pathname.startsWith('/sp')) {
      return (
        <>
          <NavLink to="/sp/backup" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>Backup</NavLink>
          <NavLink to="/sp/rollback" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>Rollback</NavLink>
        </>
      );
    }
    if (location.pathname.startsWith('/table')) {
      return (
        <>
          <NavLink to="/table/alter" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>Alter</NavLink>
          <NavLink to="/table/backup" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>Backup</NavLink>
          <NavLink to="/table/rollback" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>Rollback</NavLink>
        </>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-100 px-6 py-2 space-x-4 border-b">
      {renderLinks()}
    </div>
  );
};

export default SubNav
