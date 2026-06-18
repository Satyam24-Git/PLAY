import os
from supabase import create_client, Client
from dotenv import load_dotenv

_client_instance = None

def get_supabase_client() -> Client:
    global _client_instance
    if _client_instance is not None:
        return _client_instance

    load_dotenv()
    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_KEY", "")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")
        
    _client_instance = create_client(url, key)
    return _client_instance
