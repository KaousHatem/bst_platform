from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
import django_filters.rest_framework

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

from rest_framework_csv import parsers as p

import csv
import json
from time import time

from bst_django.utils import get_access_token
from bst_django.permissions import IsAuthenticatedCustom, HasPermission



from .models import (
    Location
)

from .serializers import  (
    LocationSerializer
)



class LocationViewSet(ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes=[HasPermission]

    def get_queryset(self):
        return Location.objects.all()


