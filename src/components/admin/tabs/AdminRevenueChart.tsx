"use client";

import { useState, useMemo } from "react";
import styles from "@/app/admin/admin.module.css";

interface AdminRevenueChartProps {
  dailySales: { date: string; key: string; revenue: number }[];
  maxRevenue: number;
  analyticsDateRange: "7days" | "30days" | "alltime";
}

export default function AdminRevenueChart({
  dailySales,
  maxRevenue,
  analyticsDateRange,
}: AdminRevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; revenue: number; x: number; y: number; index: number } | null>(null);

  // Chart configuration constants
  const svgWidth = 800;
  const svgHeight = 250;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const chartPoints = useMemo(() => {
    const totalPoints = dailySales.length;
    const divisor = totalPoints > 1 ? totalPoints - 1 : 1;
    return dailySales.map((d, idx) => {
      const x = paddingLeft + (idx / divisor) * chartWidth;
      const y = (svgHeight - paddingBottom) - (d.revenue / maxRevenue) * chartHeight;
      return { x, y, date: d.date, revenue: d.revenue, index: idx };
    });
  }, [dailySales, maxRevenue, chartWidth, chartHeight]);

  const linePath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    return `M ${chartPoints[0].x} ${chartPoints[0].y} ` + chartPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
  }, [chartPoints]);

  const areaPath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    const startX = chartPoints[0].x;
    const startY = svgHeight - paddingBottom;
    const endX = chartPoints[chartPoints.length - 1].x;
    const endY = svgHeight - paddingBottom;
    return `${linePath} L ${endX} ${endY} L ${startX} ${startY} Z`;
  }, [chartPoints, linePath]);

  return (
    <div className={styles.chartCard} style={{ gridColumn: "span 2", position: "relative" }}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>
          Revenue Trend ({analyticsDateRange === "7days" ? "Last 7 Days" : analyticsDateRange === "30days" ? "Last 30 Days" : "All Time"})
        </h3>
        {hoveredPoint && (
          <span className={styles.chartHoverValue}>
            {hoveredPoint.date}: <strong style={{ color: "var(--accent)" }}>₹{hoveredPoint.revenue}</strong>
          </span>
        )}
      </div>

      <div className={styles.chartWrapper} style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.33, 0.66, 1].map((ratio, index) => {
            const y = (svgHeight - paddingBottom) - ratio * chartHeight;
            const val = Math.round(maxRevenue * ratio);
            return (
              <g key={index}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="var(--text-secondary)"
                  fontSize="10"
                  textAnchor="end"
                >
                  ₹{val}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          {areaPath && (
            <path d={areaPath} fill="url(#chartGradient)" />
          )}

          {/* Chart Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dotted indicator line on hover */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingTop}
              x2={hoveredPoint.x}
              y2={svgHeight - paddingBottom}
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Interactive Circles */}
          {chartPoints.map((p) => {
            const isHovered = hoveredPoint?.index === p.index;
            return (
              <g key={p.index}>
                {/* Visible circle marker */}
                {p.revenue > 0 && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? "var(--accent)" : "var(--background)"}
                    stroke="var(--accent)"
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ transition: "all 0.15s ease" }}
                  />
                )}
                {/* Transparent touch/hover target */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {chartPoints.map((p, idx) => {
            const total = chartPoints.length;
            let show = false;
            if (total <= 7) {
              show = true;
            } else if (total <= 31) {
              show = idx % 5 === 0 || idx === total - 1;
            } else {
              show = idx % 10 === 0 || idx === total - 1;
            }

            if (show) {
              return (
                <text
                  key={idx}
                  x={p.x}
                  y={svgHeight - paddingBottom + 20}
                  fill="var(--text-secondary)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {p.date}
                </text>
              );
            }
            return null;
          })}
        </svg>

        {/* Inline HTML Tooltip */}
        {hoveredPoint && (
          <div
            className={styles.chartTooltip}
            style={{
              left: hoveredPoint.x - 65,
              top: hoveredPoint.y - 70,
              position: "absolute",
            }}
          >
            <div className={styles.tooltipDate}>{hoveredPoint.date}</div>
            <div className={styles.tooltipValue}>₹{hoveredPoint.revenue}</div>
          </div>
        )}
      </div>
    </div>
  );
}
