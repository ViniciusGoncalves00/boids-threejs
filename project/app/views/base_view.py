from django.views.generic import View

class BaseView(View):
    template_not_found = "common/template_not_found.html"