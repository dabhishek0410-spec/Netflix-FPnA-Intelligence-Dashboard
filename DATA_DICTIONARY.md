# Netflix FP&A Dashboard Data Dictionary

This document serves as the formal repository data handbook for the **Netflix FP&A Intelligence & Strategic Forecasting platform**. It details the exact schemas, logical data models, data types, and file locations for all historical actuals, forecast scenarios, relational DuckDB tables, and JSON strategic assumption matrices.

---

## 📂 Physical Directory Layout & Storage Specifications

All analytical datasets reside within the `data/` sub-directory, split across distinct stages:

```
netflix-fpna-dashboard/data/
├── raw/
│   └── companyfacts.json                     # Comprehensive SEC XBRL tagged data
├── processed/
│   ├── netflix_fpa.db                        # Sub-millisecond DuckDB relational store
│   ├── quarterly_financials.parquet          # Columnar store of historical actuals
│   ├── regional_revenue.parquet              # Columnar store of segment actuals
│   ├── forecast_scenarios.parquet            # Columnar store of unified scenario projections
│   ├── forecast_regional_revenue.parquet     # Columnar store of segment scenario projections
│   ├── corporate_financials_raw.csv          # Intermediate corporate actuals in CSV format
│   ├── regional_revenue_raw.csv              # Intermediate segment actuals in CSV format
│   └── analyst_insights.json                 # Pre-compiled qualitative analytics JSON
└── assumptions/
    └── forecast_assumptions_2026_2030.json   # Base, bear, and bull model drivers
```

---

## 🏛️ Relational Schema Definitions (DuckDB & Parquet)

The platform utilizes a unified, relational database structure within `netflix_fpa.db` that matches the logical schema of the compiled Apache Parquet tables.

### 1. `quarterly_actuals` / `quarterly_financials.parquet`
*   **Description:** Stores historical quarterly corporate income statements and cash flow summaries extracted from verified SEC filings.
*   **Granularity:** Quarterly (historical actuals only).
*   **Chronological Coverage:** CY2020-Q1 through CY2026-Q1 (25 rows).

| Column Name | SQL Data Type | Unit / Range | Constraints | Business Definition |
| :--- | :--- | :--- | :--- | :--- |
| `year` | `INTEGER` | `2020 - 2026` | `PRIMARY KEY` | Calendar year of the filing period. |
| `quarter` | `VARCHAR` | `Q1, Q2, Q3, Q4` | `PRIMARY KEY` | Calendar quarter of the filing period. |
| `revenue` | `DOUBLE` | Millions USD | `NOT NULL` | Total GAAP net revenues from contracts with customers. |
| `operating_income` | `DOUBLE` | Millions USD | `NOT NULL` | Operating income (Revenue minus Cost of Revenues and OpEx). |
| `net_income` | `DOUBLE` | Millions USD | `NOT NULL` | GAAP net income attributable to common shareholders. |
| `fcf` | `DOUBLE` | Millions USD | `NOT NULL` | Free Cash Flow (Operating Cash Flow minus Capital Expenditures). |

---

### 2. `regional_revenue_actuals` / `regional_revenue.parquet`
*   **Description:** Stores geographic segment revenues, ensuring absolute reconciliation with corporate totals.
*   **Granularity:** Quarterly per regional segment.
*   **Chronological Coverage:** CY2020-Q1 through CY2026-Q1 (100 rows).

| Column Name | SQL Data Type | Unit / Range | Constraints | Business Definition |
| :--- | :--- | :--- | :--- | :--- |
| `year` | `INTEGER` | `2020 - 2026` | `PRIMARY KEY` | Calendar year of the segment revenue. |
| `quarter` | `VARCHAR` | `Q1, Q2, Q3, Q4` | `PRIMARY KEY` | Calendar quarter of the segment revenue. |
| `region` | `VARCHAR` | `UCAN, EMEA, LATAM, APAC` | `PRIMARY KEY` | Geographic reporting region. |
| `revenue` | `DOUBLE` | Millions USD | `NOT NULL` | Allocated revenue reconciled exactly to corporate totals. |

---

### 3. `forecast_scenarios` / `forecast_scenarios.parquet`
*   **Description:** Represents the unified, multi-scenario corporate forecasting model.
*   **Granularity:** Quarterly per scenario per forecast type.
*   **Chronological Coverage:** CY2020-Q1 through CY2030-Q4 (132 rows).

