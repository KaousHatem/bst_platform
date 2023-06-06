from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, HttpResponseRedirect, FileResponse, QueryDict
# from django.http import FileResponse
from django.views.decorators.csrf import csrf_exempt
import django_filters.rest_framework
from rest_framework_role_filters.viewsets import RoleFilterModelViewSet
from django.db.models import Q
from itertools import chain
from django.db import transaction

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import status
from rest_framework.response import Response

from ..role_filters import stock_in_document_role_filters

from rest_framework_csv import parsers as p

# import pandas as pd
import csv
import json
from time import time
from ..serializer.stock_out_serializers import StockOutSerializer

from bst_django.utils import get_access_token, decodeJWT
from bst_django.permissions import IsAuthenticatedCustom, HasPermission

from ..serializer.stock_serializers import StockSerializer
from ..serializer.stock_in_serializers import StockInSerializer
from ..models import (
    ReceiptDocument
)

from ..serializer.receipt_serializers import (
    ReceiptDocumentSerializer
)


class ReceiptDocumentViewSet(ModelViewSet):
    queryset = ReceiptDocument.objects.all().order_by('-created_on')
    serializer_class = ReceiptDocumentSerializer

    # permission_classes = [HasPermission]

    # def get_serializer_class(self):
    #     if self.action == 'retrieve':
    #         return StockInDocumentListSerializer
    #     if self.action == 'list':
    #         return StockInDocumentListSerializer
    #     return super().get_serializer_class()
