from django.urls import path
from ..views.v1 import LoginView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
]
