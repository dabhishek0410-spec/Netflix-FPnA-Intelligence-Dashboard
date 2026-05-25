"use client";

import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/cards/GlassCard";
import { 
  Star, 
  Database, 
  TrendingUp, 
  LineChart, 
  Sliders, 
  Code, 
  Activity, 
  ShieldCheck, 
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

export default function PortfolioSummaryPage() {
  const financeSkills = [
    {
      title: "FP&A, Modeling & Forecasting",
      desc: "Built a fully driver-based 5-year operating model (2026-2030) mapping subscription growth, ARPU, and tiered content spending. Models key scenarios (Base, Bear, Bull) with fully automated balance checks."
    },
    {
      title: "Regional Performance & Segment Reconciliations",
      desc: "Calculated regional growth premiums for UCAN, EMEA, LATAM, and APAC. Leveraged top-down allocations to dynamically reconcile segment totals with corporate numbers to a precise $0.00 discrepancy."
    },
    {
      title: "FX Translation & Constant Currency",
      desc: "Isolated real organic growth from currency volatility by calculating constant-currency translations vs. reported figures, modeling foreign exchange headwinds (e.g., historical FY2022 actual FX haircuts)."
    },
    {
      title: "Operating Leverage & Margin Bridges",
      desc: "Modeled corporate scaling behavior—capturing how high fixed content amortization creates operating leverage as subscriptions scale. Designed automated Waterfall Margin Bridges to explain profit deviations."
    }
  ];

  const quantitativeStack = [
    {
      name: "Python, Pandas & NumPy",
      icon: <Code className="w-5 h-5 text-netflix-red" />,
      subtitle: "Automated Data Ingestion & ETL",
      details: "Engineered robust ETL scripts (`run_pipeline.py`) that ingest raw SEC EDGAR actual filings, clean irregular quarters, parse multi-tiered segment data, and compound CAGR trajectories with vectorized speed."
    },
    {
      name: "Advanced SQL & DuckDB",
      icon: <Database className="w-5 h-5 text-netflix-red" />,
      subtitle: "Relational Querying & DB Auditing",
      details: "Designed local relational DB storage (`netflix_fpa.db`) and formulated complex analytical queries. Leveraged CTEs, window functions, and regional aggregation to build zero-discrepancy staging tables."
    },
    {
      name: "Scikit-Learn (Risk & Scenario Stressing)",
      icon: <Activity className="w-5 h-5 text-netflix-red" />,
      subtitle: "Statistical Risk & Scenario Modeling",
      details: "Utilized regression methodologies for predicting regional subscriber growth curves, sensitivity coefficient analysis, and quantifying worst-case Bear drawdown risks under macroeconomic stress."
    },
    {
      name: "Streamlit, Plotly & Matplotlib",
      icon: <Sliders className="w-5 h-5 text-netflix-red" />,
      subtitle: "Executive Visualization Prototyping",
      details: "Developed quantitative dashboard interfaces in Streamlit for fast prototyping. Deployed high-fidelity interactive scatterplots (Plotly) and executive-ready margin walks (Matplotlib) for visual reporting."
    }
  ];

  const businessValue = [
    { 
      capability: "Multi-Scenario Risk Assessment", 
      excelWay: "Static, slow manual copying across separate tabs", 
      thisEngine: "Sub-millisecond dynamic scenario re-calculations", 
      impact: "Instant stress-testing of margins and free cash flow cushions during live executive board reviews." 
    },
    { 
      capability: "Data Aggregation & Rounding Reconciliations", 
      excelWay: "Manual tracking of rounding errors across sheets", 
      thisEngine: "Algorithmic top-down allocation with absolute zero discrepancies", 
      impact: "Guarantees complete database integrity and automated internal audit consistency across all geographies." 
    },
    { 
      capability: "Shareholder Commentary & Variance Auditing", 
      excelWay: "Hours of manual writing by financial analysts after quarter end", 
      thisEngine: "Dynamic rule-based trigger engine compiling investor commentaries", 
      impact: "Accelerates investor relations response times by identifying variance anomalies and auto-formatting readouts." 
    }
  ];

  return (
    <DashboardShell title="Recruiter Portfolio Summary">
      <div className="space-y-8 max-w-5xl select-none">
        
        {/* Profile Card */}
        <GlassCard
          title={
            <div className="flex items-center gap-2 text-glow-red text-netflix-red text-base md:text-lg font-bold">
              <Star className="w-5 h-5 fill-current" />
              Financial Analyst & Data Systems Specialist
            </div>
          }
          subtitle="Corporate FP&A • Quantitative Modeling • Financial Risk Engineering"
          glowColor="rgba(229, 9, 20, 0.08)"
        >
          <div className="space-y-4 text-sm leading-relaxed text-[#A3A3A3]">
            <p>
              Welcome to the portfolio showcase for the <strong className="text-white">Netflix FP&A Intelligence Platform</strong>. 
              This workspace is designed to demonstrate an advanced corporate finance profile—bridging traditional 
              <strong className="text-white"> FP&A modeling</strong>, <strong className="text-white">forecast compounding</strong>, 
              and <strong className="text-white">segment variance analysis</strong> with a powerful modern quantitative toolkit: 
              <strong className="text-white"> Python, SQL, Streamlit, Scikit-learn, Plotly, Pandas, and NumPy</strong>.
            </p>
            <p>
              Instead of relying on fragile, slow Excel files that break under large datasets, this project illustrates how a modern 
              Financial Analyst can build fully automated data pipelines (from SEC filings to DuckDB), execute complex top-down reconciliations, 
              stress-test multi-scenario forecasts, and render interactive boardroom-ready dashboards.
            </p>
          </div>
        </GlassCard>

        {/* Quantitative Tech Stack */}
        <div>
          <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block mb-4">
            Quantitative Stack & Programming Grasp
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quantitativeStack.map((item, index) => (
              <GlassCard
                key={index}
                interactive
                title={
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    {item.icon}
                    {item.name}
                  </div>
                }
                subtitle={item.subtitle}
                glowColor="rgba(255, 255, 255, 0.01)"
              >
                <p className="text-xs text-[#A3A3A3] leading-relaxed mt-2">
                  {item.details}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* FP&A and Financial Analysis Competency */}
        <div>
          <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block mb-4">
            Financial Analysis & FP&A Mastery
          </span>
          <GlassCard
            title="Strategic Financial Competency Grid"
            subtitle="Core corporate finance frameworks implemented directly within this application."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
              {financeSkills.map((h, idx) => (
                <div key={idx} className="p-4 bg-black/40 border border-netflix-border/50 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-netflix-red flex-shrink-0" />
                    {h.title}
                  </div>
                  <p className="text-[#A3A3A3] leading-relaxed pl-5.5">{h.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Strategic Business Value / Excel Replacement */}
        <div>
          <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block mb-4">
            Legacy Excel vs. Modern Quantitative Dashboarding
          </span>
          <GlassCard
            title="Institutional Value Comparison"
            subtitle="Demonstrating how automated analytical systems elevate C-suite planning."
          >
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse text-[#A3A3A3]">
                <thead>
                  <tr className="border-b border-netflix-border/60 text-white uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Financial Capability</th>
                    <th className="py-3 px-4 text-netflix-red">Legacy Excel Approach</th>
                    <th className="py-3 px-4 text-green-500">This Quantitative System</th>
                    <th className="py-3 px-4">C-Suite / Strategic Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-netflix-border/30">
                  {businessValue.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold text-white">{row.capability}</td>
                      <td className="py-4 px-4 line-through decoration-netflix-red/60 text-netflix-red/80">{row.excelWay}</td>
                      <td className="py-4 px-4 text-green-400 font-semibold">{row.thisEngine}</td>
                      <td className="py-4 px-4 text-white/90">{row.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Final Disclaimer Banner */}
        <div className="p-4 bg-black/60 border border-netflix-border/50 rounded-lg text-center">
          <p className="text-[10px] text-[#666666] leading-relaxed uppercase tracking-wider">
            Educational Portfolio Project Only • Built to demonstrate quantitative finance, Python, SQL, and Streamlit expertise • Independent analysis, not endorsed by Netflix, Inc.
          </p>
        </div>

      </div>
    </DashboardShell>
  );
}
