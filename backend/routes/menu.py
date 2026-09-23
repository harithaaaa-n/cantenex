from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from backend.database import get_db
from backend.schemas import StockToggleRequest, PriceUpdateRequest
from backend.routes.admin import verify_admin

router = APIRouter(prefix="/api/menu", tags=["Menu Catalogue"])

@router.get("")
@router.get("/")
def get_menu():
    with get_db() as db:
        cur = db.cursor()
        param_placeholder = "%s" if db.is_pg else "?"
        cur.execute("SELECT * FROM menu_items ORDER BY code ASC")
        rows = cur.fetchall()
        menu = []
        for r in rows:
            item = dict(r)
            item['inStock'] = bool(item.get('in_stock', 1))
            item['highlight'] = bool(item.get('highlight', 0))
            item['featuredSpecial'] = bool(item.get('featured_special', 0))
            item['prepTime'] = item.get('prep_time', '5 mins')
            item['spiceLevel'] = item.get('spice_level', 0)
            item['price'] = float(item.get('price', 0))
            item['rating'] = float(item.get('rating', 5.0))
            menu.append(item)
        return menu

@router.post("/toggle-stock")
def toggle_stock_json(payload: StockToggleRequest, is_admin: bool = Depends(verify_admin)):
    return toggle_stock_internal(payload.itemId)

@router.post("/{item_id}/stock")
def toggle_stock_param(item_id: str, is_admin: bool = Depends(verify_admin)):
    return toggle_stock_internal(item_id)

def toggle_stock_internal(item_id: str):
    with get_db() as db:
        cur = db.cursor()
        param = "%s" if db.is_pg else "?"
        cur.execute(f"SELECT in_stock FROM menu_items WHERE id = {param}", (item_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        current_stock = dict(row)['in_stock'] if isinstance(row, dict) else row[0]
        new_stock = 0 if current_stock == 1 else 1
        
        cur.execute(f"UPDATE menu_items SET in_stock = {param} WHERE id = {param}", (new_stock, item_id))
        db.commit()
        return {"success": True, "itemId": item_id, "inStock": bool(new_stock)}

@router.post("/update-price")
def update_price_json(payload: PriceUpdateRequest, is_admin: bool = Depends(verify_admin)):
    return update_price_internal(payload.itemId, payload.price)

@router.post("/{item_id}/price")
def update_price_param(item_id: str, payload: PriceUpdateRequest, is_admin: bool = Depends(verify_admin)):
    return update_price_internal(item_id, payload.price)

def update_price_internal(item_id: str, price: float):
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")
    
    with get_db() as db:
        cur = db.cursor()
        param = "%s" if db.is_pg else "?"
        cur.execute(f"UPDATE menu_items SET price = {param} WHERE id = {param}", (price, item_id))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Menu item not found")
        db.commit()
        return {"success": True, "itemId": item_id, "price": price}
