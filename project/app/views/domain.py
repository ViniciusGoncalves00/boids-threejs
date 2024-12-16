from django.http import HttpRequest, HttpResponse, JsonResponse
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
        
    def post(self, request: HttpRequest, simulation_id):
        sizeX = request.POST.get('sizeX')
        sizeY = request.POST.get('sizeY')
        sizeZ = request.POST.get('sizeZ')
        partitionsX = request.POST.get('partitionsX')
        partitionsY = request.POST.get('partitionsY')
        partitionsZ = request.POST.get('partitionsZ')
        
        print(sizeX)
        print(sizeY)
        print(sizeZ)

        simulation = Simulation.objects.get(pk=simulation_id)
        simulation.sizeX = sizeX
        simulation.sizeY = sizeY
        simulation.sizeZ = sizeZ
        simulation.partitionsX = partitionsX
        simulation.partitionsY = partitionsY
        simulation.partitionsZ = partitionsZ
        simulation.save()
        return JsonResponse({'status': 'success', 'message': 'Simulation updated'})