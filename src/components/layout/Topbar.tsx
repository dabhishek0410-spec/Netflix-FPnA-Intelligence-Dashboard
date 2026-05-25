"use client";

import React from "react";
import { useDashboard } from "./DashboardContext";
import { usePathname } from "next/navigation";
import { ScenarioType } from "@/types/forecast";
import { 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Layers
} from "lucide-react";

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title = "Corporate Intelligence Center" }: TopbarProps) {
  const pathname = usePathname();
  const { 
    scenario, 
    setScenario, 
    selectedYear, 
    setSelectedYear, 
    enableLlm, 
    setEnableLlm 
  } = useDashboard();

  const isFinancialTab = [
    "/executive",
    "/expenses",
    "/regions",
    "/margin-bridge",
    "/long-range-plan",
    "/growth-diagnostics",
    "/analyst-narrative"
  ].some(path => pathname === path || (path === "/executive" && pathname === "/"));


  const scenarios: { value: ScenarioType; label: string; icon: any; color: string }[] = [
    { value: "base", label: "Base Case", icon: TrendingUp, color: "text-[#F5F5F1]" },
    { value: "bear", label: "Bear Case", icon: TrendingDown, color: "text-amber-500" },
    { value: "bull", label: "Bull Case", icon: Sparkles, color: "text-[#E50914]" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2021 + i); // 2021-2030

  return (
    <header className="h-16 border-b border-netflix-border bg-[#0a0a0a]/90 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Page Title / Context */}
      <div>
        <h2 className="font-bold text-[#F5F5F1] text-lg tracking-tight flex items-center gap-2">
          {title}
        </h2>
      </div>

      {/* Global FP&A Controllers */}
      <div className="flex items-center gap-4">
        {/* Scenario Selector */}
        {isFinancialTab && (
          <div className="flex items-center bg-black/60 rounded-lg border border-netflix-border p-0.5">
            {scenarios.map((scen) => {
              const isSelected = scenario === scen.value;
              const Icon = scen.icon;
              return (
                <button
                  key={scen.value}
                  onClick={() => setScenario(scen.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                    isSelected 
                      ? "bg-netflix-red text-white shadow-lg text-glow-red" 
                      : "text-[#A3A3A3] hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{scen.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Year/Timeline selector */}
        {isFinancialTab && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#A3A3A3]" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="glass-input text-xs py-1.5 pr-8 font-semibold bg-black border-netflix-border hover:border-netflix-red cursor-pointer focus:ring"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-[#141414] text-white">
                  {y} {y >= 2026 ? "(Forecast)" : "(Actual)"}
                </option>
              ))}
            </select>
            {selectedYear >= 2026 ? (
              <span className="badge-forecast font-mono text-[10px]">Forecast</span>
            ) : (
              <span className="badge-actual font-mono text-[10px] animate-pulse">Actual</span>
            )}
          </div>
        )}

        {/* Separator */}
        {isFinancialTab && <div className="w-[1px] h-6 bg-netflix-border" />}

        {/* LLM Narrative Switch */}
        {isFinancialTab && (
          <button
            onClick={() => setEnableLlm(!enableLlm)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              enableLlm 
                ? "bg-gradient-to-r from-purple-900/40 to-netflix-red/30 border-purple-500 text-purple-200 text-glow-white shadow-md shadow-purple-500/10" 
                : "bg-black/60 border-netflix-border text-[#A3A3A3] hover:text-white hover:border-white/20"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${enableLlm ? "text-purple-400 animate-spin" : "text-[#A3A3A3]"}`} />
            <span>Generative AI Narrative</span>
          </button>
        )}
      </div>
    </header>
  );
}
