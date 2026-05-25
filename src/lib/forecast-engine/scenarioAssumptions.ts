import { ForecastAssumptions, ScenarioGrowthAssumptions, ScenarioType } from "@/types/forecast";
import assumptionsJson from "../../../data/assumptions/forecast_assumptions_2026_2030.json";

// Typed cast of assumptions JSON
export const forecastAssumptions = assumptionsJson as unknown as ForecastAssumptions;

/**
 * Loads the growth and margin assumptions for a given scenario (base, bear, bull).
 */
export function getScenarioAssumptions(scenario: ScenarioType): ScenarioGrowthAssumptions {
  return forecastAssumptions[scenario];
}
