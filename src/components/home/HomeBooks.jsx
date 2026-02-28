import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import catalogService from "../../services/catalogService";
import BookCard from "../BookCard";
import BookDetailsModal from "../BookDetailsModal";

const BOOKS_PER_PAGE_DESKTOP = 8;
const BOOKS_PER_PAGE_MOBILE = 4;

const HomeBooks = ({ isAuthenticated, launchHeart }) => {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await catalogService.getAll();
      if (result.success) {
        const sorted = [...result.data].sort((a, b) => (b.borrowCount ?? 0) - (a.borrowCount ?? 0));
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
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-60px); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(60px); opacity: 0; }
        }
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-out-left { animation: slideOutLeft 0.3s ease forwards; }
        .animate-slide-out-right { animation: slideOutRight 0.3s ease forwards; }
        .animate-slide-in-right { animation: slideInRight 0.4s ease forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.4s ease forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header — title from left, controls from right */}
        <div className="flex justify-between items-center mb-12">
          <div style={fromLeft(0)}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Books</h2>
            <p className="text-lg text-gray-600">Popular picks from our collection</p>
          </div>
          <div className="flex items-center gap-3" style={fromRight(0)}>
            {totalPages > 1 && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => changePage("prev")}
                  disabled={currentPage === 0 || animating}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400">{currentPage + 1} / {totalPages}</span>
                <button
                  onClick={() => changePage("next")}
                  disabled={currentPage === totalPages - 1 || animating}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
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
              See All Books
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#000080]" />
          </div>
        )}

        {/* Books Grid — stagger from bottom */}
        {!isLoading && (
          <div
            className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${slideClass}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentBooks.map((book, index) => (
              <div key={book.catalogId} style={fromBottom(index * 60)}>
                <BookCard
                  book={book}
                  onViewDetails={setSelectedBook}
                  isAuthenticated={isAuthenticated}
                  onWishlistToggle={(catalogId, added, heartEl) => {
                    if (added) launchHeart?.(heartEl);
                  }}
                  initialWishlisted={false}
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile: dot indicators + See All */}
        {!isLoading && (
          <div className="mt-6 flex items-center justify-between md:hidden" style={fromBottom(200)}>
            {totalPages > 1 ? (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { const dir = i > currentPage ? "next" : "prev"; if (i !== currentPage) changePage(dir); }}
                    className={`rounded-full transition-all duration-300 ${i === currentPage ? "w-5 h-2 bg-[#000080]" : "w-2 h-2 bg-gray-300"}`}
                  />
                ))}
              </div>
            ) : <div />}
            <a
              href="/browse"
              className="inline-flex items-center font-semibold transition-colors hover:opacity-80 group text-sm"
              style={{ color: "#000080" }}
            >
              See All
              <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        )}
      </div>

      {selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </section>
  );
};

export default HomeBooks;