import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import BookDetailsModal from '../components/BookDetailsModal';
import memberService from '../services/memberServices';
import config from '../config/config';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${config.api.baseUrl}${imagePath}`;
};

const Wishlist = ({ isAuthenticated, onWishlistChange }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    load();
  }, [isAuthenticated]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    const result = await memberService.getWishlist();
    if (result.success) {
      const mapped = result.data.map(b => ({
        ...b,
        imageUrl: getImageUrl(b.imagePath),
        available: b.availableCopies > 0,
      }));
      setItems(mapped);
      onWishlistChange?.(mapped.length);
    } else {
      if (result.message) setError(result.message);
    }
    setIsLoading(false);
  };

  const handleRemoved = (catalogId) => {
    setItems(prev => {
      const next = prev.filter(b => b.catalogId !== catalogId);
      onWishlistChange?.(next.length);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f1f7ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-500 text-sm ml-13 pl-0.5">
            {isLoading ? 'Loading...' : `${items.length} book${items.length !== 1 ? 's' : ''} saved`}
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#000080]" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-32">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button onClick={load} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && items.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Your wishlist is empty</h3>
            <p className="text-gray-400 text-sm mb-5">Browse the library and tap the heart icon to save books</p>
            <button
              onClick={() => navigate('/browse')}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Browse Books
            </button>
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && !error && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {items.map((book, i) => (
                <motion.div
                  key={book.catalogId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -10 }}
                  transition={{ delay: i * 0.04, exit: { duration: 0.25 } }}
                  layout
                >
                  <WishlistCard
                    book={book}
                    onViewDetails={setSelectedBook}
                    onRemoved={handleRemoved}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

// ─── WishlistCard ─────────────────────────────────────────────────────────────
const WishlistCard = ({ book, onViewDetails, onRemoved }) => {
  const [loading, setLoading] = useState(false);
  const FALLBACK = 'https://www.oreilly.com/api/v2/epubs/9780763766580/files/images/cover.jpg';

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    const result = await memberService.removeFromWishlist(book.catalogId);
    if (result.success) onRemoved(book.catalogId);
    else setLoading(false);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      <div className="relative w-full overflow-hidden bg-gray-100 rounded-3xl m-2" style={{ height: 'clamp(160px, 30vw, 280px)', width: 'calc(100% - 1rem)' }}>
        <img
          src={book.imageUrl || FALLBACK}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK; }}
        />

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleRemove}
          disabled={loading}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-sm transition-colors disabled:opacity-60"
        >
          {loading
            ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
            : <FiHeart className="w-4 h-4 text-white" style={{ fill: 'white' }} />
          }
        </motion.button>

        {book.hasPdf && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-sm text-[#000080] flex items-center gap-1 shadow-sm">
            <FiBookOpen className="w-3 h-3" /> PDF
          </div>
        )}
      </div>

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

export default Wishlist;