from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from .base_view import BaseView
from ..models.simulation import Simulation

class SimulationView(BaseView):
    template = "sections/simulation.html"
        
    def delete(self, request: HttpRequest, simulation_id):
        try:
            simulation_id = int(simulation_id)
            simulation = Simulation.objects.get(pk=simulation_id)
            simulation.delete()
            return HttpResponse(status=204)
        except Simulation.DoesNotExist:
            return render(request, self.template_not_found)
        
    def post(self, request: HttpRequest):
        simulation = Simulation.objects.create()
        return JsonResponse({
            "id": simulation.id,
            "name": simulation.name
        })