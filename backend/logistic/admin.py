from django.contrib import admin

# Register your models here.
from .models import Unit, Product, Category, PurchaseRequest



admin.site.register(Unit)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(PurchaseRequest)