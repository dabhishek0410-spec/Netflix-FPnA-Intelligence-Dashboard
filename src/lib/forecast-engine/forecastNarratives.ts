import { ScenarioType } from "@/types/forecast";

export interface ScenarioNarrative {
  scenario: ScenarioType;
  headline: string;
  theme: string;
  assumptionsText: string;
  risksAndOpportunities: string[];
}

export const scenarioNarratives: Record<ScenarioType, ScenarioNarrative> = {
  base: {
    scenario: "base",
    headline: "Steady Expansion & Sustained Margin Expansion",
    theme: "Netflix maintains moderate double-digit growth, driven by password sharing monetization, ad-tier scaling, and steady price adjustments. Operating margin expands to 33.5% by 2030, reflecting disciplined content spend and corporate efficiencies.",
    assumptionsText: "Revenue growth trends down from 13.0% in 2026 to 7.0% in 2030. Operating margin improves by 50 bps annually from 31.5% in 2026 to 33.5% in 2030.",
    risksAndOpportunities: [
      "Opportunity: Stronger-than-expected ad-tier uptake in EMEA/APAC, opening new monetization pools.",
      "Risk: Higher churn in UCAN following premium pricing tier adjustments.",
      "Opportunity: Leverage global local-language programming to lower overall average content production costs.",
    ],
  },
  bear: {
    scenario: "bear",
    headline: "Competitive Headwinds & Scale Obstacles",
    theme: "Slowing international adoption and aggressive streaming wars lead to growth deceleration. Pricing power is limited due to subscriber pressure. G&A and technology costs remain sticky, dragging operating margin down to 31.0% by 2030.",
    assumptionsText: "Revenue growth decelerates rapidly from 12.0% in 2026 to 4.0% in 2030. Operating margin slips to 30.0% in 2027-2028 before recovering slightly to 31.0% by 2030.",
    risksAndOpportunities: [
      "Opportunity: Shift content mix heavily to low-cost unscripted, licensed content, and live sports.",
      "Risk: Subscriber contraction in saturated UCAN market.",
      "Risk: Intense FX headwinds from a strengthening USD eroding international margins.",
    ],
  },
  bull: {
    scenario: "bull",
    headline: "Accelerated Monetization & Advertising Dominance",
    theme: "Ad-supported memberships grow exponentially, and gaming/live-event divisions hit scale. Strong domestic demand and price elasticity drive high double-digit revenue growth. Aggressive operating scale pushes margins to a record 36.5% by 2030.",
    assumptionsText: "Revenue growth starts at 14.0% in 2026 and sustains at a robust 9.0% by 2030. Operating margin increases by 100 bps annually to reach 36.5% by 2030.",
    risksAndOpportunities: [
      "Opportunity: Dominant market share in gaming and live entertainment/sports streaming.",
      "Opportunity: Massive pricing power in high ARPU UCAN and EMEA markets.",
      "Risk: Increased regulatory scrutiny in regional jurisdictions regarding content production quotas.",
    ],
  },
};

/**
 * Retrieves the qualitative narrative metadata for a given forecast scenario.
 */
export function getScenarioNarrative(scenario: ScenarioType): ScenarioNarrative {
  return scenarioNarratives[scenario];
}
