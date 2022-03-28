from django.db import models as django_models
# import django_filters as filters
from django_filters import rest_framework as filters
from .models import Provision, ProvisionProductRel, Product



class ProvisionFilter(filters.FilterSet):
    class Meta:
        model = Provision
        fields = {
            'created_on': ('lte', 'gte','exact'),
            'delay': ('lte', 'gte', 'exact'),
            'status': ['exact'],
            'destination': ['exact']
        	}

class ProductFilter(filters.FilterSet):
    class Meta:
        model = Product
        fields = {
            'category': ['exact'],
            'unit': ['exact']
            }


