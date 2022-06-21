import re

from typing import Optional

import matplotlib

import nltk
import numpy as np
import pandas as pd
import unicodedata

from nltk.corpus import stopwords


nltk.download("stopwords")


def remove_stop_words(string_data: str, extra_stop_words: list = []) -> str:
    stop_words = stopwords.words("spanish")
    stop_words.extend(extra_stop_words)
    string_data = re.sub(
        r"\b(" + r"|".join(stop_words) + r")\b\s*", "", string_data, flags=re.IGNORECASE
    )
    return string_data


def remove_characters(string_data: str, character_list: list) -> str:
    for character in character_list:
        string_data = string_data.replace(character, "")
    return string_data


def convert_to_long_string(series_data: pd.Series) -> str:
    regex_compile = re.compile(r"[^A-Za-z ]")
    string_data = (
        series_data.str.replace(regex_compile, "", regex=True).str.cat(sep=" ").lower()
    )

    string_data = remove_stop_words(string_data)
    string_data = remove_characters(string_data, ["-", ","])
    string_data = re.sub(" {2,}", " ", string_data)
    return string_data


def strip_accents(accented_string: str) -> str:
    clean_string = (
        unicodedata.normalize("NFD", accented_string)
        .encode("ascii", "ignore")
        .decode("utf-8")
    )
    return clean_string


def find_top_k_words(string_value: str, k: int = 5) -> list:
    string_value = str(string_value).lower()
    # Some text cleaning
    string_value = remove_stop_words(string_value)
    string_value = remove_characters(string_value, ["-", ","])
    # Split into lists for the counter
    split_it = string_value.split()
    counter = Counter(split_it)
    most_common = counter.most_common(k)
    return most_common


def merge_classes(df):
    notas = df.copy()
    notas.loc[notas.Código == "A529", "Código"] = "A539"
    notas.loc[notas.Código == "A539", "Nombre"] = "SIFILIS, NO ESPECIFICADA"
    notas.loc[notas.Código == "A510", "Código"] = "A51"
    notas.loc[notas.Código == "A511", "Código"] = "A51"
    notas.loc[notas.Código == "A514", "Código"] = "A51"
    notas.loc[notas.Código == "A51", "Nombre"] = "SIFILIS PRECOZ"
    return notas


def word_count_feat_engineering(df):
    notas = df.copy()
    word_count_features = {
        "acido": "acido",
        "antibio": "antibio",
        "asintoma": "asintoma",
        "cabeza": "cabeza",
        "diabet": "diabet",
        "diet": "diet",
        "gluco": "gluco",
        "hepat": "hepat",
        "insulin": "insulin",
        "keto": "keto",
        "penici": "penici",
        "preservativo": "preservativo",
        "rpr": "rpr",
        "sable": "sable",
        "serolo": "serolo",
        "sifili": "sifili",
        "test_reloj_orden": r"(test.*reloj)",
        "vih": "vih",
    }
    for word in word_count_features:
        notas[word] = notas.Plan.str.lower().str.count(word_count_features[word])
    return notas


def merge_labs_notas(df_lab, df_notas):
    lab = df_lab.copy()
    notas = df_notas.copy()

    # Preprocess the lab data
    preprocessed_labs = preprocess_labs(lab)

    # Merge the data, dropping it beforehand if it was already merged to the notas DF
    if not set(["top_lab_name", "top_lab_avg_value", "top_lab_count"]).issubset(
        df_notas.columns
    ):
        df_merged = notas.merge(preprocessed_labs, how="left", on="IDRecord")
    else:
        df_merged = df_merged.drop(
            columns=preprocessed_labs.columns, errors="ignore"
        ).merge(preprocessed_labs, how="left", on="IDRecord")
        # Fill NaNs
        df_merged["top_lab_name"] = df_merged.top_lab_name.fillna(0)
        df_merged["top_lab_avg_value"] = df_merged.top_lab_avg_value.fillna(0)
        df_merged["top_lab_count"] = df_merged.top_lab_count.fillna("NA")
        df_merged["total_lab_count"] = df_merged.total_lab_count.fillna(0)
    return df_merged


def clean_labs(df_lab):
    lab = df_lab.copy()
    lab["Valor"] = pd.to_numeric(lab.Valor, errors="coerce")
    lab["IDRecord"] = pd.to_numeric(lab.IDRecord, errors="coerce")
    lab = lab.dropna(subset=["IDRecord"])

    return lab


def preprocess_labs(df):
    lab = df.copy()

    # Group data by Lab name and IDRecord
    lab = lab.groupby(["IDRecord", "Nombre"])

    # Aggregate the data
    labs_agg = lab.aggregate({"Valor": np.nanmean, "Nombre": "count"})
    labs_agg = labs_agg.rename(
        columns={"Nombre": "lab_count", "Valor": "top_lab_avg_value"}
    ).reset_index()

    # Get the top lab test per patient, by getting the lab with the highest count
    top_lab_test_by_patient = labs_agg.merge(
        labs_agg.loc[
            labs_agg.groupby("IDRecord").lab_count.idxmax(), ["IDRecord", "Nombre"]
        ]
    ).rename(columns={"Nombre": "top_lab_name", "lab_count": "top_lab_count"})

    # Get the total number of labs performed on each patient
    total_lab_count_by_patient = (
        labs_agg.groupby(["IDRecord"])
        .aggregate({"lab_count": "sum"})
        .rename(columns={"lab_count": "total_lab_count"})
    )

    preprocessed_labs = top_lab_test_by_patient.merge(
        total_lab_count_by_patient, on="IDRecord"
    )

    return preprocessed_labs


def clean_sociodemograficos(df):
    demografico = df.copy()
    demografico["IDRecord"] = pd.to_numeric(demografico["IDRecord"], errors="coerce")
    return demografico


def clean_notas(df):
    notas = df.copy()
    # Dropping null values from IDRecord
    notas.dropna(subset=["IDRecord"], inplace=True)

    # Drop samples where both Code and Name are null
    notas.dropna(how="all", subset=["Código", "Nombre"], inplace=True)

    # Drop bad data form IDRecord
    notas["IDRecord"] = pd.to_numeric(notas["IDRecord"], errors="coerce")
    notas.dropna(subset=["IDRecord"], inplace=True)

    # Remove bad data from Nombre
    index = notas[notas.Nombre == "Confirmado Repetido"].index
    notas.loc[index, ["Nombre", "Tipo", "Plan"]] = notas.loc[
        index, ["Código", "Nombre", "Tipo"]
    ].to_numpy()
    notas.loc[index, "Código"] = notas[
        notas["Nombre"] == notas.loc[index, "Código"].iat[0]
    ]["Código"].iloc[0]

    # Remove accents from Plan
    notas["Plan"] = notas.Plan.astype(str).apply(lambda x: strip_accents(x))

    # Remove stop words from Plan
    notas["Plan"] = notas.Plan.astype(str).apply(lambda x: remove_stop_words(x))
    return notas
