"use client";

import React from "react";
import GlassCard from "./GlassCard";
import Sparkline from "../charts/Sparkline";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatPercentage } from "@/lib/calculations/formatters";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. 0.12 or -0.05
  changeLabel?: string; // e.g. "YoY" or "vs base"
  historicalData?: number[];
  isForecast?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  changeLabel = "YoY",
  historicalData = [],
  isForecast = false,
  interactive = true,
  className = "",
}: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <GlassCard 
      interactive={interactive} 
      className={`relative min-h-[128px] flex flex-col justify-between ${className}`}
      glowColor={isForecast ? "rgba(229, 9, 20, 0.07)" : "rgba(229, 9, 20, 0.18)"}
    >
      <div className="flex items-start justify-between">
        {/* Metric Label & Badge */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold flex items-center gap-1.5">
            {title}
            {isForecast && (
              <span className="text-[9px] uppercase tracking-normal border border-dashed border-white/20 text-[#A3A3A3] px-1 rounded-sm">
                FC
              </span>
            )}
          </span>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F5F5F1] text-glow-white mt-1">
            {value}
          </span>
        </div>

        {/* Mini Sparkline Visualization */}
        {historicalData.length > 0 && (
          <div className="pt-2">
            <Sparkline 
              data={historicalData} 
              strokeColor={isForecast ? "#A3A3A3" : "#E50914"}
              fillColor={isForecast ? "rgba(255, 255, 255, 0.03)" : "rgba(229, 9, 20, 0.04)"}
            />
          </div>
        )}
      </div>

      {/* Variance & Dynamic Metadata Row */}
      {change !== undefined && (
        <div className="flex items-center gap-2 mt-4 pt-2 border-t border-netflix-border/50 text-xs">
          <div 
            className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
              isPositive 
                ? "bg-emerald-500/10 text-emerald-400" 
                : isNegative 
                ? "bg-rose-500/10 text-rose-400" 
                : "bg-zinc-500/10 text-zinc-400"
            }`}
          >
            {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
            {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
            {isNeutral && <Minus className="w-3.5 h-3.5" />}
            <span>{formatPercentage(change, true)}</span>
          </div>
          <span className="text-[#666666] font-medium text-[11px]">{changeLabel}</span>
        </div>
      )}
    </GlassCard>
  );
}
