from uuid import UUID, uuid4
from typing import Optional
from fastapi import HTTPException

from app.domain.interfaces.services import AbstractDocumentService
from app.domain.interfaces.repositories import AbstractDocumentRepository, AbstractProductRepository
from app.application.dto.document_dto import DocumentResponse
from app.infrastructure.database.models import DocumentModel
from app.infrastructure.storage.file_storage import FileStorage


class DocumentService(AbstractDocumentService):
    def __init__(
        self,
        document_repo: AbstractDocumentRepository,
        product_repo: AbstractProductRepository,
        file_storage: FileStorage,
    ):
        self.document_repo = document_repo
        self.product_repo = product_repo
        self.file_storage = file_storage

    def _model_to_response(self, model: DocumentModel) -> DocumentResponse:
        return DocumentResponse(
            id=UUID(model.id),
            file_name=model.file_name,
            file_path=model.file_path,
            product_id=UUID(model.product_id),
        )

    def upload(self, product_id: UUID, file_content: bytes, file_name: str) -> DocumentResponse:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        doc_id = uuid4()
        subfolder = f"products/{product_id}/documents"
        file_path = self.file_storage.save(subfolder, f"{doc_id}_{file_name}", file_content)
        model = DocumentModel(
            id=str(doc_id),
            file_name=file_name,
            file_path=file_path,
            product_id=str(product_id),
        )
        created = self.document_repo.add(model)
        return self._model_to_response(created)

    def download(self, id: UUID):
        from fastapi.responses import FileResponse
        model = self.document_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Document not found")
        return FileResponse(model.file_path, filename=model.file_name)

    def delete(self, id: UUID) -> bool:
        model = self.document_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Document not found")
        self.file_storage.delete(model.file_path)
        return self.document_repo.delete(id)
