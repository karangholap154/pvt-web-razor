"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTrash, FaTriangleExclamation, FaCircleQuestion } from "react-icons/fa6";
import styles from "./ConfirmDialog.module.css";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  message?: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose?: () => void;
  onCancel?: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  message,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onCancel) {
      onCancel();
    }
  };

  const resolvedDescription = description ?? message ?? "";
  const resolvedConfirmText = confirmText ?? confirmLabel ?? "Confirm";
  const resolvedCancelText = cancelText ?? cancelLabel ?? "Cancel";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation: Escape key & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus confirm button
    const timer = setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        handleClose();
        return;
      }

      // Trap Tab focus inside the dialog
      if (e.key === "Tab" && cardRef.current) {
        const focusableElements = cardRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose, onCancel]);

  if (!mounted || !isOpen) return null;

  const renderIcon = () => {
    if (variant === "danger") {
      return (
        <div className={`${styles.iconBadge} ${styles.iconDanger}`} aria-hidden="true">
          <FaTrash size={16} />
        </div>
      );
    }
    if (variant === "warning") {
      return (
        <div className={`${styles.iconBadge} ${styles.iconWarning}`} aria-hidden="true">
          <FaTriangleExclamation size={18} />
        </div>
      );
    }
    return (
      <div className={`${styles.iconBadge} ${styles.iconDefault}`} aria-hidden="true">
        <FaCircleQuestion size={18} />
      </div>
    );
  };

  const confirmBtnClass =
    variant === "danger"
      ? styles.btnDanger
      : variant === "warning"
      ? styles.btnWarning
      : styles.btnDefault;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          handleClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={cardRef}
        className={styles.dialogCard}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <div className={styles.headerRow}>
          {renderIcon()}
          <div className={styles.titleArea}>
            <h3 id="confirm-dialog-title" className={styles.title}>
              {title}
            </h3>
            {resolvedDescription && (
              <p id="confirm-dialog-desc" className={styles.description}>
                {resolvedDescription}
              </p>
            )}
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={handleClose}
            disabled={isLoading}
          >
            {resolvedCancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className={`${styles.btnConfirm} ${confirmBtnClass}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>Processing...</span>
              </>
            ) : (
              resolvedConfirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
