from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import Optional, List

VALID_STATUSES = ["a venda", "reservado", "vendido", "não vender"]


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=50)
    description: str = ""
    price: Decimal = Field(..., max_digits=10, decimal_places=2)
    quantity: int = 0
    code: str = Field(..., max_length=50)
    status: str = "a venda"
    category_id: Optional[UUID] = None
    type_id: Optional[UUID] = None

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


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    quantity: Optional[int] = None
    code: Optional[str] = Field(None, max_length=50)
    status: Optional[str] = None
    category_id: Optional[UUID] = None
    type_id: Optional[UUID] = None

    @field_validator("price", mode="before")
    @classmethod
    def normalize_price(cls, v):
        if v is not None and isinstance(v, (int, float, str)):
            return Decimal(str(v)).quantize(Decimal("0.01"))
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {VALID_STATUSES}")
        return v


class ProductPhotoItem(BaseModel):
    model_config = {"from_attributes": True}
    id: UUID
    file_name: str
    file_path: str
    is_cover: bool = False


class ProductDocumentItem(BaseModel):
    model_config = {"from_attributes": True}
    id: UUID
    file_name: str
    file_path: str


class ProductResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: UUID
    name: str
    description: str
    price: Decimal
    quantity: int
    code: str
    status: str
    category_id: Optional[UUID] = None
    type_id: Optional[UUID] = None
    category_name: Optional[str] = None
    type_name: Optional[str] = None
    photos: List[ProductPhotoItem] = []
    documents: List[ProductDocumentItem] = []
    created_at: datetime
    updated_at: datetime
