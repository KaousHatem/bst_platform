from rest_framework import serializers

from ..models import (
	Stock,
	StockInit,
	Product,
	Unit

)

from project.models import Location
from user_control.serializers import CustomUserListSerializer



class StockInitSerializer(serializers.ModelSerializer):
	class Meta:
		model = StockInit
		fields = [
			'id',
			'stock',
			'quantity',
			'note',
			'price',
			'created_by',
			'created_on',
			'updated_on',
		]