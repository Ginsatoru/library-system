import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BookCard from "../components/BookCard";
import BookDetailsModal from "../components/BookDetailsModal";

const BrowseBooks = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    available: false,
    category: "",
    language: "all",
    sortBy: "title",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showReader, setShowReader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const mockBooks = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      author: "John Doe",
      available: true,
      category: "computer",
      language: "English",
    },
    {
      id: 2,
      title: "Data Structures and Algorithms",
      author: "Jane Smith",
      available: true,
      category: "programming",
      language: "English",
    },
    {
      id: 3,
      title: "The Art of Programming",
      author: "Alan Turing",
      available: false,
      category: "programming",
      language: "English",
    },
    {
      id: 4,
      title: "Clean Code",
      author: "Robert C. Martin",
      available: true,
      category: "programming",
      language: "English",
    },
    {
      id: 5,
      title: "Design Patterns",
      author: "Erich Gamma",
      available: false,
      category: "design",
      language: "English",
    },
    {
      id: 6,
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      available: true,
      category: "programming",
      language: "English",
    },
    {
      id: 7,
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      available: true,
      category: "programming",
      language: "English",
    },
    {
      id: 8,
      title: "Eloquent JavaScript",
      author: "Marijn Haverbeke",
      available: true,
      category: "programming",
      language: "English",
    },
    {
      id: 9,
      title: "Computer Networking",
      author: "James Kurose",
      available: true,
      category: "computer",
      language: "English",
    },
    {
      id: 10,
      title: "Database Systems",
      author: "Raghu Ramakrishnan",
      available: true,
      category: "computer",
      language: "English",
    },
    {
      id: 11,
      title: "Artificial Intelligence",
      author: "Stuart Russell",
      available: false,
      category: "computer",
      language: "English",
    },
    {
      id: 12,
      title: "Operating Systems",
      author: "Abraham Silberschatz",
      available: true,
      category: "computer",
      language: "English",
    },
    {
      id: 13,
      title: "Advanced React Patterns",
      author: "React Team",
      available: true,
      category: "programming",
      language: "English",
    },
    {
      id: 14,
      title: "TypeScript Handbook",
      author: "Microsoft",
      available: true,
      category: "programming",
      language: "English",
    },
    {
      id: 15,
      title: "UX Design Principles",
      author: "Don Norman",
      available: true,
      category: "design",
      language: "English",
    },
    {
      id: 16,
      title: "Color Theory",
      author: "Johannes Itten",
      available: false,
      category: "design",
      language: "English",
    },
  ];

  // Filter and sort books
  const filteredBooks = mockBooks
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = !filters.available || book.available;
      const matchesCategory =
        !filters.category || book.category === filters.category;
      const matchesLanguage =
        filters.language === "all" || book.language === filters.language;

      return (
        matchesSearch &&
        matchesAvailability &&
        matchesCategory &&
        matchesLanguage
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (filters.sortBy === "author") {
        return a.author.localeCompare(b.author);
      } else if (filters.sortBy === "popularity") {
        return b.id - a.id; // Simulating popularity by ID
      }
      return 0;
    });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleBorrow = () => {
    alert(`You have borrowed "${selectedBook.title}"`);
    setSelectedBook(null);
  };

  const handleAddToWishlist = (book) => {
    if (wishlist.some((item) => item.id === book.id)) {
      setWishlist(wishlist.filter((item) => item.id !== book.id));
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
      category: "",
      language: "all",
      sortBy: "title",
    });
    setSearchTerm("");
    setCurrentPage(1); // Reset to first page when filters are reset
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const OnlineReader = ({ book, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <h3 className="text-lg font-medium dark:text-white">
              {book.title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <div className="text-center p-8">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Online Reader
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Reading: {book.title}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  (In a real application, this would show the book content)
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page 1 of 1
              </span>
              <button
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div>
              <button
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 text-sm font-medium"
                onClick={() => alert("Download disabled for online reading")}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            BBU Library Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover thousands of books in BBU's digital library
          </p>
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
                className="w-full pl-10 pr-4 py-3 border outline-none border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white dark:bg-gray-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-colors ${
                showFilters ||
                filters.available ||
                filters.category ||
                filters.language !== "all" ||
                filters.sortBy !== "title"
                  ? "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Availability
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="available-only"
                          checked={filters.available}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              available: e.target.checked,
                            });
                            setCurrentPage(1); // Reset to first page when changing filters
                          }}
                          className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label
                          htmlFor="available-only"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Available Only
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 dark:text-white"
                        value={filters.category}
                        onChange={(e) => {
                          setFilters({ ...filters, category: e.target.value });
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Categories</option>
                        <option value="computer">Computer Science</option>
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 dark:text-white"
                        value={filters.language}
                        onChange={(e) => {
                          setFilters({ ...filters, language: e.target.value });
                          setCurrentPage(1);
                        }}
                      >
                        <option value="all">All Languages</option>
                        <option value="English">English</option>
                        <option value="Khmer">Khmer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 dark:text-white"
                        value={filters.sortBy}
                        onChange={(e) => {
                          setFilters({ ...filters, sortBy: e.target.value });
                          setCurrentPage(1);
                        }}
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
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wishlist Indicator */}
          {wishlist.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <BookmarkPlus className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your
              wishlist
            </div>
          )}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700"
          >
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No books found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onViewDetails={setSelectedBook}
                  onAddToWishlist={handleAddToWishlist}
                  inWishlist={wishlist.some((item) => item.id === book.id)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstBook + 1}-
                  {Math.min(indexOfLastBook, filteredBooks.length)} of{" "}
                  {filteredBooks.length} books
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md border flex items-center ${
                      currentPage === 1
                        ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  {/* Smart pagination - shows first page, last page, and pages around current */}
                  <div className="flex space-x-1">
                    {/* Always show first page */}
                    <button
                      onClick={() => paginate(1)}
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        currentPage === 1
                          ? "bg-blue-600 dark:bg-blue-700 text-white"
                          : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      1
                    </button>

                    {/* Show ellipsis if current page is far from start */}
                    {currentPage > 4 && (
                      <span className="w-10 h-10 flex items-center justify-center">
                        ...
                      </span>
                    )}

                    {/* Show pages around current page */}
                    {Array.from(
                      { length: Math.min(5, totalPages - 2) },
                      (_, i) => {
                        let pageNum;
                        if (currentPage < 4) {
                          pageNum = i + 2; // Show 2,3,4,5 when near start
                        } else if (currentPage > totalPages - 3) {
                          pageNum = totalPages - 4 + i; // Show ...n-3,n-2,n-1 when near end
                        } else {
                          pageNum = currentPage - 2 + i; // Show current-2, current-1, current, current+1, current+2
                        }

                        if (pageNum > 1 && pageNum < totalPages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                currentPage === pageNum
                                  ? "bg-blue-600 dark:bg-blue-700 text-white"
                                  : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      }
                    )}

                    {/* Show ellipsis if current page is far from end */}
                    {currentPage < totalPages - 3 && (
                      <span className="w-10 h-10 flex items-center justify-center">
                        ...
                      </span>
                    )}

                    {/* Always show last page if there's more than 1 page */}
                    {totalPages > 1 && (
                      <button
                        onClick={() => paginate(totalPages)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          currentPage === totalPages
                            ? "bg-blue-600 dark:bg-blue-700 text-white"
                            : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md border flex items-center ${
                      currentPage === totalPages
                        ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Book Details Modal */}
        {selectedBook && (
          <BookDetailsModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onBorrow={handleBorrow}
            onAddToWishlist={handleAddToWishlist}
            onReadOnline={() => handleReadOnline(selectedBook)}
            inWishlist={wishlist.some((item) => item.id === selectedBook.id)}
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
