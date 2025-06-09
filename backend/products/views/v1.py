from rest_framework import viewsets, filters, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError



from ..models import Product, Currency, ProductCurrencyPrice
from companies.models import Company
from ..ai.text_generator import generate_ad_text
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
    - Listar todas los productos de una empresa(Público)
    - Crear, actualizar y eliminar productos (Requiere autenticación)
    - Listar productos creados por el usuario autenticado (Requiere autenticación)
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
        company_nit = self.request.data.get('company')

        if not company_nit:
            raise ValidationError({"company": "Debes especificar el nit de la empresa a la que pertenece el producto."})
        try:
            company = Company.objects.get(nit=company_nit)
        except Company.DoesNotExist:
            raise ValidationError({"company": "La empresa especificada no existe."})

        # Validar que el usuario actual es administrador de esa empresa
        if company.administrator != self.request.user:
            raise ValidationError({"company": "No tienes permiso para agregar productos a esta empresa."})

        # Guardar el producto con la empresa y el creador
        serializer.save(company=company, created_by=self.request.user)
    
    def perform_update(self, serializer):
        company_nit = self.request.data.get('company') # Obtener el NIT del frontend

        # Si el NIT de la empresa se envió en la solicitud de actualización
        if company_nit is not None and company_nit != '':
            try:
                # Intenta convertir el NIT a entero (si tu modelo Company.nit es IntegerField)
                # O si es CharField, simplemente úsalo como string: new_company = Company.objects.get(nit=company_nit)
                new_company = Company.objects.get(nit=int(company_nit)) 
            except (ValueError, Company.DoesNotExist):
                raise ValidationError({"company": "La empresa especificada no existe o el NIT no es válido."})

            # Verifica si la empresa realmente está cambiando
            if serializer.instance.company.nit != new_company.nit:
                # Valida que el usuario sea administrador de la NUEVA empresa
                if new_company.administrator != self.request.user:
                    raise ValidationError({"company": "No tienes permiso para asignar este producto a la nueva empresa."})
                
                # Pasa el objeto Company directamente como un argumento clave a serializer.save()
                # Esto hará que esté disponible en `kwargs` dentro de ProductSerializer.update
                serializer.save(company=new_company) 
            else:
                # Si el NIT se envió pero es la misma empresa, o si no se envió un cambio
                serializer.save() # Guarda los demás campos
        else:
            # Si no se envió company_nit o se envió vacío, solo guardar los demás campos
            serializer.save()
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_products(self, request):
        user = request.user
        queryset = self.get_queryset().filter(created_by=user).order_by('-created_at')
        # Aplica paginación si está configurada
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Si no hay paginación configurada, se comporta como lista normal
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='generate_post')
    def generate_post(self, request, pk=None):
        try:
            product = self.get_object()
            generated = generate_ad_text(product.name, product.characteristics)
            print(generated)
            print(product.name, product.characteristics)
            product.generated_add = generated
            product.save()
            return Response({'generated_add': generated}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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

