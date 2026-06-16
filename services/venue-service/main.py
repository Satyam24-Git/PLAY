from fastapi import FastAPI, HTTPException
import sys
import os

# Add the shared-core to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from shared_core.supabase_client import get_supabase_client

app = FastAPI(title="venue-service")

@app.get("/")
def read_root():
    return {"message": "Welcome to venue-service"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/venues")
def get_venues():
    try:
        supabase = get_supabase_client()
        response = supabase.table("venues").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/venues")
def create_venue(venue: dict):
    try:
        supabase = get_supabase_client()
        response = supabase.table("venues").insert(venue).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
