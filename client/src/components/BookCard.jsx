import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, BookmarkPlus } from 'lucide-react';

const BookCard = ({ book, onViewDetails, onAddToWishlist }) => {
  const coverImages = {
    computer: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop',
    programming: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop',
    design: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=500&auto=format&fit=crop',
    fiction: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&auto=format&fit=crop'
  };

  const bookCategories = {
    1: 'computer', 2: 'programming', 3: 'programming', 4: 'programming',
    5: 'design', 6: 'programming', 7: 'programming', 8: 'programming'
  };

  const coverImage = coverImages[bookCategories[book.id]];

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow relative"
    >
      <button 
        onClick={() => onAddToWishlist(book)}
        className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        title="Add to wishlist"
      >
        <BookmarkPlus className="h-5 w-5 text-gray-600 hover:text-yellow-500" />
      </button>
      
      <div className="h-48 overflow-hidden">
        <img src={coverImage} alt={`Cover of ${book.title}`} className="w-full h-full object-cover" />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{book.author}</p>
        
        <div className="flex items-center mt-3">
          {book.available ? (
            <span className="inline-flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center text-sm text-red-600">
              <XCircle className="h-4 w-4 mr-1" /> Checked Out
            </span>
          )}
        </div>
        
        <button
          onClick={() => onViewDetails(book)}
          className="mt-4 w-full flex items-center justify-between px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
        >
          View Details <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default BookCard;