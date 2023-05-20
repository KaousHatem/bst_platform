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
    Store,
    Transfer,
    TransferDocument,
    TransferProductRel,
    Stock,
    StockInDocument,
    StockInDocumentSourceFile,
    StockInDocumentProductRel,
    StockInDocumentFile,
)

from ..serializer.stock_in_document_serializers import (
    StockInDocumentSerializer,
    StockInDocumentSourceFileSerializer,
    StockInDocumentListSerializer,
    StockInDocumentProductSerializer,
    StockInDocumentFileSerializer,
)


class StockInDocumentViewSet(RoleFilterModelViewSet):
    queryset = StockInDocument.objects.all().order_by('-created_on')
    serializer_class = StockInDocumentSerializer
    role_filter_classes = [stock_in_document_role_filters.UserRoleFilter,
                           stock_in_document_role_filters.LogisticAdminRoleFilter, stock_in_document_role_filters.AdminRoleFilter]

    permission_classes = [HasPermission]

    def get_role_id(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if user.is_superuser:
            return 1
        return user.role

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StockInDocumentListSerializer
        if self.action == 'list':
            return StockInDocumentListSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):

        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if user:
            request.data['created_by'] = user.id
            store = Store.objects.get(location=user.location.id)
            if store:
                request.data['store'] = store.id

        data = request.data

        serializers = self.serializer_class(data=data)
        print(data)
        try:
            serializers.is_valid(raise_exception=True)

        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        return super().create(request, *args, **kwargs)


class StockInDocumentSourceFileViewSet(ModelViewSet):
    queryset = StockInDocumentSourceFile.objects.all().order_by('-created_on')
    serializer_class = StockInDocumentSourceFileSerializer

    def create(self, request, *args, **kwargs):

        data = request.data

        serializers = self.serializer_class(data=data)
        try:
            serializers.is_valid(raise_exception=True)

        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        return super().create(request, *args, **kwargs)


class StockInDocumentFileViewSet(ModelViewSet):
    queryset = StockInDocumentFile.objects.all().order_by('-created_on')
    serializer_class = StockInDocumentFileSerializer

    def create(self, request, *args, **kwargs):

        data = request.data

        serializers = self.serializer_class(data=data)
        try:
            serializers.is_valid(raise_exception=True)

        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        result = super().create(request, *args, **kwargs)
        print(data['stock_in_document'])
        stockInDocument = StockInDocument.objects.get(
            id=data['stock_in_document'])

        if stockInDocument:
            stockInDocument.status = "999"
            stockInDocument.save()
        return result


class StockInDocumentProductViewSet(ModelViewSet):
    queryset = StockInDocumentProductRel.objects.all()
    serializer_class = StockInDocumentProductSerializer
    # permission_classes = [HasPermission]

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True

        return super(StockInDocumentProductViewSet, self).get_serializer(*args, **kwargs)

    def get_serializer_class(self):
        return super().get_serializer_class()

    def create_stock_movement(self, StockInDocumentProduct):
        print("create_stock_movement")
        stockInDocumentId = StockInDocumentProduct['stock_in_document']
        productId = StockInDocumentProduct['product']

        stockInDocument = StockInDocument.objects.get(id=stockInDocumentId)
        print(stockInDocument)
        store = stockInDocument.store

        stock = Stock.objects.filter(
            product=productId, store=store.id)
        if len(stock) == 0:
            serializer = StockSerializer(
                data={'product': productId, 'store': store.id})
            serializer.is_valid()
            serializer.save()
            stock = [Stock.objects.get(id=serializer.data['id'])]

        data = {
            'stock': stock[0].id,
            'quantity': StockInDocumentProduct['quantity'],
            'source': stockInDocument.source,
            'created_by': stockInDocument.created_by.id,
            'source_id': stockInDocument.id,
            'price': StockInDocumentProduct['price']
        }

        serializer = StockInSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)

        except:
            print(serializer.errors)

        serializer.save()

    def create(self, request, *args, **kwargs):

        print(request.data)

        serializers = self.get_serializer(data=request.data)

        try:
            serializers.is_valid(raise_exception=True)
        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        result = super().create(request, *args, **kwargs)

        for StockInDocumentProduct in result.data:
            self.create_stock_movement(StockInDocumentProduct)
        return result
