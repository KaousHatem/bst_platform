from rest_framework import serializers
from django.forms.models import model_to_dict

from .models import (
    Product,
    Provision,
    Category,
    ProvisionProductRel,
    PurchaseRequest,
    PurchaseReqProductRel,
    Unit,
    UnitConversion,
    Supplier,
    PurchaseOrder,
    PurchaseOrderProductRel,
    Receipt,
    ReceiptProductRel,

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
            self.child.Meta.model.objects.bulk_create(
                result, ignore_conflicts=True)
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
            },
            'created_by': {
                'required': False
            }
        }


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


class UnitListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = [
            'ref',
        ]


class UnitConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitConversion
        fields = [
            'id',
            'product',
            'base_unit',
            'to_unit',
            'multiplier'
        ]


class UnitConversionListingSerializer(serializers.ModelSerializer):
    base_unit = UnitSerializer()
    to_unit = UnitSerializer()

    class Meta:
        model = UnitConversion
        fields = [
            'id',
            'product',
            'base_unit',
            'to_unit',
            'multiplier'
        ]


class ProductListingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = [
            'id',
            'sku',
            'name',

        ]


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(), slug_field='ref')
    created_by = CustomUserListSerializer(read_only=True, required=False)
    base_unit = UnitSerializer()
    unit_conversions = UnitConversionListingSerializer(
        many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'sku',
            'name',
            'description',
            'status',
            'base_unit',
            'unit_conversions',
            'category',
            'created_by'
        ]
        extra_kwargs = {
            'unit_converions': {
                'read_only': True
            },
            'sku': {
                'required': False
            },
            'description': {
                'required': False
            },
            'base_unit': {
                'required': False
            },
            'status': {
                'required': False
            },

        }


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(), slug_field='ref')
    created_by = CustomUserListSerializer(read_only=True, required=False)
    base_unit = serializers.SlugRelatedField(
        queryset=Unit.objects.all(), slug_field='ref')
    # base_unit = UnitSerializer()
    unit_conversions = UnitConversionListingSerializer(
        many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'sku',
            'name',
            'description',
            'status',
            'base_unit',
            'unit_conversions',
            'category',
            'created_by'
        ]
        extra_kwargs = {
            'unit_converions': {
                'read_only': True
            },
            'sku': {
                'required': False
            },
            'description': {
                'required': False
            },
            'base_unit': {
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
        validated_data.update({'category': category_obj})

        return Product.objects.create(**validated_data)


class PurchaseReqProductListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):

        # Maps for id->instance and id->data item.

        product_mapping = {product.id: product for product in instance}

        data_mapping = {item['id']: item for item in validated_data}

        # Perform creations and updates.
        ret = []
        for product_id, data in data_mapping.items():
            product = product_mapping.get(product_id, None)

            if product is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(product, data))

        return ret


class ProvisionProductSerializer(serializers.ModelSerializer):
    unit = serializers.SlugRelatedField(
        queryset=Unit.objects.all(), slug_field='ref')
    id = serializers.IntegerField(required=False)

    class Meta:
        model = ProvisionProductRel
        fields = [
            'id',
            'product',
            'provision',
            'unit',
            'quantity',
        ]
        list_serializer_class = PurchaseReqProductListSerializer


# this serializer is only used for provision listing
class ProvisionProductListingSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    unit = UnitSerializer(read_only=True)

    class Meta:
        model = ProvisionProductRel
        fields = [
            'id',
            'product',
            'provision',
            'unit',
            'quantity',
        ]

# this serilizer is only used for product purchase listing


class ProvisionProductListingPurchaseSerializer(serializers.ModelSerializer):
    product = ProductListingSerializer(read_only=True)

    class Meta:
        model = ProvisionProductRel
        fields = [
            'id',
            'product',

        ]


class ProvisionPartialUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provision
        fields = '__all__'


