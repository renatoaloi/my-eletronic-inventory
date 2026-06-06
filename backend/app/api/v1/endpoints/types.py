from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import verify_api_key
from app.infrastructure.database.config import get_db
from app.infrastructure.repositories.type_repository import SQLAlchemyTypeRepository
from app.application.services.type_service import TypeService
from app.application.dto.type_dto import TypeCreate, TypeUpdate, TypeResponse

router = APIRouter(dependencies=[Depends(verify_api_key)])


def get_type_service(db: Session = Depends(get_db)) -> TypeService:
    return TypeService(type_repo=SQLAlchemyTypeRepository(db))


@router.get("/", response_model=List[TypeResponse])
def list_types(
    service: TypeService = Depends(get_type_service),
):
    return service.get_all()


@router.get("/{id}", response_model=TypeResponse)
def get_type(id: UUID, service: TypeService = Depends(get_type_service)):
    return service.get_by_id(id)


@router.post("/", response_model=TypeResponse, status_code=201)
def create_type(
    dto: TypeCreate,
    service: TypeService = Depends(get_type_service),
):
    return service.create(dto)


@router.put("/{id}", response_model=TypeResponse)
def update_type(
    id: UUID,
    dto: TypeUpdate,
    service: TypeService = Depends(get_type_service),
):
    return service.update(id, dto)


@router.delete("/{id}", status_code=204)
def delete_type(
    id: UUID,
    service: TypeService = Depends(get_type_service),
):
    service.delete(id)
