from django.urls import path, re_path
from .views import Index
from .views.domain import Domain
from .views.boids import Boids
from .views.simulations import SimulationsView
from .views.configuration import ConfigurationView


urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
    re_path(r'^domain/(?P<simulation_id>\d+)/?$', Domain.as_view(), name='domain'),
    re_path(r'^boids/(?P<simulation_id>\d+)/?$', Boids.as_view(), name='boids'),
    re_path(r'^simulation/(?P<simulation_id>\d+)/?$', SimulationsView.as_view(), name='simulation'),
    re_path(r'^simulations/?$', SimulationsView.as_view(), name='simulations'),
    re_path(r'^configuration/?$', ConfigurationView.as_view(), name='configuration'),
]