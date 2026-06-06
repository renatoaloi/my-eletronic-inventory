from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID


class AbstractProductRepository(ABC):
    @abstractmethod
    def add(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self, filters: Optional[dict] = None) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def update(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError

    @abstractmethod
    def count(self) -> int:
        raise NotImplementedError

    @abstractmethod
    def get_last(self, limit: int = 10) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def get_total_stock_value(self) -> float:
        raise NotImplementedError


class AbstractCategoryRepository(ABC):
    @abstractmethod
    def add(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def update(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError

    @abstractmethod
    def get_top_by_value(self, limit: int = 5) -> List[dict]:
        raise NotImplementedError

    @abstractmethod
    def count(self) -> int:
        raise NotImplementedError


class AbstractTypeRepository(ABC):
    @abstractmethod
    def add(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def update(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError

    @abstractmethod
    def count(self) -> int:
        raise NotImplementedError


class AbstractPhotoRepository(ABC):
    @abstractmethod
    def add(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_by_product_id(self, product_id: UUID) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError


class AbstractDocumentRepository(ABC):
    @abstractmethod
    def add(self, model) -> object:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[object]:
        raise NotImplementedError

    @abstractmethod
    def get_by_product_id(self, product_id: UUID) -> List[object]:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        raise NotImplementedError
