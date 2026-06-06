from uuid import UUID
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException

from app.domain.interfaces.services import AbstractCategoryService
from app.domain.interfaces.repositories import AbstractCategoryRepository
from app.domain.models.category import CategoryDomain
from app.application.dto.category_dto import CategoryCreate, CategoryUpdate, CategoryResponse
from app.infrastructure.database.models import CategoryModel


class CategoryService(AbstractCategoryService):
    def __init__(self, category_repo: AbstractCategoryRepository):
        self.category_repo = category_repo

    def _model_to_response(self, model: CategoryModel) -> CategoryResponse:
        return CategoryResponse(
            id=UUID(model.id),
            name=model.name,
            description=model.description,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def create(self, dto: CategoryCreate) -> CategoryResponse:
        domain = CategoryDomain(**dto.model_dump())
        model = CategoryModel(
            id=str(domain.id),
            name=domain.name,
            description=domain.description,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        created = self.category_repo.add(model)
        return self._model_to_response(created)

    def get_by_id(self, id: UUID) -> CategoryResponse:
        model = self.category_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Category not found")
        return self._model_to_response(model)

    def get_all(self) -> List[CategoryResponse]:
        models = self.category_repo.get_all()
        return [self._model_to_response(m) for m in models]

    def update(self, id: UUID, dto: CategoryUpdate) -> Optional[CategoryResponse]:
        model = self.category_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Category not found")
        update_data = dto.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(model, field, value)
        model.updated_at = datetime.now()
        updated = self.category_repo.update(model)
        return self._model_to_response(updated)

    def delete(self, id: UUID) -> bool:
        model = self.category_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Category not found")
        return self.category_repo.delete(id)
