import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, AlertTriangle, BookOpen, ChevronRight, BellPlus, Moon, Sun, Filter, Search, Plus } from 'lucide-react';

const DueDates = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced sample data with more variety
  const items = [
    { 
      id: 1, 
      title: 'Introduction to Computer Science', 
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'due',
      category: 'Computer Science',
      coverColor: darkMode ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20' : 'bg-gradient-to-br from-blue-100 to-blue-50',
      priority: 'high',
      progress: 75
    },
    { 
      id: 2, 
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship', 
      dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'overdue',
      category: 'Programming',
      coverColor: darkMode ? 'bg-gradient-to-br from-rose-900/30 to-rose-800/20' : 'bg-gradient-to-br from-rose-100 to-rose-50',
      priority: 'critical',
      progress: 45
    },
    { 
      id: 3, 
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software', 
      dueDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
      status: 'upcoming',
      category: 'Software Design',
      coverColor: darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-indigo-800/20' : 'bg-gradient-to-br from-indigo-100 to-indigo-50',
      priority: 'medium',
      progress: 20
    },
    { 
      id: 4, 
      title: 'JavaScript: The Good Parts', 
      dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      status: 'due',
      category: 'Web Development',
      coverColor: darkMode ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/20' : 'bg-gradient-to-br from-amber-100 to-amber-50',
      priority: 'high',
      progress: 90
    },
    { 
      id: 5, 
      title: 'The Pragmatic Programmer', 
      dueDate: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
      status: 'upcoming',
      category: 'Professional Development',
      coverColor: darkMode ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20' : 'bg-gradient-to-br from-emerald-100 to-emerald-50',
      priority: 'low',
      progress: 10
    }
  ];

  const statusStyles = {
    overdue: {
      bg: darkMode ? 'bg-rose-900/40' : 'bg-rose-100/90',
      text: darkMode ? 'text-rose-200' : 'text-rose-800',
      icon: <AlertTriangle className={`h-3.5 w-3.5 ${darkMode ? 'text-rose-400' : 'text-rose-500'}`} />,
      label: 'Overdue',
      border: darkMode ? 'border-rose-700/50' : 'border-rose-200/50'
    },
    due: {
      bg: darkMode ? 'bg-amber-900/40' : 'bg-amber-100/90',
      text: darkMode ? 'text-amber-200' : 'text-amber-800',
      icon: <Clock className={`h-3.5 w-3.5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />,
      label: 'Due Soon',
      border: darkMode ? 'border-amber-700/50' : 'border-amber-200/50'
    },
    upcoming: {
      bg: darkMode ? 'bg-blue-900/40' : 'bg-blue-100/90',
      text: darkMode ? 'text-blue-200' : 'text-blue-800',
      icon: <CalendarDays className={`h-3.5 w-3.5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />,
      label: 'Upcoming',
      border: darkMode ? 'border-blue-700/50' : 'border-blue-200/50'
    }
  };

  const priorityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const daysUntilDue = (dateString) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    return `${diffDays}d`;
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: items.length,
    overdue: items.filter(item => item.status === 'overdue').length,
    due: items.filter(item => item.status === 'due').length,
    upcoming: items.filter(item => item.status === 'upcoming').length
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Due Dates
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your reading progress and deadlines
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Add Book
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className={`rounded-xl p-4 border shadow-sm ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Books</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>
            
            <motion.div 
              className={`rounded-xl p-4 border shadow-sm ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overdue</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{stats.overdue}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
            </motion.div>
            
            <motion.div 
              className={`rounded-xl p-4 border shadow-sm ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due Soon</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{stats.due}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </motion.div>
            
            <motion.div 
              className={`rounded-xl p-4 border shadow-sm ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{stats.upcoming}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`pl-10 pr-8 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="overdue">Overdue</option>
                <option value="due">Due Soon</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className={`rounded-2xl shadow-sm border overflow-hidden ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Content */}
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className={`text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No books found</p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search or filter criteria</p>
              </motion.div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    className={`p-4 sm:p-6 rounded-xl transition-all duration-300 border-2 cursor-pointer group ${
                      statusStyles[item.status].border
                    } ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex gap-4">
                      <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl ${item.coverColor} flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <BookOpen className={`h-6 w-6 sm:h-7 sm:w-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className={`text-base sm:text-lg font-semibold leading-tight mb-1 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.title}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.category}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <div className={`h-2 w-2 rounded-full ${priorityColors[item.priority]}`}></div>
                            <ChevronRight className={`h-5 w-5 transition-colors ${
                              darkMode 
                                ? 'text-gray-400 group-hover:text-gray-300' 
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`} />
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-3 py-1.5 rounded-full ${statusStyles[item.status].bg} ${statusStyles[item.status].text} flex items-center gap-1.5 font-medium`}>
                              {statusStyles[item.status].icon}
                              <span>{statusStyles[item.status].label}</span>
                            </span>
                            
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(item.dueDate)} • {daysUntilDue(item.dueDate)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progress:</span>
                              <div className={`w-16 h-1.5 rounded-full overflow-hidden ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-200'
                              }`}>
                                <div 
                                  className="h-full bg-blue-500 transition-all duration-300"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <motion.div 
            className={`p-4 border-t ${
              darkMode 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button className={`flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}>
                <BellPlus className="h-4 w-4" /> 
                <span>Set Reminder for All</span>
              </button>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing {filteredItems.length} of {items.length} books
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DueDates;