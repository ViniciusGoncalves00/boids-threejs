from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from .base_view import BaseView
from ..models.simulation import Simulation

class Boids(BaseView):
    template = "sections/boids.html"
    
    def get(self, request: HttpRequest) -> HttpResponse:
        try:
            simulation_id = request.GET.get('simulation_id')
            simulation = Simulation.objects.get(pk=simulation_id)
            context = {"simulation": simulation.serialize()}
            
            return render(request, self.template, context)
        except Simulation.DoesNotExist:
            return render(request, self.template_not_found)