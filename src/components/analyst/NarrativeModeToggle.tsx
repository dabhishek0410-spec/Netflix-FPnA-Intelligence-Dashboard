"use client";

import React from "react";
import { useDashboard } from "../layout/DashboardContext";
import GlassCard from "../cards/GlassCard";
import { Sparkles, Terminal, ToggleLeft, ToggleRight } from "lucide-react";

export default function NarrativeModeToggle() {
  const { enableLlm, setEnableLlm } = useDashboard();

  return (
    <GlassCard 
      className={`border transition-all duration-300 ${enableLlm ? 'border-purple-500/30' : 'border-netflix-border'}`}
      glowColor={enableLlm ? "rgba(168,85,247,0.06)" : undefined}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 select-none">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${enableLlm ? 'bg-purple-900/20 text-purple-400' : 'bg-netflix-border/10 text-netflix-muted'}`}>
            <Sparkles className={`w-5.5 h-5.5 ${enableLlm ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
              Commentary Formatting Engine
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                enableLlm ? 'bg-purple-500/20 text-purple-300' : 'bg-[#141414] text-[#A3A3A3] border border-netflix-border'
              }`}>
                {enableLlm ? "Generative AI Mode" : "Rule-Based Alerts"}
              </span>
            </h4>
            <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed max-w-xl">
              Toggle between the standard mathematical structured variance alert trigger reports, or leverage the expert generative intelligence formatter which rewrites quantitative disclosures into SEC-ready executive summaries.
            </p>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setEnableLlm(!enableLlm)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
              enableLlm 
                ? "bg-purple-950/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/5 text-glow-white" 
                : "bg-black/40 border-netflix-border text-[#A3A3A3] hover:text-white hover:border-white/20"
            }`}
          >
            {enableLlm ? (
              <>
                <ToggleRight className="w-5 h-5 text-purple-400" />
                <span>AI Writer Active</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-netflix-muted" />
                <span>Activate AI Formatter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
