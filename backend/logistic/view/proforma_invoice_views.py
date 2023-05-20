from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, HttpResponseRedirect, FileResponse
# from django.http import FileResponse
from django.views.decorators.csrf import csrf_exempt
import django_filters.rest_framework
from rest_framework_role_filters.viewsets import RoleFilterModelViewSet
from django.db.models import Q
from itertools import chain

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import status
from rest_framework.response import Response


from rest_framework_csv import parsers as p

# import pandas as pd
import csv
import json
from time import time

from bst_django.utils import get_access_token, decodeJWT
from bst_django.permissions import IsAuthenticatedCustom, HasPermission


from ..models import (
    ProformaInvoiceRequest,
    ProformaInvoiceRequestProductRel,
    ProformaInvoice,
    ProformaInvoiceDocument,
    ProformaInvoiceProductRel,
)

from ..serializer.proforma_invoice_serializers import (
    ProformaInvoiceRequestSerializer,
    ProformaInvoiceRequestListSerializer,
    ProformaInvoiceRequestRetreiveSerializer,
    ProformaInvoiceRequestProductSerializer,
    ProformaInvoiceRequestProductListSerializer,
    ProformaInvoiceSerializer,
    ProformaInvoiceListSerializer,
    ProformaInvoiceRetrieveSerializer,
    ProformaInvoiceDocumentSerializer,
    ProformaInvoiceProductSerializer,


)
from user_control.models import CustomUser


class ProformaInvoiceRequestViewSet(ModelViewSet):
    queryset = ProformaInvoiceRequest.objects.all()
    serializer_class = ProformaInvoiceRequestSerializer
    # permission_classes = [HasPermission]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProformaInvoiceRequestListSerializer
        if self.action == 'retrieve':
            return ProformaInvoiceRequestRetreiveSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if user:
            request.data['created_by'] = user.id
        request.data['status'] = "1"
        return super().create(request, *args, **kwargs)


class ProformaInvoiceProductViewSet(ModelViewSet):
    queryset = ProformaInvoiceRequestProductRel.objects.all()
    serializer_class = ProformaInvoiceRequestProductSerializer
    # permission_classes = [HasPermission]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProformaInvoiceRequestProductListSerializer
        return super().get_serializer_class()

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True

        return super(ProformaInvoiceProductViewSet, self).get_serializer(*args, **kwargs)

    def put(self, request, *args, **kwargs):

        data = request.data
        serializers = self.serializer_class(
            self.queryset, data=data, many=True)

        try:
            serializers.is_valid(raise_exception=True)

        except:
            print(serializers.errors)
            return Response({'message': serializers.errors}, status=400)

        serializers.save()

        return Response(serializers.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        ids = request.data
        if ids:
            queryset = self.queryset.filter(id__in=ids)
            queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProformaInvoiceViewSet(ModelViewSet):
    queryset = ProformaInvoice.objects.all()
    serializer_class = ProformaInvoiceSerializer
    # permission_classes = [HasPermission]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProformaInvoiceListSerializer
        if self.action == 'retrieve':
            return ProformaInvoiceRetrieveSerializer
        return super().get_serializer_class()


class ProformaInvoiceDocumentViewSet(ModelViewSet):
    queryset = ProformaInvoiceDocument.objects.all()
    serializer_class = ProformaInvoiceDocumentSerializer
    # permission_classes = [HasPermission]


class ProformaInvoiceProductViewSet(ModelViewSet):
    queryset = ProformaInvoiceProductRel.objects.all()
    serializer_class = ProformaInvoiceProductSerializer
    # permission_classes = [HasPermission]
