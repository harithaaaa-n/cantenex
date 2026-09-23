import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from backend.config import CORS_ORIGINS, ENVIRONMENT, PORT
from backend.database import init_db, is_postgres
from backend.routes import menu, orders, reviews, metrics, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    print("🚀 Starting CANTENEX Production Backend API...")
    init_db()
    yield
    print("🛑 Shutting down CANTENEX API.")

app = FastAPI(
    title="CANTENEX API",
    description="Production REST API for CANTENEX Campus Dining & Express Pre-Order Platform",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True if CORS_ORIGINS != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(reviews.router)
app.include_router(metrics.router)
app.include_router(admin.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "CANTENEX API",
        "database": "PostgreSQL" if is_postgres() else "SQLite",
        "environment": ENVIRONMENT,
        "version": "2.0.0"
    }

# Static file serving for standalone or single-container deployments
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
css_dir = os.path.join(BASE_DIR, "css")
js_dir = os.path.join(BASE_DIR, "js")
index_file = os.path.join(BASE_DIR, "index.html")
config_file = os.path.join(BASE_DIR, "config.js")

if os.path.exists(css_dir):
    app.mount("/css", StaticFiles(directory=css_dir), name="css")

if os.path.exists(js_dir):
    app.mount("/js", StaticFiles(directory=js_dir), name="js")

@app.get("/config.js", include_in_schema=False)
def serve_config():
    if os.path.exists(config_file):
        return FileResponse(config_file, media_type="application/javascript")
    return JSONResponse(content={"configured": True})

@app.get("/", include_in_schema=False)
def serve_index():
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "CANTENEX Production API Live. Visit /docs for Swagger documentation."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=PORT, reload=True)
