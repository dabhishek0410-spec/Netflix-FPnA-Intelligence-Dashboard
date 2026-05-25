"use client";

import React, { useState, useMemo } from "react";
import { generateSensitivityGrid } from "@/lib/forecast-engine/sensitivityAnalysis";
import { formatCurrency, formatPercentage } from "@/lib/calculations/formatters";
import GlassCard from "../cards/GlassCard";
import { Table, ToggleLeft, Activity, Info } from "lucide-react";

export default function SensitivityPanel() {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "fcf">("revenue");

  // Custom axes matching the prompt's matrix parameters
  const growthRates = [0.05, 0.07, 0.09, 0.11, 0.13, 0.15];
  const margins = [0.28, 0.30, 0.32, 0.34, 0.36];

  const sensitivityData = useMemo(() => {
    return generateSensitivityGrid(growthRates, margins);
  }, []);

  return (
    <GlassCard
      title="FY2030 Strategic Sensitivity Matrix"
      subtitle="Examine terminal performance outcomes under varying Revenue CAGR and Operating Margin targets."
      headerAction={
        <div className="flex bg-black/60 rounded-lg p-0.5 border border-netflix-border text-xs font-semibold uppercase">
          <button
            onClick={() => setActiveMetric("revenue")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeMetric === "revenue" 
                ? "bg-netflix-red text-white text-glow-red" 
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            2030 Revenue
          </button>
          <button
            onClick={() => setActiveMetric("fcf")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeMetric === "fcf" 
                ? "bg-netflix-red text-white text-glow-red" 
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            2030 FCF
          </button>
        </div>
      }
    >
      <div className="space-y-4 select-none">
        {/* Table representation */}
        <div className="overflow-x-auto border border-netflix-border/50 rounded-lg">
          <table className="w-full text-center border-collapse">
            <thead>
              {/* Header row for margins */}
              <tr className="bg-black/40 text-[10px] uppercase font-bold text-[#666666] tracking-wider border-b border-netflix-border">
                <th className="p-3 text-left font-sans text-xs text-[#A3A3A3]">
                  Revenue CAGR (Y) \ Margin (X)
                </th>
                {sensitivityData.operatingMarginAxis.map((margin) => (
                  <th key={margin} className="p-3 font-mono">
                    {formatPercentage(margin)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sensitivityData.grid.map((row, rIndex) => {
                const growthRate = sensitivityData.revenueGrowthAxis[rIndex];
                return (
                  <tr 
                    key={growthRate} 
                    className="border-b border-netflix-border/30 hover:bg-white/5 transition-colors font-mono text-xs"
                  >
                    {/* Y-axis header (Growth rate) */}
                    <td className="p-3 text-left font-sans font-bold text-[#A3A3A3] bg-black/20">
                      {formatPercentage(growthRate)}
                    </td>

                    {/* Sensitivity Cells */}
                    {row.map((cell, cIndex) => {
                      const displayVal = activeMetric === "revenue" 
                        ? cell.endingRevenue2030 
                        : cell.endingFCF2030;

                      // Highlight typical Consensus / Base Case intersections (e.g. Growth 9-11% and Margin 32-34%)
                      const isBaseConsensus = growthRate === 0.09 && cell.operatingMargin === 0.32;
                      const cellGlow = isBaseConsensus 
                        ? "border-2 border-netflix-red/60 bg-netflix-red/10 text-netflix-red text-glow-red font-extrabold"
                        : "text-[#F5F5F1] hover:text-white";

                      return (
                        <td 
                          key={cIndex} 
                          className={`p-3 transition-colors ${cellGlow}`}
                        >
                          {formatCurrency(displayVal, true)}
                          {isBaseConsensus && (
                            <span className="block text-[8px] uppercase tracking-normal font-sans font-bold mt-0.5 text-netflix-red">
                              Base Intersect
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend footnotes */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-black/40 border border-netflix-border/50 rounded-lg text-[10px] text-[#A3A3A3]">
          <div className="flex items-center gap-1.5 font-medium leading-relaxed">
            <Info className="w-3.5 h-3.5 text-netflix-red shrink-0" />
            <span>Figures display USD Millions. Base year (2025 Actual) revenue scales at CAGR compounded to terminal 2030. FCF computed using standard margin delta metrics.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-block w-3 h-3 border border-netflix-red/60 bg-netflix-red/10 rounded-sm" />
            <span className="font-semibold text-white">Base Intersect Guideline</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
