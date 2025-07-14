import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Calendar, 
  Star, 
  Clock, 
  Filter, 
  Search, 
  ChevronDown,
  Moon,
  Sun,
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

// Mock data for reading history
const readingHistory = [
  {
    id: 1,
    title: 'The Clean Coder',
    author: 'Robert C. Martin',
    category: 'Programming',
    rating: 5,
    dateRead: '2024-01-15',
    readTime: '5 days',
    pageCount: 247,
    coverColor: 'bg-blue-500',
    notes: 'Excellent insights on professional software development practices.'
  },
  {
    id: 2,
    title: 'Design Patterns',
    author: 'Gang of Four',
    category: 'Programming',
    rating: 4,
    dateRead: '2024-01-10',
    readTime: '12 days',
    pageCount: 395,
    coverColor: 'bg-green-500',
    notes: 'Classic book on software design patterns. Still relevant today.'
  },
  {
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    rating: 5,
    dateRead: '2024-01-05',
    readTime: '3 days',
    pageCount: 320,
    coverColor: 'bg-purple-500',
    notes: 'Life-changing book about building good habits and breaking bad ones.'
  },
  {
    id: 4,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    rating: 4,
    dateRead: '2023-12-28',
    readTime: '4 days',
    pageCount: 256,
    coverColor: 'bg-orange-500',
    notes: 'Great perspective on how psychology affects financial decisions.'
  },
  {
    id: 5,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'History',
    rating: 5,
    dateRead: '2023-12-20',
    readTime: '8 days',
    pageCount: 443,
    coverColor: 'bg-red-500',
    notes: 'Fascinating look at human history and development.'
  },
  {
    id: 6,
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    rating: 4,
    dateRead: '2023-12-15',
    readTime: '6 days',
    pageCount: 336,
    coverColor: 'bg-teal-500',
    notes: 'Essential reading for entrepreneurs and product managers.'
  }
];

const yearlyStats = {
  totalBooks: 24,
  totalPages: 7892,
  averageRating: 4.3,
  readingStreak: 15,
  favoriteCategory: 'Programming',
  totalReadingTime: '127 days'
};

const categories = ['All', 'Programming', 'Self-Help', 'Finance', 'History', 'Business', 'Science'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const ReadingHistory = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateRead');
  const [showFilters, setShowFilters] = useState(false);

  const filteredHistory = readingHistory.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'dateRead':
        return new Date(b.dateRead) - new Date(a.dateRead);
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  const themeClasses = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-slate-50 to-blue-50/30 text-gray-900';

  return (
    <motion.div 
      className={`min-h-screen ${themeClasses} transition-colors duration-300 p-4 md:p-6 lg:p-8`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 md:mb-2">
                  Reading History
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'} text-base md:text-lg`}>
                  Track your reading journey and discover insights
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          <motion.div 
            whileHover={{ y: -5 }}
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border hover:shadow-md transition-all`}
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-1`}>
                    Books Read
                  </p>
                  <p className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {yearlyStats.totalBooks}
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border hover:shadow-md transition-all`}
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-1`}>
                    Pages Read
                  </p>
                  <p className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {yearlyStats.totalPages.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border hover:shadow-md transition-all`}
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-1`}>
                    Avg Rating
                  </p>
                  <p className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {yearlyStats.averageRating}
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border hover:shadow-md transition-all`}
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'} mb-1`}>
                    Reading Streak
                  </p>
                  <p className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {yearlyStats.readingStreak}
                  </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border mb-6 md:mb-8`}
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 md:py-3 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 md:py-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
              >
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Category Filter */}
                    <div className="flex-1">
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : isDarkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div className="lg:w-48">
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                      >
                        <option value="dateRead">Date Read</option>
                        <option value="rating">Rating</option>
                        <option value="title">Title</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Books List */}
        <motion.div variants={itemVariants}>
          <div className="space-y-4 md:space-y-6">
            <AnimatePresence>
              {sortedHistory.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border hover:shadow-md transition-all`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Book Cover */}
                      <div className={`w-16 h-20 md:w-20 md:h-24 ${book.coverColor} rounded-lg flex items-center justify-center mx-auto lg:mx-0`}>
                        <Book className="h-8 w-8 md:h-10 md:w-10 text-white" />
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 text-center lg:text-left">
                        <h3 className={`text-lg md:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-1`}>
                          {book.title}
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'} text-sm md:text-base mb-2`}>
                          by {book.author}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(book.rating)}
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {book.category}
                          </span>
                          <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                            <Calendar className="h-4 w-4" />
                            {new Date(book.dateRead).toLocaleDateString()}
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                            <Clock className="h-4 w-4" />
                            {book.readTime}
                          </div>
                        </div>

                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-700'} text-sm md:text-base`}>
                          {book.notes}
                        </p>
                      </div>

                      {/* Page Count */}
                      <div className={`text-center lg:text-right ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                        <p className="text-2xl md:text-3xl font-bold">{book.pageCount}</p>
                        <p className="text-xs md:text-sm">pages</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {sortedHistory.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <Book className={`h-12 w-12 md:h-16 md:w-16 ${isDarkMode ? 'text-gray-600' : 'text-slate-400'} mx-auto mb-4`} />
              <h3 className={`text-lg md:text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} mb-2`}>
                No books found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-500'} text-sm md:text-base`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReadingHistory;