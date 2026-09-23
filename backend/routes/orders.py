import random
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from backend.database import get_db
from backend.schemas import OrderCreate, OrderStatusUpdate
from backend.routes.admin import verify_admin

router = APIRouter(prefix="/api/orders", tags=["Orders & Dispatch"])

PROGRESS_MAP = {
    "PLACED": 15,
    "ACCEPTED": 35,
    "PREPARING": 65,
    "READY": 95,
    "COMPLETED": 100
}

@router.get("")
@router.get("/")
def get_orders():
    with get_db() as db:
        cur = db.cursor()
        cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders_raw = cur.fetchall()
        orders = []
        param = "%s" if db.is_pg else "?"
        
        for o in orders_raw:
            od = dict(o)
            order_id = od['id']
            cur.execute(f"SELECT menu_id as id, item_name as name, price, quantity FROM order_items WHERE order_id = {param}", (order_id,))
            items_raw = cur.fetchall()
            od['items'] = [dict(i) for i in items_raw]
            od['studentName'] = od.get('student_name')
            od['regNo'] = od.get('reg_no')
            od['totalAmount'] = float(od.get('total_amount', 0))
            od['pickupSlot'] = od.get('pickup_slot')
            od['pickupType'] = od.get('pickup_type')
            od['paymentMethod'] = od.get('payment_method')
            od['placedAt'] = od.get('placed_at')
            od['prepProgress'] = od.get('prep_progress', 15)
            orders.append(od)
            
        return orders

@router.post("")
@router.post("/")
def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    with get_db() as db:
        cur = db.cursor()
        param = "%s" if db.is_pg else "?"
        
        # 1. Fetch menu item prices and verify stock
        item_ids = [item.id for item in payload.items]
        placeholders = ", ".join([param] * len(item_ids))
        cur.execute(f"SELECT id, name, price, in_stock, category, diet FROM menu_items WHERE id IN ({placeholders})", tuple(item_ids))
        db_items_list = cur.fetchall()
        db_items = {dict(r)['id']: dict(r) for r in db_items_list}

        total_amount = 0.0
        verified_items = []
        has_dosa = False
        all_drinks = True

        for item in payload.items:
            if item.id not in db_items:
                raise HTTPException(status_code=400, detail=f"Menu item '{item.id}' does not exist")
            
            menu_info = db_items[item.id]
            if not menu_info.get('in_stock'):
                raise HTTPException(status_code=400, detail=f"Dish '{menu_info['name']}' is currently sold out")

            unit_price = float(menu_info['price'])
            line_total = unit_price * item.quantity
            total_amount += line_total

            verified_items.append({
                "id": item.id,
                "name": menu_info['name'],
                "price": unit_price,
                "quantity": item.quantity
            })

            if item.id in ('cx-01', 'cx-02', 'cx-17', 'cx-19'):
                has_dosa = True
            if menu_info.get('category') != 'DRINKS':
                all_drinks = False

        # 2. Assign counter
        counter = payload.counter
        if not counter:
            if has_dosa:
                counter = "Counter 1 (Tiffin & Dosa)"
            elif all_drinks:
                counter = "Counter 4 (Beverage Bar)"
            else:
                counter = "Counter 2 (Hot Express)"

        # 3. Generate Order ID
        order_id = payload.id or f"CX-{random.randint(1000, 9999)}"
        now_str = payload.placedAt or datetime.now().strftime("%I:%M %p")
        prep_progress = PROGRESS_MAP.get("PLACED", 15)

        # 4. Insert Student if not present
        cur.execute(
            f"INSERT INTO students (reg_no, name, department) VALUES ({param}, {param}, {param}) ON CONFLICT (reg_no) DO NOTHING" if db.is_pg else
            f"INSERT OR IGNORE INTO students (reg_no, name, department) VALUES ({param}, {param}, {param})",
            (payload.regNo, payload.studentName, payload.department)
        )

        # 5. Insert Order
        cur.execute(f"""
            INSERT INTO orders 
            (id, student_name, reg_no, department, total_amount, pickup_slot, pickup_type, payment_method, status, counter, placed_at, prep_progress)
            VALUES ({param}, {param}, {param}, {param}, {param}, {param}, {param}, {param}, {param}, {param}, {param}, {param})
        """, (
            order_id,
            payload.studentName,
            payload.regNo,
            payload.department,
            total_amount,
            payload.pickupSlot,
            payload.pickupType,
            payload.paymentMethod,
            "PLACED",
            counter,
            now_str,
            prep_progress
        ))

        # 6. Insert Order Items
        for vi in verified_items:
            cur.execute(f"""
                INSERT INTO order_items (order_id, menu_id, item_name, price, quantity)
                VALUES ({param}, {param}, {param}, {param}, {param})
            """, (
                order_id,
                vi['id'],
                vi['name'],
                vi['price'],
                vi['quantity']
            ))

        db.commit()

        return {
            "success": True,
            "orderId": order_id,
            "order": {
                "id": order_id,
                "studentName": payload.studentName,
                "regNo": payload.regNo,
                "department": payload.department,
                "items": verified_items,
                "totalAmount": total_amount,
                "pickupSlot": payload.pickupSlot,
                "pickupType": payload.pickupType,
                "paymentMethod": payload.paymentMethod,
                "status": "PLACED",
                "counter": counter,
                "placedAt": now_str,
                "prepProgress": prep_progress
            }
        }

@router.post("/update-status")
def update_status_json(payload: OrderStatusUpdate, is_admin: bool = Depends(verify_admin)):
    order_id = payload.orderId or payload.id
    if not order_id:
        raise HTTPException(status_code=400, detail="Missing orderId")
    return update_status_internal(order_id, payload.status)

@router.post("/{order_id}/status")
def update_status_param(order_id: str, payload: OrderStatusUpdate, is_admin: bool = Depends(verify_admin)):
    return update_status_internal(order_id, payload.status)

def update_status_internal(order_id: str, status: str):
    progress = PROGRESS_MAP.get(status, 50)
    with get_db() as db:
        cur = db.cursor()
        param = "%s" if db.is_pg else "?"
        cur.execute(f"UPDATE orders SET status = {param}, prep_progress = {param} WHERE id = {param}", (status, progress, order_id))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        db.commit()
        return {"success": True, "orderId": order_id, "status": status, "prepProgress": progress}
