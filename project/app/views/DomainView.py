from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import View

class DomainView(View):
    template_name = "project/templates/common/domain.html"
    
    def get_context(self, simulation_name: str, sim_id: int):
        context = {}
        return context
    
    def get(self, request: HttpRequest, simulation_name: str, sim_id: int):

        context = self.get_context(simulation_name, sim_id)
        return render(request, self.template_name, context)
    
    def post():
        return
    
    def put():
        return
        
    def delete():
        return