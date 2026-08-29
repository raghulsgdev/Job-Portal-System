import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings

# Import routers
from routers.auth_router import router as auth_router
from routers.user_router import router as user_router
from routers.hr_router import router as hr_router
from routers.job_router import router as job_router
from routers.interview_router import router as interview_router
from routers.notification_router import router as notification_router
from routers.dashboard_router import router as dashboard_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Simple, practical Job Portal Backend REST API using FastAPI and MySQL"
)

# Enable CORS for React frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://job-portal-system-tojz.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists and mount static route
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "resumes"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(hr_router)
app.include_router(job_router)
app.include_router(interview_router)
app.include_router(notification_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to Job Portal API Service",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
