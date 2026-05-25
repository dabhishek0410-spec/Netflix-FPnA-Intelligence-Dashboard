"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ScenarioType } from "@/types/forecast";
import { generateAllForecasts } from "@/lib/forecast-engine/forecastOrchestrator";
import { historicalCorporateData, historicalRegionalData } from "@/lib/forecast-engine/historicalData";
import { generateRuleBasedInsights } from "@/lib/insight-engine/ruleBasedInsights";
import { CorporateMetrics } from "@/types/financial";
import { RegionalSplit } from "@/types/regions";
import { AnalystInsight } from "@/types/insights";

interface DashboardContextType {
  scenario: ScenarioType;
  setScenario: (s: ScenarioType) => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  enableLlm: boolean;
  setEnableLlm: (b: boolean) => void;
  forecasts: any; // Record<ScenarioType, ScenarioForecastResult>
  historicalCorporate: CorporateMetrics[];
  historicalRegional: RegionalSplit[];
  allInsights: AnalystInsight[];
  activePeriodData: {
    metrics: CorporateMetrics;
    regional: RegionalSplit;
    isForecast: boolean;
  };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioType>("base");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [enableLlm, setEnableLlm] = useState<boolean>(false);

  // Generate calculations once
  const [forecasts] = useState(() => generateAllForecasts());
  const historicalCorporate = historicalCorporateData;
  const historicalRegional = historicalRegionalData;

  // Generate insights based on actuals + forecasts
  const allInsights = React.useMemo(() => {
    return generateRuleBasedInsights(
      historicalCorporateData,
      historicalRegionalData,
      forecasts
    );
  }, [forecasts]);

  // Sync process.env and state
  useEffect(() => {
    if (enableLlm) {
      process.env.NEXT_PUBLIC_ENABLE_LLM_NARRATIVE = "true";
    } else {
      process.env.NEXT_PUBLIC_ENABLE_LLM_NARRATIVE = "false";
    }
  }, [enableLlm]);

  // Compute active data based on selectedYear
  const getActivePeriodData = () => {
    const isForecast = selectedYear >= 2026;
    if (isForecast) {
      const scenarioData = forecasts[scenario];
      const period = scenarioData.periods.find((p: any) => p.year === selectedYear);
      if (period) {
        return {
          metrics: period.metrics,
          regional: period.regionalMetrics,
          isForecast: true,
        };
      }
    }
    
    // Historical actuals
    const histCorp = historicalCorporate.find((d) => d.year === selectedYear) || historicalCorporate[historicalCorporate.length - 1];
    const histReg = historicalRegional.find((d) => d.year === selectedYear) || historicalRegional[historicalRegional.length - 1];
    return {
      metrics: histCorp,
      regional: histReg,
      isForecast: false,
    };
  };

  const activePeriodData = getActivePeriodData();

  return (
    <DashboardContext.Provider
      value={{
        scenario,
        setScenario,
        selectedYear,
        setSelectedYear,
        enableLlm,
        setEnableLlm,
        forecasts,
        historicalCorporate,
        historicalRegional,
        allInsights,
        activePeriodData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
