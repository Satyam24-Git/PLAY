import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Add the shared-core to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from shared_core.supabase_client import get_supabase_client

app = FastAPI(title="profile-service")

class Profile(BaseModel):
    id: str
    full_name: str
    avatar_url: Optional[str] = None
    user_type: Optional[str] = "player"

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    sports: Optional[list[str]] = None
    state: Optional[str] = None
    city: Optional[str] = None

@app.get('/')
def read_root():
    return {'status': 'healthy'}

@app.get("/api/profiles/{user_id}")
def get_profile(user_id: str):
    try:
        supabase = get_supabase_client()
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/profiles")
def create_profile(profile: Profile):
    try:
        supabase = get_supabase_client()
        data = profile.model_dump(exclude_unset=True)
        response = supabase.table("profiles").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/profiles/{user_id}")
def update_profile(user_id: str, profile: ProfileUpdate):
    try:
        supabase = get_supabase_client()
        data = profile.model_dump(exclude_unset=True)
        response = supabase.table("profiles").update(data).eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))
