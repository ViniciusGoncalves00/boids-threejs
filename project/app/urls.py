from django.urls import path, re_path
from .views import Index
from .views.domain import Domain
from .views.properties import Properties
from .views.simulations import SimulationsView


urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
    re_path(r'^common/domain/(?P<simulation_id>\d+)/?$', Domain.as_view(), name='domain'),
    path('common/properties.html', Properties.as_view(), name='properties'),
    path('common/simulations.html', SimulationsView.as_view(), name='simulations'),
    path('common/simulations/<int:simulation_id>', SimulationsView.as_view(), name='simulations'),
]
