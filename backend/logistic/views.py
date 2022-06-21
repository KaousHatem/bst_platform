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
	ProvisionProductRel,
	PurchaseRequest,
	PurchaseReqProductRel,
	Unit,
	UnitConversion,
	Supplier,
	PurchaseOrderProductRel,
	PurchaseOrder,

	
)

from user_control.models import CustomUser

from .role_filters import provision_role_filters, po_role_filters
 # import UserRoleFilter,LogisticAdminRoleFilter, AdminRoleFilter

from .serializers import  (
	ProductSerializer, 
	ProvisionSerializer, 
	CategorySerializer,
	ProvisionProductSerializer,
	PurchaseRequestSerializer,
	PurchaseRequestListingSerializer,
	PurchaseReqProductListingSerializer,
	PurchaseRequestRetrieveSerializer,
	PurchaseReqProductSerializer,
	PurchaseRequestStatusActionSerializer,
	UnitSerializer,
	UnitConversionSerializer,
	SupplierSerializer,
	PurchaseOrderProductSerializer,
	PurchaseOrderSerializer,
	PurchaseOrderRetrieveSerializer,
	PurchaseOrderListingSerializer,
	PurchaseOrderProductListingSerializer,
	PurchaseOrderProductUpdateSerializer,
	
)






class CategoryViewSet(ModelViewSet):
	queryset = Category.objects.all()
	serializer_class = CategorySerializer
	# permission_classes=[HasPermission]

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



class UnitViewSet(ModelViewSet):
	queryset = Unit.objects.all()
	serializer_class = UnitSerializer
	# permission_classes = [HasPermission]

class UnitConversionViewSet(ModelViewSet):
	queryset = UnitConversion.objects.all()
	serializer_class = UnitConversionSerializer
	# permission_classes = [HasPermission]

	def get_serializer(self, *args, **kwargs):
		if isinstance(kwargs.get('data', {}), list):
			kwargs['many'] = True

		return super(UnitConversionViewSet, self).get_serializer(*args, **kwargs)
		
	def create(self, request):
		serializer = self.get_serializer(data=request.data)
		print(request.data)
		try:
			serializer.is_valid(raise_exception=True)

		except:
			print(serializer.errors)
			return Response({'message':serializer.errors}, status=400)
		return super(UnitConversionViewSet, self).create(request)
	
	@action(methods=['put'], detail=False)
	def put(self, request, *args, **kwargs):
		ids = request.data.get('ids')
		data = request.data.get('data')
		serializers = self.get_serializer(data=data, many=True)
		try:
			serializers.is_valid(raise_exception=True)

		except:
			print(serializers.errors)
			return Response({'message':serializers.errors}, status=400)

		if ids:
			queryset = UnitConversion.objects.filter(id__in=ids)
			i = 0
			for qs in queryset:
				serializer = serializers.data[i]
				qs.multiplier = serializer.get('multiplier')
				qs.save()
		return Response(serializers.data, status=status.HTTP_200_OK)




	@action(methods=['delete'], detail=False)
	def delete(self, request, *args, **kwargs):
		ids = request.data.get('ids')
		if ids:
			queryset = UnitConversion.objects.filter(id__in=ids)
			queryset.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)



