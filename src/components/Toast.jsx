import { useEffect, useState } from "react";
import { FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

/**
 * Toast – tick circle → slides to center → expands into pill
 *
 * Props:
 *   show       boolean
 *   type       "success" | "error" | "info" | "warning"
 *   message    string
 *   subMessage string?
 *   duration   number?  (default 4000, 0 = manual only)
 *   onClose    () => void
 */

const TYPES = {
  success: { icon: FiCheck,         bg: "bg-green-500"  },
  error:   { icon: FiAlertCircle,   bg: "bg-red-500"    },
  info:    { icon: FiInfo,          bg: "bg-[#000080]"  },
  warning: { icon: FiAlertTriangle, bg: "bg-amber-500"  },
};

const PHASE = { HIDDEN: 0, TICK: 1, CENTER: 2, EXPANDED: 3, CLOSING: 4 };

const Toast = ({
  show,
  type = "success",
  message = "",
  subMessage = "",
  duration = 4000,
  onClose,
}) => {
  const [phase, setPhase] = useState(PHASE.HIDDEN);
  const cfg = TYPES[type] || TYPES.success;
  const Icon = cfg.icon;

  useEffect(() => {
    if (!show) {
      if (phase !== PHASE.HIDDEN) {
        setPhase(PHASE.CLOSING);
        const t = setTimeout(() => setPhase(PHASE.HIDDEN), 500);
        return () => clearTimeout(t);
      }
      return;
    }

    setPhase(PHASE.TICK);
    const t1 = setTimeout(() => setPhase(PHASE.CENTER),   60);
    const t2 = setTimeout(() => setPhase(PHASE.EXPANDED), 900);

    let t3;
    if (duration > 0) {
      t3 = setTimeout(() => {
        setPhase(PHASE.CLOSING);
        setTimeout(() => { setPhase(PHASE.HIDDEN); onClose?.(); }, 500);
      }, 900 + duration);
    }

    return () => { clearTimeout(t1); clearTimeout(t2); if (t3) clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleClose = () => {
    setPhase(PHASE.CLOSING);
    setTimeout(() => { setPhase(PHASE.HIDDEN); onClose?.(); }, 500);
  };

  if (phase === PHASE.HIDDEN) return null;

  const isExpanded = phase === PHASE.EXPANDED;
  const isCentered = phase === PHASE.CENTER || phase === PHASE.EXPANDED;
  const isClosing  = phase === PHASE.CLOSING;

  return (
    <>
      <style>{`
        @keyframes toast-drain {
          from { width: 100%; }
          to   { width: 0%; }
        }

        /* ── Wrapper: handles horizontal slide ── */
        .toast-pill-wrap {
          position: fixed;
          top: 84px;
          z-index: 9999;
          pointer-events: none;
          right: ${isCentered ? "50%" : "24px"};
          transform: ${isCentered ? "translateX(50%)" : "none"};
          transition:
            right .45s cubic-bezier(.4,0,.2,1),
            transform .45s cubic-bezier(.4,0,.2,1);
        }

        /* ── Pill: shape morph ── */
        .toast-pill {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: auto;
          width:         ${isExpanded ? "min(480px, calc(100vw - 32px))" : "56px"};
          height:        ${isExpanded ? "60px" : "56px"};
          border-radius: ${isExpanded ? "999px" : "50%"};
          background:    ${isExpanded ? "#ffffff" : ""};
          border:        ${isExpanded ? "1px solid #e5e7eb" : "1px solid transparent"};
          box-shadow:    ${isExpanded
                           ? "0 8px 32px rgba(0,0,128,.10), 0 2px 8px rgba(0,0,0,.08)"
                           : "0 20px 40px rgba(0,0,0,.25)"};
          opacity:       ${isClosing ? 0 : 1};
          transform:     ${isClosing ? "scale(0.88)" : "scale(1)"};
          transition:
            width         .45s cubic-bezier(.4,0,.2,1),
            height        .45s cubic-bezier(.4,0,.2,1),
            border-radius .45s cubic-bezier(.4,0,.2,1),
            background    .3s ease,
            border-color  .3s ease,
            box-shadow    .3s ease,
            opacity       .3s ease,
            transform     .3s ease;
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .toast-pill-wrap {
            top: 72px;
            right: ${isCentered ? "50%" : "12px"};
          }
          .toast-pill {
            width:         ${isExpanded ? "calc(100vw - 24px)" : "44px"} !important;
            height:        ${isExpanded ? "48px" : "44px"} !important;
          }
          .toast-content {
            padding: 0 10px !important;
            gap: 7px !important;
          }
          .toast-icon-badge {
            width: 26px !important;
            height: 26px !important;
          }
          .toast-icon-badge svg {
            width: 11px !important;
            height: 11px !important;
          }
          .toast-tick-icon {
            width: 20px !important;
            height: 20px !important;
          }
          .toast-text-main {
            font-size: 0.72rem !important;
          }
          .toast-text-sub {
            font-size: 0.72rem !important;
          }
          .toast-close svg {
            width: 13px !important;
            height: 13px !important;
          }
        }
      `}</style>

      <div className="toast-pill-wrap">
        <div className={`toast-pill ${!isExpanded ? cfg.bg : ""}`}>

          {/* Tick icon (circle phase) */}
          <div
            className="absolute flex items-center justify-center text-white transition-all duration-300"
            style={{ opacity: isExpanded ? 0 : 1, transform: isExpanded ? "scale(0.3)" : "scale(1)" }}
          >
            <Icon className="toast-tick-icon w-7 h-7" />
          </div>

          {/* Expanded pill content */}
          <div
            className="toast-content absolute inset-0 flex items-center gap-3 px-4 transition-all duration-300"
            style={{ opacity: isExpanded ? 1 : 0, transform: isExpanded ? "translateY(0)" : "translateY(10px)" }}
          >
            {/* Icon badge */}
            <div className={`toast-icon-badge w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${cfg.bg}`}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Text — no ellipsis, wraps/shrinks to fit */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
              <span className="toast-text-main text-sm font-semibold text-gray-900 whitespace-nowrap">
                {message}
              </span>
              {subMessage && (
                <span className="toast-text-sub text-sm text-gray-500 whitespace-nowrap">
                  {subMessage}
                </span>
              )}
            </div>

            {/* Close */}
            <button
              onClick={handleClose}
              className="toast-close ml-auto flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors duration-150"
              aria-label="Dismiss"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Progress drain */}
          {isExpanded && duration > 0 && (
            <div
              className={`absolute bottom-0 left-0 h-0.5 rounded-full opacity-20 ${cfg.bg}`}
              style={{ animation: `toast-drain ${duration}ms linear forwards` }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Toast;