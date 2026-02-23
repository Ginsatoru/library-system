import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
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
  Info,
  BookmarkPlus,
  BookCheck,
  BookX,
  Download,
  Eye,
  RotateCcw
} from 'lucide-react';

const BookDetailsModal = ({ book, onClose, onBorrow, onAddToWishlist, onReadOnline }) => {
  // Fixed book details
  const bookDetails = {
    isbn: `978-${book.id}${book.id}${book.id}-${book.id}${book.id}${book.id}${book.id}-${book.id}`,
    published: `${2000 + book.id}`,
    pages: `${300 + (book.id * 20)}`,
    category: ['Computer Science', 'Programming', 'Software Engineering', 'Web Development'][book.id % 4],
    rating: (3.5 + (book.id * 0.2)).toFixed(1),
    description: `This comprehensive book on ${book.title.split(' ')[0]} provides readers with in-depth knowledge and practical examples. Covering all fundamental aspects and advanced topics, it's perfect for both beginners and experienced professionals looking to deepen their understanding.`,
    dueDate: book.available ? null : `Due ${new Date(Date.now() + (book.id + 3) * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    publisher: 'BBU Press',
    language: 'English',
    edition: `${book.id % 3 + 1}${book.id % 3 === 0 ? 'st' : book.id % 3 === 1 ? 'nd' : 'rd'} Edition`
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
          
          <div className="absolute top-4 right-4 flex space-x-2">
            <button 
              onClick={() => onAddToWishlist(book)}
              className="bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
              title="Add to wishlist"
            >
              <BookmarkPlus className="h-5 w-5 text-gray-600 hover:text-yellow-500" />
            </button>
            <button 
              onClick={onClose}
              className="bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-600" />
            </button>
          </div>
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

                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Publisher</p>
                      <p className="text-gray-700">{bookDetails.publisher}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <BookCheck className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Edition</p>
                      <p className="text-gray-700">{bookDetails.edition}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="text-gray-700">{bookDetails.language}</p>
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
                
                <div className="mt-6 space-y-3">
                  {book.available ? (
                    <>
                      <button
                        onClick={onBorrow}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <BookCheck className="h-5 w-5 mr-2" />
                        Borrow This Book
                      </button>
                      <button
                        onClick={onReadOnline}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        Read Online
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-3 px-4 bg-gray-100 text-gray-600 rounded-lg">
                      <p>Available in {book.id + 3} days</p>
                      <button className="mt-2 text-blue-600 text-sm font-medium">
                        Place a Hold
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => onAddToWishlist(book)}
                    className="w-full py-3 px-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <BookmarkPlus className="h-5 w-5 mr-2" />
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetailsModal;