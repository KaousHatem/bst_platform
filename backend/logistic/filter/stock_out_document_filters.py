
from django_filters import rest_framework as filters
from ..models import StockOutDocument


class StockOutDocumentFilter(filters.FilterSet):
    class Meta:
        model = StockOutDocument
        fields = {
            'store': ['exact'],
        }
