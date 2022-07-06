from django.urls import path
from . import views

urlpatterns = [
    path('', views.prueba, name='prueba'),
    path('api/post', views.Post_APIView.as_view()), 
    path('api/socio_economics', views.socioEconomic_APIView.as_view()), 
    path('api/laboratory', views.Laboratory_APIView.as_view()), 
    path('api/notes', views.Notes_APIView.as_view()), 
]