class ProductViewSet(ModelViewSet):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer
	# permission_classes=[HasPermission]
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
	queryset = Provision.objects.all().order_by('-created_on')
	serializer_class = ProvisionSerializer
	permission_classes=[HasPermission]
	role_filter_classes = [provision_role_filters.UserRoleFilter,provision_role_filters.LogisticAdminRoleFilter,provision_role_filters.AdminRoleFilter]
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

	@action(methods=['GET'],detail=False)
	def list_only_approved(self, request):
		qs = self.queryset.filter(status='9')

		if qs:
			data = self.serializer_class(qs,many=True).data
			data_final=[]
			for i in data:
				can_add_purchase_request = False
				for provisionProduct in i['provisionProducts']:
					p = PurchaseReqProductRel.objects.filter(provisionProduct=provisionProduct['id'])

					if not(p):
						can_add_purchase_request=True
						break
				if can_add_purchase_request:
					data_final.append(i)
				

			return Response(data_final, status=status.HTTP_200_OK)
		else:
			return Response({'message':"There is no approved provision"}, status=status.HTTP_200_OK)

	@action(methods=['GET'],detail=True)
	def get_product_in_purchase(self, request, pk):
		qs = self.queryset.filter(id=pk)

		if qs:
			data = self.serializer_class(qs.first()).data
			data_final=[]
			for provisionProduct in data['provisionProducts']:
				can_add_purchase_request = False
				p = PurchaseReqProductRel.objects.filter(provisionProduct=provisionProduct['id'])
				if p:
					data_final.append(provisionProduct)

			return Response(data_final, status=status.HTTP_200_OK)
		else:
			return Response({'message':"There is no approved provision"}, status=status.HTTP_200_OK)

		


class ProvisionProductViewSet(ModelViewSet):
	queryset = ProvisionProductRel.objects.all()
	serializer_class = ProvisionProductSerializer
	permission_classes=[HasPermission]

	def get_queryset(self):
		queryset = super().get_queryset()
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
				return Response({'message':"Only Draft provision can be edited"}, status=403)
		return super(ProvisionProductViewSet, self).create(request)


	@action(methods=['put'], detail=False)
	def put(self, request, *args, **kwargs):

		data = request.data

		ids = map(lambda product: product.get('id'), data)
		filterQueryset = self.get_queryset().filter(id__in=ids)

		serializers = self.serializer_class(filterQueryset,data=data,many=True)

		try:
			serializers.is_valid(raise_exception=True)

		except:
			print(serializers.errors)
			return Response({'message':serializers.errors}, status=400)

		try:

			provisionId = serializers.data[0].get('provision')
			provision_instance = Provision.objects.get(pk=provisionId)
			if provision_instance.status != '0':
				return Response({'message':"Only Draft provision can be edited"}, status=403)
			serializers.save()

		except Exception as e:
			return Response({'message':e}, status=403)

		return Response(serializers.data, status=status.HTTP_200_OK)


	@action(methods=['delete'], detail=False)
	def delete(self, request, *args, **kwargs):
		print('ok')
		ids = request.data
		if ids:
			queryset = ProvisionProductRel.objects.filter(id__in=ids)
			provision_instance = queryset.first().provision
			if provision_instance.status != '0':
				return Response({'message':"Only Draft provision can be edited"}, status=403)
			queryset.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)




