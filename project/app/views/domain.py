from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.views.generic import View
from ..models.simulation import Simulation

class Domain(View):
    template = "common/domain.html"
    
    def get(self, request: HttpRequest) -> HttpResponse:
        simulation_id = request.GET.get('simulation_id')

        try:
            simulation = Simulation.objects.get(pk=simulation_id)
            context = {"simulation": simulation.serialize()}
            
            return render(request, self.template, context)
        except Simulation.DoesNotExist:
            return HttpResponse("<p>Simulation not found</p>", status=404)