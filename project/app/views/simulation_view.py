# views.py

import json
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from .base_view import BaseView
from ..models.simulation import Simulation

class SimulationView(BaseView):
    template = "sections/simulation.html"
    
    def get(self, request: HttpRequest) -> HttpResponse: 
        try:
            simulation_id = request.GET.get('simulation_id')
            simulation = Simulation.objects.get(pk=simulation_id)
            context = {"simulation": simulation.serialize()}
            return render(request, self.template, context)
        except Exception as e:
            return HttpResponse(f"<div>Failed to load simulations: {str(e)}</div>", status=500)
        
    def delete(self, request: HttpRequest, simulation_id: int):
        try:
            simulation = Simulation.objects.get(pk=simulation_id)
            simulation.delete()
            return HttpResponse(status=204)
        except Simulation.DoesNotExist:
            return JsonResponse({"error": "Simulation not found"}, status=404)
        
    def post(self, request: HttpRequest):
        simulation = Simulation.objects.create()
        return JsonResponse({
            "id": simulation.id,
            "name": simulation.name
        })
