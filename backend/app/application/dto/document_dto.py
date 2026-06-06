from pydantic import BaseModel
from uuid import UUID


class DocumentResponse(BaseModel):
    model_config = {"from_attributes": True}
    id: UUID
    file_name: str
    file_path: str
    product_id: UUID
