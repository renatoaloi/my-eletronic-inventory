from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.deps import verify_api_key
from app.infrastructure.database.config import get_db
from app.infrastructure.repositories.photo_repository import SQLAlchemyPhotoRepository
from app.infrastructure.repositories.product_repository import SQLAlchemyProductRepository
from app.infrastructure.storage.file_storage import FileStorage
from app.application.services.photo_service import PhotoService
from app.application.dto.photo_dto import PhotoResponse

public_router = APIRouter()


def get_photo_service(db: Session = Depends(get_db)) -> PhotoService:
    return PhotoService(
        photo_repo=SQLAlchemyPhotoRepository(db),
        product_repo=SQLAlchemyProductRepository(db),
        file_storage=FileStorage(),
    )


@public_router.get("/{id}/file")
def get_photo_file(id: UUID, service: PhotoService = Depends(get_photo_service)):
    return service.get_file(id)


router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.put("/{id}/cover")
def set_cover_photo(id: UUID, service: PhotoService = Depends(get_photo_service)):
    return service.set_cover(id)


@router.delete("/{id}", status_code=204)
def delete_photo(
    id: UUID,
    service: PhotoService = Depends(get_photo_service),
):
    service.delete(id)
