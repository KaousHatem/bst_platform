from django.contrib import admin

# Register your models here.
from .models import Unit, Product, Category, PurchaseRequest,UnitConversion, PurchaseReqProductRel, Provision, PurchaseOrder



admin.site.register(UnitConversion)
admin.site.register(Unit)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(PurchaseRequest)
admin.site.register(PurchaseReqProductRel)
admin.site.register(Provision)
admin.site.register(PurchaseOrder)
