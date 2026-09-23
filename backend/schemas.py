from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, field_validator

class OrderItemInput(BaseModel):
    id: str
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: int = Field(default=1, ge=1)

class OrderCreate(BaseModel):
    id: Optional[str] = None
    studentName: str = Field(min_length=1, max_length=150)
    regNo: str = Field(min_length=1, max_length=50)
    department: str = Field(min_length=1, max_length=150)
    items: List[OrderItemInput] = Field(min_length=1)
    pickupSlot: str = Field(min_length=1, max_length=150)
    pickupType: str = Field(default="scheduled", max_length=50)
    paymentMethod: str = Field(min_length=1, max_length=100)
    totalAmount: Optional[float] = None
    counter: Optional[str] = None
    placedAt: Optional[str] = None
    prepProgress: Optional[int] = Field(default=15, ge=0, le=100)

class OrderStatusUpdate(BaseModel):
    orderId: Optional[str] = None
    id: Optional[str] = None
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        valid_statuses = {"PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED"}
        v_upper = v.upper()
        if v_upper not in valid_statuses:
            raise ValueError(f"Invalid status '{v}'. Allowed statuses: {', '.join(valid_statuses)}")
        return v_upper

class StockToggleRequest(BaseModel):
    itemId: str

class PriceUpdateRequest(BaseModel):
    itemId: str
    price: float = Field(gt=0)

class ReviewCreate(BaseModel):
    menuId: str
    studentName: str = Field(default="Student", min_length=1, max_length=150)
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=1, max_length=1000)

class AdminAuthRequest(BaseModel):
    secret: str

class SQLQueryRequest(BaseModel):
    query: Optional[str] = None
    preset: Optional[str] = None
