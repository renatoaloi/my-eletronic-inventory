from decimal import Decimal

from app.domain.interfaces.services import AbstractDashboardService
from app.domain.interfaces.repositories import AbstractProductRepository, AbstractCategoryRepository
from app.application.dto.dashboard_dto import DashboardResponse, LastProductItem, TopCategoryItem


class DashboardService(AbstractDashboardService):
    def __init__(
        self,
        product_repo: AbstractProductRepository,
        category_repo: AbstractCategoryRepository,
    ):
        self.product_repo = product_repo
        self.category_repo = category_repo

    def get_dashboard(self) -> DashboardResponse:
        last_products_raw = self.product_repo.get_last(limit=10)
        total_stock_value = Decimal(str(self.product_repo.get_total_stock_value())).quantize(Decimal("0.01"))
        top_categories_raw = self.category_repo.get_top_by_value(limit=5)

        last_products = [
            LastProductItem(
                id=item.id,
                name=item.name,
                price=item.price,
                status=item.status,
                created_at=item.created_at,
            )
            for item in last_products_raw
        ]

        top_categories = [
            TopCategoryItem(
                id=item["id"],
                name=item["name"],
                total_value=Decimal(str(item["total_value"])).quantize(Decimal("0.01")),
            )
            for item in top_categories_raw
        ]

        return DashboardResponse(
            last_products=last_products,
            total_stock_value=total_stock_value,
            top_categories=top_categories,
            total_products=self.product_repo.count(),
            total_categories=self.category_repo.count(),
        )
