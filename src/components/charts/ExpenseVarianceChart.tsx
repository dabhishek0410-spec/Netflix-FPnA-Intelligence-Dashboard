"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/calculations/formatters";
import { IncomeStatement } from "@/types/financial";

interface ExpenseVarianceChartProps {
  currentMetrics: IncomeStatement;
  priorMetrics: IncomeStatement;
  currentLabel: string; // e.g. "2026 (FC)"
  priorLabel: string; // e.g. "2025 (ACT)"
}

export default function ExpenseVarianceChart({
  currentMetrics,
  priorMetrics,
  currentLabel,
  priorLabel,
  height = "h-80",
}: ExpenseVarianceChartProps & { height?: string }) {
  // Map out opex categories
  const categories = [
    {
      key: "costOfRevenues",
      label: "Cost of Revenues",
      current: currentMetrics.costOfRevenues,
      prior: priorMetrics.costOfRevenues,
    },
    {
      key: "marketing",
      label: "Marketing",
      current: currentMetrics.marketing,
      prior: priorMetrics.marketing,
    },
    {
      key: "techDev",
      label: "Tech & Dev",
      current: currentMetrics.technologyAndDevelopment,
      prior: priorMetrics.technologyAndDevelopment,
    },
    {
      key: "ga",
      label: "G&A",
      current: currentMetrics.generalAndAdministrative,
      prior: priorMetrics.generalAndAdministrative,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pctChange = ((data.current - data.prior) / data.prior) * 100;
      return (
        <div className="p-3 bg-[#141414] border border-netflix-border rounded-lg shadow-xl backdrop-blur-md text-xs">
          <p className="font-extrabold text-[#F5F5F1] text-sm mb-2">{data.label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6 text-[#A3A3A3]">
              <span>{priorLabel}:</span>
              <span className="font-semibold text-white">{formatCurrency(data.prior, true)}</span>
            </div>
            <div className="flex items-center justify-between gap-6 text-netflix-red">
              <span>{currentLabel}:</span>
              <span className="font-semibold">{formatCurrency(data.current, true)}</span>
            </div>
            <div className="w-full h-[1px] bg-netflix-border my-1" />
            <div className="flex items-center justify-between gap-6 text-zinc-400">
              <span>YoY Change:</span>
              <span className={`font-semibold ${pctChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {pctChange > 0 ? "+" : ""}{pctChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${height} relative select-none`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categories}
          margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          barGap={6}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="label"
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
            tickFormatter={(val) => `$${(val / 1000).toFixed(1)}B`}
            dx={-8}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />

          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontWeight: 600, color: "#A3A3A3" }}
          />

          {/* Prior Year Bar */}
          <Bar
            name={priorLabel}
            dataKey="prior"
            fill="#404040"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />

          {/* Current Year Bar (Highlighted Netflix Red!) */}
          <Bar
            name={currentLabel}
            dataKey="current"
            fill="#E50914"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
