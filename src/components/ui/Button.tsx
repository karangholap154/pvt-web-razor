import React from "react";
import Link from "next/link";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "dark" | "highlighter" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
  external?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      children,
      className = "",
      href,
      external,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const variantClass = {
      primary: styles.variantPrimary,
      dark: styles.variantDark,
      highlighter: styles.variantHighlighter,
      secondary: styles.variantSecondary,
      ghost: styles.variantGhost,
      danger: styles.variantDanger,
    }[variant];

    const sizeClass = {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    }[size];

    const combinedClassName = [
      styles.button,
      variantClass,
      sizeClass,
      loading ? styles.loading : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          leftIcon && <span className="inline-flex items-center">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!loading && rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
      </>
    );

    if (href) {
      if (external) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
            aria-disabled={disabled || loading}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedClassName}
          aria-disabled={disabled || loading}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
