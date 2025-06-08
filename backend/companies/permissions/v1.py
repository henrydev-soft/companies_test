from rest_framework import permissions

class IsCompanyAdministrator(permissions.BasePermission):
    """
    Permiso personalizado para verificar si el usuario es el administrador de la compañia.
    Se asume que el modelo Company tiene un campo 'administrator' que referencia al usuario.
    """
    def has_object_permission(self, request, view, obj):
        # Solo el administrador puede editar/eliminar
        return obj.administrator == request.user