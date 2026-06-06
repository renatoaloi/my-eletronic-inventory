from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from app.api.deps import verify_api_key
from app.infrastructure.database.config import get_db
from app.infrastructure.repositories.product_repository import SQLAlchemyProductRepository
from app.infrastructure.repositories.category_repository import SQLAlchemyCategoryRepository
from app.infrastructure.repositories.type_repository import SQLAlchemyTypeRepository
from app.application.services.product_service import ProductService
from app.application.dto.product_dto import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(dependencies=[Depends(verify_api_key)])


def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(
        product_repo=SQLAlchemyProductRepository(db),
        category_repo=SQLAlchemyCategoryRepository(db),
        type_repo=SQLAlchemyTypeRepository(db),
    )


@router.get("/", response_model=list[ProductResponse])
def list_products(
    category_id: Optional[UUID] = Query(None),
    type_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    service: ProductService = Depends(get_product_service),
):
    filters = {}
    if category_id:
        filters["category_id"] = category_id
    if type_id:
        filters["type_id"] = type_id
    if status:
        filters["status"] = status
    if search:
        filters["search"] = search
    return service.get_all(filters=filters)


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(
    dto: ProductCreate,
    service: ProductService = Depends(get_product_service),
):
    return service.create(dto)


@router.get("/{id}", response_model=ProductResponse)
def get_product(
    id: UUID,
    service: ProductService = Depends(get_product_service),
):
    return service.get_by_id(id)


@router.put("/{id}", response_model=ProductResponse)
def update_product(
    id: UUID,
    dto: ProductUpdate,
    service: ProductService = Depends(get_product_service),
):
    return service.update(id, dto)


@router.delete("/{id}", status_code=204)
def delete_product(
    id: UUID,
    service: ProductService = Depends(get_product_service),
):
    service.delete(id)


@router.get("/export/{id}")
def export_product(
    id: UUID,
    service: ProductService = Depends(get_product_service),
):
    return service.export_kit(id)
