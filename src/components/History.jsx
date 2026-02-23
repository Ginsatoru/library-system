import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiClock, FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp, FiList, FiRotateCcw } from 'react-icons/fi';
import memberService from '../services/memberServices';

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

// ── Status badge ──────────────────────────────────────────────────
const StatusBadge = ({ isReturned, isOverdue: overdue }) => {
  if (isReturned) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
      <FiCheckCircle className="w-3 h-3" /> Returned
    </span>
  );
  if (overdue) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
      <FiAlertCircle className="w-3 h-3" /> Overdue
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#000080] border border-blue-100">
      <FiClock className="w-3 h-3" /> Active
    </span>
  );
};

// ── Action badge for history log ─────────────────────────────────
const ActionBadge = ({ actionType, entityType }) => {
  const map = {
    Borrowed: { bg: 'bg-blue-50', text: 'text-[#000080]', border: 'border-blue-100' },
    Returned: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    Fine:     { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    Paid:     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    Visit:    { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  };
  const label = actionType || entityType || 'Log';
  const style = map[actionType] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {label}
    </span>
  );
};

// ── Borrow card ──────────────────────────────────────────────────
const BorrowCard = ({ borrow }) => {
  const [expanded, setExpanded] = useState(false);
  const overdue = isOverdue(borrow.dueDate, borrow.isReturned);

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl border transition-all ${overdue ? 'border-red-100' : 'border-gray-100'} shadow-sm overflow-hidden`}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-gray-50/60 transition-colors"
      >
        <div className={`mt-0.5 p-1.5 rounded-xl flex-shrink-0 ${overdue ? 'bg-red-50' : borrow.isReturned ? 'bg-green-50' : 'bg-blue-50'}`}>
          <FiBook className={`w-3.5 h-3.5 ${overdue ? 'text-red-500' : borrow.isReturned ? 'text-green-600' : 'text-[#000080]'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {borrow.books?.map(b => b.catalogTitle).join(', ') || '—'}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <StatusBadge isReturned={borrow.isReturned} isOverdue={overdue} />
            <span className="text-xs text-gray-400">{fmt(borrow.loanDate)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-gray-300 mt-1">
          {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <DetailCell label="Loan Date" value={fmt(borrow.loanDate)} />
                <DetailCell label="Due Date" value={fmt(borrow.dueDate)} highlight={overdue} />
                <DetailCell label="Return Date" value={fmt(borrow.returnDate)} />
                <DetailCell label="Borrowing Fee" value={borrow.borrowingFee != null ? `$${Number(borrow.borrowingFee).toFixed(2)}` : '—'} />
                {borrow.fineAmount > 0 && (
                  <DetailCell label="Fine" value={`$${Number(borrow.fineAmount).toFixed(2)}`} highlight />
                )}
                <DetailCell label="Paid" value={borrow.isPaid ? 'Yes' : 'No'} />
              </div>

              {borrow.books?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Books</p>
                  <div className="space-y-1.5">
                    {borrow.books.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                        <FiBook className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-800">{b.catalogTitle}</p>
                          {(b.conditionOut || b.conditionIn) && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Out: {b.conditionOut || '—'} · In: {b.conditionIn || '—'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── History log row ───────────────────────────────────────────────
const HistoryRow = ({ item }) => (
  <div className="flex items-start gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div className="mt-0.5 p-1.5 rounded-xl bg-gray-50 flex-shrink-0">
      <FiList className="w-3.5 h-3.5 text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-medium text-gray-800 truncate">{item.bookTitle || '—'}</p>
        <ActionBadge actionType={item.actionType} entityType={item.entityType} />
      </div>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="text-xs text-gray-400">{fmtTime(item.occurredUtc)}</span>
        {item.fineAmount > 0 && (
          <span className="text-xs text-amber-600 font-medium">Fine: ${Number(item.fineAmount).toFixed(2)}</span>
        )}
        {item.amountPaid > 0 && (
          <span className="text-xs text-green-600 font-medium">Paid: ${Number(item.amountPaid).toFixed(2)}</span>
        )}
        {item.notes && (
          <span className="text-xs text-gray-400 italic truncate max-w-[160px] sm:max-w-[200px]">{item.notes}</span>
        )}
      </div>
    </div>
  </div>
);

// ── Detail cell helper ────────────────────────────────────────────
const DetailCell = ({ label, value, highlight }) => (
  <div className="bg-gray-50 rounded-xl px-3 py-2">
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${highlight ? 'text-red-500' : 'text-gray-800'}`}>{value || '—'}</p>
  </div>
);

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

// ── Main component ────────────────────────────────────────────────
const History = () => {
  const [borrows, setBorrows] = useState([]);
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('borrows');

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

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#000080]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-red-500 text-sm mb-3">{error}</p>
      </div>
    </div>
  );

  const activeLoans = borrows.filter(b => !b.isReturned);
  const overdueLoans = borrows.filter(b => isOverdue(b.dueDate, b.isReturned));
  const returned = borrows.filter(b => b.isReturned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 px-4 sm:py-8 sm:px-6">
      <div className="w-full lg:w-[69%] mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My History</h1>
          <p className="text-gray-500 text-sm">Your borrowing activity and library log</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <StatCard icon={FiBook}        label="Total Borrows" value={borrows.length}        color="bg-[#000080]" />
          <StatCard icon={FiClock}       label="Active"        value={activeLoans.length}    color="bg-blue-400" />
          <StatCard icon={FiAlertCircle} label="Overdue"       value={overdueLoans.length}   color="bg-red-400" />
          <StatCard icon={FiRotateCcw}   label="Returned"      value={returned.length}       color="bg-green-500" />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none"
        >
          {[
            { id: 'borrows',   label: 'Borrows',      count: borrows.length },
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
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'borrows' && (
            <motion.div
              key="borrows"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2.5"
            >
              {borrows.length === 0 ? (
                <EmptyState icon={FiBook} message="No borrowing history yet." />
              ) : (
                borrows.map(b => <BorrowCard key={b.loanId} borrow={b} />)
              )}
            </motion.div>
          )}

          {activeTab === 'histories' && (
            <motion.div
              key="histories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2.5"
            >
              {histories.length === 0 ? (
                <EmptyState icon={FiList} message="No activity log yet." />
              ) : (
                histories.map((h, i) => <HistoryRow key={i} item={h} />)
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-[2rem] border border-gray-100">
    <div className="p-4 bg-gray-50 rounded-2xl mb-3">
      <Icon className="w-6 h-6 text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export default History;