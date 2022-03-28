from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
import django_filters.rest_framework
from rest_framework_role_filters.viewsets import RoleFilterModelViewSet

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action
from rest_framework.permissions import IsAuthenticated,DjangoModelPermissions
from rest_framework import status
from rest_framework.response import Response

from rest_framework_csv import parsers as p

import csv
import json
from time import time

from bst_django.utils import get_access_token, decodeJWT
from bst_django.permissions import IsAuthenticatedCustom, HasPermission


from .filters import ProvisionFilter, ProductFilter
from .models import (
    Product, 
    Provision, 
    Category,
    ProvisionProductRel
    
)

from .role_filters import UserRoleFilter,LogisticAdminRoleFilter, AdminRoleFilter

from .serializers import  (
    ProductSerializer, 
    ProvisionSerializer, 
    CategorySerializer,
    ProvisionProductSerializer,
    
)






class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes=[HasPermission]

    @action(detail=False, methods=['get'])
    def last(self, request):
        data = self.serializer_class(self.queryset.last()).data
        return Response(data)

    def create(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        if token:
            user = decodeJWT(token)
            request.data['created_by']=user.id
        return super(CategoryViewSet, self).create(request)





class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes=[HasPermission]
    filterset_class = (ProductFilter)
    # permission_classes=[IsStockManagerReadOnly]
    # parser_classes = [p.CSVParser]

    def get_queryset(self):
        return Product.objects.all()

    @action(detail=False, methods=['get'])
    def last(self, request):
        data = self.serializer_class(self.queryset.last()).data
        return Response(data)

    def create(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)

        serializer = self.get_serializer(data=request.data)
        print(request.data)
        try:
            serializer.is_valid(raise_exception=True)

        except:
            print(serializer.errors)
            return Response({'message':serializer.errors}, status=400)

  
        serializer.save(created_by=user)

        return Response(serializer.data, status = 201)

class ProductBulkViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes=[HasPermission]
    parser_classes = [p.CSVParser]

    def get_queryset(self):
        return Product.objects.all()

    def create(self, request, *args, **kwargs):
        rows_data = request.data
        # data_test =  [{'name': 'LOT DE VIS VARIES    D=10mm-30mm    pas gros', 'description': '', 'unit': 'U', 'category': 'ELE'}, {'name': 'LOT DE DIVERS RONDELLE      D=13mm-22mm', 'description': 'D=13mm-22mm', 'unit': 'U', 'category': 'ELE'}, {'name': 'Lot des écroux     D=7mm--22mm', 'description': 'D=7mm--22mm', 'unit': 'PCS', 'category': 'ELE'}]
        start = time()
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        # print(rows_data)
        serializer = self.get_serializer(data=rows_data, many=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save(created_by=user)
        stop = time()
        print(f'{len(rows_data)} items added in {stop-start} seconds')
        return Response(serializer.data, status = 201)



class ProvisionViewSet(RoleFilterModelViewSet):
    queryset = Provision.objects.all()
    serializer_class = ProvisionSerializer
    permission_classes=[HasPermission]
    role_filter_classes = [UserRoleFilter,LogisticAdminRoleFilter,AdminRoleFilter]
    filterset_class = (ProvisionFilter)

    # def get_queryset(self):
    #     return Provision.objects.all()

    def get_role_id(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if user.is_superuser:
            return 1
        return user.role

    def create(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        print('create',user)
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)

        except:
            # print(serializer.errors)
            return Response({'message':serializer.errors}, status=400)

  
        serializer.save(created_by=user)

        return Response(serializer.data, status = 201)

    def destroy(self, request, pk):
        qs = Provision.objects.filter(id=pk)
        if not qs.exists():
            return Resonse({}, status=404)
        obj = qs.first()
        print(obj.id)
        if obj.status != '0':
            return Response({'message':"Only Draft provision can be deleted"}, status=400)
        obj.delete()
        return Response({'message':"Provision removed"}, status=200)

    def update(self, request, pk=None):
        instance = self.get_object()
        if instance.status != '0' and instance.status == request.data['status']:
            return Response({'message':"Only Draft provision can be edited"}, status=400)
        return super(ProvisionViewSet, self).update(request, pk)

    @action(methods=['put'],detail=True, serializer_class=ProvisionSerializer)
    def approve(self, request, pk=None):
        print(pk)
        token = request.META.get('HTTP_AUTHORIZATION')
        user = decodeJWT(token)
        if not(pk):
            return Response({'message':"Pk field is required"}, status=400)
            
            if not(qs):
                return Response({'message':"Provision does not exist"}, status=400)
                
        qs = self.queryset.filter(id=pk)
        obj = qs.first()
        obj.approved_by = user
        obj.status = '9'
        obj.save()
        # data = self.serializer_class(obj).data
        return Response({'message':"Approved"}, status=201)

        


class ProvisionProductViewSet(ModelViewSet):
    queryset = ProvisionProductRel.objects.all()
    serializer_class = ProvisionProductSerializer
    permission_classes=[HasPermission]

    def get_queryset(self):
        return ProvisionProductRel.objects.all()

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True

        return super(ProvisionProductViewSet, self).get_serializer(*args, **kwargs)

    def create(self, request):
        if isinstance(request.data, list):
            instance = request.data[0]
        else:
            instance = request.data

        provision_instance = Provision.objects.get(pk=instance['provision'])

        provision_product_exist = ProvisionProductRel.objects.filter(provision=instance['provision'])
        if provision_instance.status != '0':
            if provision_product_exist:
                return Response({'message':"Only Draft provision can be edited"}, status=400)
        return super(ProvisionProductViewSet, self).create(request)

    def update(self, request, pk=None):
        instance = self.get_object()
        provision_instance = Provision.objects.get(pk=instance.provision.id)
        print(provision_instance.status)
        if provision_instance.status != '0':
            return Response({'message':"Only Draft provision can be edited"}, status=400)
        return super(ProvisionProductViewSet, self).update(request, pk)

    def destroy(self, request, pk=None):
        instance = self.get_object()
        provision_instance = Provision.objects.get(pk=instance.provision.id)
        print(provision_instance.status)
        if provision_instance.status != '0':
            return Response({'message':"Only Draft provision can be edited"}, status=400)
        return super(ProvisionProductViewSet, self).destroy(request, pk)



# @api_view(['POST'])
# @permission_classes([IsAuthenticatedCustom])
# def product_create_view(request, *args, **kwargs):
#   serializer = ProductCreateSerializer(data=request.data)
#   if serializer.is_valid(raise_exception=True):
#       serializer.save()
#       return Response(serializer.data, status = 201)


# @api_view(['GET'])
# def product_list_view(request, *args, **kwargs):
#   qs = Product.objects.all()
#   serializer = ProductSerializer(qs, many=True)
#   return JsonResponse(serializer.data, safe=False)


# @api_view(['DELETE'])
# @permission_classes([IsAuthenticatedCustom])
# def prodcut_delete_view(request,product_id, *args, **kwargs):
#   qs = Product.objects.filter(id=product_id)
#   if not qs.exists():
#       return Resonse({}, status=404)
#   obj = qs.first()
#   obj.delete()
#   return Response({'message':"Product removed"}, status=200)

# @api_view(['GET'])
# @permission_classes([IsAuthenticatedCustom])
# def product_detail_view(request, product_id, *args, **kwargs):
#   qs = Product.objects.filter(id=product_id)
#   if not qs.exists():
#       return Response({}, status=404)
#   obj = qs.first()
#   serializer = ProductSerializer(obj)
#   return Response(serializer.data, status=200)



@api_view(['POST'])
@permission_classes([IsAuthenticatedCustom])
def provision_create_view(request, *args, **kwargs):
    serializer = ProvisionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
    return Response(serializer.data,status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticatedCustom])
def provision_list_view(request, *args, **kwargs):
    qs = Provision.objects.all()
    serializer = ProvisionSerializer(qs, many=True)
    return JsonResponse(serializer.data, safe=False)



@api_view(['DELETE'])
@permission_classes([IsAuthenticatedCustom])
def provision_delete_view(request, provision_id, *args, **kwargs):
    qs = Provision.objects.filter(id=provision_id)
    if not qs.exists():
        return Response({},404)
    obj = qs.first()
    obj.delete()
    return Response({'message':'provision has been removed'},status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticatedCustom])
def provision_detail_view(request, provision_id, *args, **kwargs):
    qs = Provision.objects.filter(id=provision_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = ProvisionSerializer(obj)
    return Response( serializer.data, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticatedCustom])
def provision_approve_view(request, provision_id, *args, **kwargs):
    qs = Provision.objects.filter(id=provision_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    obj.approve()
    obj.save()
    return Response( {'message':"update successful"}, status=200) 

