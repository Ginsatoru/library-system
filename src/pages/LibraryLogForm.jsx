import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBook, FiSearch, FiCheck, FiX,
  FiClipboard, FiSun, FiLayers, FiMoreHorizontal, FiArrowRight,
  FiChevronLeft, FiChevronRight, FiShoppingCart,
} from 'react-icons/fi';
import { MdOutlineFemale, MdOutlineMale, MdOutlineQuestionMark } from 'react-icons/md';
import { PiMicroscopeBold } from 'react-icons/pi';
import libraryLogService from '../services/libraryLogService';
import Toast from '../components/Toast';

const BOOK_PAGE_SIZE = 12;

const GENDERS = [
  { label: 'Male',   icon: MdOutlineMale },
  { label: 'Female', icon: MdOutlineFemale },
  { label: 'Other',  icon: MdOutlineQuestionMark },
];

const PURPOSES = [
  { label: 'Study',      icon: FiBook },
  { label: 'Research',   icon: PiMicroscopeBold },
  { label: 'Assignment', icon: FiClipboard },
  { label: 'Leisure',    icon: FiSun },
  { label: 'Reference',  icon: FiLayers },
  { label: 'Other',      icon: FiMoreHorizontal },
];

const FALLBACK_IMG = 'https://www.oreilly.com/api/v2/epubs/9780763766580/files/images/cover.jpg';

