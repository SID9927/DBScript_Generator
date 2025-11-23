import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slideInFromTop, pulse } from '../utils/animations';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-white font-semibold'
      : 'text-gray-200 hover:text-white transition-colors duration-300';

  return (
    <motion.nav
      className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-4 shadow-2xl overflow-hidden"
      variants={slideInFromTop}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse opacity-50"></div>

      <div className="relative flex justify-between items-center">
        <motion.div
          className="text-xl font-semibold"
          variants={pulse}
          animate="animate"
        >
          <a href="/" className="flex items-center gap-2 group">
            <motion.img
              src="/logoDB.png"
              alt="Logo"
              className="h-10 inline-block drop-shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="hidden md:inline text-white font-bold tracking-wide">
              DB Script Generator
            </span>
          </a>
        </motion.div>

        <div className="flex items-center space-x-6">
          <NavLink to="/" end className={linkClass}>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-block"
            >
              Home
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-white"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
          </NavLink>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </motion.nav>
  );
};

export default Navbar;

