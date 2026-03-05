import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiX, FiAlertTriangle, FiClock, FiBookOpen } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import memberService from "../services/memberServices";

const DueDateAlert = ({ isAuthenticated, onVisibilityChange }) => {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useTranslation('books');

  useEffect(() => {
    if (!isAuthenticated) return;

    const sessionKey = "dueDateAlertDismissed";
    if (sessionStorage.getItem(sessionKey)) {
      setDismissed(true);
      return;
    }

    memberService.getHistory().then(({ success, data }) => {
      if (!success || !data?.borrows) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const found = [];

      data.borrows
        .filter((b) => !b.isReturned)
        .forEach((b) => {
          const due = new Date(b.dueDate);
          due.setHours(0, 0, 0, 0);
          const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
          const titles = b.books?.map((bk) => bk.catalogTitle).join(", ") || "Unknown";

          if (diffDays < 0) {
            found.push({ loanId: b.loanId, type: "overdue", diffDays: Math.abs(diffDays), titles, dueDate: due });
          } else if (diffDays <= 3) {
            found.push({ loanId: b.loanId, type: "soon", diffDays, titles, dueDate: due });
          }
        });

      found.sort((a, b) => {
        if (a.type === "overdue" && b.type !== "overdue") return -1;
        if (a.type !== "overdue" && b.type === "overdue") return 1;
        return a.diffDays - b.diffDays;
      });

      setAlerts(found);
    });
  }, [isAuthenticated]);

  const isVisible = isAuthenticated && !dismissed && alerts.length > 0;

  useEffect(() => {
    if (onVisibilityChange) onVisibilityChange(isVisible);
  }, [isVisible, onVisibilityChange]);

  const handleDismiss = () => {
    sessionStorage.setItem("dueDateAlertDismissed", "1");
    setDismissed(true);
  };

  if (!isVisible) return null;

  const hasOverdue = alerts.some((a) => a.type === "overdue");
  const isUrgent = hasOverdue || alerts.some((a) => a.diffDays === 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-16 sm:top-[4.5rem] left-0 right-0 z-40 ${isUrgent ? "bg-red-600" : "bg-amber-500"}`}
      >
        <div className="max-w-[82rem] mx-auto py-1 px-3 sm:px-4">
          <div className="flex items-center gap-3 mt-0.5">

            <div className="flex-shrink-0 -mt-0.5">
              {isUrgent
                ? <FiAlertTriangle className="w-4 h-4 text-white" />
                : <FiClock className="w-4 h-4 text-white" />
              }
            </div>

            <div className="flex-1 min-w-0">
              {alerts.length === 1
                ? <SingleAlert alert={alerts[0]} t={t} />
                : <MultiAlert alerts={alerts} t={t} />
              }
            </div>

            <Link
              to="/history"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap"
            >
              <FiBookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('View History')}</span>
              <span className="sm:hidden">{t('View')}</span>
            </Link>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
              aria-label="Dismiss"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const SingleAlert = ({ alert, t }) => {
  const { type, diffDays, titles } = alert;
  const shortTitle = titles.length > 40 ? titles.slice(0, 40) + "…" : titles;

  let label;
  if (type === "overdue") {
    label = t(diffDays === 1 ? "Overdue by {{count}} day" : "Overdue by {{count}} days", { count: diffDays });
  } else if (diffDays === 0) {
    label = t("Due today");
  } else {
    label = t(diffDays === 1 ? "Due in {{count}} day" : "Due in {{count}} days", { count: diffDays });
  }

  return (
    <p className="text-white text-sm font-medium leading-snug">
      <span className="font-bold">{label}:</span>{" "}
      <span className="opacity-90">{shortTitle}</span>
    </p>
  );
};

const MultiAlert = ({ alerts, t }) => {
  const overdueCount = alerts.filter((a) => a.type === "overdue").length;
  const soonCount = alerts.filter((a) => a.type === "soon").length;

  const parts = [];
  if (overdueCount > 0)
    parts.push(t(overdueCount === 1 ? "{{count}} overdue loan" : "{{count}} overdue loans", { count: overdueCount }));
  if (soonCount > 0)
    parts.push(t(soonCount === 1 ? "{{count}} loan due soon" : "{{count}} loans due soon", { count: soonCount }));

  return (
    <p className="text-white text-sm font-medium leading-snug">
      <span className="font-bold">{t('Attention')}:</span>{" "}
      <span className="opacity-90">
        {t('You have {{parts}}. Please return them on time.', { parts: parts.join(` ${t('and')} `) })}
      </span>
    </p>
  );
};

export default DueDateAlert;