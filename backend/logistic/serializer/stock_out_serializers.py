from rest_framework import serializers

from ..models import (
	Stock,
	StockOut,

)

from project.models import Location
from user_control.serializers import CustomUserListSerializer



class StockOutSerializer(serializers.ModelSerializer):
	class Meta:
		model = StockOut
		fields = "__all__"