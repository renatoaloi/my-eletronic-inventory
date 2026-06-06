from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import verify_api_key
from app.infrastructure.database.config import get_db
from app.infrastructure.repositories.category_repository import SQLAlchemyCategoryRepository
from app.application.services.category_service import CategoryService
from app.application.dto.category_dto import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(dependencies=[Depends(verify_api_key)])


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(category_repo=SQLAlchemyCategoryRepository(db))


@router.get("/", response_model=List[CategoryResponse])
def list_categories(
    service: CategoryService = Depends(get_category_service),
):
    return service.get_all()


@router.get("/{id}", response_model=CategoryResponse)
def get_category(id: UUID, service: CategoryService = Depends(get_category_service)):
    return service.get_by_id(id)


@router.post("/", response_model=CategoryResponse, status_code=201)
def create_category(
    dto: CategoryCreate,
    service: CategoryService = Depends(get_category_service),
):
    return service.create(dto)


@router.put("/{id}", response_model=CategoryResponse)
def update_category(
    id: UUID,
    dto: CategoryUpdate,
    service: CategoryService = Depends(get_category_service),
):
    return service.update(id, dto)


@router.delete("/{id}", status_code=204)
def delete_category(
    id: UUID,
    service: CategoryService = Depends(get_category_service),
):
    service.delete(id)
