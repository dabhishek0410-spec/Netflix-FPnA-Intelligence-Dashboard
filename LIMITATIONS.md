# System Limitations, Accounting Approximations & Disclaimers

This document details the boundary conditions, analytical limitations, and intentional accounting approximations implemented in the **Netflix FP&A Strategic Forecasting platform**. It provides transparency for recruiters, financial analysts, and system administrators.

---

## 🚫 Disclaimer & Professional Limitations
> [!IMPORTANT]
> This platform is an independent professional engineering portfolio and educational showcase.
> *   **No Corporate Endorsement:** This application is not endorsed by, affiliated with, or officially representative of Netflix Inc. (NASDAQ: NFLX).
> *   **Not Investment Advice:** All forward-looking statements and model simulations are for educational purposes and should not be used as investment advice or financial recommendations.
> *   **Historical Sourcing:** Historical figures are sourced from Netflix's public SEC filings, investor relation letters, and company facts JSONs.

---

## 🧮 Accounting & Modeling Approximations

To establish a unified and performant relational database structure, several modeling approximations were applied:

### 1. Simplified Tax & Interest Structure for Forecasts
In the forecast engine, rather than modeling complex deferred tax assets, varying effective tax rates, and fluctuating interest schedules, Net Income is calculated using a flat percentage:
$$\text{Projected Net Income} = \text{Operating Income} \times (1 - \text{Simplified Tax/Interest Rate})$$
*   **Actuals Mapping:** Historical actuals reflect the exact GAAP Net Income reported by Netflix.
*   **Forecast Modeling:** Forecast periods (Q2 2026 to Q4 2030) apply a flat **$25.0\%$ simplified interest/tax rate** (Net Income is modeled at exactly $75\%$ of Operating Income) in Python (`generate_forecast_scenarios.py`) and a **$12.0\%$ simplified overhead** in the TypeScript forecast engine (`forecastExpenses.ts`) to simulate standard corporate tax and interest charges.

### 2. Segment Reconcilement Adjustments
During historical parsing, minor rounding discrepancies exist between the sum of the four segment revenues reported in Netflix's investor letters and the total GAAP revenue reported on the consolidated statement of operations.
*   **Discrepancy Resolution:** To guarantee database integrity and prevent regional reconciliation errors, these rounding differences (ranging from $\pm \$0.1\text{M}$ to $\$0.5\text{M}$) are programmatically added to the **UCAN segment** (the largest reporting region by revenue), ensuring that:
    $$\sum_{r} \text{Regional Revenues} \equiv \text{GAAP Corporate Revenue}$$

### 3. Static Foreign Exchange (FX) Models
Foreign exchange volatility fluctuates continuously. Rather than implementing real-time international currency translation matrices, the platform uses two FX representations:
*   **Historical actuals:** Captures FX translation volatility through static constant-currency comparisons (specifically, the $355\text{ bps}$ translation haircut modeled for the FY2022 USD expansion).
*   **Forecast models:** Projects values using flat, currency-stable USD estimates. Dynamic, forward-looking FX fluctuations are not simulated in the 2026–2030 horizon.

### 4. Q1 2026 Cash Flow Actuals
Historical quarterly cash flows are subject to high volatility due to irregular content production capital cycles, launch dates, and talent payment terms.
*   **Approximation:** Q1 2026 is treated as the anchor quarter for the actual-to-forecast transition. Cash flow indicators for this transition period apply historical cash-to-revenue averages to establish a stable baseline for the dynamic 5-year rolling model.
