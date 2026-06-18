from fastapi import FastAPI, Request, HTTPException
import httpx

app = FastAPI(title="api-gateway")

SERVICE_MAP = {
    "venues": "http://localhost:8004/api/venues",
    "shop": "http://localhost:8014/api",
    # other services will be added here
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
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Bad Gateway: {str(e)}")

@app.api_route("/api/{service}", methods=["GET", "POST", "PUT", "DELETE"])
async def route_api_root(service: str, request: Request):
    return await route_api(service, "", request)
