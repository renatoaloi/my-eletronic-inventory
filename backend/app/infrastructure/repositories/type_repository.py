from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.domain.interfaces.repositories import AbstractTypeRepository
from app.infrastructure.database.models import TypeModel


class SQLAlchemyTypeRepository(AbstractTypeRepository):
    def __init__(self, db: Session):
        self.db = db

    def add(self, model: TypeModel) -> TypeModel:
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return model

    def get_by_id(self, id: UUID) -> Optional[TypeModel]:
        stmt = select(TypeModel).where(TypeModel.id == str(id))
        return self.db.execute(stmt).scalar_one_or_none()

    def get_all(self) -> List[TypeModel]:
        stmt = select(TypeModel).order_by(TypeModel.name)
        return list(self.db.execute(stmt).scalars().all())

    def update(self, model: TypeModel) -> TypeModel:
        self.db.commit()
        self.db.refresh(model)
        return model

    def delete(self, id: UUID) -> bool:
        model = self.get_by_id(id)
        if model:
            self.db.delete(model)
            self.db.commit()
            return True
        return False

    def count(self) -> int:
        stmt = select(func.count(TypeModel.id))
        return self.db.execute(stmt).scalar() or 0
