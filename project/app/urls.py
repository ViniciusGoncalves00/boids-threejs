from django.urls import path, re_path
from .views import Index
from .views.domain import Domain
from .views.behavior import Behavior
from .views.simulations import SimulationsView


urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
    re_path(r'^domain/(?P<simulation_id>\d+)/?$', Domain.as_view(), name='domain'),
    re_path(r'^behavior/(?P<simulation_id>\d+)/?$', Behavior.as_view(), name='behavior'),
    re_path(r'^simulation/(?P<simulation_id>\d+)/?$', SimulationsView.as_view(), name='simulation'),
    re_path(r'^simulations/?$', SimulationsView.as_view(), name='simulations'),
]
