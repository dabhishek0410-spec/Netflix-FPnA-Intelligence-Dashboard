import { AnalystInsight } from "@/types/insights";

/**
 * Re-formats a structured AnalystInsight into polished executive commentary.
 * Checks for the environment variable NEXT_PUBLIC_ENABLE_LLM_NARRATIVE=true.
 * If enabled, uses our standard corporate fallback narrative writer which reformats
 * the structured fields into executive shareholder-ready copy using expert financial vocabulary.
 */
export async function formatLLMNarrative(insight: AnalystInsight, enableLlmOverride?: boolean): Promise<string> {
  const isLlmEnabled = enableLlmOverride !== undefined 
    ? enableLlmOverride 
    : (process.env.NEXT_PUBLIC_ENABLE_LLM_NARRATIVE === "true");

  if (!isLlmEnabled) {
    // LLM Narrative is disabled; return the standard rule-based explanation
    return insight.explanation;
  }

  // LLM / Fallback Writer is enabled: build polished, professional FP&A commentary
  return generatePolishedFallbackNarrative(insight);
}

/**
 * High-fidelity client-side narrative writer that replicates a Senior Director of FP&A's
 * perspective, blending metrics, drivers, and strategic outcomes in an integrated style.
 */
/**
 * High-fidelity client-side narrative writer that replicates a Senior Director of FP&A's
 * perspective, blending metrics, drivers, and strategic outcomes in an integrated,
 * multi-paragraph professional report format.
 */
function generatePolishedFallbackNarrative(insight: AnalystInsight): string {
  const pctStr = insight.variancePercent !== undefined 
    ? `${(Math.abs(insight.variancePercent) * 100).toFixed(1)}%` 
    : "";
  
  const absStr = insight.variance !== undefined 
    ? `$${Math.abs(insight.variance).toLocaleString()}M` 
    : "";

  const id = insight.id;

  // -------------------------------------------------------------------------
  // RULE 1: Positive Operating Leverage
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule1")) {
    const isForecast = id.includes("_FC_");
    return `**Executive Readout:** Netflix ${isForecast ? 'is projected to exhibit' : 'demonstrated'} highly positive operating leverage, with operating income ${isForecast ? 'projections expanding' : 'expanding'} by **${pctStr} YoY** compared to a much lower top-line revenue growth rate. This structural mismatch highlights excellent operating efficiency, allowing incremental subscriber and ad-tier dollars to flow directly to the bottom line at a high velocity.

**Operational Driver:** The core catalyst is the fixed-cost leverage inherent in our digital subscription business model. Because our content amortization is primarily scheduled over straight-line assets, the marginal acquisition cost of new memberships (and the expansion of our programmatic CPM ad network) remains extremely low, enabling high flow-through margins on every incremental dollar of sales.

**Financial Flow-Through:** Operating margins are successfully driven upward, reflecting scale efficiencies across marketing, streaming delivery infrastructure, and general overhead. This scale leverages our fixed content asset base, lowering the corporate operating expense ratio.

**Key Risk / Watch Item:** To sustain this flow-through velocity, we must defend pricing power and average engagement hours per active member against competitive density. If subscriber churn rises, high fixed content commitments can rapidly compress margins in reverse.`;
  }

  // -------------------------------------------------------------------------
  // RULE 2: Expense Margin Drag
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule2")) {
    return `**Executive Readout:** A critical expense margin drag has been triggered under Bear Case scenario bounds. Total corporate expenses are projected to expand by **${pctStr} YoY**, significantly outpacing top-line revenue growth. This creates severe negative operating leverage, driving immediate margin compression and highlighting operational friction.

**Operational Driver:** The primary catalyst is the sticky nature of cash content commitments, production overheads, and international studio leases. In a decelerating revenue environment (caused by high domestic market penetration and ad CPM price pressure), these long-term fixed outlays cannot be deferred rapidly enough to match the top-line slow-down.

**Financial Flow-Through:** Operating margin projections undergo immediate compression of over 100 basis points. The negative flow-through highlights the vulnerability of the bottom line when fixed studio cash overheads are distributed over a stagnating subscriber base.

**Key Risk / Watch Item:** Management must immediately trigger targeted cost-containment measures, including pausing non-English production starts, consolidating domestic overheads, and implementing strict hiring freezes across engineering and administrative divisions.`;
  }

  // -------------------------------------------------------------------------
  // RULE 3: Regional Outperformer
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule3")) {
    const region = id.split("_")[3] || "International";
    return `**Executive Readout:** Geopolitical segment analysis reveals exceptional operational momentum, with ${region} segment revenue growing by **${pctStr} YoY**. This represents a substantial outperformance premium over our consolidated corporate average growth, marking this geography as a primary engine of active expansion.

**Operational Driver:** Outperformance is anchored by high-impact local-language slates and strong consumer adoption of localized lower-priced ad plans. By tailoring content specifically to regional markets (exemplified by high-engagement localized programming and pricing plans), we have unlocked a larger addressable market and successfully expanded the subscriber acquisition funnel.

**Financial Flow-Through:** The segment's rapid growth offsets mature saturation in domestic markets. It contributes a larger percentage of consolidated revenue growth and creates operational scale to support regional overhead normalization.

**Key Risk / Watch Item:** Foreign exchange volatility remains a significant threat. Severe local currency depreciation against a strong US Dollar can erase these local-currency gains during translation, creating an artificial haircut on reported results.`;
  }

  // -------------------------------------------------------------------------
  // RULE 4: Content Cost Pressure
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule4")) {
    return `**Executive Readout:** Detailed income statement analysis exposes elevated content cost pressures, with cost of revenues as a percentage of sales expanding by **${pctStr}** (equivalent to over 100 basis points of margin drag). This indicates that the amortization of our content library is currently flowing through the income statement faster than subscriber monetization.

**Operational Driver:** The rise in cost intensity is driven by high-cost legacy licensing agreements and accelerated amortization schedules for big-budget localized programming. While these investments drive initial subscriber acquisition, their front-loaded amortization schedules create immediate margin drag on the income statement.

**Financial Flow-Through:** Gross profit margins compress, creating downward pressure on operating profits. This margin headwind offsets positive efficiencies achieved in technology, marketing, and general overhead divisions.

**Key Risk / Watch Item:** The capital allocation committee must enforce strict capital controls, capping annual cash content spend, shifting focus from high-cost broad-reach content to highly targeted genre programming, and optimizing licensing returns.`;
  }

  // -------------------------------------------------------------------------
  // RULE 5: G&A Restructuring Shock
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule5")) {
    return `**Executive Readout:** General and Administrative (G&A) expenses experienced an extraordinary spike of **${pctStr} YoY** in the Bear Case scenario, rising to **${absStr}**. This indicates severe G&A friction, driving immediate, albeit temporary, pressure on operating margins.

**Operational Driver:** The spike is driven by one-time transactional adjustments and integration friction. This includes legal provisions, advisory fees associated with corporate restructuring, and severance packages. Because these outlays are front-loaded, they create immediate margin compression.

**Financial Flow-Through:** Operating profits are severely depressed in the current period, reflecting a non-recurring G&A surcharge. This overhead drag offsets organic efficiency gains across our core streaming delivery systems.

**Key Risk / Watch Item:** While this represents a non-recurring event, G&A metrics must be monitored closely to ensure that restructuring yields the projected operational efficiencies and G&A ratios normalize in subsequent quarters.`;
  }

  // -------------------------------------------------------------------------
  // RULE 6: FX Volatility Haircut
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule6")) {
    return `**Executive Readout:** A strengthening US Dollar created a material translation haircut in our reported revenue results, with reported growth lagging constant-currency (FX-neutral) growth by **${pctStr}** (representing a significant foreign currency headwind).

**Operational Driver:** The mismatch is driven by a strong US Dollar against key global billing currencies (principally EUR, GBP, and JPY). Because over 55% of Netflix's revenue is generated internationally in local currencies while the corporate expense base is heavily USD-denominated, rapid currency translation shifts compress reported numbers.

**Financial Flow-Through:** The FX translation haircut erases absolute revenue, creating an artificial drag on top-line growth. This translation gap flows directly through to compress operating margins, despite strong underlying organic growth.

**Key Risk / Watch Item:** We are expanding localized pricing strategies and active FX hedging programs to neutralize these foreign currency headwinds, while optimizing localized expense structures to align with regional billing currencies.`;
  }

  // -------------------------------------------------------------------------
  // RULE 7: Forecast Top-Line Upside
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule7")) {
    return `**Executive Readout:** Long-range scenario models highlight substantial top-line upside potential through FY2030, with the Bull Case projection expanding by **${pctStr}** (an incremental **${absStr}** in sales) compared to our Base Case projections.

**Operational Driver:** The upside is anchored by rapid scale-up of our global programmatic ad network, highly efficient non-member monetization (password sharing adjustments), and successful licensing of our intellectual property. This high-margin revenue mix expands the subscriber acquisition funnel and drives average pricing power.

**Financial Flow-Through:** The incremental revenue flows to the bottom line at a high velocity, driving terminal operating margins upward. The expanded cash conversion generates substantial free cash flow, providing significant capital allocation optionality.

**Key Risk / Watch Item:** Achieving this upside requires sustained double-digit growth in international ad impressions and maintaining high engagement levels. If ad monetization stalls, top-line trends will align with the Base Case.`;
  }

  // -------------------------------------------------------------------------
  // RULE 8: Forecast Downside Margin Risk
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule8")) {
    return `**Executive Readout:** Terminal scenario analysis exposes a critical downside margin risk under Bear Case parameters. Operating margins are projected to compress by **${pctStr}** relative to our Base Case model, highlighting significant cash flow sensitivity.

**Operational Driver:** The risk is driven by competitive density and content production cost inflation. If customer acquisition stalls due to local competitor density and content costs continue to expand, our high fixed-cost leverage reverses, forcing rapid margin compression.

**Financial Flow-Through:** Terminal operating profits compress, reducing corporate cash generation. This margin headwind limits capital allocation optionality, restricting our ability to execute share buybacks and pay down outstanding debt.

**Key Risk / Watch Item:** This downside highlights the absolute necessity of maintaining pricing discipline, enforcing strict content production cost caps, and optimizing slate ROI to defend margins in high-churn cycles.`;
  }

  // -------------------------------------------------------------------------
  // RULE 9: FCF Turnaround / Strike effect
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule9")) {
    const isForecast = id.includes("_FC_");
    return `**Executive Readout:** Netflix registered an extraordinary free cash flow turnaround, with FCF conversion of revenue expanding by **${pctStr}** (yielding an absolute variance of **${absStr}**). This structural shift represents a highly cash-generative corporate engine.

**Operational Driver:** The turnaround was driven by a temporary reduction in content cash spent (primarily due to Hollywood strike-related production pauses that deferred cash outlays into future periods) combined with sustained organic subscriber gains. Under forecast projections, this represents a highly efficient content capital conversion rate.

**Financial Flow-Through:** The surge in FCF conversion provides massive liquidity. This strong cash generation is allocated toward debt reduction, optimizing the capital structure, and executing selective share buybacks.

**Key Risk / Watch Item:** We must note that strike-related content cash savings represent a timing deferral. As production schedules accelerate in subsequent periods, cash content spend will rise, normalising FCF conversion back toward baseline levels.`;
  }

  // -------------------------------------------------------------------------
  // RULE 10: Geographical Growth Sourcing
  // -------------------------------------------------------------------------
  if (id.startsWith("Rule10")) {
    return `**Executive Readout:** Long-range geographic planning models expose a critical structural shift: growth sourcing is moving decisively international, with EMEA and APAC projected to deliver **${pctStr}** of total top-line expansion over the next five years.

**Operational Driver:** The primary catalyst is the mature saturation of our domestic UCAN market. With UCAN serving as a highly cash-generative, mature business, customer acquisition and top-line scaling must be sourced from EMEA and APAC, where ad-supported plans and local-language programming slates expand the addressable market.

**Financial Flow-Through:** Consolidated revenue growth is heavily levered to international performance. This requires an operational shift, directing content capital and marketing expenses toward regional programming centers.

**Key Risk / Watch Item:** Sourcing growth internationally increases exposure to foreign currency translation headwinds and geopolitical regulatory risks. We must optimize regional pricing tiers and currency structures to protect margins.`;
  }

  // -------------------------------------------------------------------------
  // Generic Fallback
  // -------------------------------------------------------------------------
  return `**Executive Readout:** Our operational audit for ${insight.period} highlights a key variance in **${insight.metric}**, driven primarily by **${insight.driver.toLowerCase()}**. The absolute variance of ${absStr} (${pctStr} relative to baseline) represents a critical performance shift.

**Operational Driver:** The primary catalyst is ${insight.driver.toLowerCase()}, reflecting the impact of our active capital allocation strategies and subscriber monetization programs in this specific timeline.

**Financial Flow-Through:** This performance variance flows through to impact our operating margin and cash conversion profiles, altering consolidated profit expectations relative to our strategic baseline models.

**Key Risk / Watch Item:** Management must continue to monitor this operational metric, optimizing cost structures and pricing levers to support sustained margin expansion and cash generation.`;
}
