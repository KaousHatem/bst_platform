from rest_framework import serializers

from ..models import (
	Stock,
	StockIn,
	Product,
	Unit

)

from project.models import Location
from user_control.serializers import CustomUserListSerializer



class StockInSerializer(serializers.ModelSerializer):
	class Meta:
		model = StockIn
		fields = "__all__"