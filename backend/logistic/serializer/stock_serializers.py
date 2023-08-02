from rest_framework import serializers

from ..models import (
    Stock,
    Product,
    StockInDocument,
    Transfer,
    Unit,
    Store,
    StockMovement,
    StockIn,
    StockOut,
    StockInit,
    ReceiptProductRel,
    UnitConversion

)

from project.models import Location
from user_control.serializers import CustomUserListSerializer
from .store_serializers import StoreSerializer


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


class UnitConversionSerializer(serializers.ModelSerializer):
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


class ProductSerializer(serializers.ModelSerializer):
    base_unit = UnitSerializer()
    unit_conversions = UnitConversionSerializer(many=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'sku',
            'name',
            'base_unit',
            'unit_conversions',
        ]


class StockListSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    store = StoreSerializer()

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


class StockMovement(serializers.ModelSerializer):
    movement_detail = serializers.SerializerMethodField()

    class Meta:
        model = StockMovement
        fields = '__all__'

    def get_movement_detail(self, obj):
        data = {}
        if obj.movement_type == '0':
            source_ref = ""
            unit = ""
            total_price = None
            stock_in = StockIn.objects.get(id=obj.movement_id)
            if stock_in.source == "0":
                receipt_product = ReceiptProductRel.objects.get(
                    id=stock_in.source_id)
                source_ref = receipt_product.receipt.ref
                unit = receipt_product.purchaseOrderProduct.purchaseProduct.unit.ref
            elif stock_in.source == "2":
                transfer = Transfer.objects.get(id=stock_in.source_id)
                source_ref = transfer.ref
                print()
                unit = transfer.products.get(
                    product_id=stock_in.stock.product.id).unit.ref
            else:
                stockInDocument = StockInDocument.objects.get(
                    id=stock_in.source_id)
                source_ref = stockInDocument.ref
                unit = stock_in.stock.product.base_unit.ref
            print(stock_in.price)
            if stock_in.price != None:
                total_price = stock_in.price * stock_in.quantity

            data = {
                "id": stock_in.id,
                "justification": stock_in.source,
                "reference": source_ref,
                "quantity": stock_in.quantity,
                "unit": unit,
                "price": stock_in.price,
                "total_price": total_price,
            }

        elif obj.movement_type == '1':
            stock_out = StockOut.objects.get(id=obj.movement_id)
            target_ref = ""
            unit = ""
            if stock_out.target == "2":
                transfer = stock_out.transfer
                target_ref = transfer.ref

                unit = transfer.products.get(
                    product_id=stock_out.stock.product.id).unit.ref

            else:
                if stock_out.stockOutDocument:
                    target_ref = stock_out.stockOutDocument.ref
                else:
                    target_ref = ""
                unit = stock_out.stock.product.base_unit.ref
            total_price = stock_out.price * stock_out.quantity
            data = {
                "id": stock_out.id,
                "justification": stock_out.target,
                "reference": target_ref,
                "quantity": stock_out.quantity,
                "unit": unit,
                "price": stock_out.price,
                "total_price": total_price,
            }
        else:
            stock_init = StockInit.objects.get(id=obj.movement_id)

            total_price = stock_init.price * stock_init.quantity
            data = {
                "id": stock_init.id,
                "justification": "",
                "reference": "",
                "quantity": stock_init.quantity,
                "unit": stock_init.stock.product.base_unit.ref,
                "price": stock_init.price,
                "total_price": total_price,
            }
        return data


class StockRetrieveSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    store = StoreSerializer()
    stock_movement = StockMovement(many=True, read_only=True)

    class Meta:
        model = Stock
        fields = [
            'id',
            'product',
            'store',
            'stock_movement',
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
