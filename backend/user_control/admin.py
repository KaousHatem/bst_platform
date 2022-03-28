from django.contrib import admin
from .models import CustomUser, UserActivities
from django.contrib.auth.models import Group


admin.site.register((CustomUser, UserActivities,))

# Register your models here.