class ProvisionSerializer(serializers.ModelSerializer):
    provisionProducts = ProvisionProductListingSerializer(
        many=True, read_only=True)
    # destination = LocationListSerializer()
    # destination = serializers.RelatedField(read_only=True)
    destination = serializers.SlugRelatedField(
        queryset=Location.objects.all(), slug_field='name')
    created_by = CustomUserListSerializer(read_only=True, required=False)
    approved_by = CustomUserListSerializer(read_only=True, required=False)
    dropped_by = CustomUserListSerializer(required=False)

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
            'approved_on',
            'dropped_by',
            'dropped_on',
            'note',
            'purchase_request'
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
            },
            'approved_on': {
                'read_only': True
            },
            'note': {
                'required': False
            },
            'dropped_on': {
                'required': False
            },
            'purchase_request': {
                'read_only': True,
            },
        }

    def create(self, validated_data):
        print(validated_data)
        return Provision.objects.create(**validated_data)


class ProvisionSerializerListing(serializers.ModelSerializer):
    # destination = serializers.SlugRelatedField(queryset = Location.objects.all() ,slug_field='name')
    destination = LocationSerializer()
    created_by = CustomUserListSerializer(read_only=True, required=False)

    class Meta:
        model = Provision
        fields = [
            'id',
            'ref',
            'destination',
            'delay',
            'created_by'
        ]

    def create(self, validated_data):
        return Provision.objects.create(**validated_data)


class PurchaseReqProductListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):

        # Maps for id->instance and id->data item.

        product_mapping = {product.id: product for product in instance}

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


class PurchaseReqProductSerializer(serializers.ModelSerializer):
    unit = serializers.SlugRelatedField(
        queryset=Unit.objects.all(), slug_field='ref')
    id = serializers.IntegerField(required=False)

    class Meta:
        model = PurchaseReqProductRel
        fields = [
            'id',
            'purchaseRequest',
            'provisionProduct',
            'unit',
            'quantity'
        ]
        extra_kwargs = {
            'id': {
                'required': False
            },
        }
        list_serializer_class = PurchaseReqProductListSerializer


class PurchaseReqProductListingSerializer(serializers.ModelSerializer):
    provisionProduct = ProvisionProductListingSerializer(read_only=True)
    unit = UnitSerializer(read_only=True)

    class Meta:
        model = PurchaseReqProductRel
        fields = [
            'id',
            'purchaseRequest',
            'provisionProduct',
            'unit',
            'quantity'
        ]


class PurchaseReqProductListingOrderSerializer(serializers.ModelSerializer):
    provisionProduct = ProvisionProductListingPurchaseSerializer(
        read_only=True)
    unit = UnitSerializer(read_only=True)

    class Meta:
        model = PurchaseReqProductRel
        fields = [
            'id',
            'purchaseRequest',
            'provisionProduct',
            'unit',
            'quantity'
        ]


class PurchaseRequestListingSerializer(serializers.ModelSerializer):
    # purchaseReqProducts = PurchaseReqProductListingSerializer(many=True,read_only=True)
    created_by = CustomUserListSerializer(read_only=True, required=False)
    # approved_by = CustomUserListSerializer(read_only=True,required=False)
    provision = ProvisionSerializerListing(read_only=True, required=False)

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
            },
            'approved_on': {
                'read_only': True
            }
        }

    def create(self, validated_data):
        print(validated_data)
        return PurchaseRequest.objects.create(**validated_data)


class PurchaseRequestRetrieveSerializer(serializers.ModelSerializer):
    purchaseReqProducts = PurchaseReqProductListingSerializer(
        many=True, read_only=True)
    created_by = CustomUserListSerializer(read_only=True, required=False)
    approved_by = CustomUserListSerializer(read_only=True, required=False)
    provision = ProvisionSerializer(read_only=True, required=False)

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
            },
            'approved_on': {
                'read_only': True
            }
        }

    def create(self, validated_data):
        print(validated_data)
        return PurchaseRequest.objects.create(**validated_data)


