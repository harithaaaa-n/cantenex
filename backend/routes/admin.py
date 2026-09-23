from fastapi import APIRouter, HTTPException, Header, Depends, Query
from typing import Optional, Dict, Any, List
from backend.config import ADMIN_SECRET
from backend.database import get_db
from backend.schemas import AdminAuthRequest, SQLQueryRequest

router = APIRouter(tags=["Admin & Database Studio"])

def verify_admin(
    x_admin_key: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
    key: Optional[str] = Query(None)
) -> bool:
    token = x_admin_key or key
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    
    if token and token == ADMIN_SECRET:
        return True
    raise HTTPException(status_code=401, detail="Unauthorized: Invalid or missing Admin Secret Key")

@router.post("/api/admin/verify")
def verify_admin_login(payload: AdminAuthRequest):
    if payload.secret == ADMIN_SECRET:
        return {"success": True, "token": ADMIN_SECRET}
    raise HTTPException(status_code=401, detail="Invalid admin passcode")

SAFE_PRESET_QUERIES = {
    "todays_orders": "SELECT id, student_name, reg_no, total_amount, pickup_slot, status, counter, placed_at FROM orders ORDER BY created_at DESC LIMIT 50",
    "menu_catalogue": "SELECT id, code, name, category, price, prep_time, diet, in_stock, rating FROM menu_items ORDER BY code ASC",
    "active_orders": "SELECT id, student_name, status, pickup_slot, total_amount FROM orders WHERE status != 'COMPLETED' ORDER BY created_at DESC",
    "low_stock_dishes": "SELECT id, name, category, in_stock, price FROM menu_items WHERE in_stock = 0",
    "dish_reviews": "SELECT r.id, m.name as dish_name, r.student_name, r.rating, r.comment, r.created_at FROM dish_reviews r JOIN menu_items m ON r.menu_id = m.id ORDER BY r.created_at DESC LIMIT 50",
    "student_spend": "SELECT reg_no, student_name, COUNT(*) as order_count, SUM(total_amount) as total_spent FROM orders GROUP BY reg_no, student_name ORDER BY total_spent DESC LIMIT 20",
    "category_breakdown": "SELECT category, COUNT(*) as item_count, AVG(price) as avg_price FROM menu_items GROUP BY category"
}

@router.get("/api/sql")
@router.post("/api/sql")
def execute_sql(
    payload: Optional[SQLQueryRequest] = None,
    q: Optional[str] = Query(None),
    preset: Optional[str] = Query(None),
    is_admin: bool = Depends(verify_admin)
):
    sql_text = (payload.query if payload and payload.query else None) or q
    preset_key = (payload.preset if payload and payload.preset else None) or preset

    if preset_key and preset_key in SAFE_PRESET_QUERIES:
        sql_text = SAFE_PRESET_QUERIES[preset_key]

    if not sql_text:
        raise HTTPException(status_code=400, detail="No SQL query or valid preset provided")

    # Clean query
    sql_clean = sql_text.strip()
    
    with get_db() as db:
        cur = db.cursor()
        try:
            cur.execute(sql_clean)
            if cur.description:
                if db.is_pg:
                    rows = cur.fetchall()
                    columns = list(rows[0].keys()) if rows else [d[0] for d in cur.description]
                    clean_rows = [[r[c] for c in columns] for r in rows]
                else:
                    columns = [d[0] for d in cur.description]
                    raw_rows = cur.fetchall()
                    clean_rows = [[item for item in r] for r in raw_rows]
                return {
                    "columns": columns,
                    "rows": clean_rows,
                    "count": len(clean_rows),
                    "query": sql_clean
                }
            else:
                db.commit()
                return {
                    "message": f"Query executed successfully ({cur.rowcount} rows affected)",
                    "columns": ["status", "rows_affected"],
                    "rows": [["SUCCESS", cur.rowcount]],
                    "count": 1
                }
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Database Query Error: {str(e)}")
