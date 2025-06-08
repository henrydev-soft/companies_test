from django.urls import path, include
from rest_framework.routers import DefaultRouter
#from companies.views.v1 import SomeViewSet

router_v1_companies = DefaultRouter()
# router_v1_companies.register(r'example', SomeViewSet)

app_name = 'companies-v1'

urlpatterns = [
    path('', include(router_v1_companies.urls)),
]