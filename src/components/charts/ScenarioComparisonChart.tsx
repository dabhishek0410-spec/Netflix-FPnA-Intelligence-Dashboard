"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatPercentage } from "@/lib/calculations/formatters";

interface ScenarioComparisonChartProps {
  baseData: { year: number; value: number }[];
  bearData: { year: number; value: number }[];
  bullData: { year: number; value: number }[];
  metricLabel: string;
  isCurrency?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      year: number;
      "Bull Case": number;
      "Base Case": number;
      "Bear Case": number;
    };
  }>;
  isCurrency: boolean;
}

const CustomTooltip = ({ active, payload, isCurrency }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatter = (val: number) => {
      return isCurrency ? formatCurrency(val, true) : formatPercentage(val);
    };
    return (
      <div className="p-4 bg-[#141414] border border-netflix-border rounded-lg shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[150px]">
        <p className="font-extrabold text-[#F5F5F1] text-sm border-b border-netflix-border/50 pb-1 mb-1.5">
          FY{data.year} Projections
        </p>
        <div className="flex items-center justify-between gap-4 text-[#E50914] font-bold">
          <span>Bull Case:</span>
          <span>{formatter(data["Bull Case"])}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[#F5F5F1] font-bold">
          <span>Base Case:</span>
          <span>{formatter(data["Base Case"])}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-amber-500 font-bold">
          <span>Bear Case:</span>
          <span>{formatter(data["Bear Case"])}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ScenarioComparisonChart({
  baseData,
  bearData,
  bullData,
  metricLabel,
  isCurrency = true,
}: ScenarioComparisonChartProps) {
  // Combine scenarios for Recharts
  const chartData = baseData.map((d, index) => {
    const bearVal = bearData[index]?.value || 0;
    const bullVal = bullData[index]?.value || 0;
    return {
      year: d.year,
      "Base Case": d.value,
      "Bear Case": bearVal,
      "Bull Case": bullVal,
    };
  });

  return (
    <div className="w-full h-80 relative select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
        >
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
            tickFormatter={(val) => isCurrency ? `$${(val / 1000).toFixed(0)}B` : `${(val * 100).toFixed(0)}%`}
            dx={-8}
          />

          <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />

          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
          />

          {/* Bull Scenario Line */}
          <Line
            type="monotone"
            dataKey="Bull Case"
            stroke="#E50914"
            strokeWidth={3}
            dot={{ r: 3.5, stroke: "#E50914", strokeWidth: 1, fill: "#000" }}
            activeDot={{ r: 6.5, stroke: "#E50914", strokeWidth: 2, fill: "#E50914" }}
          />

          {/* Base Scenario Line */}
          <Line
            type="monotone"
            dataKey="Base Case"
            stroke="#F5F5F1"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#F5F5F1", strokeWidth: 1, fill: "#000" }}
            activeDot={{ r: 5.5, stroke: "#FFF", strokeWidth: 2, fill: "#F5F5F1" }}
          />

          {/* Bear Scenario Line */}
          <Line
            type="monotone"
            dataKey="Bear Case"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#F59E0B", strokeWidth: 1, fill: "#000" }}
            activeDot={{ r: 5.5, stroke: "#FFF", strokeWidth: 2, fill: "#F59E0B" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
