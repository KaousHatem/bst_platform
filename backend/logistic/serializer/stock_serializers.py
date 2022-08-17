from rest_framework import serializers

from ..models import (
	Stock,
	Product,
	Unit

)

from project.models import Location
from user_control.serializers import CustomUserListSerializer

class UnitSerializer(serializers.ModelSerializer):
	class Meta:
		model = Unit
		fields = [
			'ref',
			'name',
		]


class ProductSerializer(serializers.ModelSerializer):
	base_unit = UnitSerializer()
	class Meta:
		model = Product
		fields = [
				'sku',
				'name',
				'base_unit',
				]

class StockListSerializer(serializers.ModelSerializer):
	product = ProductSerializer()
	class Meta:
		model = Stock
		fields = [
			'id',
			'product',
			'store',
			'quantity',
			'price',
			'updated_by',
			'created_on',
			'updated_on',
		]

class StockSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Stock
		fields = [
			'id',
			'product',
			'store',
			'quantity',
			'price',
			'updated_by',
			'created_on',
			'updated_on',
		]


