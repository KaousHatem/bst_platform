from rest_framework.viewsets import ModelViewSet
from .serializers import (
    CreateUserSerializer, CustomUser, LoginSerializer, UpdatePasswordSerializer,
    CustomUserSerializer, UserActivities, UserActivitiesSerializer, GroupSerializer,
    ActivateSerializer, CustomUserSignSerializer
)
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group, Permission
from datetime import datetime, timezone
from bst_django.utils import get_access_token
from bst_django.permissions import IsAuthenticatedCustom
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action

from django.contrib.auth.models import Group
from project.models import Location


def add_user_activity(user, action):
    UserActivities.objects.create(
        user_id=user.id,
        username=user.username,
        fullname=user.fullname,
        action=action
    )

class CreateUserView(ModelViewSet):
    http_method_names = ["post","put"]
    queryset = CustomUser.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (IsAuthenticatedCustom, )

    def create(self, request):
        valid_request = self.serializer_class(data=request.data)
        # print(self.queryset.get(username="chakib"))
        if self.queryset.filter(username=request.data['username']):
            return Response(
                    {'message':"username already exists"},
                    status=status.HTTP_409_CONFLICT
                )

        valid_request.is_valid(raise_exception=True)

        user_data = dict(valid_request.validated_data)

        user_data['location'] = Location.objects.get(pk=valid_request.validated_data.get('location'))

        user = CustomUser.objects.create(**user_data)
        user.set_password(valid_request.validated_data['password'])

        access = get_access_token({"user_id": user.id, "user_username": user.username}, 99999)
        user.private_key = access

        user.save()

        add_user_activity(request.user, "added new user")

        return Response(
            {"success": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

    def update(self, request, pk):
        valid_request = self.serializer_class(data=request.data)
        checkUser = self.queryset.get(username=request.data['username'])
        if checkUser and checkUser.id != int(pk):
            return Response(
                    {'message':"username already exists"},
                    status=status.HTTP_409_CONFLICT
                )
        valid_request.is_valid(raise_exception=True)
        user_data = dict(valid_request.validated_data)    
        user_data['location'] = Location.objects.get(pk=valid_request.validated_data.get('location'))
        user = CustomUser.objects.get(id=pk)
        user.username = user_data['username']
        user.fullname = user_data['fullname']
        user.role = user_data['role']
        user.location = user_data['location']
        if valid_request.validated_data['password'] != "":
            user.set_password(valid_request.validated_data['password'])
        user.save()
        add_user_activity(request.user, "update "+user.username+" user")

        return Response(
            {"success": "User Updated successfully"},
            status=status.HTTP_200_OK
        )

class ActivateUserView(ModelViewSet):
    http_method_names = ["put"]
    queryset = CustomUser.objects.all()
    serializer_class = ActivateSerializer
    permission_classes = (IsAuthenticatedCustom, )

    def update(self, request, pk):
        valid_request = self.serializer_class(data=request.data)
        valid_request.is_valid(raise_exception=True)
        user = CustomUser.objects.get(id=pk)
        user.is_active = valid_request.validated_data['is_active']
        
        user.save()
        
        add_user_activity(request.user, "activate "+user.username+" user "+str(user.is_active))
        # print(request.data)

        return Response(
            {"success": "User Updated successfully"},
            status=status.HTTP_200_OK
        )




class LoginView(ModelViewSet):
    http_method_names = ["post"]
    queryset = CustomUser.objects.all()
    serializer_class = LoginSerializer

    def create(self, request):
        print(request.data)
        valid_request = self.serializer_class(data=request.data)
        valid_request.is_valid(raise_exception=True)

        new_user = valid_request.validated_data["is_new_user"]
        if new_user:
            user = CustomUser.objects.filter(
                username=valid_request.validated_data["username"]
            )

            if user:
                user = user[0]
                if not user.password:
                    return Response({"user_id": user.id})
                else:
                    raise Exception("User has password already")
            else:
                raise Exception("User with username not found")

        user = authenticate(
            username=valid_request.validated_data["username"],
            password=valid_request.validated_data.get("password", None)
        )
        if not user:
            return Response(
                {"error": "Votre nom d'utilisation ou mot de pass n'est pas correcte"},
                status=status.HTTP_400_BAD_REQUEST
            )

        access = get_access_token({"user_id": user.id}, 1)
        user.last_login = datetime.utcnow().replace(tzinfo=timezone.utc)
        user.save()

        add_user_activity(user, "logged in")
        role = user.role
        if user.is_superuser:
            role = "1"
        return Response({"access": access,"role":role})

class UpdatePasswordView(ModelViewSet):
    serializer_class = UpdatePasswordSerializer
    http_method_names = ["post"]
    queryset = CustomUser.objects.all()

    def create(self, request):
        valid_request = self.serializer_class(data=request.data)
        valid_request.is_valid(raise_exception=True)

        user = CustomUser.objects.filter(
            id=valid_request.validated_data["user_id"])

        if not user:
            raise Exception("User with id not found")

        user = user[0]

        user.set_password(valid_request.validated_data["password"])
        user.save()

        add_user_activity(user, "updated password")

        return Response({"success": "User password updated"})

class MeView(ModelViewSet):
    serializer_class = CustomUserSerializer
    http_method_names = ["get"]
    queryset = CustomUser.objects.all()
    permission_classes = (IsAuthenticatedCustom, )

    def list(self, request):
        data = self.serializer_class(request.user).data
        return Response(data)


class UserActivitiesView(ModelViewSet):
    serializer_class = UserActivitiesSerializer
    http_method_names = ["get"]
    queryset = UserActivities.objects.all()
    permission_classes = (IsAuthenticatedCustom, )


class UsersView(ModelViewSet):
    serializer_class = CustomUserSerializer
    http_method_names = ["get","delete"]
    queryset = CustomUser.objects.all()
    # permission_classes = (IsAuthenticatedCustom, )

    def list(self, request):
        users = self.queryset.filter(is_superuser=False)
        data = self.serializer_class(users, many=True).data
        return Response(data)


    @action(detail=True, methods=['get'],serializer_class=CustomUserSignSerializer)
    def signature(self, request, pk, *args, **kwargs):
        user = self.get_object()
        
        if user.private_key==None:
            access = get_access_token({"user_id": user.id, "user_username": user.username}, 99999)
            user.private_key = access
            user.save()
        serializer = self.serializer_class(user)
            

        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupView(ModelViewSet):
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    permission_classes = (IsAuthenticatedCustom, )




