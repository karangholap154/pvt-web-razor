"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import styles from "./ToastProvider.module.css";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  isLeaving?: boolean;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      // Mark as leaving first to trigger exit animation
      return prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t));
    });

    // Remove from array after animation finishes (250ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      // Set timeout to start removal
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback((msg: string, dur?: number) => toast(msg, "success", dur), [toast]);
  const error = useCallback((msg: string, dur?: number) => toast(msg, "error", dur), [toast]);
  const warning = useCallback((msg: string, dur?: number) => toast(msg, "warning", dur), [toast]);
  const info = useCallback((msg: string, dur?: number) => toast(msg, "info", dur), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((t) => {
          const toastClass = `${styles.toast} ${
            t.type === "success"
              ? styles.toastSuccess
              : t.type === "error"
              ? styles.toastError
              : t.type === "warning"
              ? styles.toastWarning
              : styles.toastInfo
          } ${t.isLeaving ? styles.toastLeaving : ""}`;

          const progressClass = `${styles.progressBar} ${
            t.type === "success"
              ? styles.progressSuccess
              : t.type === "error"
              ? styles.progressError
              : t.type === "warning"
              ? styles.progressWarning
              : styles.progressInfo
          }`;

          return (
            <div key={t.id} className={toastClass} role="alert">
              {/* Type Icons */}
              <div className={`${styles.iconWrapper} ${
                t.type === "success"
                  ? styles.iconSuccess
                  : t.type === "error"
                  ? styles.iconError
                  : t.type === "warning"
                  ? styles.iconWarning
                  : styles.iconInfo
              }`}>
                {t.type === "success" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )}
                {t.type === "error" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
                {t.type === "warning" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                )}
                {t.type === "info" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                )}
              </div>

              {/* Message */}
              <div className={styles.message}>{t.message}</div>

              {/* Close Button */}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Timer Progress Bar */}
              <div 
                className={progressClass}
                style={{
                  animation: `shrinkTimer ${t.duration}ms linear forwards`
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Inline styles to guarantee custom keyframe shrinkTimer works */}
      <style>{`
        @keyframes shrinkTimer {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