class PurchaseReqViewSet(ModelViewSet):
	queryset = PurchaseRequest.objects.all().order_by('-created_on')
	serializer_class = PurchaseRequestSerializer
	# permission_classes=[HasPermission]
	# role_filter_classes = [UserRoleFilter,LogisticAdminRoleFilter,AdminRoleFilter]
	# filterset_class = (ProvisionFilter)

	def get_serializer_class(self):
		print(self.action)
		if self.action == 'list':
			return PurchaseRequestListingSerializer
		if self.action == 'retrieve':
			return PurchaseRequestRetrieveSerializer
		if self.action == 'status_update':
			return PurchaseRequestStatusActionSerializer
		return super().get_serializer_class()

	def create(self, request):
		token = request.META.get('HTTP_AUTHORIZATION')
		user = decodeJWT(token)
		# print('create',user)
		serializer = self.get_serializer(data=request.data)
		try:
			serializer.is_valid(raise_exception=True)

		except:
			return Response({'message':serializer.errors}, status=400)

		serializer.save(created_by=user)

		return Response(serializer.data, status = 201)
	

	def update(self, request, pk):
		print(request.data)
		serializer = self.get_serializer(data=request.data)
		try:
			serializer.is_valid(raise_exception=True)
			print(serializer.data)

		except:
			print(serializer.errors)
			return Response({'message':serializer.errors}, status=400)

		return super(PurchaseReqViewSet, self).update(request,pk)

	@action(methods=['put'],detail=True, serializer_class=PurchaseRequestStatusActionSerializer)
	def approve(self, request, pk=None):
		print(pk)
		token = request.META.get('HTTP_AUTHORIZATION')
		user = decodeJWT(token)
		if not(pk):
			return Response({'message':"Pk field is required"}, status=400)
			
			if not(qs):
				return Response({'message':"Purchase request does not exist"}, status=400)
				
		qs = self.queryset.filter(id=pk)
		obj = qs.first()
		obj.approved_by = user
		obj.status = '9'
		obj.save()
		# data = self.serializer_class(obj).data
		return Response({'message':"Approved"}, status=201)

	@action(methods=['put'],detail=True)
	def status_update(self, request, pk=None):
		# print(self.action)
		if not(pk):
			return Response({'message':"Pk field is required"}, status=400)
			
			if not(qs):
				return Response({'message':"Purchase request does not exist"}, status=400)
		print(request.data)
		serializer = self.get_serializer(data=request.data) 
		try:
			serializer.is_valid(raise_exception=True)
		except:
			print(serializer.errors)
			return Response({'message':serializer.errors}, status=400)   
		qs = self.queryset.filter(id=pk)
		obj = qs.first()
		if serializer.data:
			obj.status = serializer.data['status']
		obj.save()
		# data = self.serializer_class(obj).data
		return Response({'message':"status_updated"}, status=201)

	@action(methods=['GET'],detail=False)
	def list_only_approved(self, request):

		qs = self.queryset.filter(status='9')

		if qs:
			data = self.serializer_class(qs,many=True).data
			data_final=[]
			for i in data:
				purchaseOrder = PurchaseOrder.objects.filter(purchaseRequest=i['id'])
				if not(purchaseOrder):
					data_final.append(i)
				
			return Response(data_final, status=status.HTTP_200_OK)
		else:
			return Response({'message':"There is no approved purchase request"}, status=status.HTTP_200_OK)


class PurchaseReqProductViewSet(ModelViewSet):
	queryset = PurchaseReqProductRel.objects.all()
	serializer_class = PurchaseReqProductSerializer
	# permission_classes=[HasPermission]
	# role_filter_classes = [UserRoleFilter,LogisticAdminRoleFilter,AdminRoleFilter]
	# filterset_class = (ProvisionFilter)
	def get_queryset(self):
		return PurchaseReqProductRel.objects.all()

	def get_serializer(self, *args, **kwargs):
		if isinstance(kwargs.get('data', {}), list):
			kwargs['many'] = True

		return super(PurchaseReqProductViewSet, self).get_serializer(*args, **kwargs)

	def create(self, request):
		print(request.data)

		serializer = self.get_serializer(data=request.data)
		try:
			serializer.is_valid(raise_exception=True)
			print(serializer.data)

		except:
			print(serializer.errors)
			return Response({'message':serializer.errors}, status=400)

		return super(PurchaseReqProductViewSet, self).create(request)

	@action(methods=['put'], detail=False)
	def put(self, request, *args, **kwargs):
		data = request.data
		serializers = self.serializer_class(self.queryset,data=data,many=True)

		try:
			serializers.is_valid(raise_exception=True)

		except:
			print(serializers.errors)
			return Response({'message':serializers.errors}, status=400)

		try:
			serializers.save()
		except Exception as e:
			return Response({'message':e}, status=403)

		return Response(serializers.data, status=status.HTTP_200_OK)

	@action(methods=['delete'], detail=False)
	def delete(self, request, *args, **kwargs):
		ids = request.data
		print(ids)
		if ids:
			queryset = PurchaseReqProductRel.objects.filter(id__in=ids)
			queryset.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

class SupplierViewSet(ModelViewSet):
	queryset = Supplier.objects.all()
	serializer_class = SupplierSerializer
	# permission_classes=[HasPermission]
	# role_filter_classes = [UserRoleFilter,LogisticAdminRoleFilter,AdminRoleFilter]
	# filterset_class = (ProvisionFilter)
	def get_queryset(self):
		return Supplier.objects.all()

	def create(self, request, *args, **kwargs):
		token = request.META.get('HTTP_AUTHORIZATION')
		user = decodeJWT(token)	
		serializer = self.get_serializer(data=request.data)
		try:
			serializer.is_valid(raise_exception=True)

		except:
			return Response({'message':serializer.errors}, status=400)

		serializer.save(created_by=user)

		return Response(serializer.data, status = 201)


class PurchaseOrderViewSet(RoleFilterModelViewSet):
	queryset = PurchaseOrder.objects.all().order_by('-created_on')
	serializer_class = PurchaseOrderSerializer
	role_filter_classes = [po_role_filters.UserRoleFilter,po_role_filters.LogisticAdminRoleFilter,po_role_filters.AdminRoleFilter]

	def get_role_id(self, request):
		token = request.META.get('HTTP_AUTHORIZATION')
		user = decodeJWT(token)
		if user.is_superuser:
			return 1
		return user.role
	
	def get_serializer_class(self):
		# print(self.action)
		if self.action == 'list':
			return PurchaseOrderListingSerializer
		if self.action == 'retrieve':
			return PurchaseOrderRetrieveSerializer
		
		return super().get_serializer_class()

	def create_product(self,serializer_data, *args, **kwargs):
		if serializer_data:
			po_id = serializer_data.get('id')			
			purchaseOrder = self.queryset.get(id=po_id)

			if purchaseOrder:
				purchaseRequest = purchaseOrder.purchaseRequest
				purchaseRequestSerializer = PurchaseRequestSerializer(purchaseRequest)
				prProducts = purchaseRequestSerializer.data.get('purchaseReqProducts')
				data = [
					{
					'purchaseOrder': po_id,
					'purchaseProduct': product['id']
					}
					for product in prProducts
				]

				serializerProducts = PurchaseOrderProductSerializer(data=data, many=True)
				try:
					serializerProducts.is_valid(raise_exception=True)

				except:
					return Response({'message':serializerProducts.errors}, status=400)
				serializerProducts.save()



	def create(self, request):
		token = request.META.get('HTTP_AUTHORIZATION')
		user = decodeJWT(token)
		serializer = self.get_serializer(data=request.data)

		try:
			serializer.is_valid(raise_exception=True)

		except:
			print(serializer.errors)
			return Response({'message':serializer.errors}, status=400)


		serializer.save(created_by=CustomUser.objects.first())

		self.create_product(serializer.data)



		data_serializer = PurchaseOrderRetrieveSerializer(self.queryset.get(id=serializer.data.get('id')))
		return Response(data_serializer.data, status = 201)

class PurchaseOrderProductViewSet(ModelViewSet):
	queryset = PurchaseOrderProductRel.objects.all()
	serializer_class = PurchaseOrderProductSerializer

	def get_serializer_class(self):
		if self.action == 'list':
			return PurchaseOrderProductListingSerializer
		return super().get_serializer_class()

	@action(methods=['put'], detail=False)
	def put(self, request, *args, **kwargs):

		data = request.data
		serializers = PurchaseOrderProductUpdateSerializer(self.queryset,data=data,many=True)

		try:
			serializers.is_valid(raise_exception=True)
			

		except:
			print(serializers.errors)
			return Response({'message':serializers.errors}, status=400)

		try:
			serializers.save()
		except Exception as e:
			return Response({'message':e}, status=403)


		return Response(serializers.data, status=status.HTTP_200_OK)




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

