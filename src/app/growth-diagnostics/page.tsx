"use client";

import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useDashboard } from "@/components/layout/DashboardContext";
import GlassCard from "@/components/cards/GlassCard";
import ActualForecastTimeline from "@/components/forecast/ActualForecastTimeline";
import { 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  Zap,
  CheckCircle2
} from "lucide-react";

interface VolatilityItem {
  name: string;
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  color: string;
  glowColor: string;
  driver: string;
  icon: any;
}

interface RegionalVolatilityItem {
  region: "UCAN" | "EMEA" | "LATAM" | "APAC";
  fullName: string;
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  color: string;
  glowColor: string;
  driver: string;
}

interface BottleneckItem {
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
}

interface SolutionItem {
  title: string;
  targetMetric: string;
  difficulty: "Easy" | "Medium" | "Hard";
  roi: string;
  impactScore: number;
  brief: string;
}

interface RegionalDiagnosticData {
  problem: string;
  impact: string;
  severity: "High" | "Medium" | "Low";
  solutionTitle: string;
  targetMetric: string;
  roi: string;
  difficulty: "Easy" | "Medium" | "Hard";
  actionPlan: string;
}

// Highly comprehensive, reconciled year-by-year, region-by-region diagnostic dictionary
const getRegionalDiagnostics = (
  region: "UCAN" | "EMEA" | "LATAM" | "APAC",
  year: number,
  scenario: string,
  isForecast: boolean
): RegionalDiagnosticData => {
  const isBear = scenario === "bear";
  const isBull = scenario === "bull";

  if (!isForecast) {
    switch (year) {
      case 2021:
        if (region === "UCAN") {
          return {
            problem: "Post-Lockdown Saturation",
            impact: "Growth normalizes after pandemic hyper-growth, mature market domestic penetration ceiling is approaching.",
            severity: "Medium",
            solutionTitle: "Ad-Supported Plan Development",
            targetMetric: "Subscribers & Revenue",
            roi: "3.5x Multiplier",
            difficulty: "Hard",
            actionPlan: "Standardize a lower-tier ad-supported membership option to expand UCAN's total addressable subscriber pool."
          };
        } else if (region === "EMEA") {
          return {
            problem: "Pandemic Demand Easing",
            impact: "Post-COVID subscription run-rate slowing down across high-tier Western European hubs.",
            severity: "Medium",
            solutionTitle: "Slate Localization Expansion",
            targetMetric: "Subscribers & Margin",
            roi: "4.2x Multiplier",
            difficulty: "Medium",
            actionPlan: "Fund highly localized series (e.g. Lupin, Money Heist) to drive organic Western European market share gains."
          };
        } else if (region === "LATAM") {
          return {
            problem: "Macroeconomic Inflationary Shocks",
            impact: "Economic volatility in major countries (Argentina, Brazil) erodes subscriber discretionary wallet share.",
            severity: "Medium",
            solutionTitle: "Ultra-Low-Cost Mobile Tiers",
            targetMetric: "Subscriber Volume",
            roi: "2.8x Multiplier",
            difficulty: "Easy",
            actionPlan: "Deploy customized, mobile-only plans at a low cost to capture entry-level subscribers and maintain brand presence."
          };
        } else { // APAC
          return {
            problem: "Indian Market Monetization Barrier",
            impact: "High initial pricing friction; local competitor platforms undercutting Netflix pricing tiers by over 80%.",
            severity: "High",
            solutionTitle: "Strategic Price Restructuring (India)",
            targetMetric: "Subscriber Net Adds",
            roi: "5.4x Multiplier",
            difficulty: "Hard",
            actionPlan: "Slash basic subscription pricing by up to 60% in India to unlock massive volume and build ecosystem dominance."
          };
        }
      case 2022:
        if (region === "UCAN") {
          return {
            problem: "Household Password Sharing Leakage",
            impact: "Over 30M unmonetized co-viewers in UCAN stall paid membership additions, leading to the first UCAN segment drop.",
            severity: "High",
            solutionTitle: "Automated Paid Sharing Conversion",
            targetMetric: "Subscribers & ARPU",
            roi: "3.6x Multiplier",
            difficulty: "Medium",
            actionPlan: "Deploy active IP-geofencing location checks to convert unauthorized shared accounts into $7.99/mo add-ons."
          };
        } else if (region === "EMEA") {
          return {
            problem: "Euro & Sterling Devaluation Shocks",
            impact: "Severe currency translation swings erase over $600M in reported billing during financial consolidation.",
            severity: "High",
            solutionTitle: "Local Price Adjustments",
            targetMetric: "Revenue Yields",
            roi: "3.0x Multiplier",
            difficulty: "Easy",
            actionPlan: "Implement targeted local pricing increases to match dollar-equivalent yield margins across core UK and EU tiers."
          };
        } else if (region === "LATAM") {
          return {
            problem: "Argentine Peso Devaluation Collapse",
            impact: "Extremely high hyper-inflation erodes equivalent dollar-consolidated ARPU down by 40% YoY.",
            severity: "High",
            solutionTitle: "Dynamic Inflation-Linked Indexing",
            targetMetric: "ARPU Stability",
            roi: "2.4x Multiplier",
            difficulty: "Medium",
            actionPlan: "Automatically index local currency pricing tiers monthly based on central inflation reports to preserve dollar yield."
          };
        } else { // APAC
          return {
            problem: "Low-ARPU Subscription Volume Expansion",
            impact: "Hyper-volume subscriber scaling in South Asia, but low blended regional ARPU dilutes APAC average down.",
            severity: "Medium",
            solutionTitle: "Mobile-to-Standard Plan Upgrades",
            targetMetric: "Blended ARPU",
            roi: "3.2x Multiplier",
            difficulty: "Medium",
            actionPlan: "Execute highly personalized interactive in-app upgrade promotions to convert mobile-only accounts to standard plans."
          };
        }
      case 2023:
        if (region === "UCAN") {
          return {
            problem: "Hollywood Studio Production Delays",
            impact: "US screen labor disputes freeze Stranger Things and Wednesday production schedules, delaying release calendars.",
            severity: "High",
            solutionTitle: "Global Slate Import Strategy",
            targetMetric: "User Retention",
            roi: "3.8x Multiplier",
            difficulty: "Medium",
            actionPlan: "Fast-track and heavily promote dubbing and localization of high-quality international series to bridge content gaps."
          };
        } else if (region === "EMEA") {
          return {
            problem: "Complex Local Content Quota Demands",
            impact: "EU regulators require 30% investment in localized European slate, which erases traditional global scale leverage.",
            severity: "Medium",
            solutionTitle: "Pan-European Coproduction Syndications",
            targetMetric: "Operating Margins",
            roi: "4.2x Multiplier",
            difficulty: "Medium",
            actionPlan: "Partner with premier public European networks (Canal+, ZDF, BBC) to share production costs for high-end local slates."
          };
        } else if (region === "LATAM") {
          return {
            problem: "Unbanked automatic Renewal Friction",
            impact: "Lack of credit card and banking access in rural markets drives involuntary subscription billing failures.",
            severity: "High",
            solutionTitle: "Direct Carrier Billing Partnerships",
            targetMetric: "Churn Reduction",
            roi: "2.8x Multiplier",
            difficulty: "Easy",
            actionPlan: "Collaborate with telecom operators (Claro, Telefonica) to let subscribers pay via mobile airtime balances."
          };
        } else { // APAC
          return {
            problem: "High Local-Content Rights Bidding Wars",
            impact: "Rival domestic streamers and networks in Korea and Japan drive up localized premium drama licensing fees.",
            severity: "High",
            solutionTitle: "Equity-Based Studio Coproductions",
            targetMetric: "Content Amortization",
            roi: "4.0x Multiplier",
            difficulty: "Hard",
            actionPlan: "Provide upstream equity funding to elite local animation and drama studios to lock in long-term exclusive rights."
          };
        }
      case 2024:
        if (region === "UCAN") {
          return {
            problem: "Ad-Tier Inventory Sales Lag",
            impact: "Ad-supported subscription plan volume expands rapidly, but automated direct ad sales fill rates underperform.",
            severity: "Medium",
            solutionTitle: "Programmatic Automated Ad Trading",
            targetMetric: "Ad ARPU Yield",
            roi: "4.5x Multiplier",
            difficulty: "Medium",
            actionPlan: "Integrate premium programmatic real-time bidding systems to eliminate agency fees and automatically fill empty spots."
          };
        } else if (region === "EMEA") {
          return {
            problem: "Emerging Market Subscriber Churn",
            impact: "Rapid user acquisition in Eastern Europe and Turkey offset by high pricing sensitivity and high churn rate.",
            severity: "Medium",
            solutionTitle: "Local Digital Wallet Integrations",
            targetMetric: "Billing Stability",
            roi: "3.4x Multiplier",
            difficulty: "Easy",
            actionPlan: "Integrate popular regional payment tools (like Turkish wallets) to reduce automated billing renewal friction."
          };
        } else if (region === "LATAM") {
          return {
            problem: "Competitor Price Under-cutting",
            impact: "Local rival ad-tier plans in Mexico/Colombia launch cheap bundles, creating subscriber retention risk.",
            severity: "Medium",
            solutionTitle: "Localized Franchise Collaborations",
            targetMetric: "User Engagement",
            roi: "3.1x Multiplier",
            difficulty: "Medium",
            actionPlan: "Invest in niche high-ROI cultural novels and sports documentations that competitors cannot replicate."
          };
        } else { // APAC
          return {
            problem: "Japanese Slate Production Bottlenecks",
            impact: "Labor scarcity and regulatory shifts in Japanese animation studios extend production cycles of core slates.",
            severity: "Medium",
            solutionTitle: "Global Anime Out-Licensing Syndication",
            targetMetric: "Asset Efficiency",
            roi: "5.0x Multiplier",
            difficulty: "Hard",
            actionPlan: "Out-license select catalog anime properties to third-party broadcast channels, maximizing return on content assets."
          };
        }
      case 2025:
      default:
        if (region === "UCAN") {
          return {
            problem: "Mature Market Pricing Saturation",
            impact: "Core UCAN premium tier pricing hits $22.99 threshold limit, raising concerns over customer tier down-grades.",
            severity: "Medium",
            solutionTitle: "Live Broadcast Event Monopolisation",
            targetMetric: "Ad CPM Premium",
            roi: "5.8x Multiplier",
            difficulty: "Hard",
            actionPlan: "Integrate live entertainment rights (e.g. WWE Raw, Christmas NFL matches) to secure premium ad-CPM slots over $65."
          };
        } else if (region === "EMEA") {
          return {
            problem: "Slow Ad Plan Conversions in EU Core",
            impact: "Strict regional privacy requirements in Germany and France delay automatic ad-tier cookie-based bidding.",
            severity: "Medium",
            solutionTitle: "Consolidated European Ad Sales Desk",
            targetMetric: "Ad Sales Growth",
            roi: "3.6x Multiplier",
            difficulty: "Medium",
            actionPlan: "Form direct joint ad sales relationships with verified regional agency groups to bypass cookie restrictions."
          };
        } else if (region === "LATAM") {
          return {
            problem: "Cash payment System Processing Friction",
            impact: "Cash billing networks (OXXO, Boleto) hold subscription cash flows up by 7-14 days and levy high agency fees.",
            severity: "Medium",
            solutionTitle: "Instant Digital Payments (Pix/SPEI)",
            targetMetric: "Operating Cash Flow",
            roi: "4.0x Multiplier",
            difficulty: "Easy",
            actionPlan: "Fully integrate regional instant bank settlement systems to bypass retail agents, slashing payment delays."
          };
        } else { // APAC
          return {
            problem: "Southeast Asia Ad Monetization Lag",
            impact: "High volume net additions in ASEAN hubs offset by immature local digital video advertisement markets.",
            severity: "Medium",
            solutionTitle: "Regional Brand Sponsorship Deals",
            targetMetric: "Blended ARPU",
            roi: "3.5x Multiplier",
            difficulty: "Medium",
            actionPlan: "Transition mature APAC ad-free plans to hybrid models, driving high-impact local brand sponsorship campaigns."
          };
        }
    }
  } else {
    // Forecast years (2026 - 2030)
    if (isBear) {
      if (region === "UCAN") {
        return {
          problem: "Pricing Fatigue & Competitor Slate Bundles",
          impact: "Competitor streaming platform bundling forces Netflix to pause bi-annual price tier adjustments, depressing ARPU scaling.",
          severity: "High",
          solutionTitle: "Premium Interactive Tier Bundles",
          targetMetric: "ARPU & Margin",
          roi: "3.2x Multiplier",
          difficulty: "Easy",
          actionPlan: "Partner with gaming networks and interactive content creators to package high-end domestic membership tiers."
        };
      } else if (region === "EMEA") {
        return {
          problem: "Local Cost Inflation & Margin Squeeze",
          impact: "Localized European production slates carry high straight-line amortization without generating proportional subscriber gains.",
          severity: "High",
          solutionTitle: "Strict European Slate Budget Caps",
          targetMetric: "Operating Margins",
          roi: "4.8x Multiplier",
          difficulty: "Hard",
          actionPlan: "Limit development funding strictly to returning regional blockbuster series, suspending high-budget pilot approvals."
        };
      } else if (region === "LATAM") {
        return {
          problem: "Persistent Hyper-inflation Translation Loss",
          impact: "Consolidated LATAM revenue growth drags near zero due to continuous local currency collapses against a strong USD.",
          severity: "High",
          solutionTitle: "Targeted Local Pricing Indexed to USD",
          targetMetric: "Revenue Yields",
          roi: "2.4x Multiplier",
          difficulty: "Medium",
          actionPlan: "Index local subscriptions directly to live USD-pegged benchmark levels monthly, hedging translation downside."
        };
      } else { // APAC
        return {
          problem: "Competitor Bidding Squeeze on Talent",
          impact: "Local rival tech networks in Korea and Japan aggressively bid up top localized drama and anime creators, lifting cost of sales.",
          severity: "High",
          solutionTitle: "Multi-Year Studio Talent Exclusives",
          targetMetric: "Content Amortization",
          roi: "4.0x Multiplier",
          difficulty: "Hard",
          actionPlan: "Secure multi-year exclusive output contracts with top regional writers and animation houses to lock in fixed rates."
        };
      }
    } else if (isBull) {
      if (region === "UCAN") {
        return {
          problem: "Live Sports Broadcast Capacity Strain",
          impact: "Massive concurrent user viewership spikes during live NFL streams push server delivery and CDN cost higher.",
          severity: "Medium",
          solutionTitle: "Live NFL Match Spot Auctions",
          targetMetric: "Ad Revenue Sales",
          roi: "6.2x Multiplier",
          difficulty: "Easy",
          actionPlan: "Launch exclusive real-time programmatic ad slots during Christmas live NFL games, fetching premium CPMs above $70."
        };
      } else if (region === "EMEA") {
        return {
          problem: "Ad Slot Inventory Shortage in EU West",
          impact: "High advertiser demand for premium European ad placements exceeds available ad-supported tier catalog inventory.",
          severity: "Medium",
          solutionTitle: "Targeted Programmatic CPM Auctions",
          targetMetric: "ARPU Growth",
          roi: "5.5x Multiplier",
          difficulty: "Easy",
          actionPlan: "Leverage automated real-time ad slot auction structures to dynamically maximize yield on available spots."
        };
      } else if (region === "LATAM") {
        return {
          problem: "High Partner Commission Haircuts",
          impact: "Sustained reliance on telecom airtime billing partnerships carries high partner commission fees (up to 15%).",
          severity: "Low",
          solutionTitle: "Direct Digital Payment Conversions",
          targetMetric: "FCF Margins",
          roi: "3.2x Multiplier",
          difficulty: "Medium",
          actionPlan: "Incentivize direct billing sign-ups (via Pix/credit cards) by offering exclusive early-access perks or small discounts."
        };
      } else { // APAC
        return {
          problem: "Licensing Distribution Rule Friction",
          impact: "Varying regulatory rules across APAC hubs complicate rapid centralized catalog release schedules.",
          severity: "Medium",
          solutionTitle: "Regional Carrier Pre-install Deals",
          targetMetric: "Subscriber Vol",
          roi: "4.6x Multiplier",
          difficulty: "Medium",
          actionPlan: "Negotiate pre-installation and unified billing deals with leading telecom giants to bundle Netflix in premium tiers."
        };
      }
    } else {
      // Base Case
      if (region === "UCAN") {
        return {
          problem: "Organic Subscriber net adds plateau",
          impact: "UCAN paid subscriber net additions stall below 2% YoY, putting heavy pressure on ARPU adjustments to lift revenues.",
          severity: "Medium",
          solutionTitle: "Systematic bi-annual price updates",
          targetMetric: "Revenue Yields",
          roi: "4.0x Multiplier",
          difficulty: "Easy",
          actionPlan: "Apply moderate $1.50 USD bi-annual pricing tier increases on high-end premium plans, leveraging domestic loyalty."
        };
      } else if (region === "EMEA") {
        return {
          problem: "Moderate FX Translation Vulnerability",
          impact: "Fluctuations in the EUR and GBP create occasional translation headwinds on consolidated reported European billing.",
          severity: "Medium",
          solutionTitle: "Rolling FX Translation Forward Hedging",
          targetMetric: "Margin Stability",
          roi: "3.0x Multiplier",
          difficulty: "Medium",
          actionPlan: "Maintain rolling 12-month currency forward hedging overlays to smooth out European translation margins."
        };
      } else if (region === "LATAM") {
        return {
          problem: "Steady Operating Margin Stabilization Lag",
          impact: "Relatively high content production amortization rates continue to squeeze segment operating margins.",
          severity: "Medium",
          solutionTitle: "Production Capital Sharing Studio Models",
          targetMetric: "Operating Margin",
          roi: "3.5x Multiplier",
          difficulty: "Medium",
          actionPlan: "Build centralized regional production hubs in Mexico and Colombia to optimize cost and resource allocations."
        };
      } else { // APAC
        return {
          problem: "Rising Content Production Costs",
          impact: "Local language anime and drama content amortization escalates steadily to support global catalog libraries.",
          severity: "Medium",
          solutionTitle: "Regional IP Spinoffs & Licensing",
          targetMetric: "Asset Yields",
          roi: "4.5x Multiplier",
          difficulty: "Medium",
          actionPlan: "Leverage highly successful K-dramas and anime slates into merchandise, gaming, and local spinoff series."
        };
      }
    }
  }
};

