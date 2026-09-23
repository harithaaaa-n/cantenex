from fastapi import APIRouter
from typing import Dict, Any
from backend.database import get_db

router = APIRouter(prefix="/api/metrics", tags=["Operational Metrics"])

@router.get("")
@router.get("/")
def get_live_metrics():
    with get_db() as db:
        cur = db.cursor()
        
        cur.execute("SELECT COUNT(*) FROM orders")
        row = cur.fetchone()
        today_total = row[0] if not isinstance(row, dict) else list(row.values())[0]

        cur.execute("SELECT COUNT(*) FROM orders WHERE status != 'COMPLETED'")
        row = cur.fetchone()
        active_tokens = row[0] if not isinstance(row, dict) else list(row.values())[0]

        cur.execute("SELECT COUNT(*) FROM orders WHERE status IN ('ACCEPTED', 'PREPARING')")
        row = cur.fetchone()
        in_prep = row[0] if not isinstance(row, dict) else list(row.values())[0]

        cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'READY'")
        row = cur.fetchone()
        ready_count = row[0] if not isinstance(row, dict) else list(row.values())[0]

        cur.execute("SELECT COALESCE(SUM(total_amount), 0) FROM orders")
        row = cur.fetchone()
        total_revenue = float(row[0] if not isinstance(row, dict) else list(row.values())[0])

        return {
            "todayTotal": int(today_total),
            "activeTokens": int(active_tokens),
            "inPrep": int(in_prep),
            "readyCount": int(ready_count),
            "totalRevenue": total_revenue
        }
