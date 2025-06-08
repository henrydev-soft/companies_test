from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views.v1 import ProductViewSet, CurrencyViewSet, ProductCurrencyPriceViewSet

router_v1_products = DefaultRouter()
router_v1_products.register(r'products', ProductViewSet)
router_v1_products.register(r'currencies', CurrencyViewSet)
router_v1_products.register(r'prices', ProductCurrencyPriceViewSet)


app_name = 'products'

urlpatterns = [
    path('', include(router_v1_products.urls)),
]