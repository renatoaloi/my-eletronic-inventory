from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import Optional


class LastProductItem(BaseModel):
    id: UUID
    name: str
    price: Decimal
    status: str
    created_at: datetime


class TopCategoryItem(BaseModel):
    id: UUID
    name: str
    total_value: Decimal


class DashboardResponse(BaseModel):
    last_products: list[LastProductItem]
    total_stock_value: Decimal
    top_categories: list[TopCategoryItem]
    total_products: int = 0
    total_categories: int = 0
