from sqlalchemy import Column, String, Integer, Numeric, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.infrastructure.database.base import Base
from datetime import datetime


class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, default="", server_default="")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    produtos = relationship("ProductModel", back_populates="categoria")


class TypeModel(Base):
    __tablename__ = "types"

    id = Column(String(36), primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, default="", server_default="")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    produtos = relationship("ProductModel", back_populates="tipo")


class ProductModel(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, default="", server_default="")
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, default=0, server_default="0")
    code = Column(String(50), unique=True, nullable=False)
    status = Column(String(20), nullable=False, server_default="a venda")
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=True)
    type_id = Column(String(36), ForeignKey("types.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    categoria = relationship("CategoryModel", back_populates="produtos")
    tipo = relationship("TypeModel", back_populates="produtos")
    fotos = relationship("PhotoModel", back_populates="produto", cascade="all, delete-orphan")
    documentos = relationship("DocumentModel", back_populates="produto", cascade="all, delete-orphan")


class PhotoModel(Base):
    __tablename__ = "photos"

    id = Column(String(36), primary_key=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    is_cover = Column(Boolean, default=False, server_default="0")

    produto = relationship("ProductModel", back_populates="fotos")


class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)

    produto = relationship("ProductModel", back_populates="documentos")
