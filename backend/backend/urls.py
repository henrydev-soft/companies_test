"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework.routers import DefaultRouter

# Routers for API version 1
from companies.urls.v1 import router_v1_companies
from products.urls.v1 import router_v1_products

# Generacion de PDF
from companies.views.v1 import generate_inventory_pdf

# Create a default router for API version 1
router_v1 = DefaultRouter()
router_v1.registry.extend(router_v1_companies.registry)
router_v1.registry.extend(router_v1_products.registry)



urlpatterns = [
    path('admin/', admin.site.urls),
    # --- API Version 1 ---
    path('api/v1/', include(router_v1.urls)),

    # --- JWT Authentication y Registro ---
    path('api/v1/users/', include('users.urls.v1')),

    # --- Generación de PDF ---
    path('api/v1/companies/<str:nit>/pdf/', generate_inventory_pdf, name='generate_inventory_pdf'),

    # --- Redirecciones Opcionales para la Versión por Defecto ---
    path('api/', lambda request: redirect('/api/v1/')),
    path('api/companies/', lambda request: redirect('/api/v1/companies/')),
    path('api/products/', lambda request: redirect('/api/v1/products/')),
]
