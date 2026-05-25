"use client";

import React from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatPercentage } from "@/lib/calculations/formatters";
import { historicalCorporateData } from "@/lib/forecast-engine/historicalData";


interface OperatingMarginChartProps {
  historicalData: { year: number; operatingMargin: number }[];
  forecasts: {
    base: { year: number; operatingMargin: number }[];
    bear: { year: number; operatingMargin: number }[];
    bull: { year: number; operatingMargin: number }[];
  };
  activeYear?: number;
}

export default function OperatingMarginChart({
  historicalData,
  forecasts,
  activeYear,
}: OperatingMarginChartProps) {
  // Build chart dataset
  // Let's create an entry for each year from 2021 to 2030
  const years = Array.from({ length: 10 }, (_, i) => 2021 + i);

  const chartData = years.map((year) => {
    const isForecast = year >= 2026;
    const hist = historicalData.find((d) => d.year === year);
    
    if (!isForecast) {
      const margin = hist?.operatingMargin || 0;
      return {
        year,
        margin,
        isForecast: false,
        range: [margin, margin], // No range in history
        base: null,
        bear: null,
        bull: null,
      };
    }

    // Forecast ranges
    const baseVal = forecasts.base.find((d) => d.year === year)?.operatingMargin || 0;
    const bearVal = forecasts.bear.find((d) => d.year === year)?.operatingMargin || 0;
    const bullVal = forecasts.bull.find((d) => d.year === year)?.operatingMargin || 0;

    // For year 2025, we want to anchor the range to 2025 actual margin (continuity)
    return {
      year,
      margin: null,
      isForecast: true,
      range: [bearVal, bullVal],
      base: baseVal,
      bear: bearVal,
      bull: bullVal,
    };
  });

  // Connect the range from 2025 actual
  const hist25Margin = historicalCorporateData.find((d) => d.year === 2025)?.incomeStatement.operatingMargin || 0;
  const idx25 = chartData.findIndex((d) => d.year === 2025);
  if (idx25 !== -1) {
    chartData[idx25].range = [hist25Margin, hist25Margin];
    // Also include a point for base/bear/bull at 2025 to draw line continuities
    chartData[idx25].base = hist25Margin;
    chartData[idx25].bear = hist25Margin;
    chartData[idx25].bull = hist25Margin;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isSelected = activeYear === data.year;

      return (
        <div className={`p-3 bg-[#141414] border rounded-lg shadow-xl backdrop-blur-md ${isSelected ? 'border-netflix-red' : 'border-netflix-border'}`}>
          <p className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-semibold">
            {data.year} — {data.isForecast ? "Scenario Target range" : "Historical Actual"}
          </p>
          
          {data.isForecast ? (
            <div className="mt-1.5 space-y-1 text-xs">
              <div className="flex items-center justify-between gap-6 text-[#E50914] font-bold">
                <span>Bull Case:</span>
                <span>{formatPercentage(data.bull)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-[#F5F5F1] font-bold">
                <span>Base Case:</span>
                <span>{formatPercentage(data.base)}</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-amber-500 font-bold">
                <span>Bear Case:</span>
                <span>{formatPercentage(data.bear)}</span>
              </div>
            </div>
          ) : (
            <p className="text-lg font-extrabold text-[#F5F5F1] mt-1">
              {formatPercentage(data.margin)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 relative select-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            {/* Shaded Scenario Bounds */}
            <linearGradient id="scenarioBoundsGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E50914" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#E50914" stopOpacity={0.01} />
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
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            dx={-8}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />

          {/* Shaded Area Range for scenarios (Bull to Bear bounds) */}
          <Area
            type="monotone"
            dataKey="range"
            stroke="none"
            fill="url(#scenarioBoundsGlow)"
            activeDot={false}
          />

          {/* Historical Operating Margin Line */}
          <Line
            type="monotone"
            dataKey="margin"
            stroke="#E50914"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#E50914", strokeWidth: 1, fill: "#000" }}
            activeDot={{ r: 6, stroke: "#E50914", strokeWidth: 2, fill: "#E50914" }}
          />

          {/* Base Forecast Line */}
          <Line
            type="monotone"
            dataKey="base"
            stroke="#F5F5F1"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, stroke: "#F5F5F1", strokeWidth: 1, fill: "#000" }}
            activeDot={{ r: 5, stroke: "#FFF", strokeWidth: 2, fill: "#F5F5F1" }}
          />

          {/* Bull Forecast Line */}
          <Line
            type="monotone"
            dataKey="bull"
            stroke="#E50914"
            strokeWidth={1.5}
            strokeDasharray="2 2"
            dot={false}
            activeDot={false}
          />

          {/* Bear Forecast Line */}
          <Line
            type="monotone"
            dataKey="bear"
            stroke="#D97706"
            strokeWidth={1.5}
            strokeDasharray="2 2"
            dot={false}
            activeDot={false}
          />

          <ReferenceLine
            x={2025}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeDasharray="2 2"
          />

          {activeYear && (
            <ReferenceLine
              x={activeYear}
              stroke="#E50914"
              strokeOpacity={0.4}
              strokeWidth={1}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
