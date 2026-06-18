import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Add the shared-core to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from shared_core.supabase_client import get_supabase_client

app = FastAPI(title="tournament-service")

class Tournament(BaseModel):
    title: str
    sport_type: str
    prize_pool: Optional[float] = 0.0
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    organizer_id: str
    image_url: Optional[str] = None

@app.get('/')
def read_root():
    return {'status': 'healthy'}

@app.get("/api/tournaments")
def get_tournaments():
    try:
        supabase = get_supabase_client()
        response = supabase.table("tournaments").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tournaments")
def create_tournament(tournament: Tournament):
    try:
        supabase = get_supabase_client()
        data = tournament.model_dump(exclude_unset=True)
        response = supabase.table("tournaments").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
