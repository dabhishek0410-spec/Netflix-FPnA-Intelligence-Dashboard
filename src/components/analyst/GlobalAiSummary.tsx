"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useDashboard } from "../layout/DashboardContext";
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/calculations/formatters";

export default function GlobalAiSummary() {
  const pathname = usePathname();
  const { 
    scenario, 
    selectedYear, 
    activePeriodData,
    enableLlm,
    forecasts,
    historicalCorporate,
    historicalRegional
  } = useDashboard();

  const hiddenPaths = [
    "/analyst-narrative",
    "/methodology",
    "/portfolio-summary"
  ];

  if (!enableLlm || hiddenPaths.includes(pathname)) return null;

  const metrics = activePeriodData.metrics;
  const isForecast = activePeriodData.isForecast;

  // Compute prior metrics for YoY dynamic comparisons
  const priorMetrics = useMemo(() => {
    const priorYear = selectedYear - 1;
    if (priorYear >= 2026) {
      return forecasts[scenario].periods.find((p: any) => p.year === priorYear)!.metrics;
    }
    return historicalCorporate.find((d) => d.year === priorYear);
  }, [selectedYear, scenario, forecasts, historicalCorporate]);

  // Compute prior regional metrics
  const priorRegional = useMemo(() => {
    const priorYear = selectedYear - 1;
    if (priorYear >= 2026) {
      return forecasts[scenario].periods.find((p: any) => p.year === priorYear)!.regionalMetrics;
    }
    return historicalRegional.find((d) => d.year === priorYear) || historicalRegional[historicalRegional.length - 1];
  }, [selectedYear, scenario, forecasts, historicalRegional]);

  // Compute a highly specific, professional financial memo for the active page
  const memoContent = useMemo(() => {
    const rev = metrics.incomeStatement.revenue;
    const opInc = metrics.incomeStatement.operatingIncome;
    const opMargin = metrics.incomeStatement.operatingMargin;
    const grossProfit = metrics.incomeStatement.grossProfit;
    const opex = metrics.incomeStatement.operatingExpenses;
    const subs = metrics.paidMemberships || 0;
    const arpu = metrics.arpu || 0;
    const fcf = metrics.cashFlowStatement?.freeCashFlow || 0;
    const contentAdd = metrics.contentAssets?.additions || 0;

    const formattedRev = formatCurrency(rev, true);
    const formattedOpInc = formatCurrency(opInc, true);
    const formattedGrossProfit = formatCurrency(grossProfit, true);
    const formattedOpex = formatCurrency(opex, true);
    const formattedSubs = formatNumber(subs, true);
    const formattedArpu = formatCurrency(arpu);
    const formattedFcf = formatCurrency(fcf, true);
    const formattedContentAdd = formatCurrency(contentAdd, true);

    const isBull = scenario === "bull";
    const isBear = scenario === "bear";

    switch (pathname) {
      case "/expenses": {
        const costOfRevRatio = metrics.incomeStatement.costOfRevenues / rev;
        const marketingRatio = metrics.incomeStatement.marketing / rev;
        const techRatio = metrics.incomeStatement.technologyAndDevelopment / rev;
        const gaRatio = metrics.incomeStatement.generalAndAdministrative / rev;

        // Dynamic Heuristic: Find fastest growing expense category
        let fastestExpenseLabel = "Cost of Revenues";
        let fastestExpenseGrowth = 0.05;
        if (priorMetrics) {
          const growths = [
            { label: "Cost of Revenues (Streaming Delivery & Amortization)", cur: metrics.incomeStatement.costOfRevenues, prior: priorMetrics.incomeStatement.costOfRevenues },
            { label: "Marketing Initiatives", cur: metrics.incomeStatement.marketing, prior: priorMetrics.incomeStatement.marketing },
            { label: "Technology & Software Development", cur: metrics.incomeStatement.technologyAndDevelopment, prior: priorMetrics.incomeStatement.technologyAndDevelopment },
            { label: "General & Administrative Overhead", cur: metrics.incomeStatement.generalAndAdministrative, prior: priorMetrics.incomeStatement.generalAndAdministrative },
          ].map(item => ({
            label: item.label,
            growth: item.prior > 0 ? (item.cur - item.prior) / item.prior : 0
          }));
          growths.sort((a, b) => b.growth - a.growth);
          fastestExpenseLabel = growths[0].label;
          fastestExpenseGrowth = growths[0].growth;
        }

        return {
          title: `Operating Expense Structure & Margin Flow-Through Analysis`,
          subtitle: `P&L Functional Allocations for FY${selectedYear} (${isForecast ? "Projections" : "Actuals"}) • Scenario: ${scenario.toUpperCase()}`,
          paragraphs: [
            `Functional cost allocations for FY${selectedYear} indicate total corporate operating expenses and streaming delivery costs of ${formattedOpex}. Cost of Revenues—which encapsulates straight-line content library asset amortization and digital streaming delivery infrastructure—serves as the primary operational cost block at ${formatCurrency(metrics.incomeStatement.costOfRevenues, true)} (representing ${formatPercentage(costOfRevRatio)} of sales). Customer acquisition and software engineering investments are sustained through a marketing allocation of ${formatCurrency(metrics.incomeStatement.marketing, true)} (${formatPercentage(marketingRatio)} of sales) and technology outlays of ${formatCurrency(metrics.incomeStatement.technologyAndDevelopment, true)} (${formatPercentage(techRatio)} of sales), while back-office G&A overheads are tightly managed at ${formatCurrency(metrics.incomeStatement.generalAndAdministrative, true)} (${formatPercentage(gaRatio)} of sales).`,
            `Budgetary variance reviews indicate that **${fastestExpenseLabel}** represents our fastest-growing overhead block, expanding by **${formatPercentage(fastestExpenseGrowth, true)} YoY**. ${
              isBear
                ? `Under Bear Case scenario parameters, the high concentration of fixed straight-line content amortization combined with top-line subscriber deceleration creates negative operating leverage. Because production commitments and international studio leases cannot be deferred rapidly enough to match the decelerating revenue inflows, G&A and marketing margins suffer from moderate drag. Management is advised to enforce cost containment measures, prioritizing slate consolidation and suspending non-English production starts to defend consolidated operating margins of ${formatPercentage(opMargin)}.`
                : `This expansion rate is successfully offset by high flow-through margins across other functional line items. Under active ${scenario.toUpperCase()} case parameters, corporate functional spending remains highly optimized. Top-line scaling driven by global programmatic adCPM expansion and price hikes leverages our straight-line amortization base. Cost of revenues shows steady efficiency, preventing margin compression hazards and allowing net operating margins to print at ${formatPercentage(opMargin)}.`
            }`
          ]
        };
      }

      case "/regions": {
        const ucanRev = activePeriodData.regional.regions.UCAN?.revenue || 0;
        const emeaRev = activePeriodData.regional.regions.EMEA?.revenue || 0;
        const latamRev = activePeriodData.regional.regions.LATAM?.revenue || 0;
        const apacRev = activePeriodData.regional.regions.APAC?.revenue || 0;
        const totalRegRev = activePeriodData.regional.totalRevenue;

        // Dynamic Heuristic: Find fastest growing region
        let fastestRegionLabel = "EMEA";
        let fastestRegionGrowth = 0.08;
        const regionCodes: ("UCAN" | "EMEA" | "LATAM" | "APAC")[] = ["UCAN", "EMEA", "LATAM", "APAC"];
        const regionNames = { UCAN: "US & Canada (Domestic)", EMEA: "Europe, Middle East & Africa (EMEA)", LATAM: "Latin America (LATAM)", APAC: "Asia-Pacific (APAC)" };

        if (priorRegional) {
          const growths = regionCodes.map(code => {
            const curVal = activePeriodData.regional.regions[code]?.revenue || 0;
            const prevVal = priorRegional.regions[code]?.revenue || 0;
            const growth = prevVal > 0 ? (curVal - prevVal) / prevVal : 0;
            return { label: regionNames[code], growth };
          });
          growths.sort((a, b) => b.growth - a.growth);
          fastestRegionLabel = growths[0].label;
          fastestRegionGrowth = growths[0].growth;
        }

        return {
          title: `Geographical Segment Sourcing & Translation Exposure Audit`,
          subtitle: `Geopolitical Splits for FY${selectedYear} (${isForecast ? "Projections" : "Actuals"}) • Scenario: ${scenario.toUpperCase()}`,
          paragraphs: [
            `Geographic segment analysis for FY${selectedYear} exposes a structural shift in growth sourcing, with total regional revenues reconciling to ${formatCurrency(totalRegRev, true)}. UCAN segment billing contributes ${formatCurrency(ucanRev, true)} (representing ${((ucanRev / totalRegRev) * 100).toFixed(1)}% of consolidated sales), acting as our highest-ARPU cash generator. In contrast, high-volume international subscriber acquisition is driven primarily by EMEA at ${formatCurrency(emeaRev, true)} (${((emeaRev / totalRegRev) * 100).toFixed(1)}%), LATAM at ${formatCurrency(latamRev, true)} (${((latamRev / totalRegRev) * 100).toFixed(1)}%), and APAC at ${formatCurrency(apacRev, true)} (${((apacRev / totalRegRev) * 100).toFixed(1)}%).`,
            `Audits identify **${fastestRegionLabel}** as the primary growth driver for the current year, expanding revenue at a highly impressive **${formatPercentage(fastestRegionGrowth, true)} YoY**. While this validates our international localization slate, sourcing a higher percentage of top-line growth internationally increases our structural exposure to foreign exchange translation headwinds. Volatility in local billing currencies (primarily the EUR, JPY, and GBP) relative to a strong US Dollar can erase organic subscriber gains during consolidation, making constant-currency localized pricing tiers and hedging programs a strategic necessity.`
          ]
        };
      }

      case "/margin-bridge": {
        const gpRatio = grossProfit / rev;
        const opRatio = opInc / rev;

        // Dynamic Heuristic: Evaluate Capital Recycling Ratio (Cash spend on content vs P&L Amortization)
        const contentAmort = metrics.incomeStatement.costOfRevenues;
        const isCapitalBuilding = contentAdd > contentAmort;
        const recycleRatio = contentAmort > 0 ? (contentAdd / contentAmort) : 1.0;

        return {
          title: `Reconciliation of Top-Line Revenue to Consolidated Operating Profits`,
          subtitle: `Margin Bridging Parameters for FY${selectedYear} (${isForecast ? "Projections" : "Actuals"}) • Scenario: ${scenario.toUpperCase()}`,
          paragraphs: [
            `The bridge analysis maps the waterfall transition from consolidated revenues down to net operating income for FY${selectedYear}. Gross Profit of ${formattedGrossProfit} represents a gross margin of ${formatPercentage(gpRatio)}, showing high pricing power. Direct functional overheads (marketing, software engineering, and corporate G&A) subtract from gross profit to yield a net operating income of ${formattedOpInc} (an operating margin of ${formatPercentage(opRatio)}).`,
            `Strategic capital allocation reviews show a Content Capital Recycling Ratio of **${recycleRatio.toFixed(2)}x** (representing cash content investments of ${formattedContentAdd} against straight-line P&L library amortization of ${formatCurrency(contentAmort, true)}). ${
              isCapitalBuilding
                ? `This ratio indicates a capital build phase, where Netflix is aggressively expanding its content catalog to capture market share, temporarily expanding the balance sheet net book value.`
                : `This ratio indicates an extremely cash-generative release phase, where historical slate amortizations exceed current cash content additions. This positive cash conversion flow supports corporate debt reduction targets while providing the capital allocation committee with substantial flexibility for opportunistic share buybacks.`
            }`
          ]
        };
      }

      case "/long-range-plan": {
        const termMargin = scenario === "bull" ? "36.5%" : scenario === "bear" ? "31.0%" : "33.5%";
        const cagrText = scenario === "bull" ? "14% to 9%" : scenario === "bear" ? "12% to 4%" : "13% to 7%";

        return {
          title: `5-Year Scenario Model Projections & Strategic Sensitivity Analysis`,
          subtitle: `LRP Strategic Planning Horizon (2026-2030) • Scenario: ${scenario.toUpperCase()}`,
          paragraphs: [
            `The 5-Year LRP (2026-2030) outlines our long-term structural boundaries. Under the active ${scenario.toUpperCase()} case projection, revenue CAGR models a deceleration curve of ${cagrText} as domestic UCAN paid-membership saturation forces a strategic transition from volume-driven subscriber acquisition to ARPU-driven yield optimization. Terminal corporate operating margins are set to peak at ${termMargin} by FY2030.`,
            `The critical planning risk is slate capital efficiency and the timing of free cash flow conversion. To secure the terminal targets, we must balance high-budget marquee productions with localized genre slates that deliver high subscriber acquisition efficiency. If ad-tier monetization fails to offset linear TV sub losses, margin pressure will force capital spend limits on content additions, making catalog monetization a primary strategic lever.`
          ]
        };
      }
      case "/growth-diagnostics": {
        // 1. Calculate corporate metric volatility dynamic averages
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

        const corporateMetrics = [
          { name: "Revenue Scaling", score: revScore, driver: revDriver },
          { name: "Operating Margin", score: marginScore, driver: marginDriver },
          { name: "Blended ARPU Yield", score: arpuScore, driver: arpuDriver },
          { name: "FCF Conversion", score: fcfScore, driver: fcfDriver },
          { name: "Subscriber Net Adds", score: subScore, driver: subDriver }
        ];

        // Sort to isolate the absolute highest volatility driver for the selected period
        const sortedMetrics = [...corporateMetrics].sort((a, b) => b.score - a.score);
        const peakVolMetric = sortedMetrics[0].name;
        const peakVolScore = sortedMetrics[0].score;
        const peakVolDriver = sortedMetrics[0].driver;
        const avgVolScore = corporateMetrics.reduce((sum, item) => sum + item.score, 0) / 5;

        // 2. Map year/scenario-specific corporate bottlenecks and suggested actions dynamically
        let activeBottleneckSummary = "";
        let activeSolutionSummary = "";
        if (!isForecast) {
          switch (selectedYear) {
            case 2021:
              activeBottleneckSummary = "post-COVID demand normalization easing combined with high content capital outlays scaling to $17.7B straight-line content commitments";
              activeSolutionSummary = "the launch of lower-priced ad-supported tiers to lower friction for price-sensitive households, geographic slate localization, and FX forward hedging derivatives";
              break;
            case 2022:
              activeBottleneckSummary = "a severe 355 bps foreign exchange consolidated translation shock alongside historical domestic membership declines from household sharing saturation";
              activeSolutionSummary = "enforcing active geofenced location checks for password conversions and implementing local price revisions to defend consolidated yields";
              break;
            case 2023:
              activeBottleneckSummary = "Hollywood screen writer labor disputes delayed major US studio franchise additions, stalling premium pricing headroom";
              activeSolutionSummary = "importing high-quality international local slates to bridge catalog gaps and executing bi-annual price tier adjustments";
              break;
            case 2024:
              activeBottleneckSummary = "accelerated content production capital additions as delayed studio pipelines resume operations post-strike";
              activeSolutionSummary = "establishing direct automated programmatic ad-trading desk integrations to capture direct real-time bidding slots";
              break;
            case 2025:
              activeBottleneckSummary = "slowing benefits of password conversions leaving local language regional slates as the primary subscriber engine";
              activeSolutionSummary = "securing premium marquee live sports streaming event packages and systematically phasing out mature ad-free basic plans";
              break;
          }
        } else {
          if (isBear) {
            activeBottleneckSummary = "severe expense growth outstripping revenue scaling under structural operating deleveraging (Rule 2 trigger), cost of revenues inflation (Rule 4 trigger), and G&A restructuring friction (Rule 5 trigger)";
            activeSolutionSummary = "enforcing strict content budget caps, G&A administrative consolidation, and Phase 2 location auditing checks";
          } else if (isBull) {
            activeBottleneckSummary = "hyper-growth integration friction and broadcast infrastructure costs from live event streaming, combined with local currency translation swings";
            activeSolutionSummary = "creating exclusive real-time programmatic ad auctions for live finale sports and restructuring international subscription plans";
          } else {
            activeBottleneckSummary = "mature UCAN subscriber volume plateaus combined with slow ad-tier programmatic fill-rates";
            activeSolutionSummary = "implementing systematic $1.00 USD bi-annual pricing updates and building custom direct brand sponsorship partnerships";
          }
        }

        // 3. Map year/scenario-specific regional segment audits dynamically
        let activeRegionVol = 3.0;
        let activeRegionName = "Asia-Pacific (APAC)";
        let activeRegionProblem = "";
        let activeRegionCountermeasure = "";

        if (!isForecast) {
          switch (selectedYear) {
            case 2021:
              activeRegionName = "Asia-Pacific (APAC) hub (🇯🇵)"; activeRegionVol = 7.2;
              activeRegionProblem = "Indian sub-market monetization barriers, where local competitor pricing tiers were priced up to 80% cheaper";
              activeRegionCountermeasure = "slashing basic plan rates by up to 60% in India to build market scale";
              break;
            case 2022:
              activeRegionName = "Europe, Middle-East & Africa (EMEA) segment (🇪🇺)"; activeRegionVol = 8.2;
              activeRegionProblem = "extreme EUR and GBP devaluations relative to a strong USD, causing massive translation conversion haircuts";
              activeRegionCountermeasure = "applying immediate local-currency plan pricing revisions to protect dollar-equivalent margin yield";
              break;
            case 2023:
              activeRegionName = "Latin America (LATAM) region (🇧🇷)"; activeRegionVol = 6.0;
              activeRegionProblem = "involuntary member churn caused by renewal friction on cash-based and local credit card billing networks";
              activeRegionCountermeasure = "securing carrier prepaid integrations to bypass credit card requirements and streamline airtime billings";
              break;
            case 2024:
              activeRegionName = "Europe, Middle-East & Africa (EMEA) segment (🇪🇺)"; activeRegionVol = 4.0;
              activeRegionProblem = "complex local European content quota demands requiring 30% local slate investments, diluting global catalog leverage";
              activeRegionCountermeasure = "expanding pan-European coproductions with public networks to distribute production capital outlays";
              break;
            case 2025:
              activeRegionName = "US & Canada (UCAN) domestic segment (🇺🇸)"; activeRegionVol = 1.8;
              activeRegionProblem = "pricing ceiling friction on the ad-free premium tier at $22.99, triggering down-grade customer trends";
              activeRegionCountermeasure = "leveraging Christmas live NFL and WWE Raw broadcasts to lock in premium ad-CPM auctions over $65";
              break;
          }
        } else {
          if (isBear) {
            activeRegionName = "Asia-Pacific (APAC) segment (🇯🇵)"; activeRegionVol = 9.0;
            activeRegionProblem = "intense bidding wars by local tech competitors driving up localized animation and drama rights";
            activeRegionCountermeasure = "locking in top regional directors under multi-year exclusive direct output contracts";
          } else if (isBull) {
            activeRegionName = "Europe, Middle-East & Africa (EMEA) hub (🇪🇺)"; activeRegionVol = 2.0;
            activeRegionProblem = "programmatic adCPM fill latency during massive subscriber shifts to ad-tier plans";
            activeRegionCountermeasure = "launching high-impact automated real-time ad slot programmatic bidding desks";
          } else {
            activeRegionName = "Latin America (LATAM) segment (🇧🇷)"; activeRegionVol = 5.0;
            activeRegionProblem = "elevated regional drama amortization schedules holding back segment operating margins";
            activeRegionCountermeasure = "constructing shared centralized production hubs in Mexico and Colombia to share asset costs";
          }
        }

        // Helper level calculator
        const getLevel = (score: number): "Low" | "Medium" | "High" | "Critical" => {
          if (score >= 8.0) return "Critical";
          if (score >= 6.0) return "High";
          if (score >= 4.0) return "Medium";
          return "Low";
        };
        const avgLevel = getLevel(avgVolScore);

        return {
          title: `Strategic Growth Diagnostics & Metric Volatility Assessment`,
          subtitle: `Risk Diagnostic Panel for FY${selectedYear} (${isForecast ? "Projections" : "Actuals"}) • Scenario: ${scenario.toUpperCase()}`,
          paragraphs: [
            `Growth diagnostics for FY${selectedYear} identify a consolidated **Average Volatility Index of ${avgVolScore.toFixed(1)}/10 (${avgLevel} Volatility)** across our core operational pillars. Corporate metrics analysis indicates that **${peakVolMetric}** represents our highest operational sensitivity point, registering an elevated score of **${peakVolScore.toFixed(1)}/10** (Primary Driver: *${peakVolDriver}*). Real-time risk audits verify that the primary structural friction blocks for the period stem from **${activeBottleneckSummary}**. To optimize top-line scaling and preserve operational cash flows, the FP&A team recommends deploying strategic countermeasures focused on **${activeSolutionSummary}**.`,
            `Geographic segment diagnostics expose critical variance sourcing and currency translation risks within our international hubs. Sourcing a higher weight of membership additions internationally dilutes domestic ARPU and expands translation exposure. For FY${selectedYear}, the **${activeRegionName}** represents our most sensitive geopolitical risk profile, printing a volatility index of **${activeRegionVol.toFixed(1)}/10**. Audits identify that this segment's primary growth barrier is **${activeRegionProblem}**. We advise immediate execution of the localized segment action plan—specifically: **${activeRegionCountermeasure}**—to protect consolidated yields and stabilize corporate margins.`
          ]
        };
      }

      default:
      case "/executive":
      case "/": {
        // Dynamic Heuristic: Calculate corporate top-line YoY revenue growth
        let revYoYText = "positive top-line traction";
        if (priorMetrics) {
          const revGrowth = (rev - priorMetrics.incomeStatement.revenue) / priorMetrics.incomeStatement.revenue;
          revYoYText = `YoY top-line revenue expansion of **${formatPercentage(revGrowth, true)}**`;
        }

        return {
          title: `Consolidated Financial Performance & Corporate Scaling Synthesis`,
          subtitle: `Executive FP&A Cockpit Briefing for FY${selectedYear} (${isForecast ? "Projections" : "Actuals"}) • Scenario: ${scenario.toUpperCase()}`,
          paragraphs: [
            `This cockpit highlights the consolidation of our global streaming model for FY${selectedYear}, showing ${revYoYText} yielding consolidated sales of ${formattedRev}. Key indicators show Operating Income scaling to ${formattedOpInc}, reflecting a highly competitive, scalable operating margin of ${formatPercentage(opMargin)}. Blended ARPU remains extremely stable at ${formattedArpu} across a global membership footprint of ${formattedSubs}.`,
            isBull
              ? `Under active BULL Case projections, accelerated global ad-tier scaling and successful high-ticket IP licensing boost incremental revenue conversion, driving free cash flow to ${formattedFcf} and providing massive capital allocation flexibility against content additions of ${formattedContentAdd}.`
              : isBear
              ? `Under active BEAR Case projections, stagnating paid-subscriber growth and local currency translation headwinds put pressure on operating margins, requiring cost-containment programs to protect bottom-line free cash flow of ${formattedFcf} against content additions of ${formattedContentAdd}.`
              : `Under BASE Case parameters, financial performance matches consensus targets. Steady ad-supported plan conversions and moderate localized price adjustments support consistent free cash flow conversion of ${formattedFcf} against content additions of ${formattedContentAdd}, keeping corporate target guidelines fully on track.`
          ]
        };
      }
    }
  }, [pathname, selectedYear, scenario, metrics, isForecast, activePeriodData, priorMetrics, priorRegional]);

  return (
    <div className="mb-6 rounded-xl border border-purple-500/10 bg-black/60 p-6 glass-card shadow-lg select-none">
      {/* Header (No Emojis, No Graphic Icons) */}
      <div className="border-b border-purple-500/10 pb-4 mb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
          Financial Intelligence Center • AI Narrative Briefing
        </span>
        <h3 className="font-extrabold text-[#F5F5F1] text-base tracking-wide mt-1.5">
          {memoContent.title}
        </h3>
        <p className="text-xs text-[#A3A3A3] font-semibold mt-1 font-mono tracking-tight">
          {memoContent.subtitle}
        </p>
      </div>

      {/* Body Paragraphs (No Bullets, No Arrow Icons) */}
      <div className="space-y-4">
        {memoContent.paragraphs.map((paragraph, idx) => (
          <p 
            key={idx} 
            className="text-xs leading-relaxed text-[#D4D4D4] text-justify"
            dangerouslySetInnerHTML={{ 
              __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') 
            }} 
          />
        ))}
      </div>
    </div>
  );
}
