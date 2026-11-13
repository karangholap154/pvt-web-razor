"use client";

import React, { useRef } from "react";
import styles from "./UniversityChips.module.css";

export const UNIVERSITIES = [
  { code: "MU", name: "Mumbai University" },
  { code: "SPPU", name: "Pune University" },
  { code: "NU", name: "Nagpur University" },
  { code: "AU", name: "Amravati University" },
  { code: "DBATU", name: "Dr. BATU" },
  { code: "SUK", name: "Shivaji University" },
] as const;

export type UniversityCode = (typeof UNIVERSITIES)[number]["code"];

interface UniversityChipsProps {
  value: string;
  onChange: (university: string) => void;
  className?: string;
  allowClear?: boolean;
}

export function UniversityChips({
  value,
  onChange,
  className = "",
  allowClear = false,
}: UniversityChipsProps) {
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % UNIVERSITIES.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + UNIVERSITIES.length) % UNIVERSITIES.length;
    }

    if (nextIndex >= 0) {
      const nextUni = UNIVERSITIES[nextIndex].code;
      onChange(nextUni);
      chipRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Filter by university"
      className={`${styles.chipGroup} ${className}`.trim()}
    >
      {UNIVERSITIES.map((uni, idx) => {
        const isSelected = value === uni.code;
        return (
          <button
            key={uni.code}
            ref={(el) => {
              chipRefs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected || (!value && idx === 0) ? 0 : -1}
            title={uni.name}
            onClick={() => {
              if (allowClear && isSelected) {
                onChange("");
              } else {
                onChange(uni.code);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`${styles.chip} ${isSelected ? styles.selected : ""}`}
          >
            {uni.code}
          </button>
        );
      })}
    </div>
  );
}

export default UniversityChips;
