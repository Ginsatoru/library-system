import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  BookOpen,
  Library,
  Bookmark,
  CalendarDays,
  History,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/browse", name: "Browse Books", icon: <BookOpen className="h-5 w-5" /> },
    { path: "/my-library", name: "My Library", icon: <Library className="h-5 w-5" /> },
    { path: "/reservations", name: "Reservations", icon: <Bookmark className="h-5 w-5" /> },
    { path: "/due-dates", name: "Due Dates", icon: <CalendarDays className="h-5 w-5" /> },
    { path: "/history", name: "Reading History", icon: <History className="h-5 w-5" /> }
  ];

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 shadow-xl overflow-hidden"
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">BBU Library</h2>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                      location.pathname === item.path 
                        ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3 ${
                      location.pathname === item.path 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              Settings
            </Link>
            <button className="w-full flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-1">
              <LogOut className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              Sign Out
            </button>
            
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Student Portal v2.0.1
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;