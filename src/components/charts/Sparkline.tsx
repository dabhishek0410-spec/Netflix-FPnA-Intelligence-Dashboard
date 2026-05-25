"use client";

import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
}

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  strokeColor = "#E50914",
  strokeWidth = 2,
  fillColor = "rgba(229, 9, 20, 0.08)",
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <div className="w-[120px] h-[36px] bg-netflix-border/10 rounded" />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;

  // Compute points
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    // Invert Y axis for screen coordinates (0 is top)
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Path for shaded area under sparkline
  const areaD = `
    ${pathD}
    L ${points[points.length - 1].x.toFixed(1)} ${height}
    L ${points[0].x.toFixed(1)} ${height}
    Z
  `;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Area Shading */}
      {fillColor && (
        <path 
          d={areaD} 
          fill={fillColor} 
          stroke="none"
        />
      )}
      
      {/* Sparkline Path */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Endpoint Pulse Dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={2.5}
          fill={strokeColor}
          className="animate-pulse-glow"
        />
      )}
    </svg>
  );
}
