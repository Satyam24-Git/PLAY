import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Add the shared-core to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from shared_core.supabase_client import get_supabase_client

app = FastAPI(title="auth-service")

class SendOtpReq(BaseModel):
    email: str

class VerifyOtpReq(BaseModel):
    email: str
    token: str

@app.get('/')
def read_root():
    return {'status': 'healthy'}

@app.post("/api/auth/send-otp")
def send_otp(req: SendOtpReq):
    # Mock sending OTP
    return {"message": "OTP sent! (Use 123456)"}

@app.post("/api/auth/verify-otp")
def verify_otp(req: VerifyOtpReq):
    if req.token != "123456":
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    supabase = get_supabase_client()
    try:
        # Try to sign in with a dummy password
        response = supabase.auth.sign_in_with_password({"email": req.email, "password": "DummyPassword123!"})
        return {"user": {"id": response.user.id, "email": response.user.email}}
    except Exception as e:
        # If sign in fails, the user probably doesn't exist, so sign them up!
        try:
            response = supabase.auth.sign_up({"email": req.email, "password": "DummyPassword123!"})
            return {"user": {"id": response.user.id, "email": response.user.email}}
        except Exception as e2:
            raise HTTPException(status_code=500, detail=str(e2))
