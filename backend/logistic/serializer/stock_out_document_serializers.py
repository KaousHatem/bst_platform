from rest_framework import serializers

from .store_serializers import StoreSerializer

from ..models import (
    StockOutDocument,
    StockOutDocumentProductRel,
    StockOutDocumentFile

)

from ..serializers import (
    ProductSerializer,
    ProductListSerializer,
    UnitSerializer,
)
from user_control.serializers import CustomUserListSerializer


class StockOutDocumentProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockOutDocumentProductRel
        fields = '__all__'


class StockOutDocumentProductListSerializer(serializers.ModelSerializer):
    unit = UnitSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = StockOutDocumentProductRel
        fields = '__all__'


class StockOutDocumentFileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StockOutDocumentFile
        fields = "__all__"

    def get_name(self, obj):
        return obj.file.name.split('/')[-1]


class StockOutDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockOutDocument
        fields = '__all__'


class StockOutDocumentListSerializer(serializers.ModelSerializer):

    file = StockOutDocumentFileSerializer(read_only=True, many=True)
    created_by = CustomUserListSerializer(read_only=True)
    products = StockOutDocumentProductListSerializer(read_only=True, many=True)
    store = StoreSerializer()

    class Meta:
        model = StockOutDocument
        fields = '__all__'
