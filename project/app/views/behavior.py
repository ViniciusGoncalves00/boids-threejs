from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from .base_view import BaseView
from ..models.simulation import Simulation

class Behavior(BaseView):
    template = "sections/behavior.html"
    
    def get(self, request: HttpRequest, simulation_id) -> HttpResponse:
        try:
            simulation_id = int(simulation_id)
            simulation = Simulation.objects.get(pk=simulation_id)
            context = {"simulation": simulation.serialize()}
            
            return render(request, self.template, context)
        except Behavior.DoesNotExist:
            return render(request, self.template_not_found)