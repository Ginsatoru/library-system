import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Calendar,
  Clock,
  RotateCcw,
  X,
  CheckCircle,
  AlertCircle,
  History,
  Bookmark,
  ArrowRight
} from 'lucide-react';

const BookDetailsModal = ({ book, onClose, onAction, activeTab }) => {
  // Generate random book details
  const bookDetails = {
    isbn: `978-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9) + 1}`,
    published: `${Math.floor(Math.random() * 20) + 2000}`,
    pages: `${Math.floor(Math.random() * 500) + 200}`,
    category: ['Computer Science', 'Programming', 'Software Engineering'][Math.floor(Math.random() * 3)],
    description: `This comprehensive book on ${book.title.split(' ')[0]} provides readers with in-depth knowledge and practical examples.`
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{book.title}</h2>
              <p className="text-base sm:text-lg text-gray-600 mt-1">by {book.author}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-48 w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-blue-400" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">ISBN</p>
                  <p className="text-xs sm:text-sm font-medium break-all">{bookDetails.isbn}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Published</p>
                  <p className="text-xs sm:text-sm font-medium">{bookDetails.published}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Pages</p>
                  <p className="text-xs sm:text-sm font-medium">{bookDetails.pages}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-xs sm:text-sm font-medium">{bookDetails.category}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-600 mt-1 text-sm">{bookDetails.description}</p>
              </div>

              {'dueDate' in book && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">Due Date</p>
                      <p className="font-medium">{book.dueDate}</p>
                    </div>
                  </div>
                  <p className={`mt-2 text-sm ${
                    book.daysRemaining <= 3 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {book.daysRemaining} {book.daysRemaining === 1 ? 'day' : 'days'} remaining
                  </p>
                </div>
              )}

              {'reservationDate' in book && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Bookmark className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">Reserved on</p>
                      <p className="font-medium">{book.reservationDate}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Pick up by {book.pickupDate}
                  </p>
                </div>
              )}

              {'checkoutDate' in book && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <History className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">Previously borrowed</p>
                      <p className="font-medium text-sm">{book.checkoutDate} to {book.returnDate}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={onAction}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {activeTab === 'history' ? 'Borrow Again' : 
                   activeTab === 'reservations' ? 'Cancel Reservation' : 'Return Book'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MobileCard = ({ item, onAction, activeTab }) => {
  const getStatusColor = (item) => {
    if (activeTab === 'loans' && item.daysRemaining <= 3) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-green-100 text-green-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm leading-tight">{item.title}</h3>
          <p className="text-xs text-gray-600 mt-1">{item.author}</p>
        </div>
        <button
          onClick={() => onAction(item)}
          className="ml-3 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-lg transition-colors flex-shrink-0"
        >
          {activeTab === 'history' ? 'Borrow' : 
           activeTab === 'reservations' ? 'Cancel' : 'Return'}
        </button>
      </div>

      <div className="space-y-2">
        {activeTab === 'loans' && (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Due Date:</span>
              <span className="font-medium">{item.dueDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item)}`}>
                {item.status}
              </span>
            </div>
          </>
        )}

        {activeTab === 'reservations' && (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Reserved:</span>
              <span className="font-medium">{item.reservationDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Pickup By:</span>
              <span className="font-medium">{item.pickupDate}</span>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Period:</span>
              <span className="font-medium text-right">{item.checkoutDate} to {item.returnDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Rating:</span>
              <span className="font-medium">{item.rating}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const LibraryTable = ({ items, columns, onAction, activeTab }) => {
  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl p-8 text-center border border-gray-200"
      >
        <BookOpen className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {activeTab === 'loans' ? 'No active loans' : 
           activeTab === 'reservations' ? 'No reservations' : 'No reading history'}
        </h3>
        <p className="text-gray-500 text-sm">
          {activeTab === 'loans' ? 'Your currently borrowed books will appear here' : 
           activeTab === 'reservations' ? 'Your book reservations will appear here' : 'Your reading history will appear here'}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Mobile Cards (visible on small screens) */}
      <div className="block lg:hidden space-y-4">
        {items.map((item) => (
          <MobileCard
            key={item.id}
            item={item}
            onAction={onAction}
            activeTab={activeTab}
          />
        ))}
      </div>

      {/* Desktop Table (visible on large screens) */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`} className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {column.render ? column.render(item) : item[column.key]}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => onAction(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium rounded-xl border border-blue-200 hover:border-blue-300 px-3 py-1.5 transition-colors"
                    >
                      {activeTab === 'history' ? 'Borrow Again' : 
                       activeTab === 'reservations' ? 'Cancel' : 'Return'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const MyLibrary = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('loans');

  // Mock data with enhanced details
  const activeLoans = [
    { 
      id: 1, 
      title: 'Introduction to Computer Science', 
      author: 'John Doe', 
      dueDate: 'June 15, 2023', 
      daysRemaining: 5,
      status: 'Due Soon'
    },
    { 
      id: 2, 
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship', 
      author: 'Robert C. Martin', 
      dueDate: 'June 20, 2023', 
      daysRemaining: 10,
      status: 'On Time'
    },
  ];

  const reservedBooks = [
    { 
      id: 3, 
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software', 
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 
      reservationDate: 'May 25, 2023', 
      pickupDate: 'June 5, 2023',
      status: 'Ready for Pickup'
    },
  ];

  const readingHistory = [
    { 
      id: 4, 
      title: 'The Pragmatic Programmer: Your Journey to Mastery', 
      author: 'Andrew Hunt, David Thomas', 
      checkoutDate: 'March 10, 2023', 
      returnDate: 'March 24, 2023',
      rating: '★★★★☆'
    },
    { 
      id: 5, 
      title: 'Eloquent JavaScript: A Modern Introduction to Programming', 
      author: 'Marijn Haverbeke', 
      checkoutDate: 'February 15, 2023', 
      returnDate: 'March 1, 2023',
      rating: '★★★★★'
    },
    { 
      id: 6, 
      title: 'JavaScript: The Good Parts', 
      author: 'Douglas Crockford', 
      checkoutDate: 'January 5, 2023', 
      returnDate: 'January 19, 2023',
      rating: '★★★☆☆'
    },
  ];

  const handleAction = (book) => {
    if (activeTab === 'loans') {
      alert(`Returning: ${book.title}`);
    } else if (activeTab === 'reservations') {
      alert(`Canceling reservation for: ${book.title}`);
    } else {
      alert(`Borrowing again: ${book.title}`);
    }
    setSelectedBook(null);
  };

  const tabConfig = {
    loans: {
      title: 'Active Loans',
      items: activeLoans,
      columns: [
        { key: 'title', title: 'Book Title' },
        { key: 'author', title: 'Author' },
        { key: 'dueDate', title: 'Due Date' },
        { 
          key: 'status', 
          title: 'Status',
          render: (item) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item.daysRemaining <= 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {item.status}
            </span>
          )
        }
      ]
    },
    reservations: {
      title: 'Reservations',
      items: reservedBooks,
      columns: [
        { key: 'title', title: 'Book Title' },
        { key: 'author', title: 'Author' },
        { key: 'reservationDate', title: 'Reserved On' },
        { key: 'pickupDate', title: 'Pickup By' }
      ]
    },
    history: {
      title: 'Reading History',
      items: readingHistory,
      columns: [
        { key: 'title', title: 'Book Title' },
        { key: 'author', title: 'Author' },
        { key: 'checkoutDate', title: 'Checkout Date' },
        { key: 'returnDate', title: 'Return Date' },
        { key: 'rating', title: 'Your Rating' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6 xl:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your loans, reservations, and reading history</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex flex-wrap gap-2 sm:space-x-4 sm:gap-0">
            {Object.entries(tabConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex-shrink-0 ${
                  activeTab === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {config.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LibraryTable
              items={tabConfig[activeTab].items}
              columns={tabConfig[activeTab].columns}
              onAction={(book) => setSelectedBook(book)}
              activeTab={activeTab}
            />
          </motion.div>
        </AnimatePresence>

        {/* Book Details Modal */}
        {selectedBook && (
          <BookDetailsModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onAction={() => handleAction(selectedBook)}
            activeTab={activeTab}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MyLibrary;