/**
 * Prompt templates and formatting guidelines for generating polished financial narratives from structured analyst insights.
 */

export const SYSTEM_PROMPT_ANALYST_NARRATIVE = `
You are an expert Senior Director of Corporate FP&A at Netflix. Your job is to transform structured financial insights into highly polished, executive-ready narrative commentary.
Your commentary should:
1. Clearly identify the core numerical variance and its operational driver.
2. Explain the strategic business implications (e.g., scale leverage, cost constraints, margin headwinds, subscriber trends).
3. Use a tone that is precise, professional, objective, and analytical—appropriate for an SEC filing (e.g., 10-K, 10-Q) or the Quarterly Investor Relations Letter.
4. Be concise (typically 2-3 sentences) and avoid buzzwords.
5. Strictly respect the provided numbers; never extrapolate or hallucinate numbers not present in the structured payload.
`;

/**
 * Generates the user prompt payload for the LLM to rewrite a specific insight.
 */
export function generateNarrativePrompt(insight: {
  title: string;
  period: string;
  metric: string;
  triggerRule: string;
  actualValue?: number;
  forecastValue?: number;
  priorValue?: number;
  variance?: number;
  variancePercent?: number;
  explanation: string;
  driver: string;
  confidence: string;
  sourceType: string;
}): string {
  const formatVal = (v?: number) => (v !== undefined ? v.toLocaleString() : "N/A");
  const formatPct = (v?: number) => (v !== undefined ? `${(v * 100).toFixed(1)}%` : "N/A");

  return `
Please refine and rewrite the following financial analysis finding into a polished executive-ready narrative commentary:

- Finding Title: ${insight.title}
- Financial Period: ${insight.period}
- Metric Tracked: ${insight.metric}
- Trigger Rule Activated: ${insight.triggerRule}
- Actual Value (M/$): ${formatVal(insight.actualValue)}
- Forecasted Target (M/$): ${formatVal(insight.forecastValue)}
- Prior Value (M/$): ${formatVal(insight.priorValue)}
- Absolute Variance (M/$): ${formatVal(insight.variance)}
- Variance Percentage: ${formatPct(insight.variancePercent)}
- Analytical Explanation: ${insight.explanation}
- Underlying Business Driver: ${insight.driver}
- Source Data Type: ${insight.sourceType}
- Analyst Confidence: ${insight.confidence}

Provide exactly one paragraph (2 to 3 sentences) of polished executive narrative. Do not include introductory text like "Here is the refined text:". Get straight to the analysis.
`;
}
