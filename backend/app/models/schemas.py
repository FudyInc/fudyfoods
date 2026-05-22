from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity: int


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SalesBase(BaseModel):
    product_id: int
    quantity: int
    total_price: float


class SalesCreate(SalesBase):
    pass


class Sales(SalesBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyticsResponse(BaseModel):
    total_sales: float
    total_products_sold: int
    average_order_value: float
    top_products: List[dict]
