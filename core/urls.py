from django.urls import path
from . import views

urlpatterns = [
    path('', views.prueba, name='prueba'),
    path('api/post', views.Post_APIView.as_view()), 
]