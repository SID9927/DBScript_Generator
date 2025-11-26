import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-white font-medium text-sm'
      : 'text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium';

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/logoDB.png"
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="text-white font-semibold tracking-tight text-lg">
              DB Playground
            </span>
          </a>
        </div>

        <div className="flex items-center space-x-8">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

