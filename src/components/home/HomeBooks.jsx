import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import catalogService from "../../services/catalogService";
import BookCard from "../BookCard";
import BookDetailsModal from "../BookDetailsModal";

const BOOKS_PER_PAGE_DESKTOP = 8;
const BOOKS_PER_PAGE_MOBILE = 4;
const MAX_FEATURED_BOOKS = 16;

const HomeBooks = ({ isAuthenticated, launchHeart }) => {
  const { t } = useTranslation('home');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDir, setSlideDir] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await catalogService.getAll();
      if (result.success) {
        // Sort by borrow count and take only first 16
        const sorted = [...result.data]
          .sort((a, b) => (b.borrowCount ?? 0) - (a.borrowCount ?? 0))
          .slice(0, MAX_FEATURED_BOOKS);
        setBooks(sorted);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => { setCurrentPage(0); }, [isMobile]);

  const booksPerPage = isMobile ? BOOKS_PER_PAGE_MOBILE : BOOKS_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(books.length / booksPerPage);
  const currentBooks = books.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  const changePage = (dir) => {
    if (animating) return;
    const nextPage = dir === "next" ? currentPage + 1 : currentPage - 1;
    if (nextPage < 0 || nextPage >= totalPages) return;
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(nextPage);
      setSlideDir(null);
      setTimeout(() => setAnimating(false), 400);
    }, 300);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 10) isDragging.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !isDragging.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) changePage(dx < 0 ? "next" : "prev");
    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;
  };

  // Modern loading skeleton for books
  const BookSkeleton = ({ index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100"
    >
      {/* Image skeleton */}
      <div className="relative pt-[140%] bg-gray-50 overflow-hidden">
        <motion.div
          animate={{ 
            background: ['#f0f0f0', '#f8f8f8', '#f0f0f0'],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <motion.div
          animate={{ 
            background: ['#e0e0e0', '#e8e8e8', '#e0e0e0'],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          className="h-4 w-3/4 rounded-full"
        />
        <motion.div
          animate={{ 
            background: ['#e8e8e8', '#f0f0f0', '#e8e8e8'],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="h-3 w-1/2 rounded-full"
        />
        <div className="flex justify-between items-center pt-2">
          <motion.div
            animate={{ 
              background: ['#e8e8e8', '#f0f0f0', '#e8e8e8'],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="h-6 w-16 rounded-full"
          />
          <motion.div
            animate={{ 
              background: ['#e8e8e8', '#f0f0f0', '#e8e8e8'],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="h-6 w-6 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );

  // Modern loading state
  const LoadingState = () => (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="relative w-20 h-20 mb-4">
        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-gray-200"
          style={{ borderTopColor: '#0033A0', borderRightColor: 'transparent' }}
        />
        
        {/* Book icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-gray-300" />
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-sm text-gray-400 font-light tracking-wide mb-3"
      >
        {t('Loading featured books...')}
      </motion.p>
      
      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </div>
  );

  // Skeleton grid for initial load
  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(isMobile ? BOOKS_PER_PAGE_MOBILE : BOOKS_PER_PAGE_DESKTOP)].map((_, i) => (
        <BookSkeleton key={i} index={i} />
      ))}
    </div>
  );

  const slideClass = animating && slideDir
    ? slideDir === "next" ? "animate-slide-out-left" : "animate-slide-out-right"
    : animating
    ? slideDir === "next" ? "animate-slide-in-right" : "animate-slide-in-left"
    : "";

  const fromLeft = (delay = 0) => ({
    transition: `opacity 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(-80px)",
  });

  const fromRight = (delay = 0) => ({
    transition: `opacity 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(80px)",
  });

  const fromBottom = (delay = 0) => ({
    transition: `opacity 1000ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(40px)",
  });

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white overflow-hidden">
      <style>{`
        @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-60px); opacity: 0; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(60px); opacity: 0; } }
        @keyframes slideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-out-left { animation: slideOutLeft 0.3s ease forwards; }
        .animate-slide-out-right { animation: slideOutRight 0.3s ease forwards; }
        .animate-slide-in-right { animation: slideInRight 0.4s ease forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.4s ease forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div style={fromLeft(0)}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {t('Featured Books')}
            </h2>
            <p className="text-lg text-gray-600">
              {isLoading ? t('Loading...') : t('Popular picks from our collection')}
            </p>
          </div>
          
          {/* Header right section - only show when not loading */}
          {!isLoading && books.length > 0 && (
            <div className="flex items-center gap-3" style={fromRight(0)}>
              {totalPages > 1 && (
                <div className="hidden md:flex items-center gap-1.5">
                  <button
                    onClick={() => changePage("prev")}
                    disabled={currentPage === 0 || animating}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400 min-w-[48px] text-center">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => changePage("next")}
                    disabled={currentPage === totalPages - 1 || animating}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              <a 
                href="/browse" 
                className="hidden md:inline-flex items-center font-semibold transition-colors hover:opacity-80 group" 
                style={{ color: "#000080" }}
              >
                {t('See All Books')}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          )}
        </div>

        {/* Enhanced Loading State */}
        {isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Show skeleton grid on larger screens, loading animation on mobile */}
              {isMobile ? <LoadingState /> : <SkeletonGrid />}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Books Grid */}
        {!isLoading && books.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${slideClass}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {currentBooks.map((book, index) => (
                  <motion.div
                    key={book.catalogId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={fromBottom(index * 60)}
                  >
                    <BookCard
                      book={book}
                      onViewDetails={setSelectedBook}
                      isAuthenticated={isAuthenticated}
                      onWishlistToggle={(catalogId, added, heartEl) => { 
                        if (added) launchHeart?.(heartEl); 
                      }}
                      initialWishlisted={false}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile Pagination - only show when not loading and has content */}
        {!isLoading && books.length > 0 && (
          <motion.div 
            className="mt-8 flex items-center justify-between md:hidden" 
            style={fromBottom(200)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { 
                      const dir = i > currentPage ? "next" : "prev"; 
                      if (i !== currentPage) changePage(dir); 
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentPage 
                        ? "w-6 h-2 bg-[#000080]" 
                        : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            ) : <div />}
            
            <a 
              href="/browse" 
              className="inline-flex items-center font-semibold transition-colors hover:opacity-80 group text-sm" 
              style={{ color: "#000080" }}
            >
              {t('See All')}
              <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        )}

        {/* Empty State - if no books after loading */}
        {!isLoading && books.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500">{t('No featured books available')}</p>
          </motion.div>
        )}
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <BookDetailsModal 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomeBooks;