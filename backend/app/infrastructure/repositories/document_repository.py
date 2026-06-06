from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.domain.interfaces.repositories import AbstractDocumentRepository
from app.infrastructure.database.models import DocumentModel


class SQLAlchemyDocumentRepository(AbstractDocumentRepository):
    def __init__(self, db: Session):
        self.db = db

    def add(self, model: DocumentModel) -> DocumentModel:
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return model

    def get_by_id(self, id: UUID) -> Optional[DocumentModel]:
        stmt = select(DocumentModel).where(DocumentModel.id == str(id))
        return self.db.execute(stmt).scalar_one_or_none()

    def get_by_product_id(self, product_id: UUID) -> List[DocumentModel]:
        stmt = select(DocumentModel).where(DocumentModel.product_id == str(product_id))
        return list(self.db.execute(stmt).scalars().all())

    def delete(self, id: UUID) -> bool:
        model = self.get_by_id(id)
        if model:
            self.db.delete(model)
            self.db.commit()
            return True
        return False
