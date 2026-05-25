"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/calculations/formatters";

interface RevenueTrendChartProps {
  historicalData: { year: number; revenue: number }[];
  forecastData: { year: number; revenue: number }[];
  activeYear?: number;
}

export default function RevenueTrendChart({
  historicalData,
  forecastData,
  activeYear,
}: RevenueTrendChartProps) {
  // Combine datasets for rendering. For continuity, the last historical point connects to the first forecast point.
  // 2025 actual: $44,111. Forecast starts in 2026.
  const chartData = [
    ...historicalData.map((d) => ({
      year: d.year,
      actual: d.revenue,
      forecast: null,
      isForecast: false,
    })),
    // Connect forecast line from 2025 actual
    {
      year: 2025,
      actual: null,
      forecast: historicalData[historicalData.length - 1]?.revenue || null,
      isForecast: true,
    },
    ...forecastData.map((d) => ({
      year: d.year,
      actual: null,
      forecast: d.revenue,
      isForecast: true,
    })),
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const val = data.actual !== null ? data.actual : data.forecast;
      const label = data.isForecast ? "Forecast" : "Actual";
      const isSelected = activeYear === data.year;

      return (
        <div className={`p-3 bg-[#141414] border rounded-lg shadow-xl backdrop-blur-md ${isSelected ? 'border-netflix-red' : 'border-netflix-border'}`}>
          <p className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-semibold">
            {data.year} — {label}
          </p>
          <p className="text-lg font-extrabold text-[#F5F5F1] mt-1">
            {formatCurrency(val, true)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 relative select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            {/* Gradient for Actuals */}
            <linearGradient id="actualGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E50914" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#E50914" stopOpacity={0.0} />
            </linearGradient>
            {/* Gradient for Forecast */}
            <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A3A3A3" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#A3A3A3" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="year"
            stroke="#666666"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
          />

          <YAxis
            stroke="#666666"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}B`}
            dx={-8}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />

          {/* Connect Actual Area */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#E50914"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#actualGlow)"
            dot={{ r: 4, stroke: "#E50914", strokeWidth: 1, fill: "#000" }}
            activeDot={{ r: 6, stroke: "#E50914", strokeWidth: 2, fill: "#E50914" }}
          />

          {/* Connect Forecast Area */}
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#A3A3A3"
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#forecastGlow)"
            dot={{ r: 3.5, stroke: "#A3A3A3", strokeWidth: 1, fill: "#000", strokeDasharray: "none" }}
            activeDot={{ r: 5, stroke: "#FFF", strokeWidth: 2, fill: "#A3A3A3" }}
          />

          {/* Demarcation line between Actuals & Forecast */}
          <ReferenceLine
            x={2025}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeDasharray="2 2"
            label={{
              value: "FORECAST TRANSITION",
              position: "top",
              fill: "#666",
              fontSize: 9,
              letterSpacing: 1,
              fontWeight: "bold",
            }}
          />

          {/* Active Highlight year */}
          {activeYear && (
            <ReferenceLine
              x={activeYear}
              stroke="#E50914"
              strokeOpacity={0.4}
              strokeWidth={1}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
