import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, BookOpen, Hash, Tag, Copy, CheckCircle, XCircle,
  Eye, BarChart2, FileText, MapPin, Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import catalogService from "../services/catalogService";

const FALLBACK = "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80";

const BookDetailsModal = ({ book, onClose }) => {
  const { t } = useTranslation('books');
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfViewerCount, setPdfViewerCount] = useState(book.pdfViewerCount ?? 0);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await catalogService.getById(book.catalogId);
      if (result.success) {
        setDetail(result.data);
        setPdfViewerCount(result.data.pdfViewerCount ?? 0);
      }
      setIsLoading(false);
    };
    load();
  }, [book.catalogId]);

  const handleReadOnline = async () => {
    setShowPdf(true);
    // Fire-and-forget — track viewer, update count if new
    const result = await catalogService.trackPdfViewer(book.catalogId);
    if (result.success) {
      setPdfViewerCount(result.pdfViewerCount);
    }
  };

  const data = detail || book;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 24 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Top section */}
          <div className="flex flex-col sm:flex-row gap-0 rounded-t-[2rem] overflow-hidden">
            <div className="relative sm:w-48 flex-shrink-0 bg-white p-3">
              <div className="relative w-full h-56 sm:h-full rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={data.imageUrl || FALLBACK}
                  alt={data.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = FALLBACK; }}
                />
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#000080] text-xs font-semibold rounded-full">
                    <Tag className="w-3 h-3" /> {data.category || t('General')}
                  </span>
                  <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900 leading-snug mb-1">{data.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {t('by')} <span className="text-gray-700 font-medium">{data.author}</span>
                </p>

                {data.isbn && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Hash className="w-3.5 h-3.5" />
                    <span className="font-mono">{data.isbn}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <StatPill
                  icon={data.available ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  label={data.available ? t('Available') : t('Unavailable')}
                  color={data.available ? "green" : "red"}
                />
                <StatPill
                  icon={<Copy className="w-3.5 h-3.5" />}
                  label={`${data.availableCopies}/${data.totalCopies} ${t('copies')}`}
                  color="blue"
                />
                <StatPill
                  icon={<BarChart2 className="w-3.5 h-3.5" />}
                  label={`${data.borrowCount ?? 0} ${t('borrowed')}`}
                  color="indigo"
                />
                <StatPill
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                  label={`${data.inLibraryCount ?? 0} ${t('in-library')}`}
                  color="purple"
                />
                {(data.hasPdf || detail?.pdfUrl) && (
                  <StatPill
                    icon={<Users className="w-3.5 h-3.5" />}
                    label={`${pdfViewerCount} ${t('PDF readers')}`}
                    color="teal"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mx-6 border-t border-gray-100" />

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#000080]" />
              </div>
            ) : (
              <div className="space-y-6">
                {data.hasPdf || detail?.pdfUrl ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleReadOnline}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors text-sm font-semibold"
                    >
                      <Eye className="w-4 h-4" /> {t('Read Online')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl text-gray-400 text-sm border border-gray-100">
                    <FileText className="w-4 h-4 flex-shrink-0" /> {t('No PDF available for this book')}
                  </div>
                )}

                {detail?.books?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('Physical Copies')}</h4>
                    <div className="rounded-2xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('Barcode')}</th>
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('Status')}</th>
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('Location')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {detail.books.map((b) => (
                            <tr key={b.bookId} className="hover:bg-gray-50/60 transition-colors">
                              <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.barcode}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  b.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                }`}>
                                  {b.status === "Available"
                                    ? <><CheckCircle className="w-3 h-3" /> {t('Available')}</>
                                    : <><XCircle className="w-3 h-3" /> {t('Borrowed')}</>
                                  }
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {b.location ? (
                                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                                    <MapPin className="w-3 h-3" /> {b.location}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* PDF Viewer */}
      {showPdf && detail?.pdfUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex flex-col z-[60]"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPdf(false); }}
        >
          <div className="flex items-center justify-between px-5 py-3 bg-white/10 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-sm font-medium truncate max-w-xs">{detail.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white/60 text-xs">
                <Users className="w-3.5 h-3.5" /> {pdfViewerCount} {t('PDF readers')}
              </span>
              <button onClick={() => setShowPdf(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 w-full">
            <iframe
              src={`${detail.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              className="absolute inset-0 w-full h-full"
              title={detail.title}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} onContextMenu={(e) => e.preventDefault()} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const COLOR_MAP = {
  green:  "bg-green-50 text-green-700",
  red:    "bg-red-50 text-red-600",
  blue:   "bg-blue-50 text-[#000080]",
  indigo: "bg-indigo-50 text-indigo-700",
  purple: "bg-purple-50 text-purple-700",
  teal:   "bg-teal-50 text-teal-700",
};

const StatPill = ({ icon, label, color = "blue" }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${COLOR_MAP[color]}`}>
    {icon} {label}
  </span>
);

export default BookDetailsModal;