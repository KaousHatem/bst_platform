from django.urls import path, include
from .views import (
	ProductViewSet,
	CategoryViewSet,
	ProductBulkViewSet,
	ProvisionViewSet,
	ProvisionProductViewSet,
	)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'product', ProductViewSet)
router.register(r'product-bulk', ProductBulkViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'provision', ProvisionViewSet)
router.register(r'provision-product', ProvisionProductViewSet)
urlpatterns = [
	path("", include(router.urls)),
	
]
