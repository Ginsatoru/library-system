import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RotateCcw, BookOpen, BookmarkPlus } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookDetailsModal from '../components/BookDetailsModal';

const BrowseBooks = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    available: false,
    category: '',
    language: 'all',
    sortBy: 'title'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showReader, setShowReader] = useState(false);

  const mockBooks = [
    { id: 1, title: 'Introduction to Computer Science', author: 'John Doe', available: true, category: 'computer', language: 'English' },
    { id: 2, title: 'Data Structures and Algorithms', author: 'Jane Smith', available: true, category: 'programming', language: 'English' },
    { id: 3, title: 'The Art of Programming', author: 'Alan Turing', available: false, category: 'programming', language: 'English' },
    { id: 4, title: 'Clean Code', author: 'Robert C. Martin', available: true, category: 'programming', language: 'English' },
    { id: 5, title: 'Design Patterns', author: 'Erich Gamma', available: false, category: 'design', language: 'English' },
    { id: 6, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', available: true, category: 'programming', language: 'English' },
    { id: 7, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', available: true, category: 'programming', language: 'English' },
    { id: 8, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', available: true, category: 'programming', language: 'English' },
    { id: 9, title: 'Computer Networking', author: 'James Kurose', available: true, category: 'computer', language: 'English' },
    { id: 10, title: 'Database Systems', author: 'Raghu Ramakrishnan', available: true, category: 'computer', language: 'English' },
    { id: 11, title: 'Artificial Intelligence', author: 'Stuart Russell', available: false, category: 'computer', language: 'English' },
    { id: 12, title: 'Operating Systems', author: 'Abraham Silberschatz', available: true, category: 'computer', language: 'English' },
  ];

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = !filters.available || book.available;
    const matchesCategory = !filters.category || book.category === filters.category;
    const matchesLanguage = filters.language === 'all' || book.language === filters.language;
    
    return matchesSearch && matchesAvailability && matchesCategory && matchesLanguage;
  }).sort((a, b) => {
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'author') {
      return a.author.localeCompare(b.author);
    } else if (filters.sortBy === 'popularity') {
      return b.id - a.id; // Simulating popularity by ID
    }
    return 0;
  });

  const handleBorrow = () => {
    alert(`You have borrowed "${selectedBook.title}"`);
    setSelectedBook(null);
  };

  const handleAddToWishlist = (book) => {
    if (wishlist.some(item => item.id === book.id)) {
      setWishlist(wishlist.filter(item => item.id !== book.id));
      alert(`Removed "${book.title}" from wishlist`);
    } else {
      setWishlist([...wishlist, book]);
      alert(`Added "${book.title}" to wishlist`);
    }
  };

  const handleReadOnline = (book) => {
    setSelectedBook(book);
    setShowReader(true);
  };

  const resetFilters = () => {
    setFilters({
      available: false,
      category: '',
      language: 'all',
      sortBy: 'title'
    });
    setSearchTerm('');
  };

  const OnlineReader = ({ book, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-dark-700 rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col"
        >
          <div className="border-b border-gray-200 dark:border-dark-600 p-4 flex justify-between items-center">
            <h3 className="text-lg font-medium dark:text-white">{book.title}</h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-dark-800">
              <div className="text-center p-8">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Online Reader</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Reading: {book.title}</p>
                <p className="text-gray-500 dark:text-gray-400">(In a real application, this would show the book content)</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-dark-600 p-3 flex justify-between items-center bg-gray-50 dark:bg-dark-600">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-500 disabled:opacity-50" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">Page 1 of 1</span>
              <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-500 disabled:opacity-50" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div>
              <button 
                className="px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-800 text-sm font-medium"
                onClick={() => alert('Download disabled for online reading')}
              >
                Download (Disabled)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">BBU Library Collection</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover thousands of books in BBU's digital library</p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                className="w-full pl-10 pr-4 py-3 border outline-none border-gray-300 dark:border-dark-600 rounded-xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 shadow-sm bg-white dark:bg-dark-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-colors ${
                showFilters || filters.available || filters.category || filters.language !== 'all' || filters.sortBy !== 'title'
                  ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400' 
                  : 'bg-white dark:bg-dark-700 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600'
              }`}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-dark-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-600 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Availability</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available-only"
                      checked={filters.available}
                      onChange={(e) => setFilters({...filters, available: e.target.checked})}
                      className="h-4 w-4 text-primary-600 dark:text-primary-400 focus:ring-primary-500 border-gray-300 dark:border-dark-500 rounded"
                    />
                    <label htmlFor="available-only" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Available Only
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-dark-700 dark:text-white"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    <option value="computer">Computer Science</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-dark-700 dark:text-white"
                    value={filters.language}
                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                  >
                    <option value="all">All Languages</option>
                    <option value="English">English</option>
                    <option value="Khmer">Khmer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-dark-700 dark:text-white"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="author">Author (A-Z)</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Wishlist Indicator */}
          {wishlist.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <BookmarkPlus className="h-4 w-4 mr-1 text-secondary-500" />
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </div>
          )}
        </div>
        
        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-dark-700 rounded-xl shadow-sm p-8 text-center"
          >
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No books found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onViewDetails={setSelectedBook}
                onAddToWishlist={handleAddToWishlist}
                inWishlist={wishlist.some(item => item.id === book.id)}
              />
            ))}
          </div>
        )}
        
        {/* Book Details Modal */}
        {selectedBook && (
          <BookDetailsModal 
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onBorrow={handleBorrow}
            onAddToWishlist={handleAddToWishlist}
            onReadOnline={() => handleReadOnline(selectedBook)}
            inWishlist={wishlist.some(item => item.id === selectedBook.id)}
          />
        )}
        
        {/* Online Reader */}
        {showReader && selectedBook && (
          <OnlineReader 
            book={selectedBook} 
            onClose={() => setShowReader(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default BrowseBooks;