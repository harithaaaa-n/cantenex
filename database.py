"""
CANTENEX — SQLite Database Controller & REST Backend
Web Essentials Mini Project — Python SQLite Server
"""

import sqlite3
import json
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

DB_FILE = os.path.join(os.path.dirname(__file__), "cantenex.db")
SCHEMA_FILE = os.path.join(os.path.dirname(__file__), "schema.sql")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initializes SQLite database with schema and seed data."""
    if not os.path.exists(SCHEMA_FILE):
        print(f"Error: Schema file not found at {SCHEMA_FILE}")
        return False
    
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    conn = get_db()
    with conn:
        conn.executescript(schema_sql)
    conn.close()
    print(f"✓ SQLite database successfully initialized at {DB_FILE}")
    return True

class CantenexAPIHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode("utf-8"))

    def do_GET(self):
        parsed = urlparse(self.path)
        
        # API: Menu Items
        if parsed.path == "/api/menu":
            conn = get_db()
            cursor = conn.cursor()
            rows = cursor.execute("SELECT * FROM menu_items ORDER BY code ASC").fetchall()
            menu = [dict(r) for r in rows]
            # Convert integer flags to booleans
            for item in menu:
                item['inStock'] = bool(item['in_stock'])
                item['highlight'] = bool(item['highlight'])
                item['featuredSpecial'] = bool(item['featured_special'])
                item['prepTime'] = item['prep_time']
                item['spiceLevel'] = item['spice_level']
            conn.close()
            return self.send_json(menu)

        # API: Orders
        if parsed.path == "/api/orders":
            conn = get_db()
            cursor = conn.cursor()
            orders_raw = cursor.execute("SELECT * FROM orders ORDER BY created_at DESC").fetchall()
            orders = []
            for o in orders_raw:
                od = dict(o)
                items_raw = cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (od['id'],)).fetchall()
                od['items'] = [dict(i) for i in items_raw]
                od['studentName'] = od['student_name']
                od['regNo'] = od['reg_no']
                od['totalAmount'] = od['total_amount']
                od['pickupSlot'] = od['pickup_slot']
                od['pickupType'] = od['pickup_type']
                od['paymentMethod'] = od['payment_method']
                od['placedAt'] = od['placed_at']
                od['prepProgress'] = od['prep_progress']
                orders.append(od)
            conn.close()
            return self.send_json(orders)

        # API: Live Metrics
        if parsed.path == "/api/metrics":
            conn = get_db()
            cursor = conn.cursor()
            today_total = cursor.execute("SELECT COUNT(*) FROM orders").fetchone()[0]
            active_tokens = cursor.execute("SELECT COUNT(*) FROM orders WHERE status != 'COMPLETED'").fetchone()[0]
            in_prep = cursor.execute("SELECT COUNT(*) FROM orders WHERE status IN ('ACCEPTED', 'PREPARING')").fetchone()[0]
            ready_count = cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'READY'").fetchone()[0]
            total_rev = cursor.execute("SELECT IFNULL(SUM(total_amount), 0) FROM orders").fetchone()[0]
            conn.close()
            return self.send_json({
                "todayTotal": today_total,
                "activeTokens": active_tokens,
                "inPrep": in_prep,
                "readyCount": ready_count,
                "totalRevenue": total_rev
            })

        # API: Execute arbitrary SQL for evaluator inspector
        if parsed.path == "/api/sql":
            query_params = parse_qs(parsed.query)
            sql = query_params.get("q", [""])[0]
            if not sql:
                return self.send_json({"error": "No SQL query provided"}, 400)
            try:
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute(sql)
                if cursor.description:
                    columns = [d[0] for d in cursor.description]
                    rows = [dict(zip(columns, r)) for r in cursor.fetchall()]
                    conn.close()
                    return self.send_json({"columns": columns, "rows": rows, "count": len(rows)})
                else:
                    conn.commit()
                    rowcount = cursor.rowcount
                    conn.close()
                    return self.send_json({"message": f"Query executed successfully ({rowcount} rows affected)"})
            except Exception as e:
                return self.send_json({"error": str(e)}, 500)

        # API: Reviews GET
        if parsed.path == "/api/reviews":
            query_params = parse_qs(parsed.query)
            menu_id = query_params.get("menuId", [None])[0]
            conn = get_db()
            cursor = conn.cursor()
            if menu_id:
                rows = cursor.execute("SELECT * FROM dish_reviews WHERE menu_id = ? ORDER BY created_at DESC", (menu_id,)).fetchall()
            else:
                rows = cursor.execute("SELECT * FROM dish_reviews ORDER BY created_at DESC").fetchall()
            reviews = [dict(r) for r in rows]
            conn.close()
            return self.send_json(reviews)

        # Static files fallback
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len)
        data = json.loads(post_body.decode('utf-8')) if post_body else {}

        # API: Add Review
        if parsed.path == "/api/reviews":
            menu_id = data.get("menuId")
            student_name = data.get("studentName", "Student")
            rating = int(data.get("rating", 5))
            comment = data.get("comment", "")
            
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO dish_reviews (menu_id, student_name, rating, comment)
                VALUES (?, ?, ?, ?)
            """, (menu_id, student_name, rating, comment))
            
            # Recalculate average rating for menu item
            avg_rating = cursor.execute("SELECT AVG(rating) FROM dish_reviews WHERE menu_id = ?", (menu_id,)).fetchone()[0]
            if avg_rating:
                cursor.execute("UPDATE menu_items SET rating = ? WHERE id = ?", (round(avg_rating, 1), menu_id))
            
            conn.commit()
            conn.close()
            return self.send_json({"success": True, "newRating": round(avg_rating, 1) if avg_rating else rating})


        # API: Place Order
        if parsed.path == "/api/orders":
            conn = get_db()
            cursor = conn.cursor()
            order_id = data.get("id")
            cursor.execute("""
                INSERT INTO orders (id, student_name, reg_no, department, total_amount, pickup_slot, pickup_type, payment_method, status, counter, placed_at, prep_progress)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id,
                data.get("studentName"),
                data.get("regNo"),
                data.get("department"),
                data.get("totalAmount"),
                data.get("pickupSlot"),
                data.get("pickupType", "scheduled"),
                data.get("paymentMethod"),
                data.get("status", "PLACED"),
                data.get("counter"),
                data.get("placedAt"),
                data.get("prepProgress", 15)
            ))

            for item in data.get("items", []):
                cursor.execute("""
                    INSERT INTO order_items (order_id, menu_id, item_name, price, quantity)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    order_id,
                    item.get("id"),
                    item.get("name"),
                    item.get("price"),
                    item.get("quantity", 1)
                ))

            conn.commit()
            conn.close()
            return self.send_json({"success": True, "orderId": order_id})

        # API: Update Order Status
        if parsed.path == "/api/orders/update-status":
            order_id = data.get("orderId")
            next_status = data.get("status")
            progress_map = {"PLACED": 15, "ACCEPTED": 35, "PREPARING": 65, "READY": 95, "COMPLETED": 100}
            progress = progress_map.get(next_status, 50)
            
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("UPDATE orders SET status = ?, prep_progress = ? WHERE id = ?", (next_status, progress, order_id))
            conn.commit()
            conn.close()
            return self.send_json({"success": True, "orderId": order_id, "status": next_status})

        # API: Toggle Item Stock
        if parsed.path == "/api/menu/toggle-stock":
            item_id = data.get("itemId")
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("UPDATE menu_items SET in_stock = CASE WHEN in_stock = 1 THEN 0 ELSE 1 END WHERE id = ?", (item_id,))
            conn.commit()
            conn.close()
            return self.send_json({"success": True, "itemId": item_id})

        # API: Update Item Price
        if parsed.path == "/api/menu/update-price":
            item_id = data.get("itemId")
            price = float(data.get("price", 0))
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("UPDATE menu_items SET price = ? WHERE id = ?", (price, item_id))
            conn.commit()
            conn.close()
            return self.send_json({"success": True, "itemId": item_id, "price": price})

        self.send_json({"error": "Endpoint not found"}, 404)

def run_server(port=8000):
    init_database()
    server_address = ('', port)
    httpd = HTTPServer(server_address, CantenexAPIHandler)
    print(f"🚀 CANTENEX SQLite Backend Server live at http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ("--init", "-i", "init"):
        init_database()
        sys.exit(0)
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)
