from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend


from ..models import Company
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