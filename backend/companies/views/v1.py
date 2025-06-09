from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend

from django.http import HttpResponse
from products.models import Product
from companies.models import Company
from ..pdf.generators import render_inventory_pdf

from ..models import Company
from products.models import ProductCurrencyPrice
from ..serializers.v1 import CompanySerializer
from ..permissions.v1 import IsCompanyAdministrator
from ..filters.v1 import CompanyFilter


class CompanyPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista pública: lista todas las compañías. Permite solo GET.(Vista para usuario no autenticado)
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CompanyFilter
    search_fields = ['nit', 'name']
    ordering_fields = ['nit', 'name', 'created_at']
    ordering = ['-created_at']

class CompanyAdminViewSet(viewsets.ModelViewSet):
    """
    Vista privada para administración:
    Solo permite ver y gestionar empresas donde el usuario es administrador.
    """
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdministrator]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CompanyFilter
    search_fields = ['nit', 'name']
    ordering_fields = ['nit', 'name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Company.objects.filter(administrator=self.request.user)

    def perform_create(self, serializer):
        serializer.save(administrator=self.request.user)

#End Point para Generación de PDF de inventario
def generate_inventory_pdf(request, nit):
    try:
        company = Company.objects.get(nit=nit)
        productos = Product.objects.filter(company=company).prefetch_related('productcurrencyprice_set__currency')
        productos_con_precios = []
        for producto in productos:
            precios = ProductCurrencyPrice.objects.filter(product=producto).select_related('currency')
            productos_con_precios.append({
                'producto': producto,
                'precios': precios
            })
        
    except Company.DoesNotExist:
        return HttpResponse("Empresa no encontrada", status=404)

    pdf_file = render_inventory_pdf(company, productos_con_precios)
    response = HttpResponse(pdf_file.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="inventario_{nit}.pdf"'
    return response