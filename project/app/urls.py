from django.urls import path
from .views import Index
from .views import domain_view

urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
    path('fetch-data/<int:button_id>/', domain_view.fetch_data, name='fetch_data'),
    # path('', DomainView.as_view(), name='menu'),
]