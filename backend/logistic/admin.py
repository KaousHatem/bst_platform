from django.contrib import admin

# Register your models here.
from .models import (
	StockIn, 
	StockOut,
	StockInit,
	Transfer,
	Stock, 
	Store, 
	Unit, 
	Product, 
	Category, 
	PurchaseRequest,
	UnitConversion, 
	PurchaseReqProductRel, 
	Provision, 
	PurchaseOrder,
	PurchaseOrderProductRel,
	Receipt,
	ReceiptProductRel,
	Supplier,
	StockMovement

)



admin.site.register(UnitConversion)
admin.site.register(Unit)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(PurchaseRequest)
admin.site.register(PurchaseReqProductRel)
admin.site.register(Provision)
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
admin.site.register(StockMovement)
