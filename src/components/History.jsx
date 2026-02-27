import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBook, FiClock, FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp,
  FiList, FiRotateCcw, FiDollarSign, FiCheck, FiCornerUpLeft, FiSearch, FiX,
  FiEye, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { MdOutlineLocalLibrary } from 'react-icons/md';
import memberService from '../services/memberServices';

const PAGE_SIZE = 20;

const fmt = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const fmtTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const isOverdue = (dueDate, isReturned) => {
  if (isReturned) return false;
  return dueDate && new Date(dueDate) < new Date();
};

const ACTION_MAP = {
  BorrowInLibrary: { bg: 'bg-blue-50',    text: 'text-[#000080]',   border: 'border-blue-100',    icon: MdOutlineLocalLibrary, label: 'In-Library'  },
  Approve:         { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-100',   icon: FiCheck,               label: 'Approved'    },
  ReturnLibrary:   { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-100',    icon: FiCornerUpLeft,        label: 'Returned'    },
  Unreturn:        { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100',   icon: FiRotateCcw,           label: 'Unreturned'  },
  ToPending:       { bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-200',    icon: FiClock,               label: 'Pending'     },
  Borrowed:        { bg: 'bg-blue-50',    text: 'text-[#000080]',   border: 'border-blue-100',    icon: FiBook,                label: 'Borrowed'    },
  Returned:        { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-100',   icon: FiCheckCircle,         label: 'Returned'    },
  Fine:            { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100',     icon: FiAlertCircle,         label: 'Fine'        },
  Paid:            { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: FiDollarSign,          label: 'Paid'        },
  Visit:           { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-100',  icon: MdOutlineLocalLibrary, label: 'Visit'       },
};

// ── Detail cell ───────────────────────────────────────────────────
const DetailCell = ({ label, value, highlight }) => (
  <div className="bg-gray-50 rounded-xl px-3 py-2">
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${highlight ? 'text-red-500' : 'text-gray-800'}`}>{value || '—'}</p>
  </div>
);

// ── Borrow row ────────────────────────────────────────────────────
const BorrowRow = ({ borrow, index }) => {
  const [expanded, setExpanded] = useState(false);
  const overdue = isOverdue(borrow.dueDate, borrow.isReturned);

  const statusColor = borrow.isReturned ? 'text-green-600' : overdue ? 'text-red-500' : 'text-[#000080]';
  const statusLabel = borrow.isReturned ? 'Returned' : overdue ? 'Overdue' : 'Active';
  const iconBg = borrow.isReturned ? 'bg-green-50' : overdue ? 'bg-red-50' : 'bg-blue-50';
  const iconColor = borrow.isReturned ? 'text-green-600' : overdue ? 'text-red-500' : 'text-[#000080]';
  const bookCount = borrow.books?.length || 0;

  return (
    <>
      <tr
        className={`group border-b border-gray-50 transition-colors cursor-pointer hover:bg-blue-50/30 ${expanded ? 'bg-blue-50/20' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
        onClick={() => setExpanded(p => !p)}
      >
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <FiBook className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-[220px]">
                {borrow.books?.[0]?.catalogTitle || '—'}
              </p>
              {bookCount > 1 && (
                <p className="text-xs text-gray-400">+{bookCount - 1} more book{bookCount > 2 ? 's' : ''}</p>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5 hidden sm:table-cell">
          <p className="text-sm text-gray-700">{fmt(borrow.loanDate)}</p>
          <p className="text-xs text-gray-400">Loan date</p>
        </td>
        <td className="px-4 py-3.5 hidden md:table-cell">
          <p className={`text-sm font-medium ${overdue && !borrow.isReturned ? 'text-red-500' : 'text-gray-700'}`}>
            {fmt(borrow.dueDate)}
          </p>
          <p className="text-xs text-gray-400">Due date</p>
        </td>
        <td className="px-4 py-3.5 hidden lg:table-cell">
          <p className={`text-sm font-medium ${borrow.fineAmount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {borrow.fineAmount > 0 ? `$${Number(borrow.fineAmount).toFixed(2)}` : '—'}
          </p>
          <p className="text-xs text-gray-400">Fine</p>
        </td>
        <td className="px-4 py-3.5">
          <span className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</span>
        </td>
        <td className="px-4 py-3.5 text-right">
          <button
            onClick={e => { e.stopPropagation(); setExpanded(p => !p); }}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#000080] transition-colors font-medium"
          >
            {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            <span className="hidden sm:inline">{expanded ? 'Hide' : 'Details'}</span>
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
          <td colSpan={6} className="px-4 pb-4 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-1">
              <DetailCell label="Loan Date"     value={fmt(borrow.loanDate)} />
              <DetailCell label="Due Date"      value={fmt(borrow.dueDate)} highlight={overdue && !borrow.isReturned} />
              <DetailCell label="Return Date"   value={fmt(borrow.returnDate)} />
              <DetailCell label="Borrowing Fee" value={borrow.borrowingFee != null ? `$${Number(borrow.borrowingFee).toFixed(2)}` : '—'} />
              {borrow.fineAmount > 0 && <DetailCell label="Fine" value={`$${Number(borrow.fineAmount).toFixed(2)}`} highlight />}
              <DetailCell label="Paid" value={borrow.isPaid ? 'Yes' : 'No'} />
            </div>
            {borrow.books?.length > 1 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">All Books</p>
                <div className="space-y-1.5">
                  {borrow.books.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                      <FiBook className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{b.catalogTitle}</p>
                        {(b.conditionOut || b.conditionIn) && (
                          <p className="text-xs text-gray-400 mt-0.5">Out: {b.conditionOut || '—'} · In: {b.conditionIn || '—'}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

// ── History row ───────────────────────────────────────────────────
const HistoryRow = ({ item, index }) => {
  const cfg = ACTION_MAP[item.actionType] || {
    bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', icon: FiList, label: item.actionType || 'Log',
  };
  const Icon = cfg.icon;
  return (
    <tr className={`border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
            <Icon className={`w-4 h-4 ${cfg.text}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-[220px]">
              {item.bookTitle || item.catalogTitle || '—'}
            </p>
            {item.notes && (
              <p className="text-xs text-gray-400 truncate max-w-[160px] sm:max-w-[200px]">{item.notes}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <p className="text-sm text-gray-700">{fmt(item.occurredUtc)}</p>
        <p className="text-xs text-gray-400">{new Date(item.occurredUtc).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        {item.fineAmount > 0 && <p className="text-sm font-medium text-red-500">-${Number(item.fineAmount).toFixed(2)}</p>}
        {item.amountPaid > 0 && <p className="text-sm font-medium text-green-600">+${Number(item.amountPaid).toFixed(2)}</p>}
        {!item.fineAmount && !item.amountPaid && <p className="text-sm text-gray-400">—</p>}
      </td>
      <td className="px-4 py-3.5">
        <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
      </td>
    </tr>
  );
};

// ── Pagination ────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, total, onPrev, onNext }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Page <span className="font-medium text-gray-600">{page}</span> of <span className="font-medium text-gray-600">{totalPages}</span>
        <span className="ml-1">({total} total)</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FiChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>
        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-3 sm:px-4 flex items-center gap-3">
    <div className={`p-2 rounded-xl flex-shrink-0 ${color}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 truncate">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// ── Main ─────────────────────────────────────────────────────────
const History = () => {
  const [borrows, setBorrows] = useState([]);
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('borrows');
  const [borrowSearch, setBorrowSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [borrowPage, setBorrowPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await memberService.getHistory();
      if (result.success) {
        setBorrows(result.data.borrows || []);
        setHistories(result.data.histories || []);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    })();
  }, []);

  // Reset page to 1 when search changes
  useEffect(() => { setBorrowPage(1); }, [borrowSearch]);
  useEffect(() => { setHistoryPage(1); }, [historySearch]);

  const filteredBorrows = useMemo(() => {
    const q = borrowSearch.toLowerCase();
    if (!q) return borrows;
    return borrows.filter(b =>
      b.books?.some(bk => bk.catalogTitle?.toLowerCase().includes(q)) ||
      fmt(b.loanDate).toLowerCase().includes(q) ||
      fmt(b.dueDate).toLowerCase().includes(q)
    );
  }, [borrows, borrowSearch]);

  const filteredHistories = useMemo(() => {
    const q = historySearch.toLowerCase();
    if (!q) return histories;
    return histories.filter(h =>
      (h.bookTitle || h.catalogTitle || '').toLowerCase().includes(q) ||
      (h.actionType || '').toLowerCase().includes(q) ||
      (h.notes || '').toLowerCase().includes(q)
    );
  }, [histories, historySearch]);

  const borrowTotalPages = Math.ceil(filteredBorrows.length / PAGE_SIZE);
  const historyTotalPages = Math.ceil(filteredHistories.length / PAGE_SIZE);

  const pagedBorrows = useMemo(() => {
    const start = (borrowPage - 1) * PAGE_SIZE;
    return filteredBorrows.slice(start, start + PAGE_SIZE);
  }, [filteredBorrows, borrowPage]);

  const pagedHistories = useMemo(() => {
    const start = (historyPage - 1) * PAGE_SIZE;
    return filteredHistories.slice(start, start + PAGE_SIZE);
  }, [filteredHistories, historyPage]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#000080]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  const activeLoans  = borrows.filter(b => !b.isReturned);
  const overdueLoans = borrows.filter(b => isOverdue(b.dueDate, b.isReturned));
  const returned     = borrows.filter(b => b.isReturned);

  return (
    <div className="min-h-screen bg-[#f1f7ff] py-6 px-4 sm:py-8 sm:px-6">
      <div className="w-full lg:w-[69%] mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My History</h1>
          <p className="text-gray-500 text-sm">Your borrowing activity and library log</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <StatCard icon={FiBook}        label="Total Borrows" value={borrows.length}      color="bg-[#000080]" />
          <StatCard icon={FiClock}       label="Active"        value={activeLoans.length}  color="bg-blue-400"  />
          <StatCard icon={FiAlertCircle} label="Overdue"       value={overdueLoans.length} color="bg-red-400"   />
          <StatCard icon={FiRotateCcw}   label="Returned"      value={returned.length}     color="bg-green-500" />
        </motion.div>

        {/* Tabs + search */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="flex gap-2 flex-shrink-0">
            {[
              { id: 'borrows',   label: 'Borrows',      count: borrows.length   },
              { id: 'histories', label: 'Activity Log', count: histories.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#000080] text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative ml-auto w-40 sm:w-52">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={activeTab === 'borrows' ? borrowSearch : historySearch}
              onChange={e => activeTab === 'borrows' ? setBorrowSearch(e.target.value) : setHistorySearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-7 py-2 text-sm bg-white border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all shadow-sm"
            />
            {(activeTab === 'borrows' ? borrowSearch : historySearch) && (
              <button
                onClick={() => activeTab === 'borrows' ? setBorrowSearch('') : setHistorySearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-3 h-3" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Tables */}
        <AnimatePresence mode="wait">
          {activeTab === 'borrows' && (
            <motion.div key="borrows" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {filteredBorrows.length === 0 ? (
                <EmptyState icon={FiBook} message={borrowSearch ? 'No borrows match your search.' : 'No borrowing history yet.'} />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Book</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Loan Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Fine</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedBorrows.map((b, i) => (
                        <BorrowRow key={b.loanId} borrow={b} index={i} />
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    page={borrowPage}
                    totalPages={borrowTotalPages}
                    total={filteredBorrows.length}
                    onPrev={() => setBorrowPage(p => p - 1)}
                    onNext={() => setBorrowPage(p => p + 1)}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'histories' && (
            <motion.div key="histories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {filteredHistories.length === 0 ? (
                <EmptyState icon={FiList} message={historySearch ? 'No activity matches your search.' : 'No activity log yet.'} />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Book / Event</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedHistories.map((h, i) => (
                        <HistoryRow key={i} item={h} index={i} />
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    page={historyPage}
                    totalPages={historyTotalPages}
                    total={filteredHistories.length}
                    onPrev={() => setHistoryPage(p => p - 1)}
                    onNext={() => setHistoryPage(p => p + 1)}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-100">
    <div className="p-4 bg-gray-50 rounded-2xl mb-3">
      <Icon className="w-6 h-6 text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export default History;