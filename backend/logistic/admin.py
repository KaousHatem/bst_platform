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
    StockOutDocument,
    ReceiptDocument


)


admin.site.register(UnitConversion)
admin.site.register(Unit)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(PurchaseRequest)
admin.site.register(PurchaseReqProductRel)
admin.site.register(Provision)
admin.site.register(ProvisionProductRel)
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderProductRel)
admin.site.register(Receipt)
admin.site.register(ReceiptProductRel)
admin.site.register(Store)
admin.site.register(Stock)
admin.site.register(StockIn)
admin.site.register(StockOut)
admin.site.register(StockInit)
admin.site.register(Supplier)
admin.site.register(Transfer)
# admin.site.register(TransferProductRel)
admin.site.register(StockMovement)


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
