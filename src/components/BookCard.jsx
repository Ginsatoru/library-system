import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import memberService from '../services/memberServices';

const FALLBACK = 'https://www.oreilly.com/api/v2/epubs/9780763766580/files/images/cover.jpg';

const BookCard = ({ book, onViewDetails, isAuthenticated, initialWishlisted = false, onWishlistToggle }) => {
  const imageUrl = book.imageUrl || FALLBACK;
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const heartRef = useRef(null);
  const navigate = useNavigate();

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (wishlistLoading) return;

    setWishlistLoading(true);
    if (wishlisted) {
      const result = await memberService.removeFromWishlist(book.catalogId);
      if (result.success) {
        setWishlisted(false);
        onWishlistToggle?.(book.catalogId, false, null);
      }
    } else {
      const result = await memberService.addToWishlist(book.catalogId);
      if (result.unauthorized) { navigate('/login'); return; }
      if (result.success) {
        setWishlisted(true);
        onWishlistToggle?.(book.catalogId, true, heartRef.current);
      }
    }
    setWishlistLoading(false);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      {/* Cover image */}
      <div className="relative w-full overflow-hidden bg-white rounded-3xl m-2" style={{ height: 'clamp(160px, 30vw, 280px)', width: 'calc(100% - 1rem)' }}>
        <img
          src={imageUrl}
          alt={book.title}
          className="w-full h-full object-cover rounded-3xl bg-gray-100 transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK; }}
        />

        {/* Heart button */}
        <motion.button
          ref={heartRef}
          whileTap={{ scale: 0.85 }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${
            wishlisted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/80 backdrop-blur-sm hover:bg-white'
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
        >
          <FiHeart
            className={`w-4 h-4 transition-colors ${wishlisted ? 'text-white' : 'text-gray-500'}`}
            style={{ fill: wishlisted ? 'white' : 'none' }}
          />
        </motion.button>

        {/* PDF badge */}
        {book.hasPdf && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-sm text-[#000080] flex items-center gap-1 shadow-sm">
            <FiBookOpen className="w-3 h-3" /> PDF
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">{book.title}</h3>

        <div className="flex items-center gap-1 mt-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-gray-400 line-clamp-1">{book.author}{book.category ? ` · ${book.category}` : ''}</span>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {book.availableCopies} / {book.totalCopies} copies
          </span>
          {book.isbn && (
            <span className="flex items-center gap-1 truncate">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z" />
              </svg>
              <span className="truncate">{book.isbn}</span>
            </span>
          )}
        </div>

        <div className="my-3 border-t border-gray-100" />

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col leading-tight">
            <span className={`text-xs sm:text-sm font-bold ${book.available ? 'text-gray-900' : 'text-red-500'}`}>
              {book.available ? 'Available' : 'Borrowed'}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400">{book.availableCopies} left</span>
          </div>
          <button
            onClick={() => onViewDetails(book)}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs sm:text-sm font-semibold transition-colors"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;