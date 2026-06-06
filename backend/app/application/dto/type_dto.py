from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class TypeCreate(BaseModel):
    name: str = Field(..., max_length=50)
    description: str = ""


class TypeUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None


class TypeResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: UUID
    name: str
    description: str
    created_at: datetime
    updated_at: datetime
