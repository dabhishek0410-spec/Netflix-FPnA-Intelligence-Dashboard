# corporate strategic Forecast Assumptions (2026–2030)

This document outlines the detailed quantitative parameters, operational drivers, and segment-specific expansion coefficients for the **Base, Bear, and Bull forecast scenarios** driving the **Netflix FP&A platform** through the end of the decade.

---

## 📊 Tabular Overview of Core Scenario Assumptions

These parameters are loaded dynamically from `file:///Users/negat1vekronos/Documents/New%20project/netflix-fpna-dashboard/data/assumptions/forecast_assumptions_2026_2030.json` by the strategic forecasting and segment-matching algorithms.

### 1. Revenue Growth Drivers ($g_{c,y}$)
*   *Business Context:* Baseline year-over-year corporate top-line growth rate from which quarterly seasonal revenue is calculated.

| Scenario Case | FY2026 | FY2027 | FY2028 | FY2029 | FY2030 | Terminal Momentum |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| 🟢 **Bull Case** | $14.0\%$ | $13.0\%$ | $11.0\%$ | $10.0\%$ | $9.0\%$ | Aggressive international scaling and high-margin ad-tier leverage. |
| 🟡 **Base Case** | $13.0\%$ | $11.0\%$ | $9.0\%$ | $8.0\%$ | $7.0\%$ | Moderate, steady global membership expansion. |
| 🔴 **Bear Case** | $12.0\%$ | $8.0\%$ | $6.0\%$ | $5.0\%$ | $4.0\%$ | Domestic saturation, increased price competition, and churn spikes. |

---

### 2. Target Operating Margins
*   *Business Context:* Operating Income divided by Revenue. This driver models operating expenses and isolates fixed content costs.

| Scenario Case | FY2026 | FY2027 | FY2028 | FY2029 | FY2030 | Strategic Context |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| 🟢 **Bull Case** | $32.5\%$ | $33.5\%$ | $34.5\%$ | $35.5\%$ | $36.5\%$ | Scale leverage converts content spend into outsized profits. |
| 🟡 **Base Case** | $31.5\%$ | $32.0\%$ | $32.5\%$ | $33.0\%$ | $33.5\%$ | Gradual corporate efficiency gains and optimized G&A. |
| 🔴 **Bear Case** | $30.5\%$ | $30.0\%$ | $30.0\%$ | $30.5\%$ | $31.0\%$ | Inefficiencies in international markets and content cost pressure. |

---

### 3. Segment Growth Premiums ($P_r$)
*   *Business Context:* Segment-specific adjustments added to the baseline corporate growth rate ($g_{c,y}$) to reflect regional dynamics.
*   *Reconciliation:* Total segment outputs are normalized using a top-down reconciliation ratio to match corporate revenues exactly.

| Region Segment | UCAN | EMEA | LATAM | APAC | Strategic Rationale |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 🟢 **Bull Case** | $-1.0\%$ | $+2.0\%$ | $+1.0\%$ | $+5.0\%$ | Rapid ad-supported expansion in APAC and premium engagement in EMEA. |
| 🟡 **Base Case** | $-2.0\%$ | $+1.0\%$ | $0.0\%$ | $+4.0\%$ | Domestic maturity (UCAN) offset by high international growth. |
| 🔴 **Bear Case** | $-3.0\%$ | $0.0\%$ | $-1.0\%$ | $+2.0\%$ | Saturation in the US, deceleration in LATAM, and slower ad conversion. |

*   *Example Calculation (Base Case, FY2027 UCAN Growth):*
    $$\text{UCAN Growth Rate} = g_{c,2027} + P_{\text{UCAN}} = 11.0\% + (-2.0\%) = 9.0\%$$
*   *Example Calculation (Bull Case, FY2028 APAC Growth):*
    $$\text{APAC Growth Rate} = g_{c,2028} + P_{\text{APAC}} = 11.0\% + 5.0\% = 16.0\%$$

---

### 4. Free Cash Flow (FCF) Conversion of Revenue
*   *Business Context:* Operating Cash Flow minus Capital Expenditures, expressed as a percentage of total corporate revenue.

| Scenario Case | FY2026 | FY2027 | FY2028 | FY2029 | FY2030 | Structural Drivers |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| 🟢 **Bull Case** | $19.0\%$ | $21.0\%$ | $22.0\%$ | $23.0\%$ | $24.0\%$ | Significant structural turnaround with efficient content spend. |
| 🟡 **Base Case** | $18.0\%$ | $19.0\%$ | $20.0\%$ | $21.0\%$ | $22.0\%$ | Stable operations with normalized content capital cycles. |
| 🔴 **Bear Case** | $15.0\%$ | $15.0\%$ | $16.0\%$ | $16.0\%$ | $17.0\%$ | Elevated content expenditures and lower subscriber conversion. |
