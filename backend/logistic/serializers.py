from rest_framework import serializers
from django.forms.models import model_to_dict

from .models import (
	Product, 
	Provision, 
	Category,
	ProvisionProductRel,
	PurchaseRequest,
	PurchaseReqProductRel,
	
)
from project.models import Location
from project.serializers import LocationSerializer, LocationListSerializer
from user_control.serializers import CustomUserListSerializer
from django.db import IntegrityError


class BulkCreateListSerializer(serializers.ListSerializer):
	
	def create(self, validated_data, *args, **kwargs):
		result = []
		for attrs in validated_data:
			print(attrs)
			result.append(self.child.create(attrs))
		try:
			self.child.Meta.model.objects.bulk_create(result, ignore_conflicts=True)
		except IntegrityError as e:
			raise e

		return result



class CategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = Category
		fields = [
				'id',
				'ref',
				'name',
				'created_by']
		extra_kwargs = {
		   'ref': {
			  'required': False
		   }
		}


class ProductSerializer(serializers.ModelSerializer):
	category = serializers.SlugRelatedField(queryset = Category.objects.all() ,slug_field='ref')
	created_by = CustomUserListSerializer(read_only=True,required=False)
	# category = CategorySerializer()
	class Meta:
		model = Product
		fields = [
				'id',
				'sku',
				'name',
				'description',
				'status',
				'unit',
				'category',
				'created_by'
				]
		extra_kwargs = {
		   'sku': {
			  'required': False
		   },
		   'description': {
			  'required': False
		   },
		   'unit': {
			  'required': False
		   },
		   'status': {
			  'required': False
		   },
		   
		}
		list_serializer_class = BulkCreateListSerializer


	def create(self, validated_data):
		category = validated_data.pop('category')
		if not category:
			raise serializers.ValidationError('No category input found')
		category_obj = Category.objects.get(ref=category)
		validated_data.update({'category':category_obj})
		return Product.objects.create(**validated_data)





class ProvisionProductSerializer(serializers.ModelSerializer):
	class Meta:
		model = ProvisionProductRel
		fields = [
				'id',
				'product',
				'provision',
				'unit',
				'quantity',
				]
		# list_serializer_class = BulkCreateListSerializer


# this serializer is only used for provision listing
class ProvisionProductListingSerializer(serializers.ModelSerializer):
	product = ProductSerializer(read_only=True)
	class Meta:
		model = ProvisionProductRel
		fields = [
				'id',
				'product',
				'provision',
				'unit',
				'quantity',
				]

class ProvisionSerializer(serializers.ModelSerializer):
	provisionProducts = ProvisionProductListingSerializer(many=True,read_only=True)
	# destination = LocationListSerializer()
	# destination = serializers.RelatedField(read_only=True)
	destination = serializers.SlugRelatedField(queryset = Location.objects.all() ,slug_field='name')
	created_by = CustomUserListSerializer(read_only=True,required=False)
	class Meta:
		model = Provision
		fields = [
				'id',
				'ref',
				'destination',
				'status',
				'delay',
				'created_on',
				'updated_on',
				'provisionProducts',
				'created_by',
				'approved_by',
				'approved_on'
				]
		extra_kwargs = {
		   'provisionProducts': {
			  'read_only': True
		   },
		   'ref': {
			  'required': False
		   },
		   'approved_by': {
			  'required': False
		   }
		   ,
		   'approved_on': {
			  'read_only': True
		   }
		}


	def create(self, validated_data):
		print(validated_data)
		return Provision.objects.create(**validated_data)

class ProvisionSerializerListing(serializers.ModelSerializer):
	destination = serializers.SlugRelatedField(queryset = Location.objects.all() ,slug_field='name')
	class Meta:
		model = Provision
		fields = [
				'id',
				'ref',
				'destination',
				'delay',
				]


	def create(self, validated_data):
		print(validated_data)
		return Provision.objects.create(**validated_data)


