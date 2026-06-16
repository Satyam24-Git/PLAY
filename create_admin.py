import os
import sys
from dotenv import load_dotenv

# Load env before getting client
load_dotenv()

# Add libs/shared-core to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'libs', 'shared-core'))
from supabase_client import get_supabase_client

supabase = get_supabase_client()

email = "admin@pplay.com"
password = "supersecretadmin123"

try:
    print(f"Attempting to create user: {email}...")
    res = supabase.auth.admin.create_user({
        "email": email,
        "password": password,
        "email_confirm": True,
        "user_metadata": {"full_name": "Super Admin"}
    })
    
    user_id = res.user.id
    print(f"Created auth user with ID: {user_id}")
    
    # Check if profile was auto-created by a database trigger
    profile_check = supabase.table('profiles').select('*').eq('id', user_id).execute()
    
    if not profile_check.data:
        # Create profile manually
        supabase.table('profiles').insert({
            "id": user_id,
            "full_name": "Super Admin",
            "user_type": "owner"
        }).execute()
        print("Created profile manually and set user_type='owner'")
    else:
        # Update existing profile
        supabase.table('profiles').update({
            "user_type": "owner"
        }).eq('id', user_id).execute()
        print("Updated existing profile to user_type='owner'")
        
    print("\n--- TEST ACCOUNT CREATED SUCCESSFULLY ---")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print("Role: owner (Super Admin)")

except Exception as e:
    print(f"Error: {e}")
