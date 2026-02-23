import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import History from './components/History'
import Toast from './components/Toast'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import BrowseBooks from './pages/BrowseBooks'
import MyLibrary from './pages/MyLibrary'
import NotFound from './pages/NotFound'
import Reservation from './pages/Reservation'
import Duedates from './pages/Duedates'
import Settings from './components/settings/settings'
import Home from './pages/Home'
import Profile from './pages/Profile'
import authService from './services/authServices'

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password']

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, type: 'success', message: '', subMessage: '' })
  const location = useLocation()

  const showToast = (type, message, subMessage = '') => {
    setToast({ show: true, type, message, subMessage })
  }

  const closeToast = () => setToast(t => ({ ...t, show: false }))

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    if (storedUser?.isAuthenticated) {
      setIsAuthenticated(true)
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = (customMessage) => {
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setIsAuthenticated(true)
      setUser(storedUser)
      const name = storedUser.fullName?.split(' ')[0] || 'there'
      showToast('success', customMessage || `Welcome back, ${name}!`, "You're now logged in.")
    }
  }

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedFields }
      localStorage.setItem('user', JSON.stringify(merged))
      return merged
    })
  }

  const logout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    showToast('info', 'Logged out successfully', 'See you next time!')
  }

  const isAuthPage = AUTH_PAGES.includes(location.pathname)
  const isHomePage = location.pathname === '/'

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen flex flex-col">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={closeToast}
      />

      {!isAuthPage && (
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      {isAuthenticated && !isAuthPage && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <main className={`flex-1${!isAuthPage && !isHomePage ? ' pt-16 sm:pt-20' : ''}`}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login login={login} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register login={login} />}
          />
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />}
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
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<BrowseBooks />} />
            <Route path="/reservations" element={<Reservation />} />
            <Route path="/my-library" element={<MyLibrary />} />
            <Route path="/due-dates" element={<Duedates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/history" element={<History />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App