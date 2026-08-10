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
}: BranchSelectProps) {
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
          backgroundColor: "rgba(24, 24, 27, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: isOpen ? "1px solid var(--accent, #fbbf24)" : "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "var(--radius-sm, 8px)",
          padding: "0.6rem 0.85rem",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isOpen
            ? "0 0 0 3px rgba(251, 191, 36, 0.2), 0 8px 20px rgba(0, 0, 0, 0.4)"
            : "0 4px 12px rgba(0, 0, 0, 0.2)",
          opacity: disabled ? 0.6 : 1,
          minHeight: "42px",
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
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary, #f8fafc)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            fontWeight: 600,
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
              color: "#94a3b8",
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
            fontSize: "0.8rem",
            color: "var(--accent, #fbbf24)",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
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
            backgroundColor: "#121215",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            borderRadius: "var(--radius-sm, 8px)",
            padding: "0.35rem",
            margin: 0,
            listStyle: "none",
            zIndex: 1050,
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.7)",
          }}
        >
          {filteredOptions.length === 0 ? (
            <li
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.85rem",
                color: "#94a3b8",
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
                    padding: "0.6rem 0.85rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "var(--accent, #fbbf24)" : "var(--text-primary, #f8fafc)",
                    backgroundColor: isSelected ? "rgba(251, 191, 36, 0.1)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span>{branch}</span>
                  {isSelected && <FaCheck style={{ fontSize: "0.75rem", color: "var(--accent, #fbbf24)" }} />}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
