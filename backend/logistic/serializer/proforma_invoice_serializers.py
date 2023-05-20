from rest_framework import serializers


from ..models import (
    ProformaInvoiceRequest,
    ProformaInvoiceRequestProductRel,
    ProformaInvoice,
    ProformaInvoiceDocument,
    ProformaInvoiceProductRel,
)

from ..serializers import (
    ProductSerializer,
    UnitSerializer,
    SupplierListingSerializer,
)
from user_control.serializers import CustomUserListSerializer


class ProformaInvoiceRequestProductListingSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):

        # Maps for id->instance and id->data item.

        product_mapping = {product.id: product for product in instance}
        print(validated_data)
        data_mapping = {item['id']: item for item in validated_data}

        # Perform creations and updates.
        ret = []
        for product_id, data in data_mapping.items():
            product = product_mapping.get(product_id, None)

            if product is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(product, data))

        # # Perform deletions.
        # for book_id, book in book_mapping.items():
        #     if book_id not in data_mapping:
        #         book.delete()

        return ret


class ProformaInvoiceRequestProductListSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    unit = UnitSerializer()

    class Meta:
        model = ProformaInvoiceRequestProductRel
        fields = '__all__'


class ProformaInvoiceRequestProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = ProformaInvoiceRequestProductRel
        fields = '__all__'

        list_serializer_class = ProformaInvoiceRequestProductListingSerializer


class ProformaInvoiceRequestRetreiveSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True, required=False)
    products = ProformaInvoiceRequestProductListSerializer(
        many=True, read_only=True)

    class Meta:
        model = ProformaInvoiceRequest
        fields = '__all__'
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
            'updated_on': {
                'read_only': True
            }
        }


class ProformaInvoiceRequestListSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True)

    class Meta:
        model = ProformaInvoiceRequest
        fields = '__all__'


class ProformaInvoiceRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProformaInvoiceRequest
        fields = '__all__'
        extra_kwargs = {
            'ref': {
                'required': False,
                'read_only': True,
            },
            'created_by': {
                'required': False
            },
            'created_on': {
                'read_only': True
            },
            'updated_on': {
                'read_only': True
            }
        }


class ProformaInvoiceProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProformaInvoiceProductRel
        fields = '__all__'


class ProformaInvoiceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaInvoiceDocument
        fields = '__all__'


class ProformaInvoiceRetrieveSerializer(serializers.ModelSerializer):
    document = ProformaInvoiceDocumentSerializer(read_only=True)
    products = ProformaInvoiceProductSerializer(read_only=True, many=True)

    class Meta:
        model = ProformaInvoice
        fields = '__all__'


class ProformaInvoiceListSerializer(serializers.ModelSerializer):
    document = ProformaInvoiceDocumentSerializer(read_only=True)
    proformaRequest = ProformaInvoiceRequestSerializer(read_only=True)
    supplier = SupplierListingSerializer(read_only=True)
    amount = serializers.SerializerMethodField()

    class Meta:
        model = ProformaInvoice
        fields = '__all__'

    def get_amount(self, obj):
        return sum([item.price for item in obj.products.all()])


class ProformaInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaInvoice
        fields = '__all__'

        extra_kwargs = {
            'ref': {
                'required': False,
                'read_only': True,
            },
            'created_by': {
                'required': False
            },
            'created_on': {
                'read_only': True
            },
            'updated_on': {
                'read_only': True
            }
        }


class ProformaInvoiceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaInvoiceDocument
        fields = '__all__'
