from rest_framework import serializers

from .store_serializers import StoreSerializer

from ..models import (
    StockInDocument,
    StockInDocumentSourceFile,
    StockInDocumentProductRel,
    StockInDocumentFile

)

from ..serializers import (
    ProductSerializer,
    ProductListSerializer,
    UnitSerializer,
)
from user_control.serializers import CustomUserListSerializer


class StockInDocumentProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockInDocumentProductRel
        fields = '__all__'


class StockInDocumentProductListSerializer(serializers.ModelSerializer):
    unit = UnitSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = StockInDocumentProductRel
        fields = '__all__'


class StockInDocumentFileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StockInDocumentFile
        fields = "__all__"

    def get_name(self, obj):
        return obj.file.name.split('/')[-1]


class StockInDocumentSourceFileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StockInDocumentSourceFile
        fields = "__all__"

    def get_name(self, obj):
        return obj.file.name.split('/')[-1]


class StockInDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockInDocument
        fields = '__all__'


class StockInDocumentListSerializer(serializers.ModelSerializer):
    source_file = StockInDocumentSourceFileSerializer(
        read_only=True, many=True)
    file = StockInDocumentFileSerializer(read_only=True, many=True)
    created_by = CustomUserListSerializer(read_only=True)
    products = StockInDocumentProductListSerializer(read_only=True, many=True)
    store = StoreSerializer()

    class Meta:
        model = StockInDocument
        fields = '__all__'
