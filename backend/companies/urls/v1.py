from django.urls import path, include
from rest_framework.routers import DefaultRouter
from companies.views.v1 import CompanyPublicViewSet, CompanyAdminViewSet

router_v1_companies = DefaultRouter()
router_v1_companies.register(r'companies', CompanyPublicViewSet)
router_v1_companies.register(r'my-companies', CompanyAdminViewSet, basename='companies-admin')

app_name = 'companies'

urlpatterns = [
    path('', include(router_v1_companies.urls)),
]