import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">SQL Script Generator</div>
        <div className="space-x-4">
          <NavLink to="/Home" className={({ isActive }) => isActive ? 'text-yellow-300' : ''}>Home</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
