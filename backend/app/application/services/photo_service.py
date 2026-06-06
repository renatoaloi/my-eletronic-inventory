from uuid import UUID, uuid4
from typing import Optional
from fastapi import HTTPException

from app.domain.interfaces.services import AbstractPhotoService
from app.domain.interfaces.repositories import AbstractPhotoRepository, AbstractProductRepository
from app.application.dto.photo_dto import PhotoResponse
from app.infrastructure.database.models import PhotoModel
from app.infrastructure.storage.file_storage import FileStorage


class PhotoService(AbstractPhotoService):
    def __init__(
        self,
        photo_repo: AbstractPhotoRepository,
        product_repo: AbstractProductRepository,
        file_storage: FileStorage,
    ):
        self.photo_repo = photo_repo
        self.product_repo = product_repo
        self.file_storage = file_storage

    def _model_to_response(self, model: PhotoModel) -> PhotoResponse:
        return PhotoResponse(
            id=UUID(model.id),
            file_name=model.file_name,
            file_path=model.file_path,
            product_id=UUID(model.product_id),
            is_cover=model.is_cover,
        )

    def upload(self, product_id: UUID, file_content: bytes, file_name: str) -> PhotoResponse:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        photo_id = uuid4()
        subfolder = f"products/{product_id}/photos"
        file_path = self.file_storage.save(subfolder, f"{photo_id}_{file_name}", file_content)
        model = PhotoModel(
            id=str(photo_id),
            file_name=file_name,
            file_path=file_path,
            product_id=str(product_id),
            is_cover=False,
        )
        created = self.photo_repo.add(model)
        return self._model_to_response(created)

    def get_file(self, id: UUID):
        from fastapi.responses import FileResponse
        model = self.photo_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Photo not found")
        return FileResponse(model.file_path)

    def set_cover(self, id: UUID):
        model = self.photo_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Photo not found")
        photos = self.photo_repo.get_by_product_id(UUID(model.product_id))
        for p in photos:
            p.is_cover = (p.id == str(id))
        self.photo_repo.db.commit()
        if hasattr(self.photo_repo, 'db'):
            self.photo_repo.db.refresh(model)
        return PhotoResponse(
            id=UUID(model.id),
            file_name=model.file_name,
            file_path=model.file_path,
            product_id=UUID(model.product_id),
            is_cover=True,
        )

    def delete(self, id: UUID) -> bool:
        model = self.photo_repo.get_by_id(id)
        if not model:
            raise HTTPException(status_code=404, detail="Photo not found")
        self.file_storage.delete(model.file_path)
        return self.photo_repo.delete(id)