function GrowthDiagnosticsContent() {
  const { scenario, selectedYear, activePeriodData } = useDashboard();
  const isForecast = activePeriodData.isForecast;

  const [activeSubTab, setActiveSubTab] = useState<"corporate" | "regional">("corporate");
  const [selectedRegion, setSelectedRegion] = useState<"UCAN" | "EMEA" | "LATAM" | "APAC">("UCAN");

  const isBear = scenario === "bear";
  const isBull = scenario === "bull";

  // Helper level calculator
  const getLevel = (score: number): "Low" | "Medium" | "High" | "Critical" => {
    if (score >= 8.0) return "Critical";
    if (score >= 6.0) return "High";
    if (score >= 4.0) return "Medium";
    return "Low";
  };

  const getColorClass = (level: string) => {
    if (level === "Critical") return "text-[#E50914] font-extrabold";
    if (level === "High") return "text-amber-500 font-extrabold";
    if (level === "Medium") return "text-purple-400 font-extrabold";
    return "text-emerald-400 font-extrabold";
  };

  const getGlow = (level: string) => {
    if (level === "Critical") return "rgba(229, 9, 20, 0.16)";
    if (level === "High") return "rgba(245, 158, 11, 0.12)";
    if (level === "Medium") return "rgba(168, 85, 247, 0.1)";
    return "rgba(16, 185, 129, 0.08)";
  };

  // =========================================================================
  // 1. Dynamic Corporate Volatility Scores (Fully Year-Granular)
  // =========================================================================
  const corporateVolatility = useMemo<VolatilityItem[]>(() => {
    let revScore = 3.0;
    let marginScore = 2.5;
    let arpuScore = 2.0;
    let fcfScore = 6.5;
    let subScore = 3.5;

    let revDriver = "Consistent rolling seasonal contract expansions.";
    let marginDriver = "Steady operating income margin scaling.";
    let arpuDriver = "Stable domestic UCAN subscription yield pricing.";
    let fcfDriver = "Marquee programming capital additions cycle spikes.";
    let subDriver = "Programmatic slate organic member acquisition.";

    if (!isForecast) {
      switch (selectedYear) {
        case 2021:
          revScore = 3.5; marginScore = 4.8; arpuScore = 2.5; fcfScore = 7.2; subScore = 8.5;
          revDriver = "Post-COVID subscription expansion tailwinds.";
          marginDriver = "Rapid initial margin scaling on catalog leverage.";
          arpuDriver = "International subscription scaling dilutes average yield.";
          fcfDriver = "Pandemic studio shutdowns temporarily defer production cash outlays.";
          subDriver = "Hyper-growth subscriber influx normalizes toward end of year.";
          break;
        case 2022:
          revScore = 7.8; marginScore = 9.1; arpuScore = 8.6; fcfScore = 6.8; subScore = 9.2;
          revDriver = "Depressed by 355 bps USD translation consolidated headwind.";
          marginDriver = "Operating margins drop from 20.9% to 17.8% on negative leverage.";
          arpuDriver = "Eroded by intense local currency translation consolidated swings.";
          fcfDriver = "Consolidated amortization outpaces cash slate investments.";
          subDriver = "Netflix prints first historical net membership decline.";
          break;
        case 2023:
          revScore = 4.2; marginScore = 8.4; arpuScore = 6.5; fcfScore = 9.8; subScore = 5.1;
          revDriver = "Steady top-line recovery driven by international monetization.";
          marginDriver = "Operating margin bounces back to 18.5% on content deferrals.";
          arpuDriver = "Average yields stabilized through mature market price hikes.";
          fcfDriver = "Hollywood labor strikes defer $4.2B cash outlays, inflating FCF conversion.";
          subDriver = "Paid sharing rollout converts password co-viewers into members.";
          break;
        case 2024:
          revScore = 3.6; marginScore = 3.8; arpuScore = 2.8; fcfScore = 7.5; subScore = 6.8;
          revDriver = "Consolidated revenue scales to $38.3B driven by ad-tier conversions.";
          marginDriver = "Operating margin scales up to 22.4% on high billing volume.";
          arpuDriver = "UCAN price adjustments lift consolidated average yield.";
          fcfDriver = "Post-strike production slate cash spend accelerates heavily.";
          subDriver = "Ongoing paid-sharing enforcement conversions continue.";
          break;
        case 2025:
          revScore = 3.0; marginScore = 2.5; arpuScore = 2.2; fcfScore = 5.8; subScore = 4.2;
          revDriver = "Revenue scaling reaches baseline target of $44.1B.";
          marginDriver = "Operating margins print at a highly competitive 24.5%.";
          arpuDriver = "Steady pricing yields across core international segments.";
          fcfDriver = "Normalized production slate cash additions convert to FCF.";
          subDriver = "Ad-supported subscription plan expands target addressable market.";
          break;
      }
    } else {
      const yrOffset = selectedYear - 2026;
      if (isBear) {
        revScore = Math.max(5.0, 6.5 - yrOffset * 0.3);
        marginScore = Math.min(9.5, 8.2 + yrOffset * 0.2);
        arpuScore = Math.min(8.0, 6.0 + yrOffset * 0.3);
        fcfScore = Math.max(6.0, 7.8 - yrOffset * 0.4);
        subScore = Math.min(9.0, 7.0 + yrOffset * 0.4);

        revDriver = "Decelerating subscription sales trajectories compress top-line.";
        marginDriver = "Operating margins contract as fixed library amortization commitments pinch.";
        arpuDriver = "FX headwinds combined with low-ARPU mix shifts depress yield.";
        fcfDriver = "Forced content spend limits buffer cash conversion rates.";
        subDriver = "Paid-membership additions stall due to market saturation.";
      } else if (isBull) {
        revScore = Math.max(3.0, 4.8 - yrOffset * 0.4);
        marginScore = Math.max(3.0, 4.5 - yrOffset * 0.3);
        arpuScore = Math.max(2.5, 4.0 - yrOffset * 0.3);
        fcfScore = Math.max(4.0, 5.5 - yrOffset * 0.3);
        subScore = Math.max(3.5, 5.8 - yrOffset * 0.4);

        revDriver = "Hyper-scaling global revenue growth premium allocations.";
        marginDriver = "Robust margin scaling driven by scalable ad networks.";
        arpuDriver = "Pricing power premium extracts maximum yield from mature hubs.";
        fcfDriver = "Extremely cash-generative slates drive capital recycling gains.";
        subDriver = "Marquee local language releases secure high membership wins.";
      } else {
        revScore = Math.max(1.5, 2.8 - yrOffset * 0.3);
        marginScore = Math.max(1.5, 2.2 - yrOffset * 0.2);
        arpuScore = Math.max(1.0, 2.0 - yrOffset * 0.2);
        fcfScore = Math.max(3.0, 4.5 - yrOffset * 0.3);
        subScore = Math.max(2.0, 3.2 - yrOffset * 0.3);

        revDriver = "Revenue scaling aligns perfectly with rolling baseline target.";
        marginDriver = "Operating margin scales steadily by +50 bps per year.";
        arpuDriver = "Stable yields managed through systematic pricing tier increments.";
        fcfDriver = "Consistent content capital additions match library amortization.";
        subDriver = "Moderate ad-supported tier expansion balances organic additions.";
      }
    }

    return [
      { name: "Revenue Scaling", score: revScore, level: getLevel(revScore), color: getColorClass(getLevel(revScore)), glowColor: getGlow(getLevel(revScore)), driver: revDriver, icon: DollarSign },
      { name: "Operating Margin", score: marginScore, level: getLevel(marginScore), color: getColorClass(getLevel(marginScore)), glowColor: getGlow(getLevel(marginScore)), driver: marginDriver, icon: Activity },
      { name: "Blended ARPU Yield", score: arpuScore, level: getLevel(arpuScore), color: getColorClass(getLevel(arpuScore)), glowColor: getGlow(getLevel(arpuScore)), driver: arpuDriver, icon: Globe },
      { name: "FCF Conversion", score: fcfScore, level: getLevel(fcfScore), color: getColorClass(getLevel(fcfScore)), glowColor: getGlow(getLevel(fcfScore)), driver: fcfDriver, icon: TrendingUp },
      { name: "Subscriber Net Adds", score: subScore, level: getLevel(subScore), color: getColorClass(getLevel(subScore)), glowColor: getGlow(getLevel(subScore)), driver: subDriver, icon: BarChart3 }
    ];
  }, [selectedYear, scenario, isForecast, isBear, isBull]);

  // =========================================================================
  // 2. Dynamic Regional Volatility Scores
  // =========================================================================
  const regionalVolatility = useMemo<RegionalVolatilityItem[]>(() => {
    let ucan = 2.0; let emea = 3.5; let latam = 5.5; let apac = 6.0;
    let ucanDr = "High mature market stability.";
    let emeaDr = "Stable growth balanced by European currency exposure.";
    let latamDr = "Macroeconomic currency swings and local pricing offsets.";
    let apacDr = "Hyper-volume scaling but low initial ARPU monetization.";

    const isBearCase = scenario === "bear";
    const isBullCase = scenario === "bull";

    if (!isForecast) {
      switch (selectedYear) {
        case 2021:
          ucan = 4.2; emea = 3.8; latam = 5.0; apac = 7.2;
          ucanDr = "Post-COVID subscription reach saturation starts.";
          emeaDr = "Consistent subscriber scaling across Western Europe.";
          latamDr = "Macroeconomic currency shifts erode segment billing.";
          apacDr = "Massive membership wins offset by heavy localized discount pricing.";
          break;
        case 2022:
          ucan = 6.8; emea = 8.2; latam = 7.5; apac = 8.1;
          ucanDr = "Prints net subscriber drops due to password sharing ceiling.";
          emeaDr = "EUR and GBP devaluation against a strong USD drives translation shocks.";
          latamDr = "Currency devaluations in Argentina/Brazil depress dollar conversion.";
          apacDr = "Strategic plan price reductions in India dilute average regional yield.";
          break;
        case 2023:
          ucan = 3.5; emea = 5.4; latam = 6.0; apac = 5.8;
          ucanDr = "Paid sharing rollout converts co-viewers to paying accounts.";
          emeaDr = "Euro recovery stabilizes consolidated regional revenues.";
          latamDr = "Automatic membership renewal friction from payment methods.";
          apacDr = "Squid Game and local slate releases bolster organic engagement.";
          break;
        case 2024:
          ucan = 2.2; emea = 4.0; latam = 5.2; apac = 4.6;
          ucanDr = "Stable pricing yield increases UCAN ARPU to $16.47.";
          emeaDr = "Ad-supported conversion scales ad inventory billing.";
          latamDr = "Moderate ARPU improvements through localized pricing plans.";
          apacDr = "Anime library out-licensing expands international syndications.";
          break;
        case 2025:
          ucan = 1.8; emea = 3.2; latam = 4.8; apac = 4.0;
          ucanDr = "UCAN ARPU yield climbs to $17.78 on systematic adjustments.";
          emeaDr = "Steady organic scaling across Central and Eastern Europe.";
          latamDr = "Normalized billing operations bypass payment friction.";
          apacDr = "Localized APAC slates draw high subscription net adds.";
          break;
      }
    } else {
      const yrOffset = selectedYear - 2026;
      if (isBearCase) {
        ucan = Math.min(5.0, 3.2 + yrOffset * 0.4);
        emea = Math.min(7.5, 5.0 + yrOffset * 0.5);
        latam = Math.min(8.5, 6.8 + yrOffset * 0.3);
        apac = Math.min(9.0, 7.2 + yrOffset * 0.4);

        ucanDr = "Pricing ceiling fatigue triggers high customer churn risks.";
        emeaDr = "Excessive non-English slate cost amortization compresses margin.";
        latamDr = "Macro currency devaluations compress dollar-consolidated yield.";
        apacDr = "Intense regional competitor bidding raises content licensing rates.";
      } else if (isBullCase) {
        ucan = Math.max(1.0, 1.8 - yrOffset * 0.2);
        emea = Math.max(2.0, 3.0 - yrOffset * 0.2);
        latam = Math.max(3.5, 4.8 - yrOffset * 0.3);
        apac = Math.max(3.0, 4.5 - yrOffset * 0.3);

        ucanDr = "Excellent ARPU yield stability under premium tier shifts.";
        emeaDr = "Robust programmatic adCPM revenue scaling.";
        latamDr = "Mobile billing partnerships expand automatic renewals.";
        apacDr = "Global syndication of anime slate generates cash.";
      } else {
        ucan = Math.max(1.2, 2.0 - yrOffset * 0.2);
        emea = Math.max(2.5, 3.4 - yrOffset * 0.2);
        latam = Math.max(4.0, 5.0 - yrOffset * 0.2);
        apac = Math.max(3.5, 4.2 - yrOffset * 0.2);

        ucanDr = "Stable billing performance with low organic subscriber variance.";
        emeaDr = "Gradual expansion in local ad-supported plan conversions.";
        latamDr = "Consistent performance with moderate regional growth premium.";
        apacDr = "Steady growth premium offsets local language content cost.";
      }
    }

    return [
      { region: "UCAN", fullName: "US & Canada (Domestic)", score: ucan, level: getLevel(ucan), color: getColorClass(getLevel(ucan)), glowColor: getGlow(getLevel(ucan)), driver: ucanDr },
      { region: "EMEA", fullName: "Europe, Mid-East, Africa", score: emea, level: getLevel(emea), color: getColorClass(getLevel(emea)), glowColor: getGlow(getLevel(emea)), driver: emeaDr },
      { region: "LATAM", fullName: "Latin America (LATAM)", score: latam, level: getLevel(latam), color: getColorClass(getLevel(latam)), glowColor: getGlow(getLevel(latam)), driver: latamDr },
      { region: "APAC", fullName: "Asia-Pacific (APAC)", score: apac, level: getLevel(apac), color: getColorClass(getLevel(apac)), glowColor: getGlow(getLevel(apac)), driver: apacDr }
    ];
  }, [selectedYear, scenario, isForecast, isBear, isBull]);

  // =========================================================================
  // 3. Dynamic Corporate Bottlenecks (Problem Logs) fully granular by year
  // =========================================================================
  const corporateBottlenecks = useMemo<BottleneckItem[]>(() => {
    if (!isForecast) {
      switch (selectedYear) {
        case 2021:
          return [
            { title: "Post-COVID Demand Normalisation", description: "Hyper-growth subscription net additions pull-forward from pandemic lockdowns began to cool, creating tough YoY comparison baseline targets.", severity: "Medium" },
            { title: "Escalating Content Capital Commitments", description: "Cash additions for content slate productions scaled to $17.7B, outstripping straight-line amortization rates and compressing operating margins.", severity: "Medium" }
          ];
        case 2022:
          return [
            { title: "Consolidated FX Translation Shock", description: "A highly aggressive USD rally generated a 355 bps translation haircut, eroding over $1.1B in reported consolidated international revenues.", severity: "High" },
            { title: "First Paid-Membership Contraction", description: "Household password sharing leakage combined with pricing ceiling fatigue in UCAN to produce Netflix's first historical net subscriber decline.", severity: "High" },
            { title: "Negative Operating Leverage", description: "Operating margins compressed from 20.9% to 17.8% as library amortization fixed commitments outpaced decelerating top-line revenue flows.", severity: "High" }
          ];
        case 2023:
          return [
            { title: "Hollywood Studio Release Vacuum", description: "Industrial labor strikes delayed key US franchise production starts (e.g. Stranger Things), threatening catalog additions and subscriber retention.", severity: "High" },
            { title: "Premium Pricing Ceilings", description: "UCAN segment ARPU hit a threshold limit of $15.46, requiring new programmatic ad-tier plans or paid-sharing conversions to unlock further yield.", severity: "Medium" }
          ];
        case 2024:
          return [
            { title: "Post-Strike Production Cash Surge", description: "Deferred studio production cash additions ramped back up immediately, leading to a massive increase in capital expenditure outlays.", severity: "Medium" },
            { title: "Marketing Efficiency Drag", description: "Scale cost outlays for programmatic customer acquisition grew faster than net organic subscriber additions, diluting marketing margin leverage.", severity: "Low" }
          ];
        case 2025:
          return [
            { title: "Premium Customer Churn Risk", description: "Password sharing conversion benefits began to taper off, leaving organic regional slate localized releases as the primary source of volume growth.", severity: "Medium" },
            { title: "Ad-Supported Monetization Lag", description: "Ad-tier paid members scaled rapidly, but automated premium programmatic adCPM bidding networks scaled slower than linear TV ad decay rates.", severity: "Medium" }
          ];
      }
    } else {
      if (isBear) {
        switch (selectedYear) {
          case 2026:
            return [
              { title: "G&A Friction Spike (Rule 5 Trigger)", description: "Restructuring overhead and one-time litigation settlement outlays cause G&A costs to expand by over 25% YoY, depressing margin flow-through.", severity: "High" },
              { title: "Negative Operating Leverage Drag", description: "Sticky library straight-line amortization commitments combined with decel revenue growth drives net margins down immediately.", severity: "High" }
            ];
          case 2027:
            return [
              { title: "Severe Content Cost Pressure (Rule 4 Trigger)", description: "Cost of revenues % of sales expands by +92 bps YoY (rising to 49.5%), compressing consolidated gross margins.", severity: "High" },
              { title: "Sub-Optimal Expense Drag (Rule 2 Trigger)", description: "Total expenses grow by 8.77% YoY, pacing 77 bps faster than decelerating revenue growth of 8.00%.", severity: "High" }
            ];
          case 2028:
            return [
              { title: "Saturated Subscriber Net Adds Ceiling", description: "Paid member expansion drops to a critical low of 2.0% YoY as UCAN and EMEA subscription pools reach full saturation.", severity: "High" },
              { title: "Operating Deleverage Drag", description: "Fixed content amortization rates continue to squeeze corporate bottom-line net income as pricing power ceases.", severity: "High" }
            ];
          case 2029:
            return [
              { title: "Consolidated Revenue Deceleration", description: "YoY top-line revenue growth drops to a critical 5.0% as low-ARPU international conversions dilute UCAN's premium weight.", severity: "High" },
              { title: "Competitive Pricing Compression", description: "Rival bundle discounting forces Netflix to pause bi-annual pricing tier adjustments in mature zones, eroding ARPU.", severity: "Medium" }
            ];
          case 2030:
            return [
              { title: "Terminal Margin Downside Risk (Rule 8 Trigger)", description: "Consolidated terminal operating margin falls to 31.0%, which is a critical 250 bps below Base Case LRP guidelines.", severity: "High" },
              { title: "Structural FCF Conversion Decline", description: "Long-term cash conversion rate stagnates below 17.0% as high content capital outlay commitments persist.", severity: "Medium" }
            ];
        }
      } else if (isBull) {
        return [
          { title: "Hyper-growth Integration Friction", description: "Managing rapid ad network programmatic auctions and live-broadcast content infrastructure triggers moderate opex scaling.", severity: "Medium" },
          { title: "High Dependency on APAC/EMEA Sourcing", description: "Over 72% of consolidated growth relies on international segments, exposing Netflix to foreign currency volatility.", severity: "Medium" }
        ];
      } else {
        return [
          { title: "UCAN Volume Saturation Ceiling", description: "UCAN paid membership net additions plateau at ~2% YoY, requiring reliance on ARPU pricing hikes to drive sales.", severity: "Medium" },
          { title: "Slow Programmatic Ad CPM Scaling", description: "Ad-supported memberships scale successfully, but automated trading programmatic auction bids scale slower than linear TV ad decay.", severity: "Medium" }
        ];
      }
    }
    return [{ title: "General Saturation Risk", description: "UCAN subscription ceiling plateaus, requiring systematic ARPU yield adjustments.", severity: "Medium" }];
  }, [selectedYear, scenario, isForecast, isBear, isBull]);

  // =========================================================================
  // 4. Dynamic Corporate Solutions (Suggested Strategic Countermeasures)
  // =========================================================================
  const corporateSolutions = useMemo<SolutionItem[]>(() => {
    if (!isForecast) {
      return [
        { title: "Ad-Supported Subscription Plan (TAM Expansion)", targetMetric: "Subscribers & Revenue", difficulty: "Hard", roi: "3.5x Multiplier", impactScore: 9, brief: "Launch a lower-priced, ad-supported tier to lower friction for price-sensitive households, successfully expanding the global Addressable Market (TAM) post-pandemic." },
        { title: "Geographic Slate Localization Program", targetMetric: "Subscribers & Operating Margin", difficulty: "Medium", roi: "4.8x Multiplier", impactScore: 8, brief: "Shift production capital out of high-cost US studio features into local-language productions (e.g. Squid Game, K-dramas). Local slates carry up to 60% lower production cash additions while commanding massive global viewership." },
        { title: "Geopolitical Cash Flow Hedging Overlays", targetMetric: "ARPU & Revenue Stability", difficulty: "Medium", roi: "2.2x Multiplier", impactScore: 7, brief: "Deploy rolling FX forward contract derivative hedging portfolios to lock in EUR, JPY, and GBP translation rates, smoothing out translation haircuts during strong USD environments." }
      ];
    }

    if (isBear) {
      return [
        { title: "Rigid Slate Rationalization & Caps", targetMetric: "Operating Margin & Free Cash Flow", difficulty: "Hard", roi: "5.2x Multiplier", impactScore: 9, brief: "Impose a strict content cash investment ceiling, cutting annual content additions by 15%. Defer high-budget US features, expand third-party library syndication out-licensing, and focus purely on localized high-margin genre slates." },
        { title: "G&A Administrative Restructuring", targetMetric: "Operating Margin & G&A Expenses", difficulty: "Medium", roi: "3.4x Multiplier", impactScore: 8, brief: "Merge duplicate back-office operations across international hubs, freeze corporate G&A hiring, and consolidate localized marketing agencies to protect operating income flow-through." },
        { title: "Restrictive Co-Viewer Conversion (Phase 2)", targetMetric: "Subscribers & ARPU", difficulty: "Medium", roi: "2.8x Multiplier", impactScore: 8, brief: "Enforce tighter geofenced location checks and hardware IP reviews to capture residual non-paying household co-viewers, forcing conversion into add-on accounts." }
      ];
    }

    if (isBull) {
      return [
        { title: "Premium Marquee Event Ad-Auctions", targetMetric: "ARPU & Ad Revenue", difficulty: "Easy", roi: "5.8x Multiplier", impactScore: 9, brief: "Create exclusive real-time programmatic ad auctions for highly-anticipated live streaming events (e.g. live NFL, global franchise finales) to secure premium ad CPMs exceeding $65 USD." },
        { title: "Franchise IP Merchandising & Gaming", targetMetric: "ARPU & Sales", difficulty: "Medium", roi: "3.6x Multiplier", impactScore: 8, brief: "Monetize core localized franchises through retail merchandise agreements, localized games, and immersive pop-up theme parks (Netflix House), generating zero-marginal-cost revenue." },
        { title: "International Plan Restructuring", targetMetric: "ARPU & Revenue", difficulty: "Hard", roi: "4.2x Multiplier", impactScore: 8, brief: "Systematically adjust base subscription tiering in mature EMEA and LATAM zones, gradually phasing out legacy ad-free plans to force conversion to ad-supported plans or premium tiers." }
      ];
    }

    return [
      { title: "Bi-Annual Mature Market Pricing Hikes", targetMetric: "ARPU & Revenue", difficulty: "Easy", roi: "4.5x Multiplier", impactScore: 8, brief: "Implement systematic $1.00 USD bi-annual pricing tier increases in mature markets (UCAN) to extract pricing power premium from high-loyalty ad-free subscribers." },
      { title: "Programmatic Automated Ad CPM Trading Desk", targetMetric: "Ad Revenue & Sales", difficulty: "Medium", roi: "3.8x Multiplier", impactScore: 8, brief: "Build direct automated integrations with programmatic trading platforms to bypass agency fees, allowing immediate, real-time ad slot bidding and lifting blended ad ARPU yields." }
    ];
  }, [selectedYear, scenario, isForecast, isBear, isBull]);

  // Regions Configuration
  const regions: { key: "UCAN" | "EMEA" | "LATAM" | "APAC"; label: string; desc: string; flag: string }[] = [
    { key: "UCAN", label: "UCAN Segment", desc: "US & Canada (Domestic)", flag: "🇺🇸" },
    { key: "EMEA", label: "EMEA Segment", desc: "Europe, Mid-East, Africa", flag: "🇪🇺" },
    { key: "LATAM", label: "LATAM Segment", desc: "Latin America", flag: "🇧🇷" },
    { key: "APAC", label: "APAC Segment", desc: "Asia-Pacific", flag: "🇯🇵" }
  ];

  // Selected region specific items
  const activeVolItem = useMemo<RegionalVolatilityItem>(() => {
    return regionalVolatility.find(v => v.region === selectedRegion) || {
      region: selectedRegion,
      fullName: selectedRegion === "UCAN" ? "US & Canada (Domestic)" : selectedRegion === "EMEA" ? "Europe, Mid-East, Africa" : selectedRegion === "LATAM" ? "Latin America" : "Asia-Pacific",
      score: 5.0,
      level: "Medium",
      color: "text-purple-400 font-extrabold",
      glowColor: "rgba(168, 85, 247, 0.1)",
      driver: "Steady baseline growth trajectories."
    };
  }, [regionalVolatility, selectedRegion]);

  const activeDiagData = useMemo<RegionalDiagnosticData>(() => {
    return getRegionalDiagnostics(selectedRegion, selectedYear, scenario, isForecast);
  }, [selectedRegion, selectedYear, scenario, isForecast]);

  // SVG Radial Geometry Calculations
  const radius = 38;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useMemo(() => {
    return circumference - (activeVolItem.score / 10) * circumference;
  }, [activeVolItem.score, circumference]);

  const hexColor = useMemo(() => {
    const lvl = activeVolItem.level;
    if (lvl === "Critical") return "#E50914";
    if (lvl === "High") return "#F59E0B";
    if (lvl === "Medium") return "#A855F7";
    return "#10B981";
  }, [activeVolItem.level]);

  // 5. Portfolio Volatility Composite Score
  const corporateAvgVolatility = useMemo(() => {
    if (corporateVolatility.length === 0) return 0;
    const total = corporateVolatility.reduce((sum, item) => sum + item.score, 0);
    return total / corporateVolatility.length;
  }, [corporateVolatility]);

  const avgLevel = getLevel(corporateAvgVolatility);
  const avgColor = getColorClass(avgLevel);
  const avgGlow = getGlow(avgLevel);

  // 6. Dynamic Board Snapshot Statement
  const executiveSnapshot = useMemo(() => {
    if (!isForecast) {
      switch (selectedYear) {
        case 2021:
          return "FY2021 experienced robust post-pandemic volume additions, but underlying operational volatility highlights the critical need to diversify into lower-priced ad-supported tiers as domestic penetration ceilings approach.";
        case 2022:
          return "FY2022 marked a critical stabilization inflection point where intense foreign exchange translation headwinds and subscriber net contractions necessitated a structural transition toward paid-sharing monetization and pricing yield recovery.";
        case 2023:
          return "FY2023 demonstrated strong operating margin resilience and capital conservation, utilizing global slate diversification and password-sharing conversions to successfully counter domestic studio production delays.";
        case 2024:
          return "FY2024 reflects highly disciplined scaling, with operating margins expanding to 22.4% as ad-supported memberships and paid sharing enforcement successfully restructured the aggregate monetization base.";
        case 2025:
          return "FY2025 exhibits a mature, high-yielding operating environment where stable content cash additions and programmatic ad-supported expansions successfully balanced UCAN volume plateaus.";
        default:
          return `FY${selectedYear} represents a stable operating baseline characterized by normalized subscriber acquisition costs and disciplined content amortization.`;
      }
    } else {
      if (isBear) {
        switch (selectedYear) {
          case 2026:
            return "FY2026 Bear Case projections warrant strict administrative overhead controls to mitigate the compounding margin dilution of negative operating leverage and elevated G&A restructuring friction.";
          case 2027:
            return "FY2027 Bear Case conditions indicate severe gross margin pressure driven by escalating localized content amortization outstripping sluggish top-line revenue additions.";
          case 2028:
            return "FY2028 Bear Case models present heightened operational risks as mature-market subscriber growth plateaus at two percent, demanding immediate slate rationalization and fixed cost restrictions.";
          case 2029:
            return "FY2029 Bear Case forecasts highlight extreme competitive pricing constraints, requiring a halt in mature-market price updates and a strategic transition toward preserving cash conversion cycles.";
          case 2030:
            return "FY2030 Bear Case terminal projections underscore structural downside risks, with operating margins contracting to thirty-one percent and demanding rigorous multi-year capital recycling reforms.";
          default:
            return `FY${selectedYear} Bear Case conditions necessitate strict cost-containment measures and defensive capital allocations across all core operational divisions.`;
        }
      } else if (isBull) {
        switch (selectedYear) {
          case 2026:
            return "FY2026 Bull Case projections outline exceptional operational momentum, where accelerated global revenue growth premiums and ad network efficiency maximize net margin flow-through.";
          case 2027:
            return "FY2027 Bull Case trajectory reflects highly lucrative monetization scaling, driven by robust programmatic CPM auctions and premium ad slot yield optimization.";
          case 2028:
            return "FY2028 Bull Case financials display superior capital generation, where high-impact global slate engagement models successfully expand cash conversion velocity.";
          case 2029:
            return "FY2029 Bull Case dynamics showcase immense pricing power and mature market yield gains, driving record operating leverage across UCAN and international hubs.";
          case 2030:
            return "FY2030 Bull Case terminal horizon indicates unprecedented scale efficiency, securing outstanding cash flows through live-broadcast monopolization and global licensing syndication.";
          default:
            return `FY${selectedYear} Bull Case projections display outstanding top-line scaling and structural operating leverage across all geographic segments.`;
        }
      } else {
        switch (selectedYear) {
          case 2026:
            return "FY2026 Base Case maintains a highly balanced operational trajectory, utilizing systematic pricing updates in mature zones to offset organic subscriber net additions plateaus.";
          case 2027:
            return "FY2027 Base Case demonstrates consistent scaling, with operating margins expanding steadily by fifty basis points annually via moderate ad-supported tier expansion.";
          case 2028:
            return "FY2028 Base Case showcases structural resilience, leveraging rolling foreign exchange hedging derivatives to buffer moderate translation headwinds in international billing.";
          case 2029:
            return "FY2029 Base Case models display healthy cash flow stabilization, where content capital additions reconcile precisely with long-term library amortization schedules.";
          case 2030:
            return "FY2030 Base Case terminal framework reinforces long-range plan guidelines, achieving healthy operating performance and sustained return on content investment.";
          default:
            return `FY${selectedYear} Base Case models represent a stable, consistent progression in line with Netflix's core long-range financial targets.`;
        }
      }
    }
  }, [selectedYear, scenario, isForecast, isBear, isBull]);

  return (
    <div className="space-y-6">
      {/* 1. Timeline Controls */}
      <ActualForecastTimeline />

      {/* 2. Sub-tab Navigation */}
      <div className="flex border-b border-netflix-border/50 pb-px select-none">
        <button
          onClick={() => setActiveSubTab("corporate")}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeSubTab === "corporate"
              ? "border-netflix-red text-white text-glow-red bg-netflix-red/5"
              : "border-transparent text-[#A3A3A3] hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Corporate Analysis</span>
        </button>
        <button
          onClick={() => setActiveSubTab("regional")}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeSubTab === "regional"
              ? "border-netflix-red text-white text-glow-red bg-netflix-red/5"
              : "border-transparent text-[#A3A3A3] hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Regional Analysis</span>
        </button>
      </div>

      {/* 3. Render Corporate Analysis Sub-Tab */}
      {activeSubTab === "corporate" && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Board Strategic Volatility Snapshot Banner */}
          <GlassCard
            className="border border-[#E50914]/30 bg-[#141414]/80 backdrop-blur-md relative overflow-hidden group shadow-[0_0_25px_rgba(229,9,20,0.06)]"
            glowColor="rgba(229, 9, 20, 0.08)"
          >
            {/* Cinematic background spotlight */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl bg-[#E50914]/5 pointer-events-none transition-all duration-700" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl bg-purple-600/3 opacity-30 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Composite Score Badge */}
              <div className="md:col-span-3 flex flex-col items-center justify-center text-center p-3 bg-black/45 border border-netflix-border/60 rounded-xl shrink-0 select-none">
                <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-[#666666] leading-none mb-2">
                  COMPOSITE PORTFOLIO VOLATILITY
                </span>
                <div className="flex items-baseline gap-1 mt-1 justify-center">
                  <span className={`text-4xl font-black tracking-tighter ${avgColor} drop-shadow-[0_0_8px_${avgGlow}] font-sans`}>
                    {corporateAvgVolatility.toFixed(1)}
                  </span>
                  <span className="text-[#666666] text-sm font-bold">/10</span>
                </div>
                <div className="mt-2">
                  <span className={`text-[8px] uppercase font-mono font-extrabold px-2 py-0.5 rounded border bg-black/50 border-netflix-border inline-block ${avgColor}`}>
                    {avgLevel} RISK INDEX
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic Board Snapshot Statement */}
              <div className="md:col-span-9 flex flex-col justify-center space-y-1.5 pl-0 md:pl-2">
                <div className="flex items-center gap-2 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                  <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-[#E50914]">
                    EXECUTIVE BOARD STRATEGIC SNAPSHOT (FY{selectedYear})
                  </span>
                  <span className="text-[#666666] text-[10px] font-semibold font-mono">
                    • {scenario.toUpperCase()} SCENARIO
                  </span>
                </div>
                <p className="text-xs md:text-[13px] leading-relaxed text-[#F5F5F1] font-medium font-sans text-justify select-text border-l-2 border-[#E50914] pl-3.5 py-1 bg-[#E50914]/2 rounded-r">
                  {executiveSnapshot}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Spotlight Corporate Metrics Volatility Grid */}
          <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block select-none">
            Corporate Metrics Volatility & Operational Sensitivity Scores (1-10) for FY{selectedYear}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {corporateVolatility.map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard
                  key={item.name}
                  className="border border-netflix-border/80 hover:border-white/10 transition-all duration-300 relative overflow-hidden group"
                  glowColor={item.glowColor}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666] select-none block">
                      {item.name}
                    </span>
                    <Icon className="w-4.5 h-4.5 text-[#666666] group-hover:text-white transition-colors" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className={`text-3xl font-extrabold tracking-tight ${item.color} drop-shadow-md font-sans`}>
                      {item.score.toFixed(1)}
                    </span>
                    <span className="text-[#666666] text-xs font-semibold select-none">/10</span>
                  </div>
                  <div className="mt-2.5">
                    <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border bg-black/40 border-netflix-border select-none inline-block ${item.color}`}>
                      {item.level} VOLATILITY
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-[#A3A3A3] mt-3 font-sans line-clamp-3 select-text">
                    {item.driver}
                  </p>
                </GlassCard>
              );
            })}
          </div>

          {/* Corporate Bottlenecks & Solutions Splits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: Corporate Growth Bottlenecks */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block select-none">
                Diagnosed Growth Bottlenecks & Operational Problems
              </span>
              <GlassCard
                title={`Corporate Diagnostics: FY${selectedYear}`}
                subtitle={`Risk Identification • Scenario: ${scenario.toUpperCase()}`}
              >
                <div className="space-y-4">
                  {corporateBottlenecks.length === 0 ? (
                     <div className="p-8 text-center text-xs text-[#666666] select-none">
                       No corporate bottlenecks diagnosed for this planning period.
                     </div>
                  ) : (
                    corporateBottlenecks.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 bg-black/40 border-l-2 border-netflix-red border-y border-r border-netflix-border/50 rounded-r-lg space-y-1.5"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <h5 className="font-extrabold text-xs text-[#F5F5F1] tracking-tight">
                            {item.title}
                          </h5>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                            item.severity === "High" ? "bg-red-500/10 text-red-400 border border-red-500/25" :
                            item.severity === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" :
                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                          }`}>
                            {item.severity} severity
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[#A3A3A3] font-sans text-justify select-text">
                          {item.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Card: Corporate Strategic Solutions */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block select-none">
                Suggested Strategic Solutions & Actionable Countermeasures
              </span>
              <GlassCard
                title="Corporate Analyst Strategic Solutions brief"
                subtitle="Actionable corporate strategies to improve scaling, expenses, and asset allocations."
              >
                <div className="space-y-4.5">
                  {corporateSolutions.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-black/30 border border-netflix-border/80 hover:border-white/15 transition-all rounded-lg space-y-3 relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/2 to-purple-500/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg -z-10" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-netflix-border/50 pb-2.5">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#E50914] font-extrabold font-mono block">
                            Target Metric: {item.targetMetric}
                          </span>
                          <h4 className="font-extrabold text-xs text-white tracking-tight mt-0.5">
                            {item.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-purple-500/25 bg-purple-950/10 text-purple-300">
                            ROI: {item.roi}
                          </span>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-netflix-border bg-black/40 text-[#A3A3A3] font-mono">
                            {item.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3.5 items-start">
                        <div className="shrink-0 w-10 h-10 rounded-full border border-netflix-red/30 bg-netflix-red/5 flex flex-col items-center justify-center relative select-none">
                          <span className="text-[8px] font-bold text-[#A3A3A3] leading-none">IMPACT</span>
                          <span className="text-xs font-extrabold text-white leading-none mt-0.5 font-mono">{item.impactScore}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-[#D4D4D4] text-justify select-text">
                          {item.brief}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* 4. Render Regional Analysis Sub-Tab */}
      {activeSubTab === "regional" && (
        <div className="space-y-6 animate-fade-in">
          {/* Section Header */}
          <div className="flex justify-between items-center select-none">
            <span className="text-[#666666] text-xs font-bold uppercase tracking-wider block">
              Audit Segment Selection • FY{selectedYear}
            </span>
          </div>

          {/* Region Sub-selector Pills (Interactive Overview Card tabs) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            {regions.map((reg) => {
              const itemVol = regionalVolatility.find(v => v.region === reg.key);
              const score = itemVol ? itemVol.score : 5.0;
              const level = itemVol ? itemVol.level : "Medium";
              const colorClass = itemVol ? itemVol.color : "text-purple-400";
              const isSelected = selectedRegion === reg.key;

              return (
                <button
                  key={reg.key}
                  onClick={() => setSelectedRegion(reg.key)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? "bg-netflix-red/10 border-netflix-red/80 shadow-[0_0_20px_rgba(229,9,20,0.15)]"
                      : "bg-[#141414]/30 border-netflix-border/50 hover:bg-[#141414]/70 hover:border-white/15"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-extrabold tracking-widest uppercase ${isSelected ? "text-netflix-red" : "text-[#666666] group-hover:text-[#A3A3A3]"}`}>
                      {reg.key} Segment
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      level === "Critical" ? "bg-[#E50914] shadow-[0_0_8px_#E50914]" :
                      level === "High" ? "bg-amber-500 shadow-[0_0_8px_#F59E0B]" :
                      level === "Medium" ? "bg-purple-400 shadow-[0_0_8px_#A855F7]" :
                      "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                    }`} />
                  </div>
                  <h4 className="font-extrabold text-sm text-white mt-1.5 truncate transition-colors flex items-center gap-1.5">
                    <span className="text-base select-none">{reg.flag}</span>
                    <span>{reg.label.split(" ")[0]}</span>
                  </h4>
                  <p className="text-[10px] text-[#888888] mt-0.5 truncate">
                    {reg.desc}
                  </p>
                  <div className="mt-3.5 flex items-baseline gap-1">
                    <span className={`text-xl font-extrabold font-mono leading-none ${colorClass}`}>
                      {score.toFixed(1)}
                    </span>
                    <span className="text-[#666666] text-[10px] font-bold">/10 Volatility</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Unified Geographic Performance Cockpit Panel (All in One Place) */}
          <div className="relative overflow-hidden border border-netflix-border bg-[#141414]/50 backdrop-blur-md rounded-2xl p-6">
            {/* Spotlight Glow Background Effect */}
            <div 
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-5 transition-all duration-700 pointer-events-none"
              style={{ backgroundColor: hexColor }}
            />
            
            <div className="flex flex-col border-b border-netflix-border/50 pb-4 select-none">
              <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-netflix-red">
                Active Diagnostic Cockpit
              </span>
              <h3 className="text-lg font-extrabold text-white mt-1 tracking-tight flex items-center gap-2">
                <span className="text-xl select-none">
                  {regions.find(r => r.key === selectedRegion)?.flag || "🌍"}
                </span>
                <span>{activeVolItem.fullName} Segment Analysis (FY{selectedYear})</span>
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">
                Strategic scenario dashboard for {scenario.toUpperCase()} planning case
              </p>
            </div>

            {/* 3-Column Consolidated Cockpit Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
              
              {/* Column 1: Volatility Visual Dial & Driver */}
              <div className="xl:col-span-4 flex flex-col items-center justify-between p-5 bg-black/40 border border-netflix-border/40 rounded-xl relative group">
                <div className="w-full border-b border-netflix-border/50 pb-2.5 flex justify-between items-center select-none">
                  <span className="text-[10px] uppercase font-mono font-extrabold text-[#666666]">
                    Volatility Scorecard
                  </span>
                  <Globe className="w-4 h-4 text-[#A3A3A3]" />
                </div>

                {/* SVG Radial Gauge */}
                <div className="my-6 relative flex items-center justify-center select-none">
                  <div 
                    className="absolute w-24 h-24 rounded-full blur-2xl -z-10 opacity-20 transition-all duration-500" 
                    style={{ backgroundColor: hexColor }}
                  />
                  
                  <svg viewBox="0 0 100 100" className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="rgba(255, 255, 255, 0.04)"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={hexColor}
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                      style={{
                        filter: `drop-shadow(0 0 6px ${hexColor}40)`
                      }}
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold tracking-tight font-sans text-white leading-none">
                      {activeVolItem.score.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-[#666666] font-bold uppercase tracking-wider mt-0.5 leading-none">
                      /10 Score
                    </span>
                  </div>
                </div>

                {/* Status Indicator & Narratives */}
                <div className="w-full text-center space-y-3">
                  <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border bg-black/40 border-netflix-border inline-block ${activeVolItem.color}`}>
                    {activeVolItem.level} VOLATILITY INDEX
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#A3A3A3] font-sans px-2 select-text text-justify">
                    {activeVolItem.driver}
                  </p>
                </div>
              </div>

              {/* Column 2: Diagnosed Segment Problems & Barriers */}
              <div className="xl:col-span-4 flex flex-col p-5 bg-black/40 border border-netflix-border/40 rounded-xl justify-between">
                <div>
                  <div className="w-full border-b border-netflix-border/50 pb-2.5 flex justify-between items-center select-none">
                    <span className="text-[10px] uppercase font-mono font-extrabold text-[#666666]">
                      Diagnosed Growth Bottleneck
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                      activeDiagData.severity === "High" ? "bg-red-500/10 text-red-400 border border-red-500/25" :
                      activeDiagData.severity === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                    }`}>
                      {activeDiagData.severity} severity
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h5 className="font-extrabold text-xs text-[#F5F5F1] tracking-tight uppercase font-mono text-glow-red">
                      {activeDiagData.problem}
                    </h5>
                    <p className="text-[11px] leading-relaxed text-[#D4D4D4] font-sans text-justify select-text">
                      {activeDiagData.impact}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[#1c1c1c]/30 border border-netflix-border/40 rounded-lg select-none">
                  <div className="flex gap-2 items-center text-[10px] text-[#666666] font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Risk Parameter Registered & Tracked</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Segment Suggested Countermeasure */}
              <div className="xl:col-span-4 flex flex-col p-5 bg-black/40 border border-netflix-border/40 rounded-xl justify-between relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/2 to-netflix-red/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -z-10" />

                <div>
                  <div className="w-full border-b border-netflix-border/50 pb-2.5 flex justify-between items-center select-none">
                    <span className="text-[10px] uppercase font-mono font-extrabold text-[#666666]">
                      Suggested Countermeasure
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-purple-500/25 bg-purple-950/15 text-purple-300 font-mono">
                      ROI: {activeDiagData.roi}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-netflix-border bg-black/40 text-[#A3A3A3] font-mono select-none">
                        {activeDiagData.difficulty} Implementation
                      </span>
                      <span className="text-[9px] uppercase font-mono font-bold text-netflix-red tracking-wider select-none">
                        Target: {activeDiagData.targetMetric}
                      </span>
                    </div>
                    
                    <h4 className="font-extrabold text-xs text-white tracking-tight mt-1 uppercase font-mono">
                      {activeDiagData.solutionTitle}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-[#D4D4D4] font-sans text-justify select-text">
                      {activeDiagData.actionPlan}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[#1c1c1c]/30 border border-netflix-border/40 rounded-lg select-none">
                  <div className="flex gap-2 items-center text-[10px] text-[#666666] font-semibold">
                    <Wrench className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">High-ROI Strategic Countermeasure Active</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrowthDiagnosticsPage() {
  return (
    <DashboardShell title="Strategic Growth Diagnostics & Volatility Cockpit">
      <GrowthDiagnosticsContent />
    </DashboardShell>
  );
}
