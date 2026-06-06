from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID


class AbstractProductService(ABC):
    @abstractmethod
    def create(self, dto) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self, filters: Optional[dict] = None) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def update(self, id: UUID, dto) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError

    @abstractmethod
    def export_kit(self, id: UUID) -> dict:
        raise NotImplementedError


class AbstractCategoryService(ABC):
    @abstractmethod
    def create(self, dto) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def update(self, id: UUID, dto) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError


class AbstractTypeService(ABC):
    @abstractmethod
    def create(self, dto) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def update(self, id: UUID, dto) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError


class AbstractPhotoService(ABC):
    @abstractmethod
    def upload(self, product_id: UUID, file_content: bytes, file_name: str) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_file(self, id: UUID):
        raise NotImplementedError

    @abstractmethod
    def set_cover(self, id: UUID):
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError


class AbstractDocumentService(ABC):
    @abstractmethod
    def upload(self, product_id: UUID, file_content: bytes, file_name: str) -> object:
        raise NotImplementedError

    @abstractmethod
    def download(self, id: UUID):
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError


class AbstractDashboardService(ABC):
    @abstractmethod
    def get_dashboard(self) -> object:
        raise NotImplementedError
