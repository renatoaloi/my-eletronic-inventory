import pytest
from uuid import UUID
from decimal import Decimal
from pydantic import ValidationError

from app.domain.models.product import ProductDomain
from app.domain.models.category import CategoryDomain
from app.domain.models.type import TypeDomain
from app.domain.models.photo import PhotoDomain
from app.domain.models.document import DocumentDomain
from app.application.dto.product_dto import ProductCreate, ProductUpdate
from app.application.dto.category_dto import CategoryCreate
from app.application.dto.type_dto import TypeCreate


class TestProductDomain:
    def test_valid_product(self):
        product = ProductDomain(
            name="Resistor 10k",
            price=0.50,
            code="R-10K-001",
        )
        assert isinstance(product.id, UUID)
        assert product.name == "Resistor 10k"
        assert product.price == Decimal("0.50")
        assert product.status == "a venda"

    def test_name_max_length(self):
        with pytest.raises(ValidationError):
            ProductDomain(
                name="A" * 51,
                price=1.0,
                code="TEST",
            )

    def test_invalid_status(self):
        with pytest.raises(ValidationError):
            ProductDomain(
                name="Test",
                price=1.0,
                code="TEST",
                status="invalid",
            )

    def test_price_two_decimals(self):
        product = ProductDomain(
            name="Capacitor",
            price=1.234,
            code="CAP-001",
        )
        assert product.price == Decimal("1.23")

    def test_code_max_length(self):
        ProductDomain(
            name="Test",
            price=1.0,
            code="A" * 50,
        )
        with pytest.raises(ValidationError):
            ProductDomain(
                name="Test",
                price=1.0,
                code="A" * 51,
            )


class TestCategoryDomain:
    def test_valid_category(self):
        cat = CategoryDomain(name="Resistores")
        assert isinstance(cat.id, UUID)
        assert cat.name == "Resistores"

    def test_name_max_length(self):
        with pytest.raises(ValidationError):
            CategoryDomain(name="A" * 51)


class TestTypeDomain:
    def test_valid_type(self):
        t = TypeDomain(name="SMD")
        assert isinstance(t.id, UUID)
        assert t.name == "SMD"

    def test_name_max_length(self):
        with pytest.raises(ValidationError):
            TypeDomain(name="A" * 51)


class TestPhotoDomain:
    def test_valid_photo(self):
        pid = UUID("00000000-0000-0000-0000-000000000001")
        photo = PhotoDomain(
            file_name="foto.jpg",
            file_path="/path/foto.jpg",
            product_id=pid,
        )
        assert isinstance(photo.id, UUID)
        assert photo.product_id == pid


class TestDocumentDomain:
    def test_valid_document(self):
        pid = UUID("00000000-0000-0000-0000-000000000001")
        doc = DocumentDomain(
            file_name="doc.pdf",
            file_path="/path/doc.pdf",
            product_id=pid,
        )
        assert isinstance(doc.id, UUID)
        assert doc.product_id == pid


class TestProductCreate:
    def test_valid(self):
        dto = ProductCreate(
            name="Resistor",
            price=0.50,
            code="R-001",
        )
        assert dto.name == "Resistor"

    def test_invalid_status(self):
        with pytest.raises(ValidationError):
            ProductCreate(
                name="Test",
                price=1.0,
                code="TEST",
                status="invalid",
            )

    def test_partial_update(self):
        dto = ProductUpdate(description="New description")
        assert dto.name is None
        assert dto.description == "New description"
        assert dto.price is None


class TestCategoryCreate:
    def test_valid(self):
        dto = CategoryCreate(name="Capacitores")
        assert dto.name == "Capacitores"


class TestTypeCreate:
    def test_valid(self):
        dto = TypeCreate(name="Through Hole")
        assert dto.name == "Through Hole"
