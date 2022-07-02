
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
        data = {
            'Edad':post_data['Edad'],
            'Genero':post_data['Genero'],
            'GrupoEtnico':post_data['GrupoEtnico'],
            'AreaResidencial':post_data['AreaResidencial'],
            'EstadoCivil':post_data['EstadoCivil'],
            'TSangre':post_data['TSangre'],
            'Tipo':post_data['Tipo'],
            'Plan':post_data['Plan'],
            'Examenes':{'Nombre':post_data['examenesRealizados'],
            'Valor':post_data['Valores'],
            'Fecha':post_data['fecha']},
            }
        
        prediction = ml_pipeline.predict(preprocess_json(data))
        prediction = {'respuesta':prediction[0]}
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
