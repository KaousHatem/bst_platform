from django.contrib import admin

# Register your models here.
from .models import Product, Category, PurchaseRequest


admin.site.register(Product)
admin.site.register(Category)
admin.site.register(PurchaseRequest)