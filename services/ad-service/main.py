import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Add the shared-core to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from shared_core.supabase_client import get_supabase_client

app = FastAPI(title="ad-service")

class Advertisement(BaseModel):
    title: str
    subtitle: str
    image_url: Optional[str] = None
    target_url: Optional[str] = None

@app.get('/')
def read_root():
    return {'status': 'healthy'}

@app.get("/api/ads")
def get_ads():
    try:
        supabase = get_supabase_client()
        response = supabase.table("advertisements").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ads")
def create_ad(ad: Advertisement):
    try:
        supabase = get_supabase_client()
        data = ad.model_dump(exclude_unset=True)
        response = supabase.table("advertisements").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
