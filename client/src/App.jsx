import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import History from './components/History'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BrowseBooks from './pages/BrowseBooks'
import MyLibrary from './pages/MyLibrary'
import NotFound from './pages/NotFound'
import Reservation from './pages/Reservation'
import Duedates from './pages/Duedates'
import Settings from './components/settings/settings'
import Home from './pages/Home'
import authService from './services/authServices'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = authService.getStoredUser()
        if (storedUser && storedUser.isAuthenticated) {
          setIsAuthenticated(true)
          setUser(storedUser)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = () => {
    // Get the user data from localStorage after successful login
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setIsAuthenticated(true)
      setUser(storedUser)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear state even if API call fails
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const isLoginPage = location.pathname === '/login'

  // Show loading spinner during initial auth check
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show navbar for all pages except login */}
      {!isLoginPage && (
        <Navbar 
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      {/* Show sidebar only when authenticated and not on login page */}
      {isAuthenticated && !isLoginPage && (
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}
      
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login login={login} />
          } />
          
          {/* Protected routes - only accessible when authenticated */}
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
      
      {/* Show footer for all pages except login */}
      {!isLoginPage && <Footer />}
    </div>
  )
}

export default App