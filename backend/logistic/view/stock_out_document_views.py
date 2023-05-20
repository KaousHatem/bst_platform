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

from ..role_filters import stock_out_document_role_filters

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
    StockOutDocument,
    StockOutDocumentProductRel,
    StockOutDocumentFile,
)

from ..serializer.stock_out_document_serializers import (
    StockOutDocumentSerializer,
    StockOutDocumentListSerializer,
    StockOutDocumentProductSerializer,
    StockOutDocumentFileSerializer,
)


class StockOutDocumentViewSet(RoleFilterModelViewSet):
    queryset = StockOutDocument.objects.all().order_by('-created_on')
    serializer_class = StockOutDocumentSerializer
    role_filter_classes = [stock_out_document_role_filters.UserRoleFilter,
                           stock_out_document_role_filters.LogisticAdminRoleFilter, stock_out_document_role_filters.AdminRoleFilter]

    permission_classes = [HasPermission]

    def get_role_id(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if user.is_superuser:
            return 1
        return user.role

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StockOutDocumentListSerializer
        if self.action == 'list':
            return StockOutDocumentListSerializer
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


class StockOutDocumentFileViewSet(ModelViewSet):
    queryset = StockOutDocumentFile.objects.all().order_by('-created_on')
    serializer_class = StockOutDocumentFileSerializer

    def create(self, request, *args, **kwargs):

        data = request.data

        serializers = self.serializer_class(data=data)
        try:
            serializers.is_valid(raise_exception=True)

        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        result = super().create(request, *args, **kwargs)
        print(data['stock_out_document'])
        stockOutDocument = StockOutDocument.objects.get(
            id=data['stock_out_document'])

        if stockOutDocument:
            stockOutDocument.status = "999"
            stockOutDocument.save()
        return result


class StockOutDocumentProductViewSet(ModelViewSet):
    queryset = StockOutDocumentProductRel.objects.all()
    serializer_class = StockOutDocumentProductSerializer
    # permission_classes = [HasPermission]

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True

        return super(StockOutDocumentProductViewSet, self).get_serializer(*args, **kwargs)

    def get_serializer_class(self):
        return super().get_serializer_class()

    # def create_stock_movement(self, transferProduct):
    #     print("create_stock_movement")
    #     transferId = transferProduct['transfer']
    #     productId = transferProduct['product']

    #     transfer = Transfer.objects.get(id=transferId)
    #     print(transfer)
    #     sourceStore = transfer.source

    #     sourceStock = Stock.objects.filter(
    #         product=productId, store=sourceStore.id)
    #     print(sourceStock)
    #     sourceData = {
    #         'stock': sourceStock[0].id,
    #         'quantity': transferProduct['quantity'],
    #         'target': '2',
    #         'created_by': transfer.created_by.id,
    #         'transfer': transfer.id,
    #         'price': sourceStock[0].price
    #     }

    #     serializer = StockOutSerializer(data=sourceData)
    #     try:
    #         serializer.is_valid(raise_exception=True)

    #     except:
    #         print(serializer.errors)

    #     serializer.save()

    def create(self, request, *args, **kwargs):

        print(request.data)

        serializers = self.get_serializer(data=request.data)

        try:
            serializers.is_valid(raise_exception=True)
        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        result = super().create(request, *args, **kwargs)

        # for transferProduct in result.data:
        #     self.create_stock_movement(transferProduct)
        return result
