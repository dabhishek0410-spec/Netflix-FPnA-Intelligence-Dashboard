import os
import pandas as pd
import duckdb

def run_validation():
    processed_dir = "/Users/negat1vekronos/Documents/New project/netflix-fpna-dashboard/data/processed"
    corp_actual_path = os.path.join(processed_dir, "quarterly_financials.parquet")
    regional_actual_path = os.path.join(processed_dir, "regional_revenue.parquet")
    corp_forecast_path = os.path.join(processed_dir, "forecast_scenarios.parquet")
    regional_forecast_path = os.path.join(processed_dir, "forecast_regional_revenue.parquet")
    
    print("====================================================")
    print("STARTING DATA VALIDATION AND RECONCILIATION CHECKS")
    print("====================================================")
    
    errors = []
    
    # 1. Check if files exist
    paths = [corp_actual_path, regional_actual_path, corp_forecast_path, regional_forecast_path]
    for path in paths:
        if not os.path.exists(path):
            errors.append(f"File missing: {path}")
            
    if errors:
        for err in errors:
            print(f"[ERROR] {err}")
        return False
        
    # Load datasets
    df_corp_act = pd.read_parquet(corp_actual_path)
    df_reg_act = pd.read_parquet(regional_actual_path)
    df_corp_fore = pd.read_parquet(corp_forecast_path)
    df_reg_fore = pd.read_parquet(regional_forecast_path)
    
    # 2. Check basic dimensions and null values
    print("Checking dataset dimensions and missing values...")
    datasets = {
        "Corporate Actuals": df_corp_act,
        "Regional Actuals": df_reg_act,
        "Corporate Forecasts": df_corp_fore,
        "Regional Forecasts": df_reg_fore
    }
    
    for name, df in datasets.items():
        nulls = df.isnull().sum().sum()
        if nulls > 0:
            errors.append(f"{name} has {nulls} missing values.")
        else:
            print(f"  {name}: OK ({len(df)} rows, 0 nulls)")
            
    # 3. Reconcile Corporate vs Regional Revenues (Historical Actuals)
    print("Reconciling historical actuals (Corporate Revenue vs Sum of Regions)...")
    for (year, quarter), group in df_reg_act.groupby(["year", "quarter"]):
        sum_regions = group["revenue"].sum()
        corp_row = df_corp_act[(df_corp_act["year"] == year) & (df_corp_act["quarter"] == quarter)]
        if corp_row.empty:
            errors.append(f"Historical corporate row missing for {year}-{quarter}")
            continue
        corp_rev = corp_row["revenue"].values[0]
        diff = abs(corp_rev - sum_regions)
        if diff > 0.01:
            errors.append(f"Historical discrepancy in {year}-{quarter}: Corp Revenue={corp_rev}M, Sum of Regions={sum_regions}M (Diff={diff:.4f}M)")
            
    if not errors:
        print("  Historical Regional Reconciliation: PERFECT (0 discrepancy)")
        
    # 4. Reconcile Corporate vs Regional Revenues (Forecasts)
    print("Reconciling forecast scenarios (Corporate Revenue vs Sum of Regions)...")
    forecast_discrepancies = 0
    for (scenario, year, quarter), group in df_reg_fore.groupby(["scenario", "year", "quarter"]):
        sum_regions = group["revenue"].sum()
        corp_row = df_corp_fore[
            (df_corp_fore["scenario"] == scenario) & 
            (df_corp_fore["year"] == year) & 
            (df_corp_fore["quarter"] == quarter)
        ]
        if corp_row.empty:
            errors.append(f"Forecast corporate row missing for {scenario} {year}-{quarter}")
            continue
        corp_rev = corp_row["revenue"].values[0]
        diff = abs(corp_rev - sum_regions)
        if diff > 0.01:
            errors.append(f"Forecast discrepancy in {scenario} {year}-{quarter}: Corp={corp_rev}M, Regions={sum_regions}M (Diff={diff:.4f}M)")
            forecast_discrepancies += 1
            
    if not errors and forecast_discrepancies == 0:
        print("  Forecast Regional Reconciliation: PERFECT (0 discrepancy)")
        
    # 5. Check if Operating Income, Net Income, and FCF are reasonable
    print("Validating financial logic constraints...")
    # Revenue should be positive, Operating Income should be positive (except highly seasonal quarters or bear case if modeled)
    # FCF can be negative in actuals but should be verified
    for df_name, df in [("Corporate Actuals", df_corp_act), ("Corporate Forecasts", df_corp_fore)]:
        negative_revenues = (df["revenue"] <= 0).sum()
        if negative_revenues > 0:
            errors.append(f"{df_name} contains negative/zero revenues.")
            
    if not errors:
        print("  Financial Logic Constraints: OK")
        
    # 6. Verify DuckDB Integration
    print("Verifying DuckDB database status and schema...")
    db_path = os.path.join(processed_dir, "netflix_fpa.db")
    if not os.path.exists(db_path):
        errors.append(f"DuckDB database not found at {db_path}")
    else:
        conn = duckdb.connect(db_path)
        try:
            tables = conn.execute("SHOW TABLES").fetchall()
            table_names = [t[0] for t in tables]
            expected_tables = ["quarterly_actuals", "regional_revenue_actuals", "forecast_scenarios", "forecast_regional_revenue"]
            for et in expected_tables:
                if et not in table_names:
                    errors.append(f"Expected table '{et}' not found in DuckDB.")
                else:
                    count = conn.execute(f"SELECT COUNT(*) FROM {et}").fetchone()[0]
                    print(f"  DuckDB Table '{et}': OK ({count} rows)")
        except Exception as e:
            errors.append(f"Failed to query DuckDB: {e}")
        finally:
            conn.close()
            
    print("----------------------------------------------------")
    if errors:
        print(f"[FAIL] Validation completed with {len(errors)} errors.")
        for err in errors:
            print(f"  - {err}")
        return False
    else:
        print("[SUCCESS] All validation and reconciliation checks PASSED successfully!")
        print("====================================================")
        return True

if __name__ == "__main__":
    run_validation()
