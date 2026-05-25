"use client";

import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useDashboard } from "@/components/layout/DashboardContext";
import GlassCard from "@/components/cards/GlassCard";
import ScenarioSelector from "@/components/forecast/ScenarioSelector";
import ForecastAssumptionsDrawer from "@/components/forecast/ForecastAssumptionsDrawer";
import ScenarioComparisonChart from "@/components/charts/ScenarioComparisonChart";
import SensitivityPanel from "@/components/forecast/SensitivityPanel";
import { formatCurrency, formatPercentage } from "@/lib/calculations/formatters";
import { Calendar, TrendingUp, DollarSign, Activity } from "lucide-react";

function LongRangePlanContent() {
  const { forecasts, historicalCorporate } = useDashboard();
  const [activeChartMetric, setActiveChartMetric] = useState<"revenue" | "operatingMargin">("revenue");

  // Compile datasets for scenario line overlays
  const chartDatasets = useMemo(() => {
    const years = [2025, 2026, 2027, 2028, 2029, 2030];
    const hist2025 = historicalCorporate.find((d) => d.year === 2025)!;

    const baseData = [
      { year: 2025, value: activeChartMetric === "revenue" ? hist2025.incomeStatement.revenue : hist2025.incomeStatement.operatingMargin },
      ...forecasts.base.periods.map((p: any) => ({
        year: p.year,
        value: activeChartMetric === "revenue" ? p.metrics.incomeStatement.revenue : p.metrics.incomeStatement.operatingMargin,
      })),
    ];

    const bearData = [
      { year: 2025, value: activeChartMetric === "revenue" ? hist2025.incomeStatement.revenue : hist2025.incomeStatement.operatingMargin },
      ...forecasts.bear.periods.map((p: any) => ({
        year: p.year,
        value: activeChartMetric === "revenue" ? p.metrics.incomeStatement.revenue : p.metrics.incomeStatement.operatingMargin,
      })),
    ];

    const bullData = [
      { year: 2025, value: activeChartMetric === "revenue" ? hist2025.incomeStatement.revenue : hist2025.incomeStatement.operatingMargin },
      ...forecasts.bull.periods.map((p: any) => ({
        year: p.year,
        value: activeChartMetric === "revenue" ? p.metrics.incomeStatement.revenue : p.metrics.incomeStatement.operatingMargin,
      })),
    ];

    return { baseData, bearData, bullData };
  }, [forecasts, historicalCorporate, activeChartMetric]);

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Scenario Cards Selection */}
      <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block select-none">
        Corporate Scenario Case Switcher
      </span>
      <ScenarioSelector />

      {/* 2. Assumptions matrix drawer */}
      <ForecastAssumptionsDrawer />

      {/* 3. Scenario Comparison Line chart */}
      <div className="grid grid-cols-1 gap-6">
        <GlassCard
          title="Integrated Scenario Case Projections (2025-2030)"
          subtitle="Compare Base, Bear, and Bull projections across major corporate parameters."
          headerAction={
            <div className="flex bg-black/60 rounded-lg p-0.5 border border-netflix-border text-xs font-semibold uppercase select-none">
              <button
                onClick={() => setActiveChartMetric("revenue")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeChartMetric === "revenue" 
                    ? "bg-netflix-red text-white text-glow-red" 
                    : "text-[#A3A3A3] hover:text-white"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveChartMetric("operatingMargin")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeChartMetric === "operatingMargin" 
                    ? "bg-netflix-red text-white text-glow-red" 
                    : "text-[#A3A3A3] hover:text-white"
                }`}
              >
                Operating Margin
              </button>
            </div>
          }
        >
          <ScenarioComparisonChart
            baseData={chartDatasets.baseData}
            bearData={chartDatasets.bearData}
            bullData={chartDatasets.bullData}
            metricLabel={activeChartMetric === "revenue" ? "Revenue" : "Operating Margin"}
            isCurrency={activeChartMetric === "revenue"}
          />
        </GlassCard>
      </div>

      {/* 4. CAGR Sensitivity Grids */}
      <div className="grid grid-cols-1 gap-6">
        <SensitivityPanel />
      </div>
    </div>
  );
}

export default function LongRangePlanPage() {
  return (
    <DashboardShell title="Long Range Plan Scenario Center">
      <LongRangePlanContent />
    </DashboardShell>
  );
}
