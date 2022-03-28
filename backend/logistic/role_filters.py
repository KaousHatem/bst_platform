from rest_framework_role_filters.role_filters import RoleFilter
from django.db.models import Q

from .serializers import ProvisionSerializer
from bst_django.utils import decodeJWT



class AdminRoleFilter(RoleFilter):
    role_id = 1
    def get_allowed_actions(self, request, view, obj=None):
        print('get_allowed_actions')
        return ["create", "list", "retrieve", "update", "partial_update","approve","destroy"]

    def get_queryset(self, request, view, queryset):
        return queryset

    def get_serializer_class(self, request, view):
        return ProvisionSerializer

class LogisticAdminRoleFilter(RoleFilter):
    role_id = 2
    def get_allowed_actions(self, request, view, obj=None):
        print('get_allowed_actions')
        return ["create", "list", "retrieve", "update", "partial_update","approve","destroy"]

    def get_queryset(self, request, view, queryset):
        print('get_queryset',request.META.get('HTTP_AUTHORIZATION'))
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        print(user)
        queryset = queryset.filter(~Q(status='0') | Q(created_by=user))
        return queryset

    def get_serializer_class(self, request, view):
        print('serialize_class')
        return ProvisionSerializer

class UserRoleFilter(RoleFilter):
    role_id = 3

    def get_allowed_actions(self, request, view, obj=None):
        print('get_allowed_actions')
        return ["create", "list", "retrieve", "update", "partial_update","approve","destroy"]

    def get_queryset(self, request, view, queryset):
        print('get_queryset',request.META.get('HTTP_AUTHORIZATION'))
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        print(user)
        queryset = queryset.filter(created_by=user)
        return queryset

    def get_serializer_class(self, request, view):
        print('serialize_class')
        return ProvisionSerializer
