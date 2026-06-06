from uuid import UUID
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException

from app.domain.interfaces.services import AbstractTypeService
from app.domain.interfaces.repositories import AbstractTypeRepository
from app.domain.models.type import TypeDomain
from app.application.dto.type_dto import TypeCreate, TypeUpdate, TypeResponse
from app.infrastructure.database.models import TypeModel


class TypeService(AbstractTypeService):
    def __init__(self, type_repo: AbstractTypeRepository):
        self.type_repo = type_repo

    def _model_to_response(self, model: TypeModel) -> TypeResponse:
        return TypeResponse(
            id=UUID(model.id),
            name=model.name,
            description=model.description,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def create(self, dto: TypeCreate) -> TypeResponse:
        domain = TypeDomain(**dto.model_dump())
        model = TypeModel(
            id=str(domain.id),
            name=domain.name,
            description=domain.description,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        created = self.type_repo.add(model)
        return self._model_to_response(created)

    def get_by_id(self, id: UUID) -> TypeResponse:
        model = self.type_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Type not found")
        return self._model_to_response(model)

    def get_all(self) -> List[TypeResponse]:
        models = self.type_repo.get_all()
        return [self._model_to_response(m) for m in models]

    def update(self, id: UUID, dto: TypeUpdate) -> Optional[TypeResponse]:
        model = self.type_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Type not found")
        update_data = dto.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(model, field, value)
        model.updated_at = datetime.now()
        updated = self.type_repo.update(model)
        return self._model_to_response(updated)

    def delete(self, id: UUID) -> bool:
        model = self.type_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Type not found")
        return self.type_repo.delete(id)
