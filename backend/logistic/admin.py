from django.contrib import admin

# Register your models here.
from .models import (
    StockIn,
    StockOut,
    StockInit,
    Transfer,
    TransferProductRel,
    Stock,
    Store,
    Unit,
    Product,
    Category,
    PurchaseRequest,
    UnitConversion,
    PurchaseReqProductRel,
    Provision,
    ProvisionProductRel,
    PurchaseOrder,
    PurchaseOrderProductRel,
    Receipt,
    ReceiptProductRel,
    Supplier,
    StockMovement,
    TransferDocument,
    StockInDocument,
    StockInDocumentProductRel,
    StockInDocumentSourceFile,
    StockOutDocument,
    ReceiptDocument


)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'ref', 'name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'sku', 'name', 'category', 'base_unit',)
    search_fields = ['sku', 'name',]


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('id', 'ref', 'name')
    search_fields = ['ref', 'name',]


@admin.register(UnitConversion)
class UnitConversionAdmin(admin.ModelAdmin):
    list_display = ('id', 'product',
                    'base_unit', 'to_unit', 'multiplier')
    search_fields = ['product__sku',]

    # @admin.display(description='Product', ordering='product__ref')
    # def get_product_ref(self, obj):
    #     return obj.product.sku


@admin.register(Provision)
class ProvisionAdmin(admin.ModelAdmin):
    list_display = ('id', 'ref', 'status', 'destination', 'created_by')
    list_filter = ['status', 'destination',]
    search_fields = ['ref',]


@admin.register(ProvisionProductRel)
class ProvisionProductRelAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'get_provision_ref',)
    # list_filter = ['status', 'destination',]
    search_fields = ['provision__ref',]

    @admin.display(description='Provision', ordering='provision__ref')
    def get_provision_ref(self, obj):
        return obj.provision.ref


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'ref', 'status', 'created_by',)
    list_filter = ['status',]
    search_fields = ['ref',]


@admin.register(PurchaseReqProductRel)
class PurchaseReqProductRelAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_product_ref', 'get_purchase_request_ref',)
    # list_filter = ['status', 'destination',]
    search_fields = ['purchaseRequest__ref',]

    @admin.display(description='PurchaseRequest', ordering='purchaseRequest__ref')
    def get_purchase_request_ref(self, obj):
        return obj.purchaseRequest.ref

    @admin.display(description='Product', ordering='provisionProduct__product__sku')
    def get_product_ref(self, obj):
        return obj.provisionProduct.product.sku


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'ref', 'supplier',)
    list_filter = ['supplier',]
    search_fields = ['ref',]


@admin.register(PurchaseOrderProductRel)
class PurchaseOrderProductRelAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_product_ref', 'get_purchase_order_ref',)
    # list_filter = ['status', 'destination',]
    search_fields = ['purchaseOrder__ref',]

    @admin.display(description='PurchaseOrder', ordering='purchaseOrder__ref')
    def get_purchase_order_ref(self, obj):
        return obj.purchaseOrder.ref

    @admin.display(description='Product', ordering='purchaseProduct__provisionProduct__product__sku')
    def get_product_ref(self, obj):
        return obj.purchaseProduct.provisionProduct.product.sku


@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = ('id', 'ref', 'get_purchase_order_ref',)
    list_filter = ['purchaseOrder__ref', ]
    search_fields = ['ref',]

    @admin.display(description='PurchaseOrder', ordering='purchaseOrder__ref')
    def get_purchase_order_ref(self, obj):
        return obj.purchaseOrder.ref


@admin.register(ReceiptProductRel)
class ReceiptProductRelAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_product_ref', 'get_receipt_ref',)
    # list_filter = ['status', 'destination',]
    search_fields = ['receipt__ref',]

    @admin.display(description='receipt', ordering='receipt__ref')
    def get_receipt_ref(self, obj):
        return obj.receipt.ref

    @admin.display(description='Product', ordering='purchaseOrderProduct__purchaseProduct__provisionProduct__product__sku')
    def get_product_ref(self, obj):
        return obj.purchaseOrderProduct.purchaseProduct.provisionProduct.product.sku


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    # list_filter = ['status', 'destination',]
    search_fields = ['name',]


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_store_name', 'product')
    list_filter = ['store__name',]
    search_fields = ['product__sku',]

    @admin.display(description='Store', ordering='store__name')
    def get_store_name(self, obj):
        return obj.store.name


