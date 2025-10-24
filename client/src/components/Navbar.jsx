import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  FiLogOut,
  FiMenu,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiSearch,
  FiX,
  FiHome,
} from "react-icons/fi";
import { US, KH } from "country-flag-icons/react/3x2";
import logo from "../assets/logo.png";
import logoIcon from "../assets/logoicon.png";

const Navbar = ({
  logout,
  sidebarOpen,
  setSidebarOpen,
  user,
  onSearch,
  isAuthenticated,
}) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Change navbar style when scrolled down 100px or more
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "km" : "en"));
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-3 sm:px-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Left section - logo and menu toggle for mobile */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`md:hidden p-2 rounded-lg transition-all duration-200 shadow-sm border ${
                    isScrolled
                      ? "bg-white hover:bg-[#000080]/5 text-[#000080] border-gray-200"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  }`}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <FiX className="h-4 w-4" />
                  ) : (
                    <FiMenu className="h-4 w-4" />
                  )}
                </button>

                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={scrollToTop}
                >
                  {/* Logo Icon - no color filter applied */}
                  <img
                    src={logoIcon}
                    alt="BBU Library Icon"
                    className="h-8 sm:h-10 w-auto object-contain transition-all duration-300"
                  />
                  {/* Logo Text - color filter applied when scrolled */}
                  <img
                    src={logo}
                    alt="BBU Library"
                    className={`h-8 sm:h-10 w-auto object-contain transition-all duration-300 ${
                      isScrolled ? "brightness-0 saturate-100" : ""
                    }`}
                    style={
                      isScrolled
                        ? {
                            filter:
                              "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(20%) contrast(100%)",
                          }
                        : {}
                    }
                  />
                </Link>
              </div>

              {/* Right section - search bar, language and user profile/login */}
              <div className="flex items-center gap-2">
                {/* Search Bar - Desktop */}
                <div className="relative w-48 lg:w-64 hidden md:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Search..."
                    className={`w-full px-4 py-2 pl-10 pr-4 rounded-lg text-sm transition-all duration-200 ${
                      isScrolled
                        ? "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#000080]"
                        : "bg-white/10 border border-white/30 text-white placeholder-white/70 backdrop-blur-sm focus:ring-white/50"
                    } focus:outline-none focus:ring-2 focus:border-transparent shadow-sm`}
                  />
                  <FiSearch
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                      isScrolled ? "text-gray-400" : "text-white/70"
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={(e) => handleSearchSubmit(e)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                        isScrolled
                          ? "text-[#000080] hover:text-[#000080]/70"
                          : "text-white hover:text-white/70"
                      }`}
                      aria-label="Search"
                    >
                      <FiSearch className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm border ${
                    isScrolled
                      ? "bg-white hover:bg-[#000080]/5 text-[#000080] border-gray-200"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  }`}
                  aria-label={
                    language === "en" ? "Switch to Khmer" : "Switch to English"
                  }
                >
                  {language === "en" ? (
                    <US className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm" />
                  ) : (
                    <KH className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm" />
                  )}
                  <span className="hidden sm:inline text-sm">
                    {language === "en" ? "EN" : "KH"}
                  </span>
                </button>

                {/* Conditional User Profile or Login Button */}
                {isAuthenticated ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 shadow-sm border ${
                        isScrolled
                          ? "bg-white hover:bg-[#000080]/5 text-[#000080] border-gray-200"
                          : "bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                      }`}
                    >
                      {/* Profile Picture or Default Icon */}
                      <div
                        className={`w-4 h-4 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                          isScrolled
                            ? "border-[#000080]/20 bg-[#000080]/5"
                            : "border-white/30 bg-white/10"
                        }`}
                      >
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
                          <FiUser
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-4 ${
                              isScrolled ? "text-[#000080]" : "text-white"
                            }`}
                          />
                        )}
                      </div>
                      <span className="hidden lg:block text-sm font-medium">
                        {user?.firstName || user?.username || "User"}
                      </span>
                      <FiChevronDown
                        className={`w-4 h-4 transform transition-transform duration-200 ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiHome className="w-4 h-4 mr-3" />
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiUser className="w-4 h-4 mr-3" />
                            Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiSettings className="w-4 h-4 mr-3" />
                            Settings
                          </Link>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                          >
                            <FiLogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm text-sm ${
                      isScrolled
                        ? "bg-[#000080] hover:bg-[#000080]/90 text-white"
                        : "bg-white hover:bg-white/90 text-[#000080]"
                    }`}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-14 left-0 bottom-0 w-64 bg-white shadow-xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4">
                {/* Search Bar in Mobile Menu */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Search..."
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Mobile Menu Items */}
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] rounded-lg transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <FiHome className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] rounded-lg transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <FiUser className="w-5 h-5 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] rounded-lg transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <FiSettings className="w-5 h-5 mr-3" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FiLogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#000080] hover:bg-[#000080]/90 text-white font-medium transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <FiUser className="w-5 h-5" />
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
