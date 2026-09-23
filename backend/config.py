import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "")
ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "admin123")
PORT: int = int(os.getenv("PORT", 8000))
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

# CORS origins handling
cors_raw = os.getenv("CORS_ORIGINS", "*")
if cors_raw.strip() == "*":
    CORS_ORIGINS: List[str] = ["*"]
else:
    CORS_ORIGINS: List[str] = [origin.strip() for origin in cors_raw.split(",") if origin.strip()]