@admin.register(StockIn)
class StockInAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_store_name', 'get_product_sku', 'created_on',)
    list_filter = ['stock__store__name',]
    search_fields = ['stock__product__sku',]

    @admin.display(description='Store', ordering='stock__store__name')
    def get_store_name(self, obj):
        return obj.stock.store.name

    @admin.display(description='Product', ordering='stock__product__sku')
    def get_product_sku(self, obj):
        return obj.stock.product.sku


@admin.register(StockInDocumentProductRel)
class StockInProductRelAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_stock_in_document_ref',
                    'get_product_sku', 'quantity',)
    # list_filter = ['stock__store__name',]
    # search_fields = ['stock__product__sku',]

    @admin.display(description='Product', ordering='stock__product__sku')
    def get_product_sku(self, obj):
        return obj.product.sku

    @admin.display(description='stock_in_document', ordering='stock_in_document__ref')
    def get_stock_in_document_ref(self, obj):
        return obj.stock_in_document.ref


@admin.register(StockInDocumentSourceFile)
class StockInProductRelAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_stock_in_document_ref',
                    'file', 'created_on',)
    # list_filter = ['stock__store__name',]
    # search_fields = ['stock__product__sku',]

    @admin.display(description='stock_in_document', ordering='stock_in_document__ref')
    def get_stock_in_document_ref(self, obj):
        return obj.stock_in_document.ref


@admin.register(StockOut)
class StockOutAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_store_name', 'get_product_sku', 'created_on',)
    list_filter = ['stock__store__name',]
    search_fields = ['stock__product__sku',]

    @admin.display(description='Store', ordering='stock__store__name')
    def get_store_name(self, obj):
        return obj.stock.store.name

    @admin.display(description='Product', ordering='stock__product__sku')
    def get_product_sku(self, obj):
        return obj.stock.product.sku


@admin.register(StockInit)
class StockInitAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_store_name', 'get_product_sku', 'created_on',)
    list_filter = ['stock__store__name',]
    search_fields = ['stock__product__sku',]

    @admin.display(description='Store', ordering='stock__store__name')
    def get_store_name(self, obj):
        return obj.stock.store.name

    @admin.display(description='Product', ordering='stock__product__sku')
    def get_product_sku(self, obj):
        return obj.stock.product.sku


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    Supplier = ('id', 'name',)
    search_fields = ['name',]


@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
    list_display = ('id', 'ref', 'get_source_name',
                    'get_target_name', 'created_on',)
    list_filter = ['source__name', 'target__name',]
    search_fields = ['ref',]

    @admin.display(description='Source', ordering='source__name')
    def get_source_name(self, obj):
        return obj.source.name

    @admin.display(description='Target', ordering='target__name')
    def get_target_name(self, obj):
        return obj.target.name


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('id', 'movement_type', 'get_store_name',
                    'get_product_sku', 'created_on',)
    list_filter = ['movement_type', 'stock__store__name',]
    search_fields = ['stock__product__sku',]

    @admin.display(description='Store', ordering='stock__store__name')
    def get_store_name(self, obj):
        return obj.stock.store.name

    @admin.display(description='Product', ordering='stock__product__sku')
    def get_product_sku(self, obj):
        return obj.stock.product.sku


@admin.register(TransferProductRel)
class TransferProductRelAdmin(admin.ModelAdmin):
    list_display = ('transfer', 'product', 'quantity',)


@admin.register(TransferDocument)
class TransferProductRelAdmin(admin.ModelAdmin):
    list_display = ('transfer', 'file',)


@admin.register(StockInDocument)
class StockInDocumentAdmin(admin.ModelAdmin):
    list_display = ('ref', 'created_by', 'created_on', 'status',)


@admin.register(StockOutDocument)
class StockOutDocumentAdmin(admin.ModelAdmin):
    list_display = ('ref', 'created_by', 'created_on', 'status',)


@admin.register(ReceiptDocument)
class ReceiptDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'file', 'created_on', 'receipt',)
