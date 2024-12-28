from django.urls import path, re_path
from .views import Index
from .views.domain_view import Domain
from .views.boids_view import Boids
from .views.simulation_view import SimulationView
from .views.simulation_section_view import SimulationSectionView
from .views.simulations_list_view import SimulationsListView
from .views.configuration_view import ConfigurationView


urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
    re_path(r'^domain/?$', Domain.as_view(), name='domain'),
    re_path(r'^boids/?$', Boids.as_view(), name='boids'),
    re_path(r'^simulation/?$', SimulationView.as_view(), name='simulation'),
    path('simulation/<int:simulation_id>/', SimulationView.as_view(), name='simulation'),
    re_path(r'^simulation-section/?$', SimulationSectionView.as_view(), name='simulation-section'),
    re_path(r'^simulations-list/?$', SimulationsListView.as_view(), name='simulations-list'),
    re_path(r'^configuration/?$', ConfigurationView.as_view(), name='configuration'),
]