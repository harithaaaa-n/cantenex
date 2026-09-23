import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.config import ADMIN_SECRET

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data

def test_get_menu():
    response = client.get("/api/menu")
    assert response.status_code == 200
    menu = response.json()
    assert isinstance(menu, list)
    assert len(menu) >= 36
    item = menu[0]
    assert "id" in item
    assert "name" in item
    assert "price" in item
    assert "inStock" in item

def test_get_orders():
    response = client.get("/api/orders")
    assert response.status_code == 200
    orders = response.json()
    assert isinstance(orders, list)
    assert len(orders) >= 1

def test_create_order():
    payload = {
        "studentName": "Test Student",
        "regNo": "22TEST999",
        "department": "Computer Science & Engineering",
        "items": [
            {"id": "cx-01", "quantity": 1},
            {"id": "cx-11", "quantity": 2}
        ],
        "pickupSlot": "01:15 PM — Lunch Break",
        "pickupType": "scheduled",
        "paymentMethod": "UPI Demo (Verified)"
    }
    response = client.post("/api/orders", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "orderId" in data
    assert data["order"]["totalAmount"] == 65.0 + (25.0 * 2)
    assert data["order"]["status"] == "PLACED"

def test_update_order_status_admin():
    # Attempt without admin key -> 401
    response = client.post("/api/orders/update-status", json={"orderId": "CX-1021", "status": "PREPARING"})
    assert response.status_code == 401

    # With admin key header -> 200
    headers = {"X-Admin-Key": ADMIN_SECRET}
    response = client.post("/api/orders/update-status", json={"orderId": "CX-1021", "status": "PREPARING"}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PREPARING"

def test_stock_toggle_admin():
    # Attempt without admin key -> 401
    response = client.post("/api/menu/toggle-stock", json={"itemId": "cx-01"})
    assert response.status_code == 401

    headers = {"X-Admin-Key": ADMIN_SECRET}
    response = client.post("/api/menu/toggle-stock", json={"itemId": "cx-01"}, headers=headers)
    assert response.status_code == 200

def test_reviews():
    response = client.get("/api/reviews")
    assert response.status_code == 200
    reviews = response.json()
    assert isinstance(reviews, list)

    # Post new review
    rev_payload = {
        "menuId": "cx-01",
        "studentName": "Reviewer Test",
        "rating": 5,
        "comment": "Crispy and delicious!"
    }
    post_res = client.post("/api/reviews", json=rev_payload)
    assert post_res.status_code == 200
    assert post_res.json()["success"] is True

def test_metrics():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    metrics = response.json()
    assert "todayTotal" in metrics
    assert "activeTokens" in metrics
    assert "totalRevenue" in metrics

def test_sql_studio_security():
    # Unauthenticated -> 401
    response = client.get("/api/sql?preset=todays_orders")
    assert response.status_code == 401

    # Authenticated -> 200
    headers = {"X-Admin-Key": ADMIN_SECRET}
    response = client.get("/api/sql?preset=todays_orders", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "columns" in data
    assert "rows" in data
