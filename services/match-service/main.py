import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Add the shared-core to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from shared_core.supabase_client import get_supabase_client

app = FastAPI(title="match-service")

class Match(BaseModel):
    creator_id: str
    venue_id: Optional[str] = None
    sport_type: str
    date: str
    max_players: int
    current_players: Optional[int] = 1
    status: Optional[str] = "open"
    image_url: Optional[str] = None

@app.get('/')
def read_root():
    return {'status': 'healthy'}

@app.get("/api/matches")
def get_matches():
    try:
        supabase = get_supabase_client()
        # Fetch matches along with related profiles and venues
        response = supabase.table("matches").select("*, profiles!creator_id(full_name), venues(*)").execute()
        
        # Map them properly for the frontend
        matches = []
        for m in response.data:
            # Map profiles -> creator
            m['creator'] = m.get('profiles')
            # Map venues -> venue
            m['venue'] = m.get('venues')
            matches.append(m)
            
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/matches")
def create_match(match: Match):
    try:
        supabase = get_supabase_client()
        data = match.model_dump(exclude_unset=True)
        response = supabase.table("matches").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
