
import sys
from typing import Optional

import numpy as np
import requests
from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import redirect, render
from joblib import load
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Add the scripts directory to sys.path to be able to load the pipeline correctly
sys.path.append('scripts')
from utils.preprocessing_utils import preprocess_json

ml_pipeline = load('scripts/model/prediction_pipeline.pickle')


class Post_APIView(APIView):

    def get(self, request, format=None, *args, **kwargs):
        """appointment = Appointment.objects.all()
        serializer = PostSerializers(appointment, many=True)"""
        data = 'hola'
        
        return Response(data)

    def post(self, request, format=None):
        post_data = request.GET
        data = post_data.copy()
        nombres = (data['Nombre'])
        valores = data['Valor']
        fechas = data['Fecha']
        if len(nombres) == 0:
            Nombre = {}
            Fecha = {}
            Valor = {}
        elif type(nombres) is str:
            Nombre = {0:nombres}
            Fecha = {0:fechas}
            Valor = {0:valores}

        elif type(nombres) is list:
            Nombre = dict(enumerate(nombres))
            Fecha = dict(enumerate(fechas))
            Valor = dict(enumerate(valores))

        Examenes = {'Nombre':Nombre, 'Fecha':Fecha, 'Valor':Valor}
        data_clean = {'Edad': data['Edad'], 'Genero': data['Genero'], 'GrupoEtnico': data['GrupoEtnico'], 'AreaResidencial': data['AreaResidencial'], 'EstadoCivil': data['EstadoCivil'], 'TSangre': data['TSangre'], 'Tipo': data['Tipo'], 'Plan': data['Plan']}
        data_clean['Examenes'] = Examenes
        print(data_clean)
        prediction = ml_pipeline.predict(preprocess_json(data_clean))
        prediction = {'respuesta':prediction[0]}
        if data_clean:
            return Response(prediction, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class socioEconomic_APIView(APIView):

    def get(self, request, format=None, *args, **kwargs):
        data = 'Socioeconomic'
        
        return Response(data)

class Laboratory_APIView(APIView):

    def get(self, request, format=None, *args, **kwargs):
        data = 'Laboratory'
        
        return Response(data)

class Notes_APIView(APIView):

    def get(self, request, format=None, *args, **kwargs):
        data = 'Notes'
        
        return Response(data)


def prueba(request):
    data = ''
    if request.method == 'POST': 
        post_data = request.POST   
        params = {'Edad':post_data['1'],'Genero':post_data['2'],'GrupoEtnico':post_data['3'],'AreaResidencial':post_data['4'],'EstadoCivil':post_data['5'],'TSangre':post_data['6'],'Tipo':post_data['7'],'Plan':post_data['8'],'Nombre':post_data['9'],'Valor':post_data['10'],'Fecha':post_data['11']}
        url = 'http://127.0.0.1:8000/api/post'
        params =  {'Edad': '39', 'Genero': 'Mujer', 'GrupoEtnico': 'Mestizo', 'AreaResidencial': 'Zona Urbana', 'EstadoCivil': 'Separado', 'TSangre': 'NaN', 'Nombre': ['902046', 'Test de urologia'], 'Fecha': ['22/02/2022 18:43', '24/02/2022 00:00'], 'Valor': ['6', '20'], 'Tipo': 'Confirmado Repetido', 'Plan': '- Paciente se remite para analisis de urologia...'}
        response = requests.post(url, params=params) 
        if response.status_code == 201:
            data =  response.json()
    else:
        data = []
        url = 'http://127.0.0.1:8000/api/laboratory'
        response = requests.get(url) 
        data.append(response.json())
        url = 'http://127.0.0.1:8000/api/socio_economics'
        response = requests.get(url) 
        data.append(response.json())
        url = 'http://127.0.0.1:8000/api/notes'
        response = requests.get(url) 
        data.append(response.json())
    return render(request, "core/prueba.html", {'data':data})

def test_ml_model(sample_path:Optional[str] = None) -> np.array:
    """Tests the functionality of the ML model.
    The model expects a dictionary with keys and formatting equal to the one
    found in the sample_example json file, located in scripts/utils/.

    Args:
        sample_path (Optional[str], optional): Path to sample file. If None is
            given, it uses the example JSON file located in scripts/utils/.
            Defaults to None.
        

    Returns:
        np.array: Numpy array containing the prediction for the supplied example.
    """
    import json
    if sample_path is None:
        sample_path = 'scripts/utils/sample_example.json'
    with open(sample_path) as in_file:
        sample_data = json.load(in_file)

    prediction = ml_pipeline.predict(
        X=preprocess_json(sample_data))
    return prediction
