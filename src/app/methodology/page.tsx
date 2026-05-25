"use client";

import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/cards/GlassCard";
import { BookOpen, Table, Info, AlertTriangle, ShieldCheck, FileText } from "lucide-react";

export default function MethodologyPage() {
  const rules = [
    { rule: "Rule 1: Positive Operating Leverage", math: "OpInc Growth > Revenue Growth", desc: "Verifies that net operating profits scale faster than top-line revenues, confirming cost scale leverage." },
    { rule: "Rule 2: Expense Margin Drag Warning", math: "Total Expense Growth > Revenue Growth + 5 pp", desc: "Flags severe cost outlays or sticky production structures causing margin contractions under bear cases." },
    { rule: "Rule 3: Regional Growth Outperformance", math: "Region Growth > Corporate Growth + 3 pp", desc: "Triggers on geopolitical segments outperforming standard averages due to high engagement or ad CPMs." },
    { rule: "Rule 4: Content Cost Margin Pressure", math: "Cost of Revenues % of Sales increases > 1 pp", desc: "Exposes content slate additions or licensing amortization outrunning immediate sub monetization." },
    { rule: "Rule 5: G&A Restructuring Friction", math: "G&A Growth > 25% YoY + Commentary Keywords", desc: "Flags extraordinary advisory, M&A integration, legal, or litigation provisioning events." },
    { rule: "Rule 6: Foreign Exchange Headwinds", math: "Reported vs Constant Currency difference > 2 pp", desc: "Models historical USD strengthening shocks depressing constant-currency billing scales." },
    { rule: "Rule 7: Long-Range Upside potential", math: "Bull Terminal Revenue > Base Terminal Revenue + 5%", desc: "Triggers on massive top-line expansion capabilities by 2030 via ad networks and IP licensing." },
    { rule: "Rule 8: Terminal Margin Downside risk", math: "Bear Terminal Margin < Base Terminal Margin - 200 bps", desc: "Exposes critical downside operating margin exposures under high subscriber churn assumptions." },
    { rule: "Rule 9: FCF Conversion Accelerator", math: "FCF Conversion of Revenue expansion > 300 bps", desc: "Signals massive cash-flow generativeness from slate capital efficiency shifts." },
    { rule: "Rule 10: Regional Growth Surcharge", math: "APAC + EMEA Growth Share > 50% of increment", desc: "Highlights mature domestic UCAN saturations making corporate scaling highly dependent on international slots." },
  ];

  return (
    <DashboardShell title="Mathematical Model & Methodology">
      <div className="space-y-6 max-w-5xl select-none">
        
        {/* 1. Core architecture overview */}
        <GlassCard
          title="Integrated 5-Year FP&A Model Architecture"
          subtitle="Mathematical formulation, slate assumptions, and forecasting engines."
        >
          <div className="space-y-4 text-xs leading-relaxed text-[#A3A3A3]">
            <p>
              The Netflix FP&A Intelligence Dashboard utilizes an integrated forecasting engine combining historical actuals (2021-2025) and five-year long-range plans (2026-2030). The model projects three core scenarios—<strong className="text-white">Base, Bear, and Bull Cases</strong>—under strict mathematical constraints.
            </p>
            <div className="p-3 bg-black/40 border border-netflix-border/50 rounded-lg font-mono text-[11px] text-white space-y-1">
              <div className="font-sans text-[10px] uppercase font-bold text-netflix-red mb-1">Core Compounding Projections</div>
              <div>Ending Revenue (t) = Revenue (2025) * Product(1 + growth_rate(i)) for i = 2026 to t</div>
              <div>Operating Income (t) = Revenue (t) * operating_margin_target(t)</div>
              <div>Free Cash Flow (t) = Revenue (t) * FCF_conversion(t)</div>
            </div>
            <p>
              Regional subscription scales and ARPUs compound dynamically. Geopolitical segments (UCAN, EMEA, LATAM, APAC) are loaded with specific localized premiums, allowing the model to project subscriber acquisition curves and ARPU monetization targets dynamically.
            </p>
          </div>
        </GlassCard>

        {/* 2. Structured rule verification listings */}
        <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block mt-4">
          Structured Analyst Narrative Trigger Audit Guide
        </span>
        <GlassCard
          title="10 Core Variance Audit Rules"
          subtitle="Quantitative algorithms driving automatic narrative alerts."
        >
          <div className="overflow-x-auto border border-netflix-border/50 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-black/40 text-[10px] uppercase font-bold text-[#666666] tracking-wider border-b border-netflix-border">
                  <th className="p-3">Rule Definition</th>
                  <th className="p-3">Mathematical Trigger</th>
                  <th className="p-3">Strategic Action Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-netflix-border/30 text-[#F5F5F1] font-medium">
                {rules.map((r, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-white font-bold">{r.rule}</td>
                    <td className="p-3 font-mono text-netflix-red text-[11px]">{r.math}</td>
                    <td className="p-3 text-[#A3A3A3] text-xs leading-normal">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* 3. Model limitations and considerations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard
            title="Model Assumptions & Limitations"
            subtitle="Boundary constraints on forward parameters"
          >
            <div className="space-y-3 text-xs leading-relaxed text-[#A3A3A3]">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">FX Currency Volatility</strong>
                  Projections assume constant exchange rates matching Q4 2025 constants. Heavy currency shocks will distort reported margins.
                </div>
              </div>
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Amortization Lag Curves</strong>
                  Content additions cash outlays are amortized over straight-line engagements. Sudden high-budget productions create margin lag profiles.
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 4. SEC Reference logs */}
          <GlassCard
            title="SEC / IR Reference Audit Log"
            subtitle="Verified source filings driving historical baseline figures."
          >
            <div className="space-y-3 text-xs font-mono select-text">
              <div className="flex justify-between py-1.5 border-b border-netflix-border/30">
                <span className="font-sans text-[#A3A3A3]">FY2021-FY2024 Actuals</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  SEC Form 10-K Audited
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-netflix-border/30">
                <span className="font-sans text-[#A3A3A3]">FY2025 Actuals Baseline</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Form 8-K Q4 Shareholder Report
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-sans text-[#A3A3A3]">Scenario Assumptions Matrix</span>
                <span className="font-bold text-netflix-red flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-netflix-red" />
                  Internal FP&A Model v3.2
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </DashboardShell>
  );
}
