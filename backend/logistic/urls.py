from django.urls import path, include
from .views import (
	ProductViewSet,
	UnitViewSet,
	UnitConversionViewSet,
	CategoryViewSet,
	ProductBulkViewSet,
	ProvisionViewSet,
	ProvisionProductViewSet,
	PurchaseReqViewSet,
	PurchaseReqProductViewSet,
	SupplierViewSet,
	)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'product', ProductViewSet)
router.register(r'unit', UnitViewSet)
router.register(r'unit-conversion', UnitConversionViewSet)
router.register(r'product-bulk', ProductBulkViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'provision', ProvisionViewSet)
router.register(r'provision-product', ProvisionProductViewSet)
router.register(r'purchase-request', PurchaseReqViewSet)
router.register(r'purchase-request-product', PurchaseReqProductViewSet)
router.register(r'supplier', SupplierViewSet)
urlpatterns = [
	path("", include(router.urls)),
	
]
