
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from django.http import Http404
from django.shortcuts import render, redirect
from django.http import HttpResponseBadRequest


class Post_APIView(APIView):

    def get(self, request, format=None, *args, **kwargs):
        """appointment = Appointment.objects.all()
        serializer = PostSerializers(appointment, many=True)"""
        data = 'hola'
        
        return Response(data)

    def post(self, request, format=None):
        post_data = request.GET
        data = {'Edad':post_data['Edad'],'Genero':post_data['Genero'],'GrupoEtnico':post_data['GrupoEtnico'],'AreaResidencial':post_data['AreaResidencial'],'EstadoCivil':post_data['EstadoCivil'],'TSangre':post_data['TSangre'],'Tipo':post_data['Tipo'],'Plan':post_data['Plan'],'examenesRealizados':post_data['examenesRealizados'],'Valores':post_data['Valores'],'fecha':post_data['fecha']}
        prediction = {'respuesta':'respuesta satisfactoria'}
        if data:
            return Response(prediction, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

def prueba(request):
    data = ''
    if request.method == 'POST': 
        post_data = request.POST   
        params = {'Edad':post_data['1'],'Genero':post_data['2'],'GrupoEtnico':post_data['3'],'AreaResidencial':post_data['4'],'EstadoCivil':post_data['5'],'TSangre':post_data['6'],'Tipo':post_data['7'],'Plan':post_data['8'],'examenesRealizados':post_data['9'],'Valores':post_data['10'],'fecha':post_data['11']}
        url = 'http://127.0.0.1:8000/api/post'
        response = requests.post(url, params=params) 
        if response.status_code == 201:
            data =  response

    return render(request, "core/prueba.html", {'data':data})