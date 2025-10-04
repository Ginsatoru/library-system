import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FiSun, FiMoon, FiLogOut, FiMenu, FiUser, FiSettings, FiChevronDown } from 'react-icons/fi';
import { US, KH } from 'country-flag-icons/react/3x2';

const Navbar = ({ logout, sidebarOpen, setSidebarOpen, user }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'km' : 'en');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const getProfilePicUrl = () => {
    if (user?.profilePic && !imageError) {
      if (
        user.profilePic.startsWith("http://") ||
        user.profilePic.startsWith("https://")
      ) {
        return user.profilePic;
      } else if (user.profilePic.startsWith("/")) {
        return `${import.meta.env.VITE_API_URL}${user.profilePic}`;
      } else {
        return `${import.meta.env.VITE_API_URL}/${user.profilePic}`;
      }
    }
    return null;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="sticky top-0 z-50 bg-[#17196D] dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Left section - logo and sidebar toggle */}
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 p-1 rounded-md text-white dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white dark:text-blue-400">
                BBU Library
              </span>
            </Link>
          </div>
          
          {/* Right section - dark mode, language, user profile */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
              aria-label={language === 'en' ? 'Switch to Khmer' : 'Switch to English'}
            >
              {language === 'en' ? (
                <US className="w-5 h-5 rounded-sm" />
              ) : (
                <KH className="w-5 h-5 rounded-sm" />
              )}
              <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'KH'}</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
              >
                {/* Profile Picture or Default Icon */}
                <div className="w-6 h-6 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center overflow-hidden bg-white dark:bg-gray-800">
                  {getProfilePicUrl() && !imageError ? (
                    <img
                      src={getProfilePicUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <FiUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
                <FiChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiUser className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiSettings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;