from uuid import UUID
from typing import Optional, List
from datetime import datetime
from fastapi import HTTPException

from app.domain.interfaces.services import AbstractProductService
from app.domain.interfaces.repositories import (
    AbstractProductRepository,
    AbstractCategoryRepository,
    AbstractTypeRepository,
)
from app.domain.models.product import ProductDomain
from app.application.dto.product_dto import ProductCreate, ProductUpdate, ProductResponse
from app.infrastructure.database.models import ProductModel, CategoryModel, TypeModel


class ProductService(AbstractProductService):
    def __init__(
        self,
        product_repo: AbstractProductRepository,
        category_repo: Optional[AbstractCategoryRepository] = None,
        type_repo: Optional[AbstractTypeRepository] = None,
    ):
        self.product_repo = product_repo
        self.category_repo = category_repo
        self.type_repo = type_repo

    def _model_to_response(self, model: ProductModel) -> ProductResponse:
        return ProductResponse(
            id=UUID(model.id),
            name=model.name,
            description=model.description,
            price=model.price,
            quantity=model.quantity,
            code=model.code,
            status=model.status,
            category_id=UUID(model.category_id) if model.category_id else None,
            type_id=UUID(model.type_id) if model.type_id else None,
            category_name=model.categoria.name if model.categoria else None,
            type_name=model.tipo.name if model.tipo else None,
            photos=[
                {"id": UUID(f.id), "file_name": f.file_name, "file_path": f.file_path, "is_cover": f.is_cover}
                for f in (model.fotos or [])
            ],
            documents=[
                {"id": UUID(d.id), "file_name": d.file_name, "file_path": d.file_path}
                for d in (model.documentos or [])
            ],
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def create(self, dto: ProductCreate) -> ProductResponse:
        domain = ProductDomain(**dto.model_dump())
        if self.category_repo and dto.category_id:
            cat = self.category_repo.get_by_id(dto.category_id)
            if not cat:
                raise HTTPException(status_code=404, detail="Category not found")
        if self.type_repo and dto.type_id:
            t = self.type_repo.get_by_id(dto.type_id)
            if not t:
                raise HTTPException(status_code=404, detail="Type not found")
        model = ProductModel(
            id=str(domain.id),
            name=domain.name,
            description=domain.description,
            price=domain.price,
            quantity=domain.quantity,
            code=domain.code,
            status=domain.status,
            category_id=str(dto.category_id) if dto.category_id else None,
            type_id=str(dto.type_id) if dto.type_id else None,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        created = self.product_repo.add(model)
        return self._model_to_response(created)

    def get_by_id(self, id: UUID) -> Optional[ProductResponse]:
        model = self.product_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Product not found")
        return self._model_to_response(model)

    def get_all(self, filters: Optional[dict] = None) -> List[ProductResponse]:
        models = self.product_repo.get_all(filters)
        return [self._model_to_response(m) for m in models]

    def update(self, id: UUID, dto: ProductUpdate) -> Optional[ProductResponse]:
        model = self.product_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Product not found")
        update_data = dto.model_dump(exclude_unset=True)
        if "category_id" in update_data:
            update_data["category_id"] = str(update_data["category_id"]) if update_data["category_id"] else None
        if "type_id" in update_data:
            update_data["type_id"] = str(update_data["type_id"]) if update_data["type_id"] else None
        if "price" in update_data:
            update_data["price"] = str(update_data["price"])
        for field, value in update_data.items():
            setattr(model, field, value)
        model.updated_at = datetime.now()
        updated = self.product_repo.update(model)
        return self._model_to_response(updated)

    def delete(self, id: UUID) -> bool:
        model = self.product_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Product not found")
        return self.product_repo.delete(id)

    def export_kit(self, id: UUID) -> dict:
        model = self.product_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Product not found")
        return {
            "id": model.id,
            "name": model.name,
            "description": model.description,
            "price": str(model.price),
            "quantity": model.quantity,
            "code": model.code,
            "status": model.status,
            "category": model.categoria.name if model.categoria else None,
            "type": model.tipo.name if model.tipo else None,
            "fotos": [
                {"file_name": f.file_name, "file_path": f.file_path}
                for f in (model.fotos or [])
            ],
            "documentos": [
                {"file_name": d.file_name, "file_path": d.file_path}
                for d in (model.documentos or [])
            ],
        }
