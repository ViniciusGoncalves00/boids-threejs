from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import View

class Index(View):
    template_name = "index.html"
    
    def get(self, request: HttpRequest):
        return render(request, self.template_name)