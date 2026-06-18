import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Add the shared-core to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from shared_core.supabase_client import get_supabase_client

app = FastAPI(title="booking-service")

class Booking(BaseModel):
    venue_id: str
    user_id: str
    start_time: str
    end_time: str
    total_price: float
    status: Optional[str] = "pending"

@app.get('/')
def read_root():
    return {'status': 'healthy'}

@app.get("/api/bookings")
def get_bookings():
    try:
        supabase = get_supabase_client()
        # Fetch bookings and related venue data
        response = supabase.table("bookings").select("*, venues(*)").execute()
        
        # Map them properly for the frontend
        bookings = []
        for b in response.data:
            # Map venues -> venue
            b['venue'] = b.get('venues')
            bookings.append(b)
            
        return bookings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/bookings")
def create_booking(booking: Booking):
    try:
        supabase = get_supabase_client()
        data = booking.model_dump(exclude_unset=True)
        response = supabase.table("bookings").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
