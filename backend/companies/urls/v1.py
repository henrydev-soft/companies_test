from django.urls import path, include
from rest_framework.routers import DefaultRouter
from companies.views.v1 import CompanyViewSet

router_v1_companies = DefaultRouter()
router_v1_companies.register(r'companies', CompanyViewSet)

app_name = 'companies'

urlpatterns = [
    path('', include(router_v1_companies.urls)),
]