class PurchaseReqProductSerializer(serializers.ModelSerializer):

	class Meta:
		model = PurchaseReqProductRel
		fields = [
				'id',
				'purchaseRequest',
				'provisionProduct',
				]

class PurchaseReqProductListingSerializer(serializers.ModelSerializer):
	provisionProduct = ProvisionProductListingSerializer(read_only=True)
	class Meta:
		model = PurchaseReqProductRel
		fields = [
				'id',
				'purchaseRequest',
				'provisionProduct',
				]


class PurchaseRequestListingSerializer(serializers.ModelSerializer):
	# purchaseReqProducts = PurchaseReqProductListingSerializer(many=True,read_only=True)
	created_by = CustomUserListSerializer(read_only=True,required=False)
	# approved_by = CustomUserListSerializer(read_only=True,required=False)
	provision = ProvisionSerializerListing(read_only=True,required=False)
	class Meta:
		model = PurchaseRequest
		fields = [
				'id',
				'ref',
				'status',
				'created_on',
				# 'updated_on',
				# 'purchaseReqProducts',
				'provision',
				'created_by',
				# 'approved_by',
				# 'approved_on'
				]
		extra_kwargs = {
		   'purchaseReqProducts': {
			  'read_only': True
		   },
		   'ref': {
			  'required': False
		   },
		   'approved_by': {
			  'required': False
		   },
		   'created_by': {
			  'required': False
		   }
		   ,
		   'approved_on': {
			  'read_only': True
		   }
		}


	def create(self, validated_data):
		print(validated_data)
		return PurchaseRequest.objects.create(**validated_data)

class PurchaseRequestRetrieveSerializer(serializers.ModelSerializer):
	purchaseReqProducts = PurchaseReqProductListingSerializer(many=True,read_only=True)
	created_by = CustomUserListSerializer(read_only=True,required=False)
	approved_by = CustomUserListSerializer(read_only=True,required=False)
	provision = ProvisionSerializer(read_only=True,required=False)
	class Meta:
		model = PurchaseRequest
		fields = [
				'id',
				'ref',
				'status',
				'created_on',
				'updated_on',
				'purchaseReqProducts',
				'provision',
				'created_by',
				'approved_by',
				'approved_on'
				]
		extra_kwargs = {
		   'purchaseReqProducts': {
			  'read_only': True
		   },
		   'ref': {
			  'required': False
		   },
		   'approved_by': {
			  'required': False
		   },
		   'created_by': {
			  'required': False
		   }
		   ,
		   'approved_on': {
			  'read_only': True
		   }
		}


	def create(self, validated_data):
		print(validated_data)
		return PurchaseRequest.objects.create(**validated_data)


class PurchaseRequestSerializer(serializers.ModelSerializer):
	purchaseReqProducts = PurchaseReqProductListingSerializer(many=True,read_only=True)
	created_by = CustomUserListSerializer(read_only=True,required=False)
	approved_by = CustomUserListSerializer(read_only=True,required=False)
	class Meta:
		model = PurchaseRequest
		fields = [
				'id',
				'ref',
				'status',
				'created_on',
				'updated_on',
				'purchaseReqProducts',
				'provision',
				'created_by',
				'approved_by',
				'approved_on'
				]
		extra_kwargs = {
		   'purchaseReqProducts': {
			  'read_only': True
		   },
		   'ref': {
			  'required': False
		   },
		   'approved_by': {
			  'required': False
		   },
		   'created_by': {
			  'required': False
		   }
		   ,
		   'approved_on': {
			  'read_only': True
		   }
		}


	def create(self, validated_data):
		print(validated_data)
		return PurchaseRequest.objects.create(**validated_data)


class PurchaseRequestStatusActionSerializer(serializers.ModelSerializer):
	class Meta:
		model = PurchaseRequest
		fields = [
				'id',
				'ref',
				'status',
				]
		extra_kwargs = {
		   'ref': {
			  'required': False
		   }
		}


	def create(self, validated_data):
		print(validated_data)
		return PurchaseRequest.objects.create(**validated_data)
		