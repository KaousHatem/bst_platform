from django.urls import path, include
from .views import (
    CreateUserView, LoginView, UpdatePasswordView, MeView,
    UserActivitiesView, UsersView, GroupView, ActivateUserView
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)

router.register("create-user", CreateUserView, 'create user')
router.register("login", LoginView, 'login')
router.register("update-password", UpdatePasswordView, 'update password')
router.register("me", MeView, 'me')
router.register("activities-log", UserActivitiesView, 'activities log')
router.register("users", UsersView, 'users')
router.register("groups", GroupView, 'groups')
router.register("activate", ActivateUserView, 'activate')

urlpatterns = [
    path("", include(router.urls))
]