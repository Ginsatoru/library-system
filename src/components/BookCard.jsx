import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, BookmarkPlus } from 'lucide-react';

const BookCard = ({ 
  book, 
  onViewDetails, 
  onAddToWishlist,
  coverImage = null,  // Allow custom cover image to override default
  title = null,       // Allow custom title to override book.title
  category = null,    // Allow custom category to override automatic mapping
}) => {
  // Define default cover images for each category
  const defaultCategoryImages = {
    computer: 'https://images-platform.99static.com//FqTz4XJYgoLsSieDOxyzHjxe-wE=/0x0:2000x2000/fit-in/500x500/99designs-contests-attachments/122/122877/attachment_122877830',
    programming: 'https://covers.shakespeareandcompany.com/97813942/9781394263219.jpg',
    design: 'https://images-platform.99static.com//q8BGJ3eqd_JEVxikrwv5OfrPZoc=/293x0:1638x1345/fit-in/500x500/99designs-contests-attachments/89/89912/attachment_89912541',
    fiction: 'https://images-platform.99static.com//1QYo-5tErGF66LjaqljkftYY2nk=/43x987:1943x2887/fit-in/500x500/99designs-contests-attachments/89/89266/attachment_89266773',
    default: 'https://www.oreilly.com/api/v2/epubs/9780763766580/files/images/cover.jpg'
  };

  // Map book categories to image categories (if no custom category provided)
  const getBookCategory = (bookId) => {
    const categories = {
      1: 'computer',
      2: 'programming',
      5: 'design',
      6: 'fiction',
      7: 'programming',
      9: 'computer',
      10: 'default',
    };
    return categories[bookId] || 'default';
  };

  // Determine the final values to use
  const finalTitle = title || book.title;
  const finalCategory = category || getBookCategory(book.id);
  const finalCoverImage = coverImage || defaultCategoryImages[finalCategory] || defaultCategoryImages.default;

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
          src={finalCoverImage} 
          alt={`Cover of ${finalTitle}`} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = defaultCategoryImages.default; // Fallback if image fails to load
          }}
        />
      </div>
      
      {/* Book Details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{finalTitle}</h3>
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