"use client";

import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useDashboard } from "@/components/layout/DashboardContext";
import GlassCard from "@/components/cards/GlassCard";
import ActualForecastTimeline from "@/components/forecast/ActualForecastTimeline";
import WaterfallBridgeChart from "@/components/charts/WaterfallBridgeChart";
import { formatCurrency, formatPercentage } from "@/lib/calculations/formatters";
import { Info, GitCommit, ShieldCheck } from "lucide-react";

function MarginBridgeContent() {
  const { activePeriodData, selectedYear } = useDashboard();
  const metrics = activePeriodData.metrics.incomeStatement;

  return (
    <div className="space-y-6">
      {/* Timeline Selector */}
      <ActualForecastTimeline />

      {/* Waterfall Bridge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Waterfall Chart */}
        <div className="lg:col-span-8 flex flex-col">
          <GlassCard
            title="Revenue to Operating Income Waterfall Bridge"
            subtitle={`Floating step-bridge displaying margin segments for FY${selectedYear}`}
            className="h-full flex flex-col"
          >
            <WaterfallBridgeChart metrics={metrics} />
          </GlassCard>
        </div>

        {/* Detailed margins and disclosures */}
        <div className="lg:col-span-4 flex flex-col">
          <GlassCard
            title="Integrated Margin Diagnostics"
            subtitle="Calculated profitability ratios"
            className="h-full flex flex-col"
          >
            <div className="flex flex-col h-full pt-1 text-xs select-none">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span>Gross Profit Margin</span>
                    <span className="text-emerald-400 font-extrabold">{formatPercentage(metrics.grossMargin)}</span>
                  </div>
                  <div className="w-full bg-netflix-border/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${metrics.grossMargin * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span>Operating Income Margin</span>
                    <span className="text-netflix-red font-extrabold">{formatPercentage(metrics.operatingMargin)}</span>
                  </div>
                  <div className="w-full bg-netflix-border/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-netflix-red h-full rounded-full" style={{ width: `${metrics.operatingMargin * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span>Net Profit Margin</span>
                    <span className="text-purple-400 font-extrabold">{formatPercentage(metrics.netMargin)}</span>
                  </div>
                  <div className="w-full bg-netflix-border/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${metrics.netMargin * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-netflix-border/80 my-4" />

              <div className="flex-1 flex flex-col justify-between p-3.5 bg-black/40 border border-netflix-border/50 rounded-lg text-xs leading-relaxed text-[#A3A3A3]">
                <div>
                  <div className="flex items-center gap-1.5 text-netflix-red font-bold text-xs uppercase mb-2">
                    <Info className="w-4 h-4 text-netflix-red" />
                    Bridge Segment Guideline
                  </div>
                  <p className="text-[11px] text-[#A3A3A3] mb-3">
                    This step-bridge visualizes the progression from gross revenue to segment operating income. It highlights structural expense components and their margin impacts:
                  </p>
                  <ul className="space-y-2 text-[10.5px]">
                    <li className="flex items-start gap-1.5">
                      <span className="text-netflix-red font-bold select-none">•</span>
                      <span><strong className="text-[#F5F5F1]">Cost of Revenues:</strong> Represents content amortization and delivery outlays. Typically the largest cost component.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-netflix-red font-bold select-none">•</span>
                      <span><strong className="text-[#F5F5F1]">Marketing:</strong> Reflects subscriber acquisition efforts and brand campaigns worldwide.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-netflix-red font-bold select-none">•</span>
                      <span><strong className="text-[#F5F5F1]">Technology & Dev:</strong> Covers streaming infrastructure, personalization algorithms, and core engineering.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-netflix-red font-bold select-none">•</span>
                      <span><strong className="text-[#F5F5F1]">General & Admin:</strong> Encompasses administrative salaries, corporate overhead, and legal functions.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-3 pt-3 border-t border-netflix-border/30 text-[10px] text-[#666666] flex justify-between items-center">
                  <span>Computed as % of FY{selectedYear} revenue</span>
                  <span className="font-mono text-[#A3A3A3] font-bold">100% Reconciled</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Structured data table block */}
      <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block mt-4 select-none">
        Waterfall bridge segment disclosures (FY{selectedYear})
      </span>
      <GlassCard
        title="Waterfall Bridge Disclosures Table"
        subtitle="Values in USD Millions"
      >
        <div className="overflow-x-auto border border-netflix-border/50 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-black/40 text-[10px] uppercase font-bold text-[#666666] tracking-wider border-b border-netflix-border">
                <th className="p-3">Bridge Component</th>
                <th className="p-3">Calculation Flow</th>
                <th className="p-3 text-right">Value (Millions)</th>
                <th className="p-3 text-right">% of Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netflix-border/30 text-[#F5F5F1] font-medium">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-sans font-bold text-white uppercase tracking-wider">Gross Revenues</td>
                <td className="p-3 font-sans text-[#A3A3A3]">Starting Revenue Target Anchor</td>
                <td className="p-3 text-right text-emerald-400 font-extrabold">{formatCurrency(metrics.revenue, true)}</td>
                <td className="p-3 text-right">100.0%</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors text-rose-300">
                <td className="p-3 font-sans text-rose-400 font-semibold">- Cost of Revenues</td>
                <td className="p-3 font-sans text-[#A3A3A3]">Content Amortization & delivery outlays</td>
                <td className="p-3 text-right font-bold">-{formatCurrency(metrics.costOfRevenues, true)}</td>
                <td className="p-3 text-right">-{(metrics.costOfRevenues / metrics.revenue * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors bg-black/20">
                <td className="p-3 font-sans font-bold text-white uppercase tracking-wider">Gross Profit subtotal</td>
                <td className="p-3 font-sans text-[#A3A3A3]">Remaining gross profits for operating expense deployment</td>
                <td className="p-3 text-right font-extrabold text-white">{formatCurrency(metrics.grossProfit, true)}</td>
                <td className="p-3 text-right font-bold">{formatPercentage(metrics.grossMargin)}</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors text-rose-300">
                <td className="p-3 font-sans text-rose-400 font-semibold">- Marketing</td>
                <td className="p-3 font-sans text-[#A3A3A3]">Global member acquisition programs</td>
                <td className="p-3 text-right font-bold">-{formatCurrency(metrics.marketing, true)}</td>
                <td className="p-3 text-right">-{(metrics.marketing / metrics.revenue * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors text-rose-300">
                <td className="p-3 font-sans text-rose-400 font-semibold">- Technology & Development</td>
                <td className="p-3 font-sans text-[#A3A3A3]">Streaming infrastructure, algorithm & R&D costs</td>
                <td className="p-3 text-right font-bold">-{formatCurrency(metrics.technologyAndDevelopment, true)}</td>
                <td className="p-3 text-right">-{(metrics.technologyAndDevelopment / metrics.revenue * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors text-rose-300">
                <td className="p-3 font-sans text-rose-400 font-semibold">- General & Administrative Expenses</td>
                <td className="p-3 font-sans text-[#A3A3A3]">Back-office operations & legal outlays</td>
                <td className="p-3 text-right font-bold">-{formatCurrency(metrics.generalAndAdministrative, true)}</td>
                <td className="p-3 text-right">-{(metrics.generalAndAdministrative / metrics.revenue * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors bg-netflix-red/10 border-t border-netflix-red/30">
                <td className="p-3 font-sans font-bold text-netflix-red uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-netflix-red" />
                  Operating Income
                </td>
                <td className="p-3 font-sans text-[#A3A3A3] font-bold">Net segment operating profits</td>
                <td className="p-3 text-right text-netflix-red font-extrabold text-glow-red">{formatCurrency(metrics.operatingIncome, true)}</td>
                <td className="p-3 text-right font-extrabold text-netflix-red">{formatPercentage(metrics.operatingMargin)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

export default function MarginBridgePage() {
  return (
    <DashboardShell title="Margin Bridge & Waterfall Analysis">
      <MarginBridgeContent />
    </DashboardShell>
  );
}
