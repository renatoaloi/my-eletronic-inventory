from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc
from app.domain.interfaces.repositories import AbstractCategoryRepository
from app.infrastructure.database.models import CategoryModel


class SQLAlchemyCategoryRepository(AbstractCategoryRepository):
    def __init__(self, db: Session):
        self.db = db

    def add(self, model: CategoryModel) -> CategoryModel:
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return model

    def get_by_id(self, id: UUID) -> Optional[CategoryModel]:
        stmt = select(CategoryModel).where(CategoryModel.id == str(id))
        return self.db.execute(stmt).scalar_one_or_none()

    def get_all(self) -> List[CategoryModel]:
        stmt = select(CategoryModel).order_by(CategoryModel.name)
        return list(self.db.execute(stmt).scalars().all())

    def update(self, model: CategoryModel) -> CategoryModel:
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
        stmt = select(func.count(CategoryModel.id))
        return self.db.execute(stmt).scalar() or 0

    def get_top_by_value(self, limit: int = 5) -> List[dict]:
        from app.infrastructure.database.models import ProductModel
        stmt = (
            select(
                CategoryModel.id,
                CategoryModel.name,
                func.sum(ProductModel.price * ProductModel.quantity).label("total_value"),
            )
            .join(ProductModel, ProductModel.category_id == CategoryModel.id)
            .group_by(CategoryModel.id)
            .order_by(desc("total_value"))
            .limit(limit)
        )
        rows = self.db.execute(stmt).all()
        return [
            {"id": row.id, "name": row.name, "total_value": float(row.total_value) if row.total_value else 0.0}
            for row in rows
        ]
