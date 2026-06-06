from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import verify_api_key
from app.infrastructure.database.config import get_db
from app.infrastructure.repositories.product_repository import SQLAlchemyProductRepository
from app.infrastructure.repositories.category_repository import SQLAlchemyCategoryRepository
from app.application.services.dashboard_service import DashboardService
from app.application.dto.dashboard_dto import DashboardResponse

router = APIRouter(dependencies=[Depends(verify_api_key)])


def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    return DashboardService(
        product_repo=SQLAlchemyProductRepository(db),
        category_repo=SQLAlchemyCategoryRepository(db),
    )


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    service: DashboardService = Depends(get_dashboard_service),
):
    return service.get_dashboard()