class PurchaseRequestSerializer(serializers.ModelSerializer):
    purchaseReqProducts = PurchaseReqProductListingSerializer(
        many=True, read_only=True)
    created_by = CustomUserListSerializer(read_only=True, required=False)
    approved_by = CustomUserListSerializer(read_only=True, required=False)

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
            },
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


class SupplierListingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = [
            'id',
            'name',
        ]


class SupplierSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True, required=False)

    class Meta:
        model = Supplier
        fields = [
            'id',
            'name',
            'number',
            'email',
            'register_number',
            'address',
            'city',
            'state',
            'code_postal',
            'created_by',
        ]
        extra_kwargs = {
            'number': {
                'required': False
            },
            'email': {
                'required': False
            },
            'address': {
                'required': False
            },
            'city': {
                'required': False
            },
            'state': {
                'required': False
            },
            'code_postal': {
                'required': False
            },
            'created_by': {
                'required': False
            }
        }


class PurchaseOrderProductListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):

        # Maps for id->instance and id->data item.

        product_mapping = {product.id: product for product in instance}

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


class PurchaseOrderProductUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = PurchaseOrderProductRel
        fields = [
            'id',
            'unitPrice'
        ]
        list_serializer_class = PurchaseOrderProductListSerializer


class PurchaseOrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderProductRel
        fields = [
            'id',
            'purchaseOrder',
            'purchaseProduct',
            'unitPrice'
        ]
        extra_kwargs = {
            'unitPrice': {
                'required': False,
            },
        }


class PurchaseOrderListingSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True, required=False)
    supplier = SupplierListingSerializer()
    purchaseRequest = PurchaseRequestListingSerializer()

    class Meta:
        model = PurchaseOrder
        fields = [
            'id',
            'ref',
            'purchaseRequest',
            'supplier',
            'created_by',
        ]
        extra_kwargs = {
            'ref': {
                'required': False,
                'read_only': True,
            },
            'created_by': {
                'required': False
            }
        }


class PurchaseOrderProductListingSerializer(serializers.ModelSerializer):
    purchaseProduct = PurchaseReqProductListingOrderSerializer()
    leftQuantity = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrderProductRel
        fields = [
            'id',
            'purchaseOrder',
            'purchaseProduct',
            'received',
            'leftQuantity',
            'unitPrice'
        ]
        extra_kwargs = {
            'purchaseOrder': {
                'required': False,
            },
            'purchaseProduct': {
                'required': False
            }
        }

    def get_leftQuantity(self, obj):
        return obj.purchaseProduct.quantity - sum(product.quantity_receipt for product in obj.received.all())


class PurchaseOrderRetrieveSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True, required=False)
    supplier = SupplierSerializer()
    purchaseOrderProducts = PurchaseOrderProductListingSerializer(
        many=True, read_only=True)
    purchaseRequest = PurchaseRequestListingSerializer()
    allReceived = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrder
        fields = [
            'id',
            'ref',
            'purchaseRequest',
            'purchaseOrderProducts',
            'supplier',
            'allReceived',
            'created_by',
            'created_on',
        ]
        extra_kwargs = {
            'ref': {
                'required': False,
                'read_only': True,
            },
            'created_by': {
                'required': False
            }
        }

    def leftQuantity(self, purchaseOrderProduct):
        return purchaseOrderProduct.purchaseProduct.quantity - sum(product.quantity_receipt for product in purchaseOrderProduct.received.all())

    def get_allReceived(self, obj):
        for purchaseOrderProduct in obj.purchaseOrderProducts.all():
            leftQuantity = self.leftQuantity(purchaseOrderProduct)
            if leftQuantity > 0:
                return False

        return True


class PurchaseOrderSerializer(serializers.ModelSerializer):
    created_by = CustomUserListSerializer(read_only=True, required=False)

    class Meta:
        model = PurchaseOrder
        fields = [
            'id',
            'ref',
            'purchaseRequest',
            'supplier',
            'created_by',
        ]
        extra_kwargs = {
            'ref': {
                'required': False,
                'read_only': True,
            },
            'created_by': {
                'required': False
            }
        }
