"use client";

import { useState, useRef, useEffect, useId } from "react";
import { BRANCHES } from "@/data/mockData";
import { FaChevronDown, FaXmark, FaCheck } from "react-icons/fa6";

interface BranchSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: "dark" | "light";
}

export default function BranchSelect({
  value,
  onChange,
  placeholder = "Type or select branch...",
  includeAllOption = false,
  allOptionLabel = "All branches",
  id,
  required,
  disabled,
  className,
  style,
  variant = "dark",
}: BranchSelectProps) {
  const isLight = variant === "light";
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = includeAllOption ? [allOptionLabel, ...BRANCHES] : [...BRANCHES];

  const filteredOptions = options.filter((branch) =>
    branch.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleSelect = (branch: string) => {
    onChange(branch);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(includeAllOption ? allOptionLabel : "");
    setQuery("");
  };

  const displayValue = isOpen ? query : value || "";

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        display: "inline-block",
        ...style,
      }}
      className={className}
    >
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: isLight ? "var(--paper, #F7F8FB)" : "rgba(24, 24, 27, 0.85)",
          backdropFilter: isLight ? "none" : "blur(12px)",
          WebkitBackdropFilter: isLight ? "none" : "blur(12px)",
          border: isOpen
            ? isLight
              ? "1px solid var(--blue-500, #2447F5)"
              : "1px solid var(--accent, #fbbf24)"
            : isLight
            ? "1px solid var(--line-300, #CDD4E2)"
            : "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: isLight ? "var(--radius-md, 10px)" : "var(--radius-sm, 8px)",
          padding: isLight ? "0 0.85rem" : "0.6rem 0.85rem",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          boxShadow: isOpen
            ? isLight
              ? "0 0 0 3px rgba(36, 71, 245, 0.12)"
              : "0 0 0 3px rgba(251, 191, 36, 0.2), 0 8px 20px rgba(0, 0, 0, 0.4)"
            : "none",
          opacity: disabled ? 0.6 : 1,
          minHeight: "42px",
          height: "42px",
          boxSizing: "border-box",
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={value || placeholder}
          disabled={disabled}
          required={required && !value}
          style={{
            width: "100%",
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: isLight ? "var(--ink-900, #0B1020)" : "var(--text-primary, #f8fafc)",
            fontFamily: isLight ? "var(--font-inter), sans-serif" : "var(--font-sans)",
            fontSize: isLight ? "13.5px" : "0.875rem",
            fontWeight: isLight ? 500 : 600,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />

        {value && value !== allOptionLabel && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: "none",
              border: "none",
              color: isLight ? "var(--slate-400, #94A3B8)" : "#94a3b8",
              cursor: "pointer",
              padding: "2px 4px",
              display: "flex",
              alignItems: "center",
              marginRight: "0.25rem",
            }}
            title="Clear selection"
          >
            <FaXmark style={{ fontSize: "0.8rem" }} />
          </button>
        )}

        <FaChevronDown
          style={{
            fontSize: "0.75rem",
            color: isLight ? "var(--slate-500, #4A5468)" : "var(--accent, #fbbf24)",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
            marginLeft: "0.4rem",
          }}
        />
      </div>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            maxHeight: "240px",
            overflowY: "auto",
            backgroundColor: isLight ? "#FFFFFF" : "#121215",
            border: isLight ? "1px solid var(--line-300, #CDD4E2)" : "1px solid rgba(251, 191, 36, 0.3)",
            borderRadius: isLight ? "var(--radius-md, 10px)" : "var(--radius-sm, 8px)",
            padding: "0.35rem",
            margin: 0,
            listStyle: "none",
            zIndex: 1050,
            boxShadow: isLight
              ? "0 10px 25px -5px rgba(11, 16, 32, 0.15), 0 8px 10px -6px rgba(11, 16, 32, 0.1)"
              : "0 12px 32px rgba(0, 0, 0, 0.7)",
          }}
        >
          {filteredOptions.length === 0 ? (
            <li
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.85rem",
                color: isLight ? "var(--slate-500, #4A5468)" : "#94a3b8",
                textAlign: "center",
              }}
            >
              No matching branch found
            </li>
          ) : (
            filteredOptions.map((branch) => {
              const isSelected = value === branch;
              return (
                <li
                  key={branch}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(branch)}
                  style={{
                    padding: isLight ? "0.55rem 0.85rem" : "0.6rem 0.85rem",
                    borderRadius: "6px",
                    fontSize: isLight ? "13px" : "0.85rem",
                    fontWeight: isSelected ? (isLight ? 600 : 700) : 500,
                    color: isLight
                      ? isSelected
                        ? "var(--blue-600, #1D39C4)"
                        : "var(--ink-900, #0B1020)"
                      : isSelected
                      ? "var(--accent, #fbbf24)"
                      : "var(--text-primary, #f8fafc)",
                    backgroundColor: isLight
                      ? isSelected
                        ? "var(--blue-50, #EEF2FF)"
                        : "transparent"
                      : isSelected
                      ? "rgba(251, 191, 36, 0.1)"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isLight
                        ? "var(--paper, #F7F8FB)"
                        : "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span>{branch}</span>
                  {isSelected && (
                    <FaCheck
                      style={{
                        fontSize: "0.75rem",
                        color: isLight ? "var(--blue-600, #1D39C4)" : "var(--accent, #fbbf24)",
                      }}
                    />
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
