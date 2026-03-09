import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Filter, RotateCcw, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookDetailsModal from '../components/BookDetailsModal';
import catalogService from '../services/catalogService';
import memberService from '../services/memberServices';

const BOOKS_PER_PAGE = 12;

const BrowseBooks = ({ isAuthenticated, onWishlistChange, launchHeart }) => {
  const { t } = useTranslation('books');
  const [books, setBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    available: false,
    hasPdf: false,
    category: '',
    faculty: '',
    sortBy: 'title',
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const [catalogResult, wishlistResult] = await Promise.all([
        catalogService.getAll(),
        isAuthenticated ? memberService.getWishlistIds() : Promise.resolve({ success: true, data: [] }),
      ]);
      if (catalogResult.success) setBooks(catalogResult.data);
      else setError(catalogResult.message);
      if (wishlistResult?.success) setWishlistIds(wishlistResult.data);
      setIsLoading(false);
    };
    load();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(books.map((b) => b.category).filter(Boolean))].sort();
  }, [books]);

  const faculties = useMemo(() => {
    return [...new Set(books.map((b) => b.faculty).filter(Boolean))].sort();
  }, [books]);

  const filtered = useMemo(() => {
    return books
      .filter((b) => {
        const q = searchTerm.toLowerCase();
        const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn && b.isbn.includes(q));
        const matchAvail = !filters.available || b.available;
        const matchCat = !filters.category || b.category === filters.category;
        const matchFaculty = !filters.faculty || b.faculty === filters.faculty;
        const matchPdf = !filters.hasPdf || b.hasPdf;
        return matchSearch && matchAvail && matchCat && matchFaculty && matchPdf;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'title') return a.title.localeCompare(b.title);
        if (filters.sortBy === 'author') return a.author.localeCompare(b.author);
        if (filters.sortBy === 'availability') return (b.availableCopies - a.availableCopies);
        if (filters.sortBy === 'mostBorrowed') return (b.borrowCount - a.borrowCount);
        if (filters.sortBy === 'mostRead') return (b.inLibraryCount - a.inLibraryCount);
        return 0;
      });
  }, [books, searchTerm, filters]);

  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ available: false, hasPdf: false, category: '', faculty: '', sortBy: 'title' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const sortLabelMap = {
    availability: t('Sort: availability'),
    author:       t('Sort: author'),
    mostBorrowed: t('Sort: mostBorrowed'),
    mostRead:     t('Sort: mostRead'),
  };

  const activeFilterCount = [filters.available, filters.hasPdf, filters.category, filters.faculty, filters.sortBy !== 'title'].filter(Boolean).length;
  const hasActiveFilters = filters.available || filters.hasPdf || filters.category || filters.faculty || filters.sortBy !== 'title' || searchTerm;

  const handleWishlistToggle = (catalogId, added, heartEl) => {
    setWishlistIds((prev) =>
      added ? [...prev, catalogId] : prev.filter((id) => id !== catalogId)
    );
    if (added) {
      onWishlistChange?.((c) => c + 1);
      launchHeart?.(heartEl);
    } else {
      onWishlistChange?.((c) => Math.max(0, c - 1));
    }
  };

  // Enhanced loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
        >
          <div className="relative pt-[140%] bg-gray-50 overflow-hidden">
            <motion.div
              animate={{ background: ['#f0f0f0', '#f8f8f8', '#f0f0f0'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />
          </div>
          <div className="p-4 space-y-3">
            <motion.div
              animate={{ background: ['#e0e0e0', '#e8e8e8', '#e0e0e0'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              className="h-4 w-3/4 rounded-full"
            />
            <motion.div
              animate={{ background: ['#e8e8e8', '#f0f0f0', '#e8e8e8'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="h-3 w-1/2 rounded-full"
            />
            <div className="flex justify-between items-center pt-2">
              <motion.div
                animate={{ background: ['#e8e8e8', '#f0f0f0', '#e8e8e8'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="h-6 w-16 rounded-full"
              />
              <motion.div
                animate={{ background: ['#e8e8e8', '#f0f0f0', '#e8e8e8'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="h-6 w-6 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const InitialLoadingState = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-gray-200"
          style={{ borderTopColor: '#0033A0', borderRightColor: 'transparent' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-gray-300" />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-sm text-gray-400 font-light tracking-wide"
      >
        {t('Loading catalog...')}
      </motion.p>
      <div className="flex gap-1.5 mt-4">
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

  return (
    <div className="min-h-screen bg-[#f1f7ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{t('Library Collection')}</h1>
          <p className="text-gray-500 text-sm">
            {isLoading
              ? t('Loading catalog...')
              : t(filtered.length !== 1 ? '{{count}} books found' : '{{count}} book found', { count: filtered.length })}
          </p>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t('Search by title, author, or ISBN...')}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:border-[#000080] text-sm transition-all disabled:opacity-50 disabled:bg-gray-50"
                disabled={isLoading}
              />
              {searchTerm && !isLoading && (
                <button
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>

            <button
              onClick={() => !isLoading && setShowFilters(!showFilters)}
              disabled={isLoading}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-colors shadow-sm ${
                isLoading ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                showFilters || activeFilterCount > 0
                  ? 'bg-[#000080] text-white border-[#000080]'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              {t('Filters')}
              {activeFilterCount > 0 && !isLoading && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          {!isLoading && (
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 bg-white rounded-3xl border border-gray-100 shadow-lg p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Availability */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('Availability')}</label>
                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${filters.available ? 'bg-[#000080] border-[#000080]' : 'border-gray-300 group-hover:border-[#000080]'}`}
                          onClick={() => setFilter('available', !filters.available)}
                        >
                          {filters.available && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 select-none" onClick={() => setFilter('available', !filters.available)}>{t('Available only')}</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer group mt-3">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${filters.hasPdf ? 'bg-[#000080] border-[#000080]' : 'border-gray-300 group-hover:border-[#000080]'}`}
                          onClick={() => setFilter('hasPdf', !filters.hasPdf)}
                        >
                          {filters.hasPdf && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 select-none" onClick={() => setFilter('hasPdf', !filters.hasPdf)}>{t('Has PDF / E-Book')}</span>
                      </label>
                    </div>

                    {/* Faculty */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('Faculty')}</label>
                      <select
                        value={filters.faculty}
                        onChange={(e) => setFilter('faculty', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#000080] transition-colors"
                      >
                        <option value="">{t('All Faculties')}</option>
                        {faculties.map((f) => <option key={f} value={f}>{t(f)}</option>)}
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('Category')}</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilter('category', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#000080] transition-colors"
                      >
                        <option value="">{t('All Categories')}</option>
                        {categories.map((cat) => <option key={cat} value={cat}>{t(cat)}</option>)}
                      </select>
                    </div>

                    {/* Sort By — spans full width on its own row */}
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('Sort By')}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { value: 'title',        label: t('Title (A–Z)') },
                          { value: 'author',       label: t('Author (A–Z)') },
                          { value: 'availability', label: t('Most Available') },
                          { value: 'mostBorrowed', label: t('Most Borrowed') },
                          { value: 'mostRead',     label: t('Most Read In-Library') },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFilter('sortBy', opt.value)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                              filters.sortBy === opt.value
                                ? 'bg-[#000080] text-white border-[#000080]'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-2">
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> {t('Reset')}
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-5 py-2 text-sm text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors font-medium"
                    >
                      {t('Apply')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Active filter chips */}
          {!isLoading && (
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  {searchTerm && <Chip label={`"${searchTerm}"`} onRemove={() => { setSearchTerm(''); setCurrentPage(1); }} />}
                  {filters.available && <Chip label={t('Available only')} onRemove={() => setFilter('available', false)} />}
                  {filters.hasPdf && <Chip label={t('Has PDF')} onRemove={() => setFilter('hasPdf', false)} />}
                  {filters.faculty && <Chip label={t(filters.faculty)} onRemove={() => setFilter('faculty', '')} />}
                  {filters.category && <Chip label={t(filters.category)} onRemove={() => setFilter('category', '')} />}
                  {filters.sortBy !== 'title' && <Chip label={sortLabelMap[filters.sortBy]} onRemove={() => setFilter('sortBy', 'title')} />}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Loading */}
        {isLoading && <InitialLoadingState />}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-32">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
              {t('Retry')}
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('No books found')}</h3>
            <p className="text-gray-400 text-sm mb-5">{t('Try adjusting your search or filters')}</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
                {t('Reset Filters')}
              </button>
            )}
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && !error && filtered.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {paginated.map((book, i) => (
                <motion.div
                  key={book.catalogId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <BookCard
                    book={book}
                    onViewDetails={setSelectedBook}
                    isAuthenticated={isAuthenticated}
                    initialWishlisted={wishlistIds.includes(book.catalogId)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-400">
                  {t('Showing {{from}}–{{to}} of {{total}} books', {
                    from: (currentPage - 1) * BOOKS_PER_PAGE + 1,
                    to: Math.min(currentPage * BOOKS_PER_PAGE, filtered.length),
                    total: filtered.length,
                  })}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => paginate(p)}
                        className={`w-9 h-9 rounded-2xl text-sm font-medium transition-colors shadow-sm ${
                          currentPage === p ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

// ─── Filter chip ──────────────────────────────────────────────────────────────
const Chip = ({ label, onRemove }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm"
  >
    {label}
    <button onClick={onRemove} className="hover:text-red-500 transition-colors">
      <X className="w-3 h-3" />
    </button>
  </motion.span>
);

export default BrowseBooks;