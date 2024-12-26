from django.urls import path, re_path
from .views import Index
from .views.domain import Domain
from .views.boids import Boids
from .views.simulation import SimulationView
from .views.simulation_section import SimulationSectionView
from .views.simulations_list import SimulationsListView
from .views.configuration import ConfigurationView


urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
    re_path(r'^domain/(?P<simulation_id>\d+)/?$', Domain.as_view(), name='domain'),
    re_path(r'^boids/(?P<simulation_id>\d+)/?$', Boids.as_view(), name='boids'),
    re_path(r'^simulation/(?P<simulation_id>\d+)/?$', SimulationView.as_view(), name='simulation'),
    re_path(r'^simulation/?$', SimulationView.as_view(), name='simulation'),
    re_path(r'^simulation-section/?$', SimulationSectionView.as_view(), name='simulation-section'),
    re_path(r'^simulations-list/?$', SimulationsListView.as_view(), name='simulations-list'),
    re_path(r'^configuration/?$', ConfigurationView.as_view(), name='configuration'),
]