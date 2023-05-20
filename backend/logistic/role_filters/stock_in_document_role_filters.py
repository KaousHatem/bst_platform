
from rest_framework_role_filters.role_filters import RoleFilter
from django.db.models import Q

from ..models import Provision, PurchaseRequest, PurchaseOrder, Transfer, Store
from ..serializers import PurchaseOrderListingSerializer
from bst_django.utils import decodeJWT


class AdminRoleFilter(RoleFilter):
    role_id = 1

    def get_allowed_actions(self, request, view, obj=None):
        print('queryset')
        return ["create", "list", "retrieve", "update", "destroy"]

    def get_queryset(self, request, view, queryset):
        return queryset

    def get_serializer_class(self, request, view):
        return view.serializer_class


class LogisticAdminRoleFilter(RoleFilter):
    role_id = 2

    def get_allowed_actions(self, request, view, obj=None):
        return ["create", "list", "retrieve", "update", "destroy"]

    def get_queryset(self, request, view, queryset):

        return queryset

    def get_serializer_class(self, request, view):
        return view.serializer_class


class UserRoleFilter(RoleFilter):
    role_id = 3

    def get_allowed_actions(self, request, view, obj=None):
        return ["create", "list", "retrieve", "update", "destroy"]

    def get_queryset(self, request, view, queryset):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        store = Store.objects.get(location=user.location.id)
        queryset = queryset.filter(store=store.id)
        return queryset

    def get_serializer_class(self, request, view):
        print('serialize_class')

        return view.serializer_class
