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
    user_type: Optional[str] = "player"

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
        
        # Check if profile exists, if not create it
        profile_res = supabase.table("profiles").select("*").eq("id", response.user.id).execute()
        if not profile_res.data:
            supabase.table("profiles").insert({
                "id": response.user.id, 
                "full_name": req.email.split('@')[0], 
                "user_type": req.user_type
            }).execute()
            
        return {"user": {"id": response.user.id, "email": response.user.email}}
    except Exception as e:
        print("ERROR IN VERIFY OTP e1:", repr(e))
        # If sign in fails, the user probably doesn't exist, so sign them up!
        try:
            response = supabase.auth.admin.create_user({
                "email": req.email, 
                "password": "DummyPassword123!",
                "email_confirm": True
            })
            supabase.table("profiles").insert({
                "id": response.user.id, 
                "full_name": req.email.split('@')[0], 
                "user_type": req.user_type
            }).execute()
            return {"user": {"id": response.user.id, "email": response.user.email}}
        except Exception as e2:
            print("ERROR IN VERIFY OTP e2:", repr(e2))
            raise HTTPException(status_code=500, detail=str(e2))

@app.post("/api/auth/verify-signin-otp")
def verify_signin_otp(req: VerifyOtpReq):
    if req.token != "123456":
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    supabase = get_supabase_client()
    try:
        # Try to sign in with a dummy password
        response = supabase.auth.sign_in_with_password({"email": req.email, "password": "DummyPassword123!"})
        
        # Link to profiles table - ensure the profile exists
        profile_res = supabase.table("profiles").select("*").eq("id", response.user.id).execute()
        if not profile_res.data:
            raise HTTPException(status_code=404, detail="Profile not found. Please sign up first.")
            
        return {"user": {"id": response.user.id, "email": response.user.email}, "profile": profile_res.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials or user does not exist")
