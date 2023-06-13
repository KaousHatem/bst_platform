from rest_framework import serializers
from django.forms.models import model_to_dict


from ..models import (
    Unit,
    Transfer,
    TransferProductRel,
    TransferDocument
)

from ..serializers import (
    ProductSerializer,
    ProductListSerializer,
    UnitSerializer,
)

from .store_serializers import StoreListSerializer

from user_control.serializers import CustomUserListSerializer


class TransferProductListSerializer(serializers.ModelSerializer):
    unit = UnitSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = TransferProductRel
        fields = '__all__'


class TransferProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransferProductRel
        fields = '__all__'


class TransferDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransferDocument
        fields = '__all__'


class TransferRetrieveSerializer(serializers.ModelSerializer):
    products = TransferProductListSerializer(many=True, read_only=True)
    created_by = CustomUserListSerializer(read_only=True, required=False)
    received_by = CustomUserListSerializer(read_only=True, required=False)
    source = StoreListSerializer(read_only=True)
    target = StoreListSerializer(read_only=True)
    document = TransferDocumentSerializer(read_only=True)

    class Meta:
        model = Transfer
        fields = '__all__'
        extra_kwargs = {
            'ref': {
                'read_only': True,
            },
            'received_by': {
                'required': False,
            }
        }


class TransferListSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True, required=False)
    received_by = CustomUserListSerializer(read_only=True, required=False)
    source = StoreListSerializer(read_only=True)
    target = StoreListSerializer(read_only=True)

    class Meta:
        model = Transfer
        fields = '__all__'
        extra_kwargs = {
            'ref': {
                'read_only': True,
            },
            'received_by': {
                'required': False,
            }
        }


class TransferSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transfer
        fields = '__all__'
        extra_kwargs = {
            'ref': {
                'read_only': True,
            },
            'received_by': {
                'required': False,
            },
            'created_by': {
                'required': False,
            },
            'status': {
                'required': False,
            }
        }
