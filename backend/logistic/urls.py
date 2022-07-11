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
	PurchaseOrderViewSet,
	PurchaseOrderProductViewSet,
	)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'logistic/product', ProductViewSet)
router.register(r'logistic/unit', UnitViewSet)
router.register(r'logistic/unit-conversion', UnitConversionViewSet)
router.register(r'logistic/product-bulk', ProductBulkViewSet)
router.register(r'logistic/category', CategoryViewSet)
router.register(r'logistic/provision', ProvisionViewSet)
router.register(r'logistic/provision-product', ProvisionProductViewSet)
router.register(r'logistic/purchase-request', PurchaseReqViewSet)
router.register(r'logistic/purchase-request-product', PurchaseReqProductViewSet)
router.register(r'logistic/supplier', SupplierViewSet)
router.register(r'logistic/purchase-order', PurchaseOrderViewSet)
router.register(r'logistic/purchase-order-product', PurchaseOrderProductViewSet)


urlpatterns = [
	path("logistic/", include(router.urls)),
	
]
