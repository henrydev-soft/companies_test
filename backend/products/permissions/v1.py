from rest_framework import permissions

class IsProductCreatorOrReadOnly(permissions.BasePermission):
    """
    Permite acceso público solo para lectura (GET).
    Para escritura (POST, PUT, PATCH, DELETE), el usuario debe estar autenticado
    y ser el administrador de la compañía asociada al producto.
    """

    def has_permission(self, request, view):
        # Permitir GET, HEAD, OPTIONS sin autenticación
        if request.method in permissions.SAFE_METHODS:
            return True
        # Requerir autenticación para otros métodos
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Permitir GET, HEAD, OPTIONS sin autenticación
        if request.method in permissions.SAFE_METHODS:
            return True
        # Solo el administrador de la compañía puede modificar/eliminar
        return obj.company.administrator == request.user

class IsProductOwnerForWrite(permissions.BasePermission):
    """
    Solo permite escritura (POST/DELETE) si el usuario es el creador del producto.
    Lectura (GET) permitida para cualquier usuario autenticado.
    """

    def has_permission(self, request, view):
        # Permitir si solo es lectura
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Para escritura, validar si el usuario es el dueño del producto
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.product.created_by == request.user