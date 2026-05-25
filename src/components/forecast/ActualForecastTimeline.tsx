"use client";

import React from "react";
import { useDashboard } from "../layout/DashboardContext";
import { motion } from "framer-motion";
import { Calendar, Play, FileCheck } from "lucide-react";

export default function ActualForecastTimeline() {
  const { selectedYear, setSelectedYear } = useDashboard();
  const years = Array.from({ length: 10 }, (_, i) => 2021 + i); // 2021-2030

  return (
    <div className="w-full bg-[#0a0a0a]/60 border border-netflix-border rounded-xl p-5 select-none relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-netflix-red" />
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#F5F5F1]">
            Fiscal Timeline & Projections Selector
          </h4>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1 text-netflix-red">
            <span className="w-2 h-2 rounded-full bg-netflix-red" />
            2021 - 2025 Actuals
          </span>
          <span className="flex items-center gap-1 text-[#A3A3A3]">
            <span className="w-2 h-2 rounded-full bg-[#A3A3A3] border border-dashed border-white/20" />
            2026 - 2030 Projections
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-between px-4 py-8">
        <div className="absolute left-6 right-6 h-[2px] bg-netflix-border z-0">
          <div 
            className="absolute left-0 h-full bg-netflix-red" 
            style={{ width: "44.4%" }}
          />
          <motion.div 
            className="absolute left-0 h-full bg-gradient-to-r from-netflix-red to-white opacity-20"
            animate={{ 
              width: `${((selectedYear - 2021) / 9) * 100}%` 
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />
        </div>

        {years.map((y) => {
          const isSelected = selectedYear === y;
          const isForecast = y >= 2026;
          
          return (
            <div 
              key={y} 
              className="flex flex-col items-center z-10 relative cursor-pointer group"
              onClick={() => setSelectedYear(y)}
            >
              <motion.div 
                className={`w-7 h-7 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all ${
                  isSelected 
                    ? isForecast 
                      ? "bg-[#F5F5F1] text-black border-[#F5F5F1]"
                      : "bg-netflix-red text-white border-netflix-red shadow-lg shadow-netflix-red/20"
                    : isForecast
                    ? "bg-black border-dashed border-white/25 text-[#A3A3A3] hover:border-white/50 hover:text-white"
                    : "bg-black border-netflix-red/40 text-netflix-red hover:border-netflix-red hover:text-white"
                }`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSelected ? (
                  isForecast ? <Play className="w-3.5 h-3.5 rotate-90 shrink-0 fill-current" /> : <FileCheck className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  y.toString().slice(-2)
                )}
              </motion.div>

              <span className={`text-[11px] font-bold mt-2.5 transition-colors font-sans ${
                isSelected 
                  ? isForecast 
                    ? "text-[#F5F5F1] scale-105" 
                    : "text-netflix-red scale-105"
                  : "text-[#666666] group-hover:text-white"
              }`}>
                {y}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
