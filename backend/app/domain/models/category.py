from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime


class CategoryDomain(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., max_length=50)
    description: str = ""
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
