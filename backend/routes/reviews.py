from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from backend.database import get_db
from backend.schemas import ReviewCreate

router = APIRouter(prefix="/api/reviews", tags=["Reviews & Ratings"])

@router.get("")
@router.get("/")
def get_reviews(menuId: Optional[str] = Query(None)):
    with get_db() as db:
        cur = db.cursor()
        param = "%s" if db.is_pg else "?"
        if menuId:
            cur.execute(f"SELECT * FROM dish_reviews WHERE menu_id = {param} ORDER BY created_at DESC", (menuId,))
        else:
            cur.execute("SELECT * FROM dish_reviews ORDER BY created_at DESC")
        
        rows = cur.fetchall()
        reviews = []
        for r in rows:
            rd = dict(r)
            reviews.append({
                "id": str(rd.get('id')),
                "menuId": rd.get('menu_id'),
                "studentName": rd.get('student_name'),
                "rating": int(rd.get('rating', 5)),
                "comment": rd.get('comment', ''),
                "date": str(rd.get('created_at', 'Just now'))
            })
        return reviews

@router.post("")
@router.post("/")
def add_review(payload: ReviewCreate):
    with get_db() as db:
        cur = db.cursor()
        param = "%s" if db.is_pg else "?"
        
        # Verify dish exists
        cur.execute(f"SELECT id FROM menu_items WHERE id = {param}", (payload.menuId,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Menu item not found")

        # Insert review
        cur.execute(f"""
            INSERT INTO dish_reviews (menu_id, student_name, rating, comment)
            VALUES ({param}, {param}, {param}, {param})
        """, (payload.menuId, payload.studentName, payload.rating, payload.comment))

        # Recalculate average rating
        cur.execute(f"SELECT AVG(rating) FROM dish_reviews WHERE menu_id = {param}", (payload.menuId,))
        avg_row = cur.fetchone()
        avg_val = dict(avg_row)['avg'] if isinstance(avg_row, dict) and 'avg' in avg_row else (avg_row[0] if avg_row else None)
        
        new_rating = round(float(avg_val), 1) if avg_val is not None else float(payload.rating)
        cur.execute(f"UPDATE menu_items SET rating = {param} WHERE id = {param}", (new_rating, payload.menuId))
        
        db.commit()
        return {"success": True, "menuId": payload.menuId, "newRating": new_rating}
