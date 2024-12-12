from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.views.generic import View

# class DomainView(View):
#     def get(self, request : HttpRequest, template_name: str) -> HttpResponse:
#         request.GET.get("", "")
#         template_name = f"common/{template_name}"
        
#         return render(request, self.template_name)

def fetch_data(request, button_id):
    # Map button IDs to template names
    template_map = {
        1: "common/domain.html",
        2: "common/properties.html",
        3: "common/properties.html",
        4: "common/properties.html",
    }

    # Get the template name or default to a fallback
    template_name = template_map.get(button_id, "common/fallback.html")

    # Pass additional context if necessary
    context = {}
    html_content = render_to_string(template_name, context)
    return HttpResponse(html_content)
