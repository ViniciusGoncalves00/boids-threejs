from django.urls import path
from .views import Index

urlpatterns = [
    path('', Index.Index.as_view(), name='index'),
]