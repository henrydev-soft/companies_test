from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend

from ..models import Product, Currency, ProductCurrencyPrice
from ..permissions.v1 import IsProductCreatorOrReadOnly, IsProductOwnerForWrite
from ..serializers.v1 import (
    ProductSerializer,
    CurrencySerializer,
    ProductCurrencyPriceSerializer
)


# ViewSet para Currency (solo lectura si lo prefieres)
class CurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API para consultar monedas (solo lectura).
    Las modificaciones deben hacerse desde el Admin de Django.
    """

    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['iso_code', 'name']  # Búsqueda por código o nombre

# ViewSet para Product
class ProductViewSet(viewsets.ModelViewSet):
    """
    Permite manejar las operaciones CRUD de la entidad Product.
    - Listar todas los productos (Público)
    - Crear, actualizar y eliminar productos (Requiere autenticación)
    """   

    queryset = Product.objects.all().select_related('company').prefetch_related(
        'productcurrencyprice_set__currency'
    )    
    serializer_class = ProductSerializer
    permission_classes = [IsProductCreatorOrReadOnly]

    # Configuración de filtros
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company__nit']  # Filtrar por NIT de empresa

    # Para búsqueda integral por el parámetro 'search'
    search_fields = ['name', 'characteristics'] 
    # Ordenamiento por fecha de creación o nombre
    ordering_fields = ['created_at', 'name'] 
    ordering = ['-created_at']

    def perform_create(self, serializer):
        # Asigna automáticamente la compañía del usuario logueado
        company = self.request.user.company_set.first()  # Ajusta según tu modelo
        serializer.save(company=company)



# ViewSet para ProductCurrencyPrice
class ProductCurrencyPriceViewSet(viewsets.ModelViewSet):
    """
    Permite manejar las operaciones CRUD de los precios de Productos por moneda.
    - Listar todas los productos (Público)
    - Crear, actualizar y eliminar productos (Requiere autenticación)
    """  
    queryset = ProductCurrencyPrice.objects.all().select_related(
        'product', 'currency'
    )
    serializer_class = ProductCurrencyPriceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product__code', 'currency__iso_code']
    permission_classes = [IsProductOwnerForWrite]