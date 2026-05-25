import os
import pandas as pd
import duckdb

def build_quarterly_dataset():
    processed_dir = "/Users/negat1vekronos/Documents/New project/netflix-fpna-dashboard/data/processed"
    os.makedirs(processed_dir, exist_ok=True)
    
    corp_csv_path = os.path.join(processed_dir, "corporate_financials_raw.csv")
    regional_csv_path = os.path.join(processed_dir, "regional_revenue_raw.csv")
    
    if not os.path.exists(corp_csv_path) or not os.path.exists(regional_csv_path):
        raise FileNotFoundError("Parsed CSV actuals files are missing. Make sure to run parse_financials.py and parse_regional_revenue.py first.")
        
    # Read files
    corp_df = pd.read_csv(corp_csv_path)
    regional_df = pd.read_csv(regional_csv_path)
    
    # Save to Parquet
    corp_parquet_path = os.path.join(processed_dir, "quarterly_financials.parquet")
    regional_parquet_path = os.path.join(processed_dir, "regional_revenue.parquet")
    
    corp_df.to_parquet(corp_parquet_path, index=False)
    regional_df.to_parquet(regional_parquet_path, index=False)
    
    print(f"Corporate financials saved to Parquet at: {corp_parquet_path}")
    print(f"Regional revenue saved to Parquet at: {regional_parquet_path}")
    
    # Write to local DuckDB database
    db_path = os.path.join(processed_dir, "netflix_fpa.db")
    print(f"Connecting to DuckDB database at: {db_path}")
    
    conn = duckdb.connect(db_path)
    try:
        # Register Pandas DataFrames as tables in DuckDB
        conn.execute("CREATE OR REPLACE TABLE quarterly_actuals AS SELECT * FROM corp_df")
        conn.execute("CREATE OR REPLACE TABLE regional_revenue_actuals AS SELECT * FROM regional_df")
        print("Successfully created actuals tables in DuckDB database.")
    except Exception as e:
        print(f"Failed to write to DuckDB: {e}")
    finally:
        conn.close()
        
    return corp_df, regional_df

if __name__ == "__main__":
    build_quarterly_dataset()
