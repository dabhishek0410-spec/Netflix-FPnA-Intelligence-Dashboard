import os
import json
import pandas as pd

def generate_insights():
    processed_dir = "/Users/negat1vekronos/Documents/New project/netflix-fpna-dashboard/data/processed"
    raw_dir = "/Users/negat1vekronos/Documents/New project/netflix-fpna-dashboard/data/raw"
    
    corp_path = os.path.join(processed_dir, "forecast_scenarios.parquet")
    reg_path = os.path.join(processed_dir, "forecast_regional_revenue.parquet")
    ir_path = os.path.join(raw_dir, "ir_letters.json")
    
    if not os.path.exists(corp_path) or not os.path.exists(reg_path):
        raise FileNotFoundError("Forecast parquet files are missing. Run generate_forecast_scenarios.py first.")
        
    df_corp = pd.read_parquet(corp_path)
    df_reg = pd.read_parquet(reg_path)
    
    # Load qualitative IR highlights
    ir_commentary = []
    if os.path.exists(ir_path):
        with open(ir_path, "r") as f:
            ir_commentary = json.load(f)
            
    insights = {
        "metadata": {
            "title": "Netflix FP&A Strategic Intelligence Report (2026-2030)",
            "generated_at": "2026-05-24T14:40:00Z",
            "currency": "USD Millions"
        },
        "financial_cagr_analysis_2025_2030": {},
        "cumulative_fcf_generation_2026_2030": {},
        "regional_share_shifts_2025_vs_2030": {},
        "strategic_highlights": [
            "Q1 2026 financials were dramatically bolstered by a $2.8 billion Warner Bros. Discovery merger termination fee following mutual termination under regulatory headwinds.",
            "WBD termination fee proceeds are being strategically reallocated to accelerate content development and share buybacks.",
            "Netflix has successfully transitioned away from reporting quarterly subscriber additions, focusing the investment community on revenue, operating margin, and engagement metrics.",
            "APAC and EMEA continue to exhibit high relative growth premiums, whereas UCAN remains the mature, cash-cow segment."
        ]
    }
    
    # 1. CAGR Analysis (2025 vs 2030)
    # Calculate FY 2025 total revenue (Historical Actuals)
    # Actuals have type="actual" or scenario-independent. Let's get it from the base scenario actuals rows.
    df_2025 = df_corp[(df_corp["year"] == 2025) & (df_corp["scenario"] == "base")]
    fy_2025_revenue = df_2025["revenue"].sum()
    
    scenarios = ["base", "bear", "bull"]
    for scen in scenarios:
        # Calculate FY 2030 total revenue
        df_2030 = df_corp[(df_corp["year"] == 2030) & (df_corp["scenario"] == scen)]
        fy_2030_revenue = df_2030["revenue"].sum()
        
        cagr = (fy_2030_revenue / fy_2025_revenue) ** (1 / 5) - 1
        
        insights["financial_cagr_analysis_2025_2030"][scen] = {
            "fy_2025_revenue": round(fy_2025_revenue, 2),
            "fy_2030_revenue": round(fy_2030_revenue, 2),
            "5yr_revenue_cagr": round(cagr, 4),
            "5yr_revenue_cagr_pct": f"{cagr*100:.2f}%"
        }
        
    # 2. Cumulative FCF Generation (2026 to 2030)
    for scen in scenarios:
        # We look at forecast period rows (2026 to 2030)
        df_forecast = df_corp[(df_corp["year"] >= 2026) & (df_corp["scenario"] == scen)]
        
        # Note: 2026-Q1 was actual, let's sum Q2-Q4 of 2026 plus 2027-2030
        fcf_sum = 0.0
        for idx, row in df_forecast.iterrows():
            if row["year"] == 2026 and row["quarter"] == "Q1":
                continue # Skip Q1 actual for forecast accumulation, or include it if preferred. Let's accumulate forecast only.
            fcf_sum += row["fcf"]
            
        insights["cumulative_fcf_generation_2026_2030"][scen] = {
            "total_fcf_millions": round(fcf_sum, 2),
            "average_annual_fcf_millions": round(fcf_sum / 4.75, 2) # 4.75 years (2026 Q2-Q4 is 0.75 yr, 2027-2030 is 4 yrs)
        }
        
    # 3. Regional Share Shifts (2025 vs 2030)
    # Calculate 2025 actual shares
    df_reg_2025 = df_reg[(df_reg["year"] == 2025) & (df_reg["scenario"] == "base")]
    total_reg_2025 = df_reg_2025["revenue"].sum()
    
    shares_2025 = {}
    for region in ["UCAN", "EMEA", "LATAM", "APAC"]:
        reg_rev = df_reg_2025[df_reg_2025["region"] == region]["revenue"].sum()
        shares_2025[region] = reg_rev / total_reg_2025
        
    for scen in scenarios:
        df_reg_2030 = df_reg[(df_reg["year"] == 2030) & (df_reg["scenario"] == scen)]
        total_reg_2030 = df_reg_2030["revenue"].sum()
        
        scen_shares = {}
        for region in ["UCAN", "EMEA", "LATAM", "APAC"]:
            reg_rev = df_reg_2030[df_reg_2030["region"] == region]["revenue"].sum()
            share_2030 = reg_rev / total_reg_2030
            scen_shares[region] = {
                "revenue_2025": round(df_reg_2025[df_reg_2025["region"] == region]["revenue"].sum(), 2),
                "share_2025_pct": f"{shares_2025[region]*100:.2f}%",
                "revenue_2030": round(reg_rev, 2),
                "share_2030_pct": f"{share_2030*100:.2f}%",
                "share_shift_pct": f"{(share_2030 - shares_2025[region])*100:+.2f}%"
            }
        insights["regional_share_shifts_2025_vs_2030"][scen] = scen_shares
        
    # Save the insights to file
    insights_path = os.path.join(processed_dir, "analyst_insights.json")
    with open(insights_path, "w") as f:
        json.dump(insights, f, indent=2)
        
    print(f"Analyst insights compiled and written to: {insights_path}")
    return insights

if __name__ == "__main__":
    generate_insights()
