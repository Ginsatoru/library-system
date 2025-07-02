import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Hash,
  Bookmark,
  BarChart2,
  Info
} from 'lucide-react';

const BookCard = ({ book, onViewDetails }) => {
  // Random book cover images with different categories
  const coverImages = {
    computer: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&auto=format&fit=crop'
    ],
    programming: [
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop'
    ],
    design: [
      'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop'
    ],
    fiction: [
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop'
    ]
  };

  // Assign categories to books
  const bookCategories = {
    1: 'computer',
    2: 'programming',
    3: 'programming',
    4: 'programming',
    5: 'design',
    6: 'programming',
    7: 'programming',
    8: 'programming'
  };

  const category = bookCategories[book.id];
  const randomCover = coverImages[category][Math.floor(Math.random() * coverImages[category].length)];

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={randomCover} 
          alt={`Cover of ${book.title}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{book.author}</p>
        
        <div className="flex items-center mt-3">
          {book.available ? (
            <span className="inline-flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center text-sm text-red-600">
              <XCircle className="h-4 w-4 mr-1" />
              Checked Out
            </span>
          )}
        </div>
        
        <button
          onClick={() => onViewDetails(book)}
          className="mt-4 w-full flex items-center justify-between px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const BookDetailsModal = ({ book, onClose, onBorrow }) => {
  // Generate random book details
  const bookDetails = {
    isbn: `978-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9) + 1}`,
    published: `${Math.floor(Math.random() * 20) + 2000}`,
    pages: `${Math.floor(Math.random() * 500) + 200}`,
    category: ['Computer Science', 'Programming', 'Software Engineering', 'Web Development'][Math.floor(Math.random() * 4)],
    rating: (Math.random() * 2 + 3).toFixed(1),
    description: `This comprehensive book on ${book.title.split(' ')[0]} provides readers with in-depth knowledge and practical examples. Covering all fundamental aspects and advanced topics, it's perfect for both beginners and experienced professionals looking to deepen their understanding.`,
    dueDate: book.available ? null : `Due ${new Date(Date.now() + (Math.floor(Math.random() * 10) + 3) * 24 * 60 * 60 * 1000).toLocaleDateString()}`
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <div className="h-64 w-full bg-gray-200 overflow-hidden">
            <img 
              src={`https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop`} 
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900">{book.title}</h2>
              <p className="text-xl text-gray-600 mt-2">by {book.author}</p>
              
              <div className="mt-6 space-y-4">
                <p className="text-gray-700">{bookDetails.description}</p>
                
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Hash className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">ISBN</p>
                      <p className="text-gray-700">{bookDetails.isbn}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Published</p>
                      <p className="text-gray-700">{bookDetails.published}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Pages</p>
                      <p className="text-gray-700">{bookDetails.pages}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Bookmark className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-gray-700">{bookDetails.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="text-gray-700">{bookDetails.rating}/5.0</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${book.available ? 'text-green-600' : 'text-red-600'}`}>
                        {book.available ? 'Available' : 'Checked Out'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4">Borrowing Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Loan Period</p>
                    <p className="text-gray-700">14 days</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Renewals</p>
                    <p className="text-gray-700">Up to 2 times</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Late Fees</p>
                    <p className="text-gray-700">$0.50/day</p>
                  </div>
                  
                  {bookDetails.dueDate && (
                    <div>
                      <p className="text-sm text-gray-500">Expected Return</p>
                      <p className="text-red-600 font-medium">{bookDetails.dueDate}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  {book.available ? (
                    <button
                      onClick={onBorrow}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Borrow This Book
                    </button>
                  ) : (
                    <div className="text-center py-3 px-4 bg-gray-100 text-gray-600 rounded-lg">
                      <p>Available in 3 days</p>
                      <button className="mt-2 text-blue-600 text-sm font-medium">
                        Place a Hold
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const BrowseBooks = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);

  const mockBooks = [
    { id: 1, title: 'Introduction to Computer Science', author: 'John Doe', available: true },
    { id: 2, title: 'Data Structures and Algorithms', author: 'Jane Smith', available: true },
    { id: 3, title: 'The Art of Programming', author: 'Alan Turing', available: false },
    { id: 4, title: 'Clean Code', author: 'Robert C. Martin', available: true },
    { id: 5, title: 'Design Patterns', author: 'Erich Gamma', available: false },
    { id: 6, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', available: true },
    { id: 7, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', available: true },
    { id: 8, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', available: true },
  ];

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterAvailable || book.available;
    return matchesSearch && matchesFilter;
  });

  const handleBorrow = () => {
    alert(`You have borrowed "${selectedBook.title}"`);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Browse Our Collection</h1>
          <p className="text-gray-600">Discover thousands of books in our digital library</p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setFilterAvailable(!filterAvailable)}
            className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-colors ${
              filterAvailable 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Available Only
          </button>
        </div>
        
        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onViewDetails={setSelectedBook}
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
          />
        )}
      </motion.div>
    </div>
  );
};

export default BrowseBooks;