from django.urls import path, include
from rest_framework.routers import DefaultRouter
#from products.views.v1 import SomeViewSet

router_v1_products = DefaultRouter()
# router_v1_products.register(r'example', SomeViewSet)

app_name = 'products-v1'

urlpatterns = [
    path('', include(router_v1_products.urls)),
]