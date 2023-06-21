from rest_framework.permissions import BasePermission
from rest_framework import permissions
from .utils import decodeJWT
from rest_framework.views import exception_handler
from rest_framework.response import Response


class IsAuthenticatedCustom(BasePermission):

    def has_permission(self, request, _):
        try:
            auth_token = request.META.get("HTTP_AUTHORIZATION", None)
        except Exception:
            return False

        user = decodeJWT(auth_token)
        if not user:
            return False

        request.user = user

        return True


class HasPermission(permissions.DjangoModelPermissions):
    """
    Global permission check if user has permission depends on his Group or Role
    """

    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],  # permission changed
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

    def get_required_permissions(self, method, model_cls):
        """
        Given a model and an HTTP method, return the list of permission
        codes that the user is required to have.
        """

        kwargs = {
            'app_label': model_cls._meta.app_label,
            'model_name': model_cls._meta.model_name
        }

        if method not in self.perms_map:
            raise exceptions.MethodNotAllowed(method)

        return [perm % kwargs for perm in self.perms_map[method]]

    def has_permission(self, request, view):
        # print(view.action)
        # get auth_token that was generated on login post
        try:
            auth_token = request.META.get("HTTP_AUTHORIZATION", None)
        except Exception:
            return False

        # decode auth_token to check if user exist
        # it can return that user does not exist that can means that auth_toke has been expired
        user = decodeJWT(auth_token)

        # check of user exist before cheching any permissions
        if not user:
            return False

        # allow all action if user is superuser
        if user.is_superuser:
            return True

        # get all user permissions and check if it has the action permission
        user_permissions = user.get_all_permissions()
        perms = self.get_required_permissions(
            request.method, view.queryset.model)

        for permission in perms:
            if permission not in user_permissions:
                return False
        return True

        return True


def custom_exception_handler(exc, context):

    response = exception_handler(exc, context)

    if response is not None:
        return response

    exc_list = str(exc).split("DETAIL: ")
    return Response({"error": exc_list[-1]}, status=403)
