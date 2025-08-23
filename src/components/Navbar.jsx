import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-white font-semibold'
      : 'text-gray-300 hover:text-white transition-colors';

  return (
    <nav className="bg-black px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          <a href="/">
            <img src="/logoDB.png" alt="Logo" className="h-8 inline-block mr-2" />
          </a>
        </div>
        <div className="space-x-4">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
