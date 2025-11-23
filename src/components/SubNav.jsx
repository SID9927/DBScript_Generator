import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slideInFromTop, staggerContainer, staggerItem } from '../utils/animations';

const SubNav = ({ basePath, links }) => {
  const location = useLocation();

  // Only render if current path starts with basePath
  if (!location.pathname.startsWith(basePath)) return null;

  const linkClass = ({ isActive }) =>
    isActive
      ? 'font-semibold text-indigo-700 relative'
      : 'text-gray-600 hover:text-indigo-600 relative';

  return (
    <motion.nav
      className="bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-3 border-b border-indigo-100 shadow-sm"
      variants={slideInFromTop}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {links.map((link) => (
          <motion.div key={link.to} variants={staggerItem}>
            <NavLink
              to={link.to.startsWith('/') ? link.to : `${basePath}${link.to}`}
              className={linkClass}
            >
              {({ isActive }) => (
                <motion.span
                  className="inline-block py-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      layoutId="activeUnderline"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.div>
    </motion.nav>
  );
};

export default SubNav;

