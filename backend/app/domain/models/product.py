from pydantic import BaseModel, Field, field_validator
from uuid import UUID, uuid4
from decimal import Decimal
from datetime import datetime
from typing import Optional

VALID_STATUSES = ["a venda", "reservado", "vendido", "não vender"]


class ProductDomain(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., max_length=50)
    description: str = ""
    price: Decimal = Field(..., max_digits=10, decimal_places=2)
    quantity: int = 0
    code: str = Field(..., max_length=50)
    status: str = "a venda"
    category_id: Optional[UUID] = None
    type_id: Optional[UUID] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @field_validator("price", mode="before")
    @classmethod
    def normalize_price(cls, v):
        if isinstance(v, (int, float, str)):
            return Decimal(str(v)).quantize(Decimal("0.01"))
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {VALID_STATUSES}")
        return v
