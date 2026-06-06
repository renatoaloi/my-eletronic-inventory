from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.deps import verify_api_key
from app.infrastructure.database.config import get_db
from app.infrastructure.repositories.document_repository import SQLAlchemyDocumentRepository
from app.infrastructure.repositories.product_repository import SQLAlchemyProductRepository
from app.infrastructure.storage.file_storage import FileStorage
from app.application.services.document_service import DocumentService
from app.application.dto.document_dto import DocumentResponse

router = APIRouter(dependencies=[Depends(verify_api_key)])


def get_document_service(db: Session = Depends(get_db)) -> DocumentService:
    return DocumentService(
        document_repo=SQLAlchemyDocumentRepository(db),
        product_repo=SQLAlchemyProductRepository(db),
        file_storage=FileStorage(),
    )


@router.get("/{id}/download")
def download_document(id: UUID, service: DocumentService = Depends(get_document_service)):
    return service.download(id)


@router.delete("/{id}", status_code=204)
def delete_document(
    id: UUID,
    service: DocumentService = Depends(get_document_service),
):
    service.delete(id)
