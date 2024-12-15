from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import View
from ..models.simulation import Simulation

class Properties(View):
    template = "common/properties.html"
    
    def get(self, request: HttpRequest) -> HttpResponse:
        simulation_id = request.GET.get('simulation_id')
        
        if not simulation_id:
            return HttpResponse("<p>Simulation ID not provided</p>", status=400)
        
        try:
            simulation = Simulation.objects.get(pk=simulation_id)
            context = {"simulation": simulation.serialize()}
            
            return render(request, self.template, context)
        except Simulation.DoesNotExist:
            return HttpResponse("<p>Simulation not found</p>", status=404)