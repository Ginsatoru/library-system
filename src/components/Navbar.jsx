import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  FiLogOut,
  FiMenu,
  FiUser,
  FiChevronDown,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";
import { GoHeart } from "react-icons/go";
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
  wishlistCount = 0,
  avatarRef,
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
  const navigate = useNavigate();

  useEffect(() => { localStorage.setItem("language", language); }, [language]);
  useEffect(() => { setImageError(false); }, [user?.profilePicture]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "km" : "en"));

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getProfilePicUrl = () => {
    if (user?.profilePicture && !imageError) return user.profilePicture;
    return null;
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/browse?search=${encodeURIComponent(q)}`);
    if (onSearch) onSearch(q);
    setIsMobileMenuOpen(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleSearch(); }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const useTransparent = isHomePage && !isScrolled;
  const displayName = user?.fullName?.split(" ")[0] || user?.email || "User";

  const WishlistBadge = () =>
    wishlistCount > 0 ? (
      <span className="ml-auto min-w-[1.25rem] h-5 px-1 bg-[#000080] text-white text-xs font-bold rounded-full flex items-center justify-center">
        {wishlistCount > 99 ? "99+" : wishlistCount}
      </span>
    ) : null;

  // Animation variants
  const logoVariants = {
    hidden: { x: -120, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
    },
  };

  const mobileMenuBtnVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
    },
  };

  const rightSlideVariants = (delay = 0) => ({
    hidden: { x: 120, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          useTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md shadow-lg"
        }`}
      >
        <div className="w-full px-3 sm:px-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center h-16 sm:h-[4.5rem]">

              {/* Left section */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile menu button — slides from left */}
                <motion.button
                  variants={mobileMenuBtnVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`md:hidden p-1.5 rounded-lg transition-all duration-200 shadow-sm border ${
                    useTransparent
                      ? "bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                      : "bg-white hover:bg-[#000080]/5 text-[#000080] border-gray-200"
                  }`}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                </motion.button>

                {/* Logo — slides from left */}
                <motion.div
                  variants={logoVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
                    <img src={logoIcon} alt="BBU Library Icon" className="h-9 sm:h-11 w-auto object-contain transition-all duration-300" />
                    <img
                      src={logo}
                      alt="BBU Library"
                      className={`h-9 sm:h-11 w-auto object-contain transition-all duration-300 ${!useTransparent ? "brightness-0 saturate-100" : ""}`}
                      style={!useTransparent ? { filter: "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(20%) contrast(100%)" } : {}}
                    />
                  </Link>
                </motion.div>
              </div>

              {/* Right section — all slides from right together */}
              <motion.div
                variants={rightSlideVariants(0.2)}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2"
              >

                {/* Search Bar - Desktop */}
                <div className="relative w-52 lg:w-72 hidden md:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Search..."
                    className={`w-full px-4 py-2.5 pl-10 pr-4 rounded-lg text-sm transition-all duration-200 ${
                      useTransparent
                        ? "bg-white/10 border border-white/30 text-white placeholder-white/70 backdrop-blur-sm focus:ring-white/50"
                        : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#000080]"
                    } focus:outline-none focus:ring-2 focus:border-transparent shadow-sm`}
                  />
                  <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${useTransparent ? "text-white/70" : "text-gray-400"}`} />
                  {searchQuery && (
                    <button
                      onClick={handleSearch}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${useTransparent ? "text-white hover:text-white/70" : "text-[#000080] hover:text-[#000080]/70"}`}
                      aria-label="Search"
                    >
                      <FiSearch className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 h-10 rounded-lg font-medium transition-all duration-200 shadow-sm border ${
                    useTransparent
                      ? "bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                      : "bg-white hover:bg-[#000080]/5 text-[#000080] border-gray-200"
                  }`}
                  aria-label={language === "en" ? "Switch to Khmer" : "Switch to English"}
                >
                  {language === "en" ? <US className="w-5 h-5 rounded-sm" /> : <KH className="w-5 h-5 rounded-sm" />}
                  <span className="hidden sm:inline text-sm">{language === "en" ? "EN" : "KH"}</span>
                </button>

                {/* User Menu or Login */}
                <div>
                  {isAuthenticated ? (
                    <div className="relative" ref={userMenuRef}>
                      <button
                        ref={avatarRef}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 h-10 rounded-lg transition-all duration-200 shadow-sm border ${
                          useTransparent
                            ? "bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                            : "bg-white hover:bg-[#000080]/5 text-[#000080] border-gray-200"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          {getProfilePicUrl() ? (
                            <img
                              src={getProfilePicUrl()}
                              alt="Profile"
                              className="w-full h-full object-cover"
                              onError={() => setImageError(true)}
                              onLoad={() => setImageError(false)}
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <FiUser className={`w-4 h-4 ${useTransparent ? "text-white" : "text-[#000080]"}`} />
                          )}
                        </div>
                        <span className="hidden lg:block text-sm font-medium">{displayName}</span>
                        <FiChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Dropdown */}
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                        >
                          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-[#000080]/5 flex-shrink-0">
                              {getProfilePicUrl() ? (
                                <img
                                  src={getProfilePicUrl()}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                  onError={() => setImageError(true)}
                                  crossOrigin="anonymous"
                                />
                              ) : (
                                <FiUser className="w-5 h-5 text-[#000080]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || "—"}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.email || user?.memberType || ""}</p>
                            </div>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/profile"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] transition-all duration-200"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <FiUser className="w-4 h-4 mr-3" />
                              Profile
                            </Link>
                            <Link
                              to="/history"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] transition-all duration-200"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <RiHistoryFill className="w-4 h-4 mr-3" />
                              History
                            </Link>
                            <Link
                              to="/wishlist"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] transition-all duration-200"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <GoHeart className="w-4 h-4 mr-3" />
                              Wishlist
                              <WishlistBadge />
                            </Link>
                            <div className="border-t border-gray-200 my-1" />
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
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm text-sm ${
                        useTransparent
                          ? "bg-white hover:bg-white/90 text-[#000080]"
                          : "bg-[#000080] hover:bg-[#000080]/90 text-white"
                      }`}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 left-0 bottom-0 w-64 bg-white shadow-xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Search..."
                    className="w-full px-4 py-2.5 pl-10 pr-4 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  />
                  <FiSearch
                    onClick={handleSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                  />
                </div>

                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                      <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-[#000080]/5 flex-shrink-0">
                        {getProfilePicUrl() ? (
                          <img
                            src={getProfilePicUrl()}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <FiUser className="w-5 h-5 text-[#000080]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || "—"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.memberType || ""}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] rounded-lg transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <FiUser className="w-5 h-5 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/history"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] rounded-lg transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <RiHistoryFill className="w-5 h-5 mr-3" />
                        History
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] rounded-lg transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <GoHeart className="w-5 h-5 mr-3" />
                        Wishlist
                        <WishlistBadge />
                      </Link>
                      <div className="border-t border-gray-200 my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <FiLogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </>
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