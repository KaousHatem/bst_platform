from django.urls import path, include
from .views import (
    CreateUserView, LoginView, UpdatePasswordView, MeView,
    UserActivitiesView, UsersView, GroupView, ActivateUserView
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("user/create-user", CreateUserView, 'create user')
router.register("user/login", LoginView, 'login')
router.register("user/update-password", UpdatePasswordView, 'update password')
router.register("user/me", MeView, 'me')
router.register("user/activities-log", UserActivitiesView, 'activities log')
router.register("user/users", UsersView, 'users')
router.register("user/groups", GroupView, 'groups')
router.register("user/activate", ActivateUserView, 'activate')

urlpatterns = [
    path("", include(router.urls))
]