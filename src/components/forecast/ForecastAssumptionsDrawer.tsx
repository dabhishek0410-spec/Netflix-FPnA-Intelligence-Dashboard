"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout/DashboardContext";
import { formatPercentage } from "@/lib/calculations/formatters";
import { getScenarioAssumptions } from "@/lib/forecast-engine/scenarioAssumptions";
import { Sliders, ChevronDown, ChevronUp, Check, Globe, HelpCircle } from "lucide-react";
import GlassCard from "../cards/GlassCard";

export default function ForecastAssumptionsDrawer() {
  const { scenario } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);

  const assumptions = getScenarioAssumptions(scenario);
  const years = ["2026", "2027", "2028", "2029", "2030"];

  return (
    <GlassCard 
      className={`border transition-all duration-300 ${isOpen ? 'border-netflix-red/30' : 'border-netflix-border'}`}
      glowColor={isOpen ? "rgba(229, 9, 20, 0.05)" : undefined}
    >
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-netflix-red animate-pulse-glow" />
          <div>
            <h3 className="font-extrabold text-[#F5F5F1] text-base tracking-tight flex items-center gap-2">
              Model Assumption Matrix
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-netflix-red/10 text-netflix-red">
                {scenario} Case
              </span>
            </h3>
            <p className="text-xs text-[#A3A3A3] mt-0.5 font-medium leading-none">
              Click to {isOpen ? "collapse" : "expand"} the underlying financial model drivers and metrics.
            </p>
          </div>
        </div>
        <button className="text-[#A3A3A3] hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="mt-6 pt-5 border-t border-netflix-border/50 space-y-6 animate-cinematic-fade-in">
          {/* Yearly Projections Table */}
          <div>
            <span className="text-[#666666] text-xs font-bold uppercase tracking-wider mb-3 block">
              Yearly Dynamic Assumptions (2026-2030)
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-netflix-border/50 text-[#666666] font-bold uppercase tracking-wider">
                    <th className="py-2.5">Assumption Variable</th>
                    {years.map((y) => (
                      <th key={y} className="py-2.5 text-right font-mono">{y}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-netflix-border/30 text-[#F5F5F1] font-medium font-mono">
                  <tr>
                    <td className="py-3 font-sans text-xs text-[#A3A3A3] font-semibold">Revenue Growth YoY</td>
                    {years.map((y) => (
                      <td key={y} className="py-3 text-right text-glow-white">
                        {formatPercentage(assumptions.revenueGrowth[y] || 0)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-xs text-[#A3A3A3] font-semibold">Operating Margin target</td>
                    {years.map((y) => (
                      <td key={y} className="py-3 text-right text-emerald-400 font-bold">
                        {formatPercentage(assumptions.operatingMargin[y] || 0)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-xs text-[#A3A3A3] font-semibold">FCF Conversion (% of Revenue)</td>
                    {years.map((y) => (
                      <td key={y} className="py-3 text-right text-purple-400">
                        {formatPercentage(assumptions.fcfConversionOfRevenue[y] || 0)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional splits and premiums */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Regional premium split */}
            <div>
              <span className="text-[#666666] text-xs font-bold uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#A3A3A3]" />
                YoY Regional Growth Premiums (vs. Corp Average)
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(assumptions.regionalGrowthPremium).map(([reg, val]) => {
                  const premiumPercent = val * 100;
                  const isPositive = premiumPercent > 0;
                  const isNegative = premiumPercent < 0;
                  return (
                    <div key={reg} className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg flex justify-between items-center">
                      <span className="font-bold text-white tracking-wider">{reg}</span>
                      <span className={`font-mono font-bold ${
                        isPositive 
                          ? 'text-emerald-400' 
                          : isNegative 
                          ? 'text-rose-400' 
                          : 'text-[#A3A3A3]'
                      }`}>
                        {isPositive ? "+" : ""}{premiumPercent.toFixed(1)} pp
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note Panel */}
            <div className="p-4 bg-netflix-red/5 border border-netflix-red/15 rounded-lg text-xs leading-relaxed text-[#A3A3A3]">
              <span className="font-extrabold text-white block mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-netflix-red" />
                INTEGRATED AUDIT SYSTEM NOTE
              </span>
              These variables represent the exact strategic guidelines formulated by our Corporate Finance and Treasury slate partners.
              Activating a different scenario in the header immediately recalculates the five-year integrated financial model statements, free cash flow models, and regional premium outcomes.
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
