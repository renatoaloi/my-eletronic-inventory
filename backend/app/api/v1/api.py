from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.api.v1.endpoints import (
    products,
    categories,
    types,
    photos,
    documents,
    dashboard,
)
from app.infrastructure.database.config import get_db
from app.infrastructure.repositories.photo_repository import SQLAlchemyPhotoRepository
from app.infrastructure.repositories.product_repository import SQLAlchemyProductRepository
from app.infrastructure.storage.file_storage import FileStorage
from app.application.services.photo_service import PhotoService
from app.application.dto.photo_dto import PhotoResponse
from app.infrastructure.repositories.document_repository import SQLAlchemyDocumentRepository
from app.application.services.document_service import DocumentService
from app.application.dto.document_dto import DocumentResponse
from app.api.deps import verify_api_key

api_router = APIRouter()

api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(types.router, prefix="/types", tags=["types"])
api_router.include_router(photos.router, prefix="/photos", tags=["photos"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])


def get_photo_service(db: Session = Depends(get_db)) -> PhotoService:
    return PhotoService(
        photo_repo=SQLAlchemyPhotoRepository(db),
        product_repo=SQLAlchemyProductRepository(db),
        file_storage=FileStorage(),
    )


def get_document_service(db: Session = Depends(get_db)) -> DocumentService:
    return DocumentService(
        document_repo=SQLAlchemyDocumentRepository(db),
        product_repo=SQLAlchemyProductRepository(db),
        file_storage=FileStorage(),
    )


@api_router.post("/products/{product_id}/photos", response_model=PhotoResponse, status_code=201, dependencies=[Depends(verify_api_key)])
def upload_product_photo(
    product_id: UUID,
    file: UploadFile = File(...),
    service: PhotoService = Depends(get_photo_service),
):
    content = file.file.read()
    return service.upload(product_id, content, file.filename or "upload")


@api_router.post("/products/{product_id}/documents", response_model=DocumentResponse, status_code=201, dependencies=[Depends(verify_api_key)])
def upload_product_document(
    product_id: UUID,
    file: UploadFile = File(...),
    service: DocumentService = Depends(get_document_service),
):
    content = file.file.read()
    return service.upload(product_id, content, file.filename or "upload")
