from rest_framework import serializers

from ..models import (
	Unit,
	Provision,
	Product,
	ProvisionProductRel,
	PurchaseRequest,
	PurchaseReqProductRel,
	PurchaseOrder,
	PurchaseOrderProductRel,
	Supplier,
	Receipt,
	ReceiptProductRel,
	
)

from project.models import Location
from project.serializers import LocationListSerializer
from user_control.serializers import CustomUserListSerializer

class SupplierSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Supplier
		fields = [
			'id',
			'name',
		]

class ProvisionSerializer(serializers.ModelSerializer):

	destination = LocationListSerializer()

	class Meta:
		model = Provision
		fields = [
				'destination',
				]



class PurchaseRequestSerializer(serializers.ModelSerializer):
	provision = ProvisionSerializer(read_only=True)
	class Meta:
		model = PurchaseRequest
		fields = [
				'provision',

				]

class PurchaseOrderRetreiveSerializer(serializers.ModelSerializer):
	purchaseRequest = PurchaseRequestSerializer()
	supplier = SupplierSerializer()
	class Meta:
		model = PurchaseOrder
		fields = [
			'id',
			'ref',
			'supplier',
			'purchaseRequest',
			'created_on',
		]
		extra_kwargs = {
		   'ref': {
			  'required': False,
			  'read_only': True,
		   },
		   'created_by': {
			  'required': False
		   },
		   'created_on': {
			  'read_only': False
		   },
		}

class PurchaseOrderSerializer(serializers.ModelSerializer):
	purchaseRequest = PurchaseRequestSerializer()
	class Meta:
		model = PurchaseOrder
		fields = [
			'id',
			'ref',
			'purchaseRequest',
			'created_on',
		]
		extra_kwargs = {
		   'ref': {
			  'required': False,
			  'read_only': True,
		   },
		   'created_by': {
			  'required': False
		   },
		   'created_on': {
			  'read_only': False
		   },
		}




class ReceiptListSerializer(serializers.ModelSerializer):
	created_by = CustomUserListSerializer(read_only=True,required=False)
	purchaseOrder = PurchaseOrderSerializer()
	class Meta:
		model = Receipt
		fields = [
				'id',
				'ref',
				'created_by',
				'purchaseOrder',
				'created_on',
				]
		extra_kwargs = {
		   'ref': {
			  'required': False
		   },
		   'created_by': {
			  'required': False
		   },
		   'invoice': {
			  'required': False
		   },
		   'do': {
			  'required': False
		   },
		   'created_on': {
			  'read_only': True
		   }
		}

class ProductSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Product
		fields = [
				'id',
				'sku',
				'name',
				]

class ProvisionProductSerializer(serializers.ModelSerializer):
	product = ProductSerializer(read_only=True)
	provision = ProvisionSerializer()
	class Meta:
		model = ProvisionProductRel
		fields = [
				'product',
				'provision'
				]

class UnitSerializer(serializers.ModelSerializer):
	class Meta:
		model = Unit
		fields = [
			'ref',
			'name',
		]


class PurchaseReqProductSerializer(serializers.ModelSerializer):
	provisionProduct = ProvisionProductSerializer(read_only=True)
	unit = UnitSerializer(read_only=True)
	class Meta:
		model = PurchaseReqProductRel
		fields = [				
				'provisionProduct',
				'unit',
				'quantity'
				]

class PurchaseOrderProductSerializer(serializers.ModelSerializer):
	purchaseProduct = PurchaseReqProductSerializer()
	class Meta:
		model = PurchaseOrderProductRel
		fields = [
				'id',
				'purchaseProduct',
				]
		extra_kwargs = {
		   'purchaseOrder': {
			  'required': False,
		   },
		   'purchaseProduct': {
			  'required': False
		   }
		}


class ReceiptProductRetreiveSerializer(serializers.ModelSerializer):
	purchaseOrderProduct = PurchaseOrderProductSerializer()
	class Meta:
		model = ReceiptProductRel
		fields = [
				'id',
				'receipt',
				'purchaseOrderProduct',
				'quantity_receipt',
				'quantity_accepted',
				'conformity',
				'note',
				]
		extra_kwargs = {
		   'note': {
			  'required': False
		   },
		   
		}

class ReceiptRetreiveSerializer(serializers.ModelSerializer):
	created_by = CustomUserListSerializer(read_only=True,required=False)
	purchaseOrder = PurchaseOrderRetreiveSerializer()
	receiptProducts = ReceiptProductRetreiveSerializer(many=True,read_only=True)
	class Meta:
		model = Receipt
		fields = [
				'id',
				'ref',
				'created_by',
				'invoice',
				'do',
				'purchaseOrder',
				'created_on',
				'receiptProducts',
				]
		extra_kwargs = {
		   'ref': {
			  'required': False
		   },
		   'created_by': {
			  'required': False
		   },
		   'invoice': {
			  'required': False
		   },
		   'do': {
			  'required': False
		   },
		   'created_on': {
			  'read_only': True
		   }
		}


class ReceiptSerializer(serializers.ModelSerializer):
	class Meta:
		model = Receipt
		fields = [
				'id',
				'ref',
				'created_by',
				'invoice',
				'do',
				'purchaseOrder',
				'created_on',
				]
		extra_kwargs = {
		   'ref': {
			  'required': False
		   },
		   'created_by': {
			  'required': False
		   },
		   'invoice': {
			  'required': False
		   },
		   'do': {
			  'required': False
		   },
		   'created_on': {
			  'read_only': True
		   },
		   'created_by': {
			  'read_only': True,
			  'required': False
		   }
		}



class ReceiptProductSerializer(serializers.ModelSerializer):
	class Meta:
		model = ReceiptProductRel
		fields = [
				'id',
				'receipt',
				'purchaseOrderProduct',
				'quantity_receipt',
				'quantity_accepted',
				'conformity',
				'note',
				]
		extra_kwargs = {
		   'note': {
			  'required': False
		   },
		   
		}



