import sys
from typing import Optional
import json
from pathlib import Path
from distutils.util import strtobool

import numpy as np
import requests
from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import redirect, render
from joblib import load
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Add the scripts directory to sys.path to be able to load the pipeline correctly
sys.path.append("scripts")
from utils.preprocessing_utils import preprocess_json

condition_name_dict = {
    "A510": "Primary genital syphilis",
    "A511": "Primary anal syphilis",
    "A514": "Other secondary syphilis",
    "A529": "Late syphilis, unspecified",
    "A530": "Latent syphilis, unspecified as early or late",
    "A539": "Syphilis, unspecified",
    "E109": "Type I diabetes mellitus",
    "E119": "Type II diabetes mellitus",
    "E149": "Unspecified diabetes mellitus",
}

ml_pipeline = load("scripts/model/prediction_pipeline.pickle")
# Path definitions
socio_json_path = (
    Path("scripts") / "utils" / "api_data" / "sociodemographic_summary.json"
)
lab_json_path = Path("scripts") / "utils" / "api_data" / "lab_summary.json"
notes_json_path = Path("scripts") / "utils" / "api_data" / "notes_summary.json"

# Load files
if socio_json_path.is_file():
    with open(socio_json_path) as in_file:
        socio_json = json.load(in_file)
else:
    socio_json = {"error": "sociodemographic_file_not_found"}

if lab_json_path.is_file():
    with open(lab_json_path) as in_file:
        lab_json = json.load(in_file)
else:
    lab_json = {"error": "lab_file_not_found"}

if notes_json_path.is_file():
    with open(notes_json_path) as in_file:
        notes_json = json.load(in_file)
else:
    notes_json = {"error": "notes_file_not_found"}


class Post_APIView(APIView):
    def get(self, request, format=None, *args, **kwargs):
        """appointment = Appointment.objects.all()
        serializer = PostSerializers(appointment, many=True)"""
        data = "hola"

        return Response(data)

    def post(self, request, format=None):
        post_data = dict(request.data)
        data = post_data.copy()
        # Should the model return the top diagnosis or a dictionary with all
        # the diagnoses and their probabilities? True by default
        try:
            probabilities_response = bool(
                strtobool(data.get("probabilities_response", ["True"])[0])
            )
        except:
            probabilities_response = True
        print("Raw data")
        print("****************************************")
        print(data)
        print("****************************************")
        nombres = data["Nombre"]
        valores = data["Valor"]
        fechas = data["Fecha"]
        if len(nombres) == 0:
            Nombre = {}
            Fecha = {}
            Valor = {}
        elif type(nombres) is str:
            Nombre = {0: nombres}
            Fecha = {0: fechas}
            Valor = {0: valores}

        elif type(nombres) is list:
            Nombre = dict(enumerate(nombres))
            Fecha = dict(enumerate(fechas))
            Valor = dict(enumerate(valores))

        Examenes = {"Nombre": Nombre, "Fecha": Fecha, "Valor": Valor}
        data_clean = {
            "Edad": data.get("Edad", "NA"),
            "Genero": data.get("Genero", "NA"),
            "GrupoEtnico": data.get("GrupoEtnico", "NA"),
            "AreaResidencial": data.get("AreaResidencial", "NA"),
            "EstadoCivil": data.get("EstadoCivil", "NA"),
            "TSangre": data.get("TSangre", "NA"),
            "Tipo": data.get("Tipo", "NA"),
            "Plan": data.get("Plan", "NA"),
        }
        data_clean["Examenes"] = Examenes
        print("Clean data")
        print("****************************************")
        print(data_clean)
        print("****************************************")
        if not probabilities_response:
            try:
                top_prediction = ml_pipeline.predict(preprocess_json(data_clean))
                prediction_ok = True
            except Exception as e:
                print(f"Error predicting: {e}")
                prediction_ok = False
        else:
            try:
                print("****************************************")
                print(f"Prediction probabilities:")
                prediction_probabilities = ml_pipeline.predict_proba(
                    preprocess_json(data_clean)
                )
                prediction_probabilities = prediction_probabilities[0]
                # Add full names to diagnoses
                prediction_response = {
                    f"{key}:{condition_name_dict.get(key, 'NA')}": value
                    for key, value in prediction_probabilities.items()
                }
                prediction = {"respuesta": prediction_response}
                print(
                    json.dumps(
                        prediction_probabilities,
                        sort_keys=True,
                        indent=4,
                    )
                )
                prediction_ok = True
            except Exception as e:
                print(f"Could not calculate probabilities of prediction, error: {e}")
                prediction_ok = False
            finally:
                print("****************************************")

        if prediction_ok and not probabilities_response:
            # Add full names to diagnosis
            top_prediction = f"{top_prediction[0]} : {condition_name_dict.get(top_prediction[0], 'NA')}"
            print(f"Final Prediction: {top_prediction}")
            prediction = {"respuesta": top_prediction}
        elif prediction_ok and probabilities_response:
            prediction = {"respuesta": prediction_response}
        else:
            prediction = {
                "respuesta": "Error en la predicción, intenta de nuevo más tarde"
            }
        if data_clean:
            return Response(prediction, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class socioEconomic_APIView(APIView):
    def get(self, request, format=None, *args, **kwargs):
        data = socio_json

        return Response(data)


class Laboratory_APIView(APIView):
    def get(self, request, format=None, *args, **kwargs):
        data = lab_json

        return Response(data)


class Notes_APIView(APIView):
    def get(self, request, format=None, *args, **kwargs):
        data = notes_json

        return Response(data)


def prueba(request):
    data = ""
    return render(request, "core/prueba.html", {"data": data})


def test_ml_model(sample_path: Optional[str] = None) -> np.array:
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
    if sample_path is None:
        sample_path = "scripts/utils/sample_example.json"
    with open(sample_path) as in_file:
        sample_data = json.load(in_file)

    prediction = ml_pipeline.predict(X=preprocess_json(sample_data))
    return prediction
