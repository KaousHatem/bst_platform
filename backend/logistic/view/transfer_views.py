from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, HttpResponseRedirect, FileResponse
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

from ..role_filters import transfer_role_filters

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
    Transfer,
    TransferDocument,
    TransferProductRel,
    Stock,
)

from ..serializer.transfer_serializers import (
    TransferDocumentSerializer,
    TransferSerializer,
    TransferRetrieveSerializer,
    TransferListSerializer,
    TransferProductSerializer,
)


class TransferViewSet(RoleFilterModelViewSet):
    queryset = Transfer.objects.all().order_by('-created_on')
    serializer_class = TransferSerializer
    role_filter_classes = [transfer_role_filters.UserRoleFilter,
                           transfer_role_filters.LogisticAdminRoleFilter, transfer_role_filters.AdminRoleFilter]

    # permission_classes = [HasPermission]

    def get_role_id(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if user.is_superuser:
            return 1
        return user.role

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TransferRetrieveSerializer
        if self.action == 'list':
            return TransferListSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        print('create')
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if user:
            request.data['created_by'] = user.id
        request.data['status'] = "1"

        data = request.data

        serializers = self.serializer_class(data=data)

        try:
            serializers.is_valid(raise_exception=True)

        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        return super().create(request, *args, **kwargs)

    def create_stock_movement(self, transfer, product):
        print('create_stock_movement')
        targetStore = transfer.target
        targetStock = Stock.objects.filter(
            product=product.product.id,
            store=targetStore.id
        )

        if len(targetStock) == 0:

            serializer = StockSerializer(
                data={'product': product.product.id, 'store': targetStore.id})
            serializer.is_valid()
            serializer.save()
            targetStock = [Stock.objects.get(id=serializer.data['id'])]
        print(transfer)
        data = {
            'stock': targetStock[0].id,
            'quantity': product.quantity,
            'source': '2',
            'created_by': transfer.received_by.id,
            'source_id': transfer.id,
            'price': product.price
        }
        print(data)
        serializer = StockInSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)

        except:
            print(serializer.errors)

        serializer.save()

    def partial_update(self, request, pk):
        print("update transfer")
        print(request.data)
        if "received_by" not in request.data:

            token = request.META.get('HTTP_AUTHORIZATION')
            user = decodeJWT(token)

            if user:
                request.data['received_by'] = user.id

        response = super(TransferViewSet, self).partial_update(request, pk)
        transfer = self.queryset.get(id=pk)
        products = transfer.products.all()
        for product in products:
            self.create_stock_movement(transfer, product)
        return response


class TransferProductViewSet(ModelViewSet):
    queryset = TransferProductRel.objects.all()
    serializer_class = TransferProductSerializer
    permission_classes = [HasPermission]

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True

        return super(TransferProductViewSet, self).get_serializer(*args, **kwargs)

    def get_serializer_class(self):
        return super().get_serializer_class()

    def create_stock_movement(self, transferProduct):
        print("create_stock_movement")
        transferId = transferProduct['transfer']
        productId = transferProduct['product']

        transfer = Transfer.objects.get(id=transferId)
        print(transfer)
        sourceStore = transfer.source

        sourceStock = Stock.objects.filter(
            product=productId, store=sourceStore.id)
        print(sourceStock)
        sourceData = {
            'stock': sourceStock[0].id,
            'quantity': transferProduct['quantity'],
            'target': '2',
            'created_by': transfer.created_by.id,
            'transfer': transfer.id,
            'price': sourceStock[0].price
        }

        serializer = StockOutSerializer(data=sourceData)
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

        for transferProduct in result.data:
            self.create_stock_movement(transferProduct)
        return result


class TransferDocumentViewSet(ModelViewSet):
    queryset = TransferDocument.objects.all()
    serializer_class = TransferDocumentSerializer
    # permission_classes = [HasPermission]

    def create(self, request):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)

        except:
            print({'message': serializer.errors})
            return Response({'message': serializer.errors}, status=400)

        return super().create(request)
