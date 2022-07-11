from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

from .views import LocationViewSet
router = DefaultRouter()
router.register(r'project/locations', LocationViewSet)
urlpatterns = [
	path("", include(router.urls)),
]

