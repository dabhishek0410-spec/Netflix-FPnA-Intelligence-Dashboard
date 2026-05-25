import os
import json
import pandas as pd
import duckdb

def generate_forecasts():
    processed_dir = "/Users/negat1vekronos/Documents/New project/netflix-fpna-dashboard/data/processed"
    assumptions_path = "/Users/negat1vekronos/Documents/New project/netflix-fpna-dashboard/data/assumptions/forecast_assumptions_2026_2030.json"
    
    # Load historical actuals
    corp_actuals = pd.read_parquet(os.path.join(processed_dir, "quarterly_financials.parquet"))
    regional_actuals = pd.read_parquet(os.path.join(processed_dir, "regional_revenue.parquet"))
    
    # Load assumptions
    with open(assumptions_path, "r") as f:
        assumptions = json.load(f)
        
    scenarios = ["base", "bear", "bull"]
    
    # Forecast horizon: 2026-Q2 to 2030-Q4
    forecast_quarters = []
    for year in range(2026, 2031):
        for quarter in ["Q1", "Q2", "Q3", "Q4"]:
            if year == 2026 and quarter == "Q1":
                continue # 2026-Q1 is actual
            forecast_quarters.append((year, quarter))
            
    all_corp_forecasts = []
    all_regional_forecasts = []
    
    # Let's include historical actuals first in the scenario datasets
    # Add type="actual" to actuals
    corp_actuals_with_type = corp_actuals.copy()
    corp_actuals_with_type["type"] = "actual"
    
    regional_actuals_with_type = regional_actuals.copy()
    regional_actuals_with_type["type"] = "actual"
    
    for scenario in scenarios:
        # Replicate actuals for this scenario
        corp_scen = corp_actuals_with_type.copy()
        corp_scen["scenario"] = scenario
        
        regional_scen = regional_actuals_with_type.copy()
        regional_scen["scenario"] = scenario
        
        # We will roll forward quarter by quarter
        for year, quarter in forecast_quarters:
            # 1. Get previous year's quarter
            prev_year = year - 1
            
            # Find corporate revenue from the same quarter in the previous year
            prev_corp_row = corp_scen[(corp_scen["year"] == prev_year) & (corp_scen["quarter"] == quarter)]
            if prev_corp_row.empty:
                raise ValueError(f"Previous year's quarter {prev_year}-{quarter} not found in scenario {scenario}")
            prev_corp_rev = prev_corp_row["revenue"].values[0]
            
            # Find regional revenues for the same quarter in the previous year
            prev_reg_rows = regional_scen[(regional_scen["year"] == prev_year) & (regional_scen["quarter"] == quarter)]
            if len(prev_reg_rows) != 4:
                raise ValueError(f"Expected 4 regional rows for {prev_year}-{quarter}, got {len(prev_reg_rows)}")
            
            prev_regions = {row["region"]: row["revenue"] for _, row in prev_reg_rows.iterrows()}
            
            # Get assumptions for this year and scenario
            yr_str = str(year)
            g_corp = assumptions[scenario]["revenueGrowth"][yr_str]
            margin = assumptions[scenario]["operatingMargin"][yr_str]
            fcf_conv = assumptions[scenario]["fcfConversionOfRevenue"][yr_str]
            
            # Forecast corporate revenue
            forecast_corp_rev = prev_corp_rev * (1 + g_corp)
            
            # Forecast regional revenues with regional premiums
            forecast_regional = {}
            for region in ["UCAN", "EMEA", "LATAM", "APAC"]:
                premium = assumptions[scenario]["regionalGrowthPremium"][region]
                g_region = g_corp + premium
                forecast_regional[region] = prev_regions[region] * (1 + g_region)
                
            # Reconcile regional revenues to match the forecasted corporate revenue exactly
            sum_regional = sum(forecast_regional.values())
            ratio = forecast_corp_rev / sum_regional
            
            reconciled_regional = {}
            for region, val in forecast_regional.items():
                reconciled_regional[region] = val * ratio
                
            # Forecast corporate operating income, net income, and free cash flow
            forecast_op_income = forecast_corp_rev * margin
            forecast_net_income = forecast_op_income * 0.75  # Assuming a standard 25% tax/interest rate
            forecast_fcf = forecast_corp_rev * fcf_conv
            
            # Append corporate row
            new_corp_row = pd.DataFrame([{
                "year": year,
                "quarter": quarter,
                "revenue": forecast_corp_rev,
                "operating_income": forecast_op_income,
                "net_income": forecast_net_income,
                "fcf": forecast_fcf,
                "type": "forecast",
                "scenario": scenario
            }])
            corp_scen = pd.concat([corp_scen, new_corp_row], ignore_index=True)
            
            # Append regional rows
            new_reg_rows = pd.DataFrame([
                {
                    "year": year,
                    "quarter": quarter,
                    "region": region,
                    "revenue": val,
                    "type": "forecast",
                    "scenario": scenario
                } for region, val in reconciled_regional.items()
            ])
            regional_scen = pd.concat([regional_scen, new_reg_rows], ignore_index=True)
            
        # Add to all scenarios
        all_corp_forecasts.append(corp_scen)
        all_regional_forecasts.append(regional_scen)
        
    # Combine all scenarios
    final_corp_df = pd.concat(all_corp_forecasts, ignore_index=True)
    final_regional_df = pd.concat(all_regional_forecasts, ignore_index=True)
    
    # Save to Parquet
    corp_forecast_path = os.path.join(processed_dir, "forecast_scenarios.parquet")
    reg_forecast_path = os.path.join(processed_dir, "forecast_regional_revenue.parquet")
    
    final_corp_df.to_parquet(corp_forecast_path, index=False)
    final_regional_df.to_parquet(reg_forecast_path, index=False)
    
    print(f"Corporate forecast scenarios saved to {corp_forecast_path} ({len(final_corp_df)} rows).")
    print(f"Regional forecast scenarios saved to {reg_forecast_path} ({len(final_regional_df)} rows).")
    
    # Write to DuckDB
    db_path = os.path.join(processed_dir, "netflix_fpa.db")
    conn = duckdb.connect(db_path)
    try:
        conn.execute("CREATE OR REPLACE TABLE forecast_scenarios AS SELECT * FROM final_corp_df")
        conn.execute("CREATE OR REPLACE TABLE forecast_regional_revenue AS SELECT * FROM final_regional_df")
        print("Successfully created forecast tables in DuckDB database.")
    except Exception as e:
        print(f"Failed to write forecasts to DuckDB: {e}")
    finally:
        conn.close()
        
    return final_corp_df, final_regional_df

if __name__ == "__main__":
    generate_forecasts()
