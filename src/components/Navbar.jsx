import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../pages/Login';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `relative py-2 px-1 transition-all duration-300 text-[13px] font-bold tracking-tight ${
      isActive ? 'text-blue-400' : 'text-slate-400 hover:text-white'
    }`;

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
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Dev Tools', to: '/devtools' },
    { name: 'Contact', to: '/contact' }
  ];

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        // Show if scrolling up, hide if scrolling down
        setIsVisible(currentScrollY < lastScrollY);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-[#060b14]/80 border-b border-white/[0.03] fixed top-0 left-0 right-0 z-[60] backdrop-blur-xl"
      >
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-14 md:h-16 flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-3 group">
              <img src="/logoDB.png" alt="Logo" className="h-8 w-auto transform transition-transform group-hover:scale-110" />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
                onClick={(e) => {
                  if (link.protected && !currentUser) {
                    e.preventDefault();
                    setShowLoginModal(true);
                  }
                }}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center group focus:outline-none ml-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center p-[1px] transition-all group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                     <div className="w-full h-full bg-[#060b14] rounded-[10px] flex items-center justify-center text-white font-black text-[10px] uppercase overflow-hidden">
                        {currentUser.photoURL ? <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" /> : currentUser.email?.charAt(0)}
                     </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-60 bg-[#0d121d]/95 backdrop-blur-2xl border border-slate-800/60 rounded-2xl shadow-2xl py-2 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-slate-800/40">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 opacity-60">Session Identity</p>
                        <p className="text-sm font-bold text-white truncate lowercase tracking-tight">{currentUser.email}</p>
                      </div>
                      <div className="p-1.5">
                         <button 
                           onClick={handleLogout} 
                           className="w-full text-left px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-black uppercase tracking-wider flex items-center gap-3 active:scale-95"
                         >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                           </svg>
                           Terminate Session
                         </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="ml-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/10"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0d1421] border-b border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={mobileLinkClass}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (link.protected && !currentUser) {
                        e.preventDefault();
                        setShowLoginModal(true);
                      }
                    }}
                  >
                    {link.name}
                  </NavLink>
                ))}
                
                <div className="pt-4 mt-4 border-t border-slate-800">
                  {currentUser ? (
                    <div className="flex items-center justify-between px-4">
                      <span className="text-xs text-slate-500 truncate mr-4">{currentUser.email}</span>
                      <button onClick={handleLogout} className="text-sm font-bold text-red-400">Log Out</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); setShowLoginModal(true); }}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {showLoginModal && (
          <Login isModal={true} onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
