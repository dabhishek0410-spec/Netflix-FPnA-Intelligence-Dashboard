import os
import sys
import time

# Ensure the etl directory is on the path for clean imports
etl_dir = os.path.dirname(os.path.abspath(__file__))
if etl_dir not in sys.path:
    sys.path.append(etl_dir)

# Import the pipeline steps
from fetch_sec_companyfacts import fetch_companyfacts
from fetch_sec_submissions import fetch_submissions
from fetch_netflix_ir_letters import fetch_ir_letters
from parse_financials import parse_financials
from parse_regional_revenue import parse_regional_revenue
from build_quarterly_dataset import build_quarterly_dataset
from generate_forecast_scenarios import generate_forecasts
from generate_analyst_insights import generate_insights
from validate_data import run_validation

def main():
    print("====================================================")
    print("      NETFLIX FP&A INTELLIGENCE ETL PIPELINE        ")
    print("====================================================")
    start_time = time.time()
    
    steps = [
        ("Step 1: Fetching SEC Company Facts", fetch_companyfacts),
        ("Step 2: Fetching SEC Submissions", fetch_submissions),
        ("Step 3: Fetching Netflix IR Letters Highlights", fetch_ir_letters),
        ("Step 4: Parsing Corporate Financials", parse_financials),
        ("Step 5: Parsing and Reconciling Regional Revenue", parse_regional_revenue),
        ("Step 6: Building Quarterly Actuals Dataset", build_quarterly_dataset),
        ("Step 7: Generating Forecast Scenarios (2026-2030)", generate_forecasts),
        ("Step 8: Compiling Analyst Strategic Insights", generate_insights),
        ("Step 9: Running Data Quality Validation Engine", run_validation)
    ]
    
    success = True
    for step_name, step_func in steps:
        print(f"\n--- Running: {step_name} ---")
        try:
            # Step 9 run_validation returns a boolean, others return dataframes or True/False.
            # We treat any exception as a failure, and if it's run_validation, we check the boolean result.
            result = step_func()
            if step_name.startswith("Step 9") and not result:
                print(f"[FAIL] {step_name} reported validation errors.")
                success = False
                break
            print("[OK] Completed successfully.")
        except Exception as e:
            print(f"[FAIL] Exception occurred during {step_name}: {e}")
            import traceback
            traceback.print_exc()
            success = False
            break
            
    end_time = time.time()
    elapsed = end_time - start_time
    
    print("\n====================================================")
    if success:
        print(f"PIPELINE RUN: SUCCESS (Elapsed Time: {elapsed:.2f} seconds)")
        print("All Parquet, JSON, and DuckDB outputs have been refreshed!")
    else:
        print(f"PIPELINE RUN: FAILED (Elapsed Time: {elapsed:.2f} seconds)")
        sys.exit(1)
    print("====================================================")

if __name__ == "__main__":
    main()
