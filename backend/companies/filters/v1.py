import django_filters
from ..models import Company

class CompanyFilter(django_filters.FilterSet):
    nit = django_filters.CharFilter(lookup_expr='icontains')
    name = django_filters.CharFilter(lookup_expr='icontains')
    created_at = django_filters.DateFromToRangeFilter()

    class Meta:
        model = Company
        fields = ['nit', 'name', 'created_at']