| Column Name | SQL Data Type | Unit / Range | Constraints | Business Definition |
| :--- | :--- | :--- | :--- | :--- |
| `year` | `INTEGER` | `2020 - 2030` | `PRIMARY KEY` | Calendar year of the actual or projected period. |
| `quarter` | `VARCHAR` | `Q1, Q2, Q3, Q4` | `PRIMARY KEY` | Calendar quarter of the actual or projected period. |
| `revenue` | `DOUBLE` | Millions USD | `NOT NULL` | Projected revenue under the specified scenario. |
| `operating_income` | `DOUBLE` | Millions USD | `NOT NULL` | Projected operating income based on driver margins. |
| `net_income` | `DOUBLE` | Millions USD | `NOT NULL` | Projected net income (Operating Income minus interest and taxes). |
| `fcf` | `DOUBLE` | Millions USD | `NOT NULL` | Projected Free Cash Flow using FCF-to-Revenue drivers. |
| `type` | `VARCHAR` | `actual, forecast` | `NOT NULL` | Period category flag separating historicals from projections. |
| `scenario` | `VARCHAR` | `base, bear, bull` | `PRIMARY KEY` | Simulated strategic scenario case. |

---

### 4. `forecast_regional_revenue` / `forecast_regional_revenue.parquet`
*   **Description:** Contains forecasted regional segment revenues, fully reconciled against parent scenario figures.
*   **Granularity:** Quarterly per region per scenario.
*   **Chronological Coverage:** CY2020-Q1 through CY2030-Q4 (528 rows).

| Column Name | SQL Data Type | Unit / Range | Constraints | Business Definition |
| :--- | :--- | :--- | :--- | :--- |
| `year` | `INTEGER` | `2020 - 2030` | `PRIMARY KEY` | Calendar year of the segment projection. |
| `quarter` | `VARCHAR` | `Q1, Q2, Q3, Q4` | `PRIMARY KEY` | Calendar quarter of the segment projection. |
| `region` | `VARCHAR` | `UCAN, EMEA, LATAM, APAC` | `PRIMARY KEY` | Geographic reporting region. |
| `revenue` | `DOUBLE` | Millions USD | `NOT NULL` | Reconciled forecasted regional segment revenue. |
| `type` | `VARCHAR` | `actual, forecast` | `NOT NULL` | Period category flag. |
| `scenario` | `VARCHAR` | `base, bear, bull` | `PRIMARY KEY` | Simulated strategic scenario case. |

---

## 📦 Assumptions & Static File Schemas

### 1. `forecast_assumptions_2026_2030.json`
Stores driver-based inputs that fuel the forecast algorithms.
*   **Root Structure:** Keys: `"base"`, `"bear"`, `"bull"`.
*   **Sub-Schema for each scenario:**
    *   `revenueGrowth` (`Object`): Maps string years `"2026"` through `"2030"` to growth floats (e.g., `0.13` represents $13.0\%$).
    *   `operatingMargin` (`Object`): Maps string years `"2026"` through `"2030"` to operating margin targets (e.g., `0.315` represents $31.5\%$).
    *   `regionalGrowthPremium` (`Object`): Maps segment abbreviations (`"UCAN"`, `"EMEA"`, `"LATAM"`, `"APAC"`) to segment growth premiums/penalties added directly to the baseline revenue growth (e.g., `-0.02` represent a $2.0\%$ discount).
    *   `fcfConversionOfRevenue` (`Object`): Maps string years `"2026"` through `"2030"` to the Free Cash Flow as a percentage of revenue (e.g., `0.18` represents $18.0\%$).

---

### 2. `analyst_insights.json`
Stores qualitative variance narrations generated dynamically by the rule-based trigger engine.
*   **Root Structure:** `Array` of analytical insight objects.
*   **Object Schema:**
    *   `id` (`String`): Unique identifier code (e.g., `Rule1_FC_2027`).
    *   `title` (`String`): Premium corporate-grade title of the strategic variance.
    *   `period` (`String`): Targeted fiscal period (e.g., `FY2027` or `FY2026-FY2030`).
    *   `scenario` (`String`): Associated case if forecasted (`"base"`, `"bear"`, `"bull"`, or `undefined` for actuals).
    *   `metric` (`String`): Primary metric audited.
    *   `actualValue` (`Number`): Reconciled actual figure in USD millions or rates (optional).
    *   `forecastValue` (`Number`): Projected value (optional).
    *   `priorValue` (`Number`): Prior period's baseline value for YoY growth comparison.
    *   `variance` (`Number`): Absolute difference in nominal value.
    *   `variancePercent` (`Number`): Percentage growth rate or rate difference.
    *   `triggerRule` (`String`): Name of the activated rule from the 10-rule strategic engine.
    *   `explanation` (`String`): Auto-narrated qualitative text detailing drivers.
    *   `driver` (`String`): Core underlying business or operational driver.
    *   `sourceType` (`String`): Data origin identifier (e.g., `Actual`, `Analyst Assumption`).
    *   `confidence` (`String`): Level of confidence (`High`, `Medium`, `Low`).
    *   `sourceReference` (`String`): Auditable document reference (e.g., `10-K FY2024`, `Base Forecast Model`).
