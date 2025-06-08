from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend


from ..models import Company
from ..serializers.v1 import CompanySerializer
from ..permissions.v1 import IsCompanyAdministrator
from ..filters.v1 import CompanyFilter

class CompanyViewSet(viewsets.ModelViewSet):
    """
    Permite manejar las operaciones CRUD de la entidad Company.
    - Listar todas las compañías (Público)
    - Crear, actualizar y eliminar compañías (Requiere autenticación)
    """    
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    # Configuración de filtros
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CompanyFilter

    # Para búsqueda integral por el parámetro 'search'
    search_fields = ['nit', 'name']

    # Configuración de ordenamiento
    ordering_fields = ['nit','name','created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        #Permisos para creación
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        #Permisos para actualización y eliminación
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsCompanyAdministrator()]
        #Permisos de Lectura
        return [permissions.AllowAny()]

    # Asigna automáticamente el usuario logueado al crear
    def perform_create(self, serializer):
        serializer.save(administrator=self.request.user)