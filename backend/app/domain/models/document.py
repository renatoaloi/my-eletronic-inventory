from pydantic import BaseModel, Field
from uuid import UUID, uuid4


class DocumentDomain(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    file_name: str = ""
    file_path: str = ""
    product_id: UUID
