import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, BookmarkPlus } from 'lucide-react';

const BookCard = ({ book, onViewDetails, onAddToWishlist }) => {
  // Define cover images for each category
  const categoryImages = {
    computer: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop',
    programming: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop',
    design: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=500&auto=format&fit=crop',
    fiction: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop'
  };

  // Map book categories to image categories
  const getBookCategory = (bookId) => {
    const categories = {
      1: 'computer',
      2: 'programming',
      3: 'programming',
      4: 'programming',
      5: 'design',
      6: 'programming',
      7: 'programming',
      8: 'programming',
      9: 'computer',
      10: 'computer',
      11: 'computer',
      12: 'computer'
    };
    return categories[bookId] || 'default';
  };

  // Get the appropriate image for the book
  const coverImage = categoryImages[getBookCategory(book.id)] || categoryImages.default;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/20 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/30 transition-shadow relative h-full flex flex-col"
    >
      {/* Wishlist Button */}
      <button 
        onClick={() => onAddToWishlist(book)}
        className="absolute top-2 right-2 z-10 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
        title="Add to wishlist"
      >
        <BookmarkPlus className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400" />
      </button>
      
      {/* Book Cover */}
      <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={coverImage} 
          alt={`Cover of ${book.title}`} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = categoryImages.default; // Fallback if image fails to load
          }}
        />
      </div>
      
      {/* Book Details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{book.author}</p>
        </div>
        
        {/* Availability Status */}
        <div className="flex items-center mt-3">
          {book.available ? (
            <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-1" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center text-sm text-red-600 dark:text-red-400">
              <XCircle className="h-4 w-4 mr-1" /> Checked Out
            </span>
          )}
        </div>
        
        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(book)}
          className="mt-4 w-full flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors"
        >
          View Details <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default BookCard;