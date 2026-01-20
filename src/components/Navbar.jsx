import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../pages/Login';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-white font-medium text-sm'
      : 'text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 relative z-50">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src="/logoDB.png"
                alt="Logo"
                className="h-8 w-auto"
              />
            </a>
          </div>

          <div className="flex items-center space-x-8">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink
              to="/clipboard"
              className={linkClass}
              onClick={(e) => {
                if (!currentUser) {
                  e.preventDefault();
                  setShowLoginModal(true);
                }
              }}
            >
              Cloud Clipboard
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>

            {/* User Profile Section */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border border-slate-700 hover:border-cyan-500 transition-colors"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm border border-slate-700 hover:border-cyan-400">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1"
                    >
                      <div className="px-4 py-3 border-b border-slate-700/50">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm text-white font-medium truncate" title={currentUser.email}>
                          {currentUser.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <NavLink
                          to="/clipboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                        >
                          Cloud Clipboard
                        </NavLink>
                      </div>

                      <div className="border-t border-slate-700/50 py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showLoginModal && (
          <Login
            isModal={true}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
