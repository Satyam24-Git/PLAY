import subprocess
import os
import sys
import time

SERVICES = [
    {"name": "api-gateway", "dir": "services/api-gateway", "port": 8000},
    {"name": "auth-service", "dir": "services/auth-service", "port": 8001},
    {"name": "profile-service", "dir": "services/profile-service", "port": 8002},
    {"name": "tournament-service", "dir": "services/tournament-service", "port": 8003},
    {"name": "venue-service", "dir": "services/venue-service", "port": 8004},
    {"name": "booking-service", "dir": "services/booking-service", "port": 8005},
    {"name": "match-service", "dir": "services/match-service", "port": 8006},
    {"name": "ad-service", "dir": "services/ad-service", "port": 8007},
    {"name": "shop-service", "dir": "services/shop-service", "port": 8014},
]

processes = []

def start_service(service):
    print(f"Starting {service['name']} on port {service['port']}...")
    # Install requirements first just in case
    req_path = os.path.join(service['dir'], "requirements.txt")
    if os.path.exists(req_path):
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", req_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Run uvicorn
    cmd = [sys.executable, "-m", "uvicorn", "main:app", "--port", str(service['port'])]
    p = subprocess.Popen(cmd, cwd=service['dir'])
    processes.append(p)

def start_frontend():
    print("Starting frontend app...")
    env = os.environ.copy()
    env["EXPO_PUBLIC_API_URL"] = "http://localhost:8000"
    
    # Use shell=True for npm on Windows
    p = subprocess.Popen("npm run web", cwd="frontend", shell=True, env=env)
    processes.append(p)

if __name__ == "__main__":
    print("🚀 Booting up the PPLAY Microservices Architecture...")
    
    for service in SERVICES:
        start_service(service)
    
    # Give backends a second to boot up
    time.sleep(2)
    start_frontend()
    
    print("\n✅ All services started! Press Ctrl+C to stop all services.")
    
    try:
        for p in processes:
            p.wait()
    except KeyboardInterrupt:
        print("\nStopping all services...")
        for p in processes:
            p.terminate()
        print("Goodbye!")
