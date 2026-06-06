from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, desc
from app.domain.interfaces.repositories import AbstractProductRepository
from app.infrastructure.database.models import ProductModel, CategoryModel, TypeModel


class SQLAlchemyProductRepository(AbstractProductRepository):
    def __init__(self, db: Session):
        self.db = db

    def _apply_filters(self, stmt, filters: Optional[dict] = None):
        if not filters:
            return stmt
        if filters.get("category_id"):
            stmt = stmt.where(ProductModel.category_id == str(filters["category_id"]))
        if filters.get("type_id"):
            stmt = stmt.where(ProductModel.type_id == str(filters["type_id"]))
        if filters.get("status"):
            stmt = stmt.where(ProductModel.status == filters["status"])
        if filters.get("search"):
            search_term = f"%{filters['search']}%"
            stmt = stmt.where(ProductModel.name.ilike(search_term))
        return stmt

    def add(self, model: ProductModel) -> ProductModel:
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return model

    def get_by_id(self, id: UUID) -> Optional[ProductModel]:
        stmt = (
            select(ProductModel)
            .options(
                joinedload(ProductModel.categoria),
                joinedload(ProductModel.tipo),
                joinedload(ProductModel.fotos),
                joinedload(ProductModel.documentos),
            )
            .where(ProductModel.id == str(id))
        )
        return self.db.execute(stmt).unique().scalar_one_or_none()

    def get_all(self, filters: Optional[dict] = None) -> List[ProductModel]:
        stmt = (
            select(ProductModel)
            .options(
                joinedload(ProductModel.categoria),
                joinedload(ProductModel.tipo),
            )
            .order_by(ProductModel.created_at.desc())
        )
        stmt = self._apply_filters(stmt, filters)
        return list(self.db.execute(stmt).unique().scalars().all())

    def update(self, model: ProductModel) -> ProductModel:
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
        stmt = select(func.count(ProductModel.id))
        return self.db.execute(stmt).scalar() or 0

    def get_last(self, limit: int = 10) -> List[ProductModel]:
        stmt = (
            select(ProductModel)
            .order_by(ProductModel.created_at.desc())
            .limit(limit)
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_total_stock_value(self) -> float:
        stmt = select(func.sum(ProductModel.price * ProductModel.quantity))
        result = self.db.execute(stmt).scalar()
        return float(result) if result else 0.0