const FloatInput = ({ label, name, type = 'text', value, onChange, error, ...rest }) => (
  <div className="relative">
    <input
      id={name} type={type} name={name} value={value} onChange={onChange} placeholder=" "
      className={`peer w-full px-4 pt-5 pb-2 text-sm bg-white border-2 rounded-2xl outline-none transition-all focus:border-[#000080] ${error ? 'border-red-300' : 'border-gray-200'}`}
      {...rest}
    />
    <label htmlFor={name}
      className="absolute left-4 top-3.5 text-xs text-gray-400 font-medium transition-all pointer-events-none
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
        peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#000080]
        peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-500"
    >{label}</label>
    {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
  </div>
);

const FloatTextarea = ({ label, name, value, onChange, rows = 3, error }) => (
  <div className="relative">
    <textarea
      id={name} name={name} value={value} onChange={onChange} placeholder=" " rows={rows}
      className={`peer w-full px-4 pt-6 pb-2 text-sm bg-white border-2 rounded-2xl outline-none transition-all resize-none focus:border-[#000080] ${error ? 'border-red-300' : 'border-gray-200'}`}
    />
    <label htmlFor={name}
      className="absolute left-4 top-3.5 text-xs text-gray-400 font-medium transition-all pointer-events-none
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
        peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#000080]
        peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-500"
    >{label}</label>
    {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
  </div>
);

const PillSelector = ({ options, value, onChange, error }) => (
  <div>
    <div className="flex flex-wrap gap-2">
      {options.map(({ label, icon: Icon }) => {
        const active = value === label;
        return (
          <button key={label} type="button" onClick={() => onChange(active ? '' : label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors
              ${active ? 'bg-[#000080] text-white border-[#000080]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {label}
            {active && <FiX className="w-3 h-3 opacity-70 ml-0.5" />}
          </button>
        );
      })}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 pl-1">{error}</p>}
  </div>
);

const BookPagination = ({ page, totalPages, total, onPrev, onNext }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Page <span className="font-medium text-gray-600">{page}</span> of <span className="font-medium text-gray-600">{totalPages}</span>
        <span className="ml-1">({total} books)</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={onPrev} disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <FiChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>
        <button onClick={onNext} disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Next <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── Flying particle component ─────────────────────────────────────
const FlyingBook = ({ id, startX, startY, endX, endY, imgUrl, onDone }) => (
  <motion.div
    key={id}
    initial={{ x: startX, y: startY, scale: 1, opacity: 1, rotate: 0 }}
    animate={{
      x: [startX, startX + (endX - startX) * 0.3, endX],
      y: [startY, startY - 120, endY],
      scale: [1, 0.7, 0.2],
      opacity: [1, 1, 0],
      rotate: [0, -15, 10],
    }}
    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
    onAnimationComplete={onDone}
    style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', top: 0, left: 0 }}
  >
    <img src={imgUrl} className="w-10 h-12 object-cover rounded-lg shadow-lg" alt="" />
  </motion.div>
);

const LibraryLogForm = () => {
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [bookSearch, setBookSearch] = useState('');
  const [bookPage, setBookPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [flyingParticles, setFlyingParticles] = useState([]);
  const [cartBounce, setCartBounce] = useState(false);
  const cartRef = useRef(null);
  const particleId = useRef(0);

  const [form, setForm] = useState({
    studentName: '', phoneNumber: '', gender: '', purpose: '', notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '', subMessage: '' });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const pendingNavRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (selectedIds.length === 0) return;
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto')) return;
      e.preventDefault();
      pendingNavRef.current = () => { window.location.href = href; };
      setShowLeaveModal(true);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [selectedIds]);

  useEffect(() => {
    const handler = (e) => {
      if (selectedIds.length > 0) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [selectedIds]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      window.history.pushState(null, '', window.location.href);
    }
    const handler = () => {
      if (selectedIds.length > 0) {
        window.history.pushState(null, '', window.location.href);
        setShowLeaveModal(true);
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [selectedIds]);

  useEffect(() => {
    (async () => {
      setBooksLoading(true);
      const result = await libraryLogService.getAvailableBooks();
      if (result.success) setBooks(result.data);
      setBooksLoading(false);
    })();
  }, []);

  useEffect(() => { setBookPage(1); }, [bookSearch]);

  const filteredBooks = useMemo(() => {
    const q = bookSearch.toLowerCase();
    if (!q) return books;
    return books.filter(b =>
      b.title?.toLowerCase().includes(q) ||
      b.barcode?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q)
    );
  }, [books, bookSearch]);

  const bookTotalPages = Math.ceil(filteredBooks.length / BOOK_PAGE_SIZE);
  const pagedBooks = useMemo(() => {
    const start = (bookPage - 1) * BOOK_PAGE_SIZE;
    return filteredBooks.slice(start, start + BOOK_PAGE_SIZE);
  }, [filteredBooks, bookPage]);

  const launchParticle = useCallback((bookEl, imgUrl) => {
    if (!cartRef.current || !bookEl) return;
    const bookRect = bookEl.getBoundingClientRect();
    const cartRect = cartRef.current.getBoundingClientRect();
    const startX = bookRect.left + bookRect.width / 2 - 20;
    const startY = bookRect.top + bookRect.height / 2 - 24;
    const endX   = cartRect.left + cartRect.width / 2 - 20;
    const endY   = cartRect.top  + cartRect.height / 2 - 24;
    const id = ++particleId.current;
    setFlyingParticles(prev => [...prev, { id, startX, startY, endX, endY, imgUrl }]);
  }, []);

  const toggleBook = useCallback((bookId, bookEl, imgUrl) => {
    setSelectedIds(prev => {
      const isSelected = prev.includes(bookId);
      if (!isSelected) setTimeout(() => launchParticle(bookEl, imgUrl), 10);
      return isSelected ? prev.filter(id => id !== bookId) : [...prev, bookId];
    });
    setErrors(prev => ({ ...prev, bookIds: null }));
  }, [launchParticle]);

  const handleParticleDone = useCallback((id) => {
    setFlyingParticles(prev => prev.filter(p => p.id !== id));
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePillChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.studentName.trim()) e.studentName = 'Name is required.';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone is required.';
    if (!form.gender) e.gender = 'Gender is required.';
    if (!form.purpose.trim()) e.purpose = 'Purpose is required.';
    if (selectedIds.length === 0) e.bookIds = 'Please select at least one book.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setIsSubmitting(true);
    setSubmitError(null);
    const result = await libraryLogService.createLog({
      ...form, notes: form.notes.trim() || '', bookIds: selectedIds,
    });
    if (result.success) {
      setToast({ show: true, type: 'success', message: 'Request Submitted!', subMessage: 'Waiting for staff approval.' });
      handleReset();
    } else {
      setSubmitError(result.message);
      setToast({ show: true, type: 'error', message: 'Submission Failed', subMessage: result.message || 'Please try again.' });
    }
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setForm({ studentName: '', phoneNumber: '', gender: '', purpose: '', notes: '' });
    setSelectedIds([]);
    setErrors({});
    setSubmitError(null);
    setBookSearch('');
    setBookPage(1);
  };

  return (
    <>
      <Toast
        show={toast.show} type={toast.type} message={toast.message}
        subMessage={toast.subMessage} duration={4000}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      {/* Unsaved cart modal */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="w-7 h-7 text-[#000080]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Leave page?</h2>
              <p className="text-sm text-gray-500 mb-6">
                You have <span className="font-semibold text-[#000080]">{selectedIds.length} book{selectedIds.length > 1 ? 's' : ''}</span> in your cart.<br />
                If you leave now, your selection will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={() => {
                    setShowLeaveModal(false);
                    handleReset();
                    if (pendingNavRef.current) { pendingNavRef.current(); pendingNavRef.current = null; }
                  }}
                  className="flex-1 py-2.5 bg-[#000080] text-white rounded-full text-sm font-semibold hover:bg-black transition-colors"
                >
                  Leave anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying particles portal */}
      {flyingParticles.map(p => (
        <FlyingBook key={p.id} {...p} onDone={() => handleParticleDone(p.id)} />
      ))}

      <div className="min-h-screen bg-[#f1f7ff] py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:w-[69%] mx-auto space-y-5">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">In-Library Reading</h1>
            <p className="text-gray-500 text-sm">Fill in your details to borrow a book for reading inside the library.</p>
          </motion.div>

          {/* Personal Info card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl shadow-md overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatInput label="Full Name *" name="studentName" value={form.studentName} onChange={handleChange} error={errors.studentName} />
                  <FloatInput label="Phone Number *" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Gender *</p>
                  <PillSelector options={GENDERS} value={form.gender} onChange={handlePillChange('gender')} error={errors.gender} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Purpose *</p>
                  <PillSelector options={PURPOSES} value={form.purpose} onChange={handlePillChange('purpose')} error={errors.purpose} />
                </div>
                <FloatTextarea label="Notes (optional)" name="notes" value={form.notes} onChange={handleChange} rows={3} error={errors.notes} />
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-100 bg-blue-50/60 px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
              <div>
                {submitError && <p className="text-xs text-red-500 mb-0.5">{submitError}</p>}
                <p className="text-xs text-gray-400">
                  {selectedIds.length === 0 ? 'No books selected yet' : `${selectedIds.length} book${selectedIds.length > 1 ? 's' : ''} selected`}
                </p>
              </div>
              <button
                onClick={handleSubmit} disabled={isSubmitting}
                className="group flex items-center gap-2 px-6 py-2.5 bg-[#000080] text-white rounded-full text-sm font-semibold hover:bg-black transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                {!isSubmitting && <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
              </button>
            </div>
          </motion.div>

          {/* Book selector card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-md overflow-hidden"
          >
            <div className="p-8 sm:p-10">

              {/* Header with cart icon */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">Select Books *</h3>
                <motion.div
                  ref={cartRef}
                  animate={cartBounce ? { scale: [1, 1.35, 0.9, 1.15, 1], rotate: [0, -8, 8, -4, 0] } : {}}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                    selectedIds.length > 0 ? 'bg-[#000080]' : 'bg-gray-100'
                  }`}>
                    <FiShoppingCart className={`w-5 h-5 ${selectedIds.length > 0 ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <AnimatePresence>
                    {selectedIds.length > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                      >
                        {selectedIds.length > 9 ? '9+' : selectedIds.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {errors.bookIds && <p className="mb-3 text-xs text-red-500 pl-1">{errors.bookIds}</p>}

              {/* Search */}
              <div className="relative mb-4">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, barcode, or category..."
                  value={bookSearch}
                  onChange={e => setBookSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#000080] transition-all"
                />
                {bookSearch && (
                  <button onClick={() => setBookSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Book list */}
              {booksLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000080]" />
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  <FiBook className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No books available
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pagedBooks.map(book => {
                      const selected = selectedIds.includes(book.bookId);
                      const imgUrl = book.imagePath
                        ? (book.imagePath.startsWith('http') ? book.imagePath : `${import.meta.env.VITE_API_URL || ''}${book.imagePath}`)
                        : FALLBACK_IMG;

                      return (
                        <button
                          key={book.bookId}
                          onClick={e => {
                            const btn = e.currentTarget;
                            toggleBook(book.bookId, btn, imgUrl);
                          }}
                          className={`w-full flex items-center gap-4 p-3 pr-4 rounded-2xl bg-white text-left transition-all shadow-sm border ${
                            selected
                              ? 'border-[#000080] ring-1 ring-[#000080]/20'
                              : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                          }`}
                        >
                          {/* Cover */}
                          <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={imgUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.src = FALLBACK_IMG; }}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5 mb-0.5">
                              <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{book.title}</p>
                              {book.category && (
                                <span className="hidden lg:inline-flex flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 whitespace-nowrap">
                                  {book.category}
                                </span>
                              )}
                            </div>
                            {book.author && (
                              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{book.author}</p>
                            )}
                            <p className="text-xs font-mono text-gray-300 mt-1">{book.barcode}</p>
                          </div>

                          {/* Select indicator */}
                          <motion.div
                            animate={selected ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                              selected ? 'bg-[#000080]' : 'bg-gray-100'
                            }`}
                          >
                            <FiCheck className={`w-4 h-4 transition-colors ${selected ? 'text-white' : 'text-gray-300'}`} />
                          </motion.div>
                        </button>
                      );
                    })}
                  </div>

                  <BookPagination
                    page={bookPage}
                    totalPages={bookTotalPages}
                    total={filteredBooks.length}
                    onPrev={() => setBookPage(p => p - 1)}
                    onNext={() => setBookPage(p => p + 1)}
                  />
                </>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default LibraryLogForm;