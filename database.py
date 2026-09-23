"""
CANTENEX — Production API Server Runner & Database Controller
Starts the FastAPI application via Uvicorn with SQLite / PostgreSQL backend.
"""

import os
import sys
import uvicorn
from backend.database import init_db

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ("--init", "-i", "init"):
        init_db()
        sys.exit(0)

    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    elif "PORT" in os.environ:
        try:
            port = int(os.environ["PORT"])
        except ValueError:
            pass

    print(f"🚀 Launching CANTENEX FastAPI Server on port {port}...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
