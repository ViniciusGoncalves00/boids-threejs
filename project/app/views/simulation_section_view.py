from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from .base_view import BaseView
from ..models.simulation import Simulation

class SimulationSectionView(BaseView):
    template = "sections/simulation-section.html"
    
    def get(self, request: HttpRequest) -> HttpResponse: 
        try:
            return render(request, self.template)
        except Exception as e:
            return HttpResponse(f"<div>Failed to load simulations: {str(e)}</div>", status=500)
        
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