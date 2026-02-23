import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Book, Calendar, BookOpen, History, Bookmark } from 'lucide-react';

// Mock data
const currentLoans = [
  { id: 1, title: 'Introduction to Computer Science', dueDate: '2023-06-15', daysRemaining: 5 },
  { id: 2, title: 'Clean Code', dueDate: '2023-06-20', daysRemaining: 10 },
];

const readingStats = {
  booksRead: 12,
  pagesRead: 3456,
  favoriteCategory: 'Computer Science',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const Dashboard = () => {
  return (
    <motion.div 
      className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Welcome back! Here's your reading overview.
          </p>
        </div>
        
        {/* Stats Cards - Responsive Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          {/* Books Checked Out Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Books Checked Out
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {currentLoans.length}
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Books Read Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Books Read This Year
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {readingStats.booksRead}
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Book className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Favorite Category Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all sm:col-span-2 lg:col-span-1"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Favorite Category
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {readingStats.favoriteCategory}
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Bookmark className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Current Loans Section */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                  Current Loans
                </h2>
                <Link 
                  to="/my-library" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                >
                  View All <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              {currentLoans.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 md:mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                    You don't have any books checked out currently.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {currentLoans.map((loan, index) => (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-3 md:gap-4 mb-2 sm:mb-0">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Book className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                            {loan.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            Due: {loan.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium ${
                          loan.daysRemaining <= 3 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' 
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        }`}>
                          {loan.daysRemaining} days remaining
                        </span>
                        <div className={`h-2 w-2 md:h-3 md:w-3 rounded-full ${
                          loan.daysRemaining <= 3 ? 'bg-red-400 dark:bg-red-500' : 'bg-green-400 dark:bg-green-500'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Quick Actions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Access your most used features
              </p>
            </div>
            
            <div className="p-4 md:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Link
                  to="/browse"
                  className="group relative rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-blue-300 dark:group-hover:bg-blue-700 transition-colors">
                      <Book className="h-5 w-5 md:h-6 md:w-6 text-blue-700 dark:text-blue-400" />
                    </div>
                    <span className="text-sm md:text-base font-semibold text-blue-900 dark:text-blue-200">
                      Browse Books
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 hidden md:block">
                      Discover new titles
                    </span>
                  </div>
                </Link>
                
                <Link
                  to="/my-library"
                  className="group relative rounded-lg bg-green-50 dark:bg-green-900/20 p-4 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-green-300 dark:group-hover:bg-green-700 transition-colors">
                      <Bookmark className="h-5 w-5 md:h-6 md:w-6 text-green-700 dark:text-green-400" />
                    </div>
                    <span className="text-sm md:text-base font-semibold text-green-900 dark:text-green-200">
                      My Library
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400 mt-1 hidden md:block">
                      Your collection
                    </span>
                  </div>
                </Link>
                
                <Link
                  to="/reservations"
                  className="group relative rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-purple-300 dark:group-hover:bg-purple-700 transition-colors">
                      <Calendar className="h-5 w-5 md:h-6 md:w-6 text-purple-700 dark:text-purple-400" />
                    </div>
                    <span className="text-sm md:text-base font-semibold text-purple-900 dark:text-purple-200">
                      Reservations
                    </span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 mt-1 hidden md:block">
                      Manage holds
                    </span>
                  </div>
                </Link>
                
                <Link
                  to="/history"
                  className="group relative rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-orange-300 dark:group-hover:bg-orange-700 transition-colors">
                      <History className="h-5 w-5 md:h-6 md:w-6 text-orange-700 dark:text-orange-400" />
                    </div>
                    <span className="text-sm md:text-base font-semibold text-orange-900 dark:text-orange-200">
                      History
                    </span>
                    <span className="text-xs text-orange-600 dark:text-orange-400 mt-1 hidden md:block">
                      Past reads
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;