from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from .base_view import BaseView
from ..models.simulation import Simulation

class SimulationsListView(BaseView):
    template = "common/components/simulation/simulations-list.html"
    
    def get(self, request: HttpRequest) -> HttpResponse: 
        try:
            simulations = Simulation.objects.all()
            
            return render(request, self.template, {"simulations": simulations})
        except Exception as e:
            return HttpResponse(f"<div>Failed to load simulations: {str(e)}</div>", status=500)