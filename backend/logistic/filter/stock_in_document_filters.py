
from django_filters import rest_framework as filters
from ..models import StockInDocument


class StockInDocumentFilter(filters.FilterSet):
    class Meta:
        model = StockInDocument
        fields = {
            'store': ['exact'],
        }
