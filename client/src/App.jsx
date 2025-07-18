import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const login = () => {
    setIsLoading(true)
    // Mock authentication
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1000)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && (
        <>
          <Navbar 
            logout={logout} 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <Sidebar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </>
      )}
      
      <main className="flex-1 p-0 md:p-0">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login login={login} />
            } />
            
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/browse" element={<BrowseBooks />} />
              <Route path="/reservations" element={<Reservation />} />
              <Route path="/my-library" element={<MyLibrary />} />
              <Route path="/due-dates" element={<Duedates />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<History />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
      
      {isAuthenticated && <Footer />}
    </div>
  )
}

export default App