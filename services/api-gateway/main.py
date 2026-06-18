from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="api-gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICE_MAP = {
    "auth": "http://localhost:8001/api/auth",
    "profiles": "http://localhost:8002/api/profiles",
    "tournaments": "http://localhost:8003/api/tournaments",
    "venues": "http://localhost:8004/api/venues",
    "bookings": "http://localhost:8005/api/bookings",
    "matches": "http://localhost:8006/api/matches",
    "ads": "http://localhost:8007/api/ads",
    "shop": "http://localhost:8014/api",
}

@app.get("/")
def read_root():
    return {"message": "Welcome to API Gateway"}

@app.api_route("/api/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def route_api(service: str, path: str, request: Request):
    if service not in SERVICE_MAP:
        raise HTTPException(status_code=404, detail="Service not found")
        
    url = f"{SERVICE_MAP[service]}/{path}" if path else SERVICE_MAP[service]
    
    async with httpx.AsyncClient() as client:
        try:
            body = await request.body()
            response = await client.request(
                method=request.method,
                url=url,
                content=body,
                headers=dict(request.headers),
                timeout=10.0
            )
            return Response(content=response.content, status_code=response.status_code, media_type=response.headers.get("content-type", "application/json"))
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Bad Gateway: {str(e)}")

@app.api_route("/api/{service}", methods=["GET", "POST", "PUT", "DELETE"])
async def route_api_root(service: str, request: Request):
    return await route_api(service, "", request)
