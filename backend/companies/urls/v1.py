from django.urls import path, include
from rest_framework import routers


app_name = 'companies'

# -- Router for API v1 --
router_v1 = routers.DefaultRouter()


urlpatterns = [
    path('', include(router_v1.urls)),
]