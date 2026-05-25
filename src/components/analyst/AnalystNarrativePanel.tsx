"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../layout/DashboardContext";
import { AnalystInsight } from "@/types/insights";
import { formatLLMNarrative } from "@/lib/insight-engine/llmNarrative";
import GlassCard from "../cards/GlassCard";
import TriggerProofCard from "./TriggerProofCard";
import { Sparkles, Terminal, FileText, CheckCircle2, ChevronRight, RefreshCcw } from "lucide-react";
import NarrativeModeToggle from "./NarrativeModeToggle";

export default function AnalystNarrativePanel() {
  const { allInsights, selectedYear, scenario, enableLlm } = useDashboard();
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [polishedNarratives, setPolishedNarratives] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter insights matching current period and active scenario
  const activeInsights = allInsights.filter((insight) => {
    // If the insight has a specific scenario, filter by it. If not (historical actuals), show it!
    const matchesScenario = !insight.scenario || insight.scenario === scenario;
    const matchesYear = insight.period.includes(selectedYear.toString()) || 
                       (selectedYear === 2030 && insight.period.includes("FY2026-FY2030"));
    return matchesScenario && matchesYear;
  });

  // Set default selected insight
  useEffect(() => {
    if (activeInsights.length > 0) {
      // Find the first insight or retain selection if valid
      const exists = activeInsights.find((d) => d.id === selectedInsightId);
      if (!exists) {
        setSelectedInsightId(activeInsights[0].id);
      }
    } else {
      setSelectedInsightId(null);
    }
  }, [selectedYear, scenario, activeInsights]);

  // Generate polished narratives when LLM is enabled
  useEffect(() => {
    let active = true;

    async function loadNarratives() {
      setIsLoading(true);
      const cache: Record<string, string> = {};
      for (const ins of activeInsights) {
        // Resolve async promise with active state override
        const text = await formatLLMNarrative(ins, enableLlm);
        cache[ins.id] = text;
      }
      if (active) {
        setPolishedNarratives(cache);
        setIsLoading(false);
      }
    }

    loadNarratives();

    return () => {
      active = false;
    };
  }, [enableLlm, selectedYear, scenario, allInsights]);

  const activeInsight = activeInsights.find((d) => d.id === selectedInsightId);

  return (
    <div className="space-y-6 select-none">
      {/* Mode controller panel */}
      <NarrativeModeToggle />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Insight List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block">
            Commentary Alerts for FY{selectedYear} ({activeInsights.length})
          </span>

          {activeInsights.length === 0 ? (
            <div className="p-8 bg-[#0a0a0a]/40 border border-dashed border-netflix-border rounded-xl text-center">
              <FileText className="w-8 h-8 text-[#666666] mx-auto mb-2.5" />
              <p className="text-xs text-[#A3A3A3] font-semibold">No operational rules triggered for this period.</p>
              <p className="text-[10px] text-[#666666] mt-1">Adjust timeline period or scenarios in the topbar header.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {activeInsights.map((ins) => {
                const isSelected = selectedInsightId === ins.id;
                return (
                  <div
                    key={ins.id}
                    onClick={() => setSelectedInsightId(ins.id)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-netflix-red/10 border-netflix-red text-white shadow shadow-netflix-red/10' 
                        : 'bg-black/60 border-netflix-border text-[#A3A3A3] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-[#666666] font-bold block">
                        {ins.id.split('_')[0]}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-[#666666] shrink-0 transition-transform ${isSelected ? 'rotate-90 text-netflix-red' : ''}`} />
                    </div>
                    <h5 className="font-extrabold text-xs tracking-tight mt-1 text-glow-white">
                      {ins.title}
                    </h5>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Narrative Detail */}
        <div className="lg:col-span-7 space-y-6">
          {activeInsight ? (
            <>
              {/* Detailed narrative review */}
              <GlassCard
                title={activeInsight.title}
                subtitle={`Insight Performance Analysis: Rule ${activeInsight.id.split('_')[0]}`}
              >
                <div className="space-y-5">
                  {/* Mode Display Box */}
                  <div className="p-4 bg-black/40 border border-netflix-border/50 rounded-lg relative overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2.5 border-b border-netflix-border/50 pb-2">
                      {enableLlm ? (
                        <>
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 font-extrabold">Generative Investor Commentary</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-netflix-red" />
                          <span className="text-netflix-red">Deterministic Financial Insight</span>
                        </>
                      )}
                    </div>

                    {/* Narrative body */}
                    {isLoading ? (
                      <div className="flex items-center gap-2 py-4 justify-center text-xs text-[#A3A3A3]">
                        <RefreshCcw className="w-4 h-4 animate-spin text-purple-500" />
                        <span>Polishing financial disclosures...</span>
                      </div>
                    ) : (
                      <div className="select-text">
                        {renderFormattedNarrative(
                          enableLlm 
                            ? polishedNarratives[activeInsight.id] || activeInsight.explanation
                            : activeInsight.explanation
                        )}
                      </div>
                    )}
                  </div>

                  {/* Operational driver */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-black/25 border border-netflix-border/30 rounded">
                      <span className="text-[#666666] font-semibold tracking-wide uppercase text-[9px] block">Operational Driver</span>
                      <p className="text-[#A3A3A3] mt-1 leading-normal">{activeInsight.driver}</p>
                    </div>
                    <div className="p-3 bg-black/25 border border-netflix-border/30 rounded">
                      <span className="text-[#666666] font-semibold tracking-wide uppercase text-[9px] block">Target Metric</span>
                      <p className="text-[#A3A3A3] mt-1 leading-normal font-bold text-white uppercase">{activeInsight.metric}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Trigger Math & Trace audit trail */}
              <TriggerProofCard insight={activeInsight} />
            </>
          ) : (
            <div className="p-12 bg-[#0a0a0a]/40 border border-dashed border-netflix-border rounded-xl text-center flex flex-col justify-center min-h-[300px]">
              <FileText className="w-10 h-10 text-[#666666] mx-auto mb-3" />
              <p className="text-sm text-[#A3A3A3] font-semibold">Select an alert item from the left pane to audit its calculations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Structured Point-wise Markdown Parser for Corporate Disclosures
function renderFormattedNarrative(text: string) {
  if (!text) return null;
  
  // Split the text into sections by double newlines
  const sections = text.split("\n\n").filter(sec => sec.trim() !== "");
  
  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const cleanSection = section.trim();
        // Match standard bold headers using standard regex matching any chars/newlines safely
        const headerMatch = cleanSection.match(/^\*\*(Executive Readout|Operational Driver|Financial Flow-Through|Key Risk \/ Watch Item):\*\*([\s\S]*)$/);
        
        if (headerMatch) {
          const header = headerMatch[1];
          const content = headerMatch[2].trim();
          
          return (
            <div key={idx} className="pl-3.5 border-l border-netflix-red/35 py-0.5 space-y-1">
              <span className="text-netflix-red text-[9px] font-extrabold uppercase tracking-widest block">
                • {header}
              </span>
              <p className="text-[#F5F5F1] text-xs leading-relaxed font-sans">
                {parseInlineBold(content)}
              </p>
            </div>
          );
        }
        
        // Muted fallback paragraph for standard descriptions
        return (
          <p key={idx} className="text-[#A3A3A3] text-xs leading-relaxed font-sans pl-3.5">
            {parseInlineBold(cleanSection)}
          </p>
        );
      })}
    </div>
  );
}

// Safe Inline Markdown bold helper wrapping (**text**) in styled elements
function parseInlineBold(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // Every odd part represents a bold metric/fact
      return (
        <strong key={i} className="font-extrabold text-white text-[12px]">
          {part}
        </strong>
      );
    }
    return part;
  });
}
