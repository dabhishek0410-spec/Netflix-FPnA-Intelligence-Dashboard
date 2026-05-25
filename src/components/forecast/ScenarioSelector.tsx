"use client";

import React from "react";
import { useDashboard } from "../layout/DashboardContext";
import { ScenarioType } from "@/types/forecast";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { formatPercentage } from "@/lib/calculations/formatters";
import { forecastAssumptions } from "@/lib/forecast-engine/scenarioAssumptions";
import GlassCard from "../cards/GlassCard";

export default function ScenarioSelector() {
  const { scenario, setScenario } = useDashboard();

  const scenarioMeta = {
    base: {
      title: "Base Case",
      description: "Standard operating projection aligned with current corporate guidance and street consensus.",
      revenueGrowth: "13% declining to 7%",
      operatingMargin: "33.5% (2030 Target)",
      fcfConversion: "22% of revenue",
      drivers: [
        "Sustained international sub acquisition",
        "Gradual ad-tier scaling and moderate password-sharing retention",
        "Controlled content opex margins",
      ],
      color: "border-neutral-500",
      accentColor: "text-neutral-200",
      glowColor: "rgba(255,255,255,0.03)",
      icon: TrendingUp,
    },
    bear: {
      title: "Bear Case",
      description: "Downside scenario modeling elevated international churn, ad-tier friction, and content cost inflation.",
      revenueGrowth: "12% declining to 4%",
      operatingMargin: "31.0% (2030 Target)",
      fcfConversion: "17% of revenue",
      drivers: [
        "Saturated domestic subscription levels and increased churn",
        "Ad-tier adoption friction and slow advertiser uptake",
        "Sticky production overheads and currency headwinds",
      ],
      color: "border-amber-500/40",
      accentColor: "text-amber-500",
      glowColor: "rgba(245,158,11,0.08)",
      icon: AlertTriangle,
    },
    bull: {
      title: "Bull Case",
      description: "Upside accelerator assuming rapid global ad-supported tier adoption and gaming/merchandising licensing growth.",
      revenueGrowth: "14% declining to 9%",
      operatingMargin: "36.5% (2030 Target)",
      fcfConversion: "24% of revenue",
      drivers: [
        "Rapid ad-tier conversions scaling CPMs globally",
        "Successful high-ticket IP licensing & gaming monetization",
        "Highly efficient slate amortization with rising ROI",
      ],
      color: "border-netflix-red/40",
      accentColor: "text-netflix-red",
      glowColor: "rgba(229,9,20,0.12)",
      icon: Sparkles,
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
      {(Object.keys(scenarioMeta) as ScenarioType[]).map((scenKey) => {
        const isSelected = scenario === scenKey;
        const meta = scenarioMeta[scenKey];
        const Icon = meta.icon;

        return (
          <GlassCard
            key={scenKey}
            interactive
            onClick={() => setScenario(scenKey)}
            className={`cursor-pointer transition-all border ${
              isSelected 
                ? `border-l-4 ${scenKey === 'bull' ? 'border-netflix-red border-l-netflix-red' : scenKey === 'bear' ? 'border-amber-500 border-l-amber-500' : 'border-white border-l-white'} bg-white/5` 
                : "border-netflix-border opacity-70 hover:opacity-100"
            }`}
            glowColor={isSelected ? meta.glowColor : undefined}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${meta.accentColor}`} />
                    <h4 className="font-extrabold text-white text-base tracking-tight">
                      {meta.title}
                    </h4>
                  </div>
                  {isSelected && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      scenKey === 'bull' 
                        ? 'bg-netflix-red/20 text-netflix-red' 
                        : scenKey === 'bear' 
                        ? 'bg-amber-500/20 text-amber-500' 
                        : 'bg-white/10 text-white'
                    }`}>
                      Active Scenario
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#A3A3A3] leading-relaxed mb-4">
                  {meta.description}
                </p>

                {/* Grid metrics */}
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-netflix-border/50 text-xs mb-4">
                  <div>
                    <span className="text-[#666666] block font-semibold">REV. CAGR RANGE</span>
                    <span className="font-bold text-[#F5F5F1] mt-0.5 block">{meta.revenueGrowth}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block font-semibold">OP. MARGIN (2030)</span>
                    <span className="font-bold text-[#F5F5F1] mt-0.5 block">{meta.operatingMargin}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#666666] block font-semibold">FCF CONVERSION</span>
                    <span className="font-bold text-[#F5F5F1] mt-0.5 block">{meta.fcfConversion}</span>
                  </div>
                </div>

                {/* Key drivers */}
                <div className="space-y-1.5">
                  <span className="text-[#666666] text-[10px] font-bold uppercase tracking-wider block">
                    Strategic Slate Drivers
                  </span>
                  {meta.drivers.map((driver, index) => (
                    <div key={index} className="flex items-start gap-2 text-[11px] text-[#A3A3A3] leading-relaxed">
                      <ArrowRight className={`w-3 h-3 mt-0.5 shrink-0 ${meta.accentColor}`} />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
