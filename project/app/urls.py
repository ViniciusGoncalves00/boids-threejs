from django.urls import path, re_path
from .views import Index
from .views.domain import Domain
from .views.properties import Properties


urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
    path('common/domain.html', Domain.as_view(), name='domain'),
    path('common/properties.html', Properties.as_view(), name='properties'),
]