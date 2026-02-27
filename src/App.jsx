import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./components/History";
import Toast from "./components/Toast";
import AuthPage from "./pages/AuthPage";
import BrowseBooks from "./pages/BrowseBooks";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import authService from "./services/authServices";
import memberService from "./services/memberServices";
import LibraryLogForm from "./pages/LibraryLogForm";
import Wishlist from "./pages/Wishlist";

const AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// ─── Flying heart particle ────────────────────────────────────────────────────
const FlyingHeart = ({ id, startX, startY, endX, endY, onDone }) => (
  <motion.div
    key={id}
    initial={{ x: startX, y: startY, scale: 1, opacity: 1, rotate: 0 }}
    animate={{
      x: [startX, startX + (endX - startX) * 0.3, endX],
      y: [startY, startY - 100, endY],
      scale: [1, 0.8, 0.25],
      opacity: [1, 1, 0],
      rotate: [0, -20, 15],
    }}
    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
    onAnimationComplete={onDone}
    style={{ position: "fixed", zIndex: 9999, pointerEvents: "none", top: 0, left: 0 }}
  >
    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
      <FiHeart className="w-4 h-4 text-white" style={{ fill: "white" }} />
    </div>
  </motion.div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [flyingHearts, setFlyingHearts] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
    subMessage: "",
  });
  const [sessionExpired, setSessionExpired] = useState(false);

  const navbarAvatarRef = useRef(null);
  const particleId = useRef(0);

  const location = useLocation();
  const navigate = useNavigate();

  const showToast = (type, message, subMessage = "") => {
    setToast({ show: true, type, message, subMessage });
  };

  const closeToast = () => setToast((t) => ({ ...t, show: false }));

  const fetchWishlistCount = async () => {
    const result = await memberService.getWishlistIds();
    if (result.success) setWishlistCount(result.data.length);
  };

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser?.isAuthenticated) {
      setIsAuthenticated(true);
      setUser(storedUser);
      fetchWishlistCount();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handler = () => setSessionExpired(true);
    window.addEventListener("session:expired", handler);
    return () => window.removeEventListener("session:expired", handler);
  }, []);

  const handleSessionExpiredConfirm = async () => {
    setSessionExpired(false);
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setWishlistCount(0);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const login = (customMessage) => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
      fetchWishlistCount();
      const name = storedUser.fullName?.split(" ")[0] || "there";
      showToast(
        "success",
        customMessage || `Welcome back, ${name}!`,
        "You're now logged in.",
      );
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setWishlistCount(0);
    showToast("info", "Logged out successfully", "See you next time!");
  };

  // Called by BookCard when heart is tapped (add only)
  const launchHeart = useCallback((heartEl) => {
    if (!navbarAvatarRef.current || !heartEl) return;
    const heartRect = heartEl.getBoundingClientRect();
    const avatarRect = navbarAvatarRef.current.getBoundingClientRect();

    const startX = heartRect.left + heartRect.width / 2 - 16;
    const startY = heartRect.top + heartRect.height / 2 - 16;
    const endX   = avatarRect.left + avatarRect.width / 2 - 16;
    const endY   = avatarRect.top  + avatarRect.height / 2 - 16;

    const id = ++particleId.current;
    setFlyingHearts((prev) => [...prev, { id, startX, startY, endX, endY }]);
  }, []);

  const handleHeartDone = useCallback((id) => {
    setFlyingHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const isAuthPage = AUTH_PAGES.includes(location.pathname);
  const isHomePage = location.pathname === "/";

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={closeToast}
      />

      {/* Flying hearts portal */}
      {flyingHearts.map((h) => (
        <FlyingHeart
          key={h.id}
          {...h}
          onDone={() => handleHeartDone(h.id)}
        />
      ))}

      {/* Session Expired Modal */}
      <AnimatePresence>
        {sessionExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="relative w-14 h-14 mx-auto mb-4">
                <motion.span
                  className="absolute inset-0 rounded-full bg-amber-300"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                />
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                  <motion.svg
                    className="w-7 h-7 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                  >
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    <motion.line
                      x1="12" y1="12" x2="12" y2="8"
                      stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 90, 180, 270, 360] }}
                      transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2, times: [0, 0.25, 0.5, 0.75, 1] }}
                      style={{ transformOrigin: "12px 12px" }}
                    />
                    <motion.line
                      x1="12" y1="12" x2="15" y2="10"
                      stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 30, 60] }}
                      transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2, times: [0, 0.5, 1] }}
                      style={{ transformOrigin: "12px 12px" }}
                    />
                  </motion.svg>
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-1">Session Expired</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your session has timed out due to inactivity.
                <br />
                Please log in again to continue.
              </p>
              <button
                onClick={handleSessionExpiredConfirm}
                className="w-full py-2.5 bg-[#000080] text-white rounded-full text-sm font-medium hover:bg-[#000080]/90 transition-colors"
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthPage && (
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          wishlistCount={wishlistCount}
          avatarRef={navbarAvatarRef}
        />
      )}

      {isAuthenticated && !isAuthPage && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <main className={`flex-1${!isAuthPage && !isHomePage ? " pt-14 sm:pt-16" : ""}`}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} launchHeart={launchHeart} />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage login={login} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage login={login} />} />
          <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage login={login} />} />
          <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage login={login} />} />
          <Route path="/library-log" element={<LibraryLogForm />} />
          <Route
            path="/wishlist"
            element={<Wishlist isAuthenticated={isAuthenticated} onWishlistChange={setWishlistCount} />}
          />

          {/* Semi-protected */}
          <Route
            path="/profile"
            element={
              isAuthenticated
                ? <Profile user={user} onUpdateUser={updateUser} showToast={showToast} />
                : <Navigate to="/login" replace />
            }
          />

          {/* Protected */}
          <Route
            path="/browse"
            element={
              <BrowseBooks
                isAuthenticated={isAuthenticated}
                onWishlistChange={setWishlistCount}
                launchHeart={launchHeart}
              />
            }
          />

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/history" element={<History />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;