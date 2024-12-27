from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from .base_view import BaseView
from ..models.simulation import Simulation

class ConfigurationView(BaseView):
    template = "section/template-not-implemented.html"
    
    def get(self, request: HttpRequest) -> HttpResponse:
        try:
            return render(request, self.template)
        except Simulation.DoesNotExist:
            return HttpResponse("<p>Simulation not found</p>", status=404)