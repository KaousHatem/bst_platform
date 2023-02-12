from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)

from project.models import Location

Roles = (("admin", "admin"), ("logistic_admin", "logistic_admin"),
         ("project_manager", "project_manager"))

ADMIN = 1
LOGISTIC_ADMIN = 2
STOCK_MANAGER = 3

ROLE_CHOICES = (
    (ADMIN, 'Admin'),
    (LOGISTIC_ADMIN, 'Logistic_admin'),
    (STOCK_MANAGER, 'Stock_manager'),
)


# Create your models here.

class CustomeUserManager(BaseUserManager):

    # def create_user(self, username, password, **extra_fields):
    # 	print(password)
    # 	extra_fields.setdefault('is_staff', True)
    # 	extra_fields.setdefault('is_superuser', False)
    # 	extra_fields.setdefault('is_active', True)

    # 	if extra_fields.get("is_staff") is not True:
    # 		raise ValueError("Superuser must have is_staff=True")

    # 	if not username:
    # 		raise ValueError("Username field is required")

    # 	user = self.model(username=username, **extra_fields)
    # 	user.set_password(password)
    # 	user.save()
    # 	return user

    def create_superuser(self, username, password, **extra_fields):
        print(password)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        if not username:
            raise ValueError("Username field is required")

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    fullname = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True)
    role = models.PositiveSmallIntegerField(
        blank=True, null=True, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True)
    private_key = models.CharField(max_length=255, null=True, blank=True)

    USERNAME_FIELD = 'username'
    objects = CustomeUserManager()

    def __str__(self):
        return self.username

    class Meta:
        ordering = ("created_at",)


class UserActivities(models.Model):
    user = models.ForeignKey(
        CustomUser, related_name="user_activities", null=True, on_delete=models.SET_NULL)
    username = models.CharField(max_length=255)
    fullname = models.CharField(max_length=255)
    action = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f"{self.fullname} {self.action} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"
