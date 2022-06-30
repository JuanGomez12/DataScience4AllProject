import re
import unicodedata
from typing import Optional

import matplotlib
import nltk
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
import spacy

# SPACY_MODEL_DEFAULT = "es_core_news_sm"
# SPACY_MODEL_DEFAULT = "es_core_news_md"
SPACY_MODEL_DEFAULT = 'es_core_news_lg'
# SPACY_MODEL_DEFAULT = 'es_dep_news_trf'

# Load the default Spacy model
try:
    default_nlp = spacy.load(SPACY_MODEL_DEFAULT)
except OSError:
    print(
        f"Spacy model {SPACY_MODEL_DEFAULT} not found, downloading from the internet, this might take some time"
    )
    from spacy.cli import download

    download(SPACY_MODEL_DEFAULT)
    default_nlp = spacy.load(SPACY_MODEL_DEFAULT)

nltk.download("stopwords")

def lemmatize(doc, nlp=default_nlp, remove_punctuation=True, remove_stopwords=True):
    tokens = nlp(doc)

    word_list = [token for token in tokens]
    if remove_punctuation:
        word_list = [token for token in word_list if not token.is_punct]
    if remove_stopwords:
        word_list = [token for token in word_list if not token.is_stop]

    word_list = [token.lemma_ for token in word_list]

    lemmatized_string = ' '.join(word_list)

    return lemmatized_string

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


def merge_classes(df: pd.DataFrame) -> pd.DataFrame:
    notas = df.copy()
    notas.loc[notas.Código == "A529", "Código"] = "A539"
    notas.loc[notas.Código == "A539", "Nombre"] = "SIFILIS, NO ESPECIFICADA"
    notas.loc[notas.Código == "A510", "Código"] = "A51"
    notas.loc[notas.Código == "A511", "Código"] = "A51"
    notas.loc[notas.Código == "A514", "Código"] = "A51"
    notas.loc[notas.Código == "A51", "Nombre"] = "SIFILIS PRECOZ"
    return notas


def word_count_feat_engineering(df: pd.DataFrame) -> pd.DataFrame:
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


def merge_labs_notas(df_lab: pd.DataFrame, df_notas: pd.DataFrame) -> pd.DataFrame:
    lab = df_lab.copy()
    notas = df_notas.copy()

    # Preprocess the lab data
    preprocessed_labs = preprocess_labs(lab)

    # Merge the data, dropping it beforehand if it was already merged to the notas DF
    if not set(["top_lab_code", "top_lab_avg_value", "top_lab_count"]).issubset(
        df_notas.columns
    ):
        df_merged = notas.merge(preprocessed_labs, how="left", on="IDRecord")
    else:
        df_merged = df_merged.drop(
            columns=preprocessed_labs.columns, errors="ignore"
        ).merge(preprocessed_labs, how="left", on="IDRecord")
        # Fill NaNs
        df_merged["top_lab_code"] = df_merged.top_lab_code.fillna(0)
        df_merged["top_lab_avg_value"] = df_merged.top_lab_avg_value.fillna(0)
        df_merged["top_lab_max_value"] = df_merged.top_lab_max_value.fillna(0)
        df_merged["top_lab_count"] = df_merged.top_lab_count.fillna("NA")
        df_merged["total_lab_count"] = df_merged.total_lab_count.fillna(0)
    return df_merged


def disease_tests_list():
    disease_tests = [
        ("hepatitis|hepat|glutamico|bilirrub", "liver_damage"),
        ("hemo", "hemoglobin"),
    ]
    # This line will look for tests relating linfo (as in linfocitos/lymphocytes), CD3, CD4, and CD8
    disease_tests.append(("linfo|cd3|cd4|cd8", "lymphocytes"))
    # This line will look for tests relating HIV and (immuno)deficiency
    disease_tests.append(("deficiencia|vih", "vih"))
    # Diabetes related keywords
    disease_tests.append(("ayun|gluco|glico", "diabetes_tests"))
    return disease_tests


def preprocess_labs(df: pd.DataFrame) -> pd.DataFrame:
    lab = df.copy()

    disease_tests = disease_tests_list()

    # ------
    # Lab count and top lab code
    # Aggregate the data
    lab = lab.groupby(["IDRecord", "Codigo"])
    labs_agg = lab.aggregate({"Valor": [np.nanmean, np.nanmax], "Codigo": "count"})
    labs_agg.columns = ["_".join(col) for col in labs_agg.columns.values]
    labs_agg = labs_agg.rename(
        columns={
            "Codigo_count": "lab_count",
            "Valor_nanmean": "top_lab_avg_value",
            "Valor_nanmax": "top_lab_max_value",
        }
    ).reset_index()

    # Get the top lab test per patient, by getting the lab with the highest count
    top_lab_test_by_patient = labs_agg.merge(
        labs_agg.loc[
            labs_agg.groupby("IDRecord").lab_count.idxmax(), ["IDRecord", "Codigo"]
        ]
    ).rename(columns={"Codigo": "top_lab_code", "lab_count": "top_lab_count"})

    # Get the total number of labs performed on each patient
    total_lab_count_by_patient = (
        labs_agg.groupby(["IDRecord"])
        .aggregate({"lab_count": "sum"})
        .rename(columns={"lab_count": "total_lab_count"})
    )

    # Merge the data
    preprocessed_labs = top_lab_test_by_patient.merge(
        total_lab_count_by_patient, on="IDRecord"
    )

    # -----
    # Patient's date for first and last exam
    merged_lab_date_calc = df.copy()[["IDRecord", "Fecha"]]
    merged_lab_date_calc["Fecha"] = pd.to_datetime(merged_lab_date_calc["Fecha"])
    lab_date_first = merged_lab_date_calc.groupby(["IDRecord"]).first().reset_index()
    lab_date_first = lab_date_first.rename(columns={"Fecha": "first_lab_date"})

    lab_date_last = merged_lab_date_calc.groupby(["IDRecord"]).last().reset_index()
    lab_date_last = lab_date_last.rename(columns={"Fecha": "last_lab_date"})

    lab_dates = lab_date_first.merge(lab_date_last, on="IDRecord")
    lab_dates["date_diff_first_last"] = abs(
        (lab_dates["last_lab_date"] - lab_dates["first_lab_date"]).dt.days
    )

    # Convert them to Epoch seconds so we can feed them to the model
    lab_dates["first_lab_date"] = lab_dates["first_lab_date"].astype(int)
    lab_dates["last_lab_date"] = lab_dates["last_lab_date"].astype(int)

    # Merge the data
    preprocessed_labs = preprocessed_labs.merge(
        lab_dates,
        on="IDRecord",
        how="left",
    )

    # -----
    # Lab max and avg date difference
    # Get the average difference
    merged_lab_date_calc = df.copy().sort_values(by=["IDRecord", "Fecha"]).copy()
    merged_lab_date_calc["Fecha"] = pd.to_datetime(merged_lab_date_calc["Fecha"])
    merged_lab_date_calc["date_diff"] = (
        merged_lab_date_calc[["IDRecord", "Fecha"]].groupby("IDRecord").diff()
    )
    # Aggregate the data
    merged_lab_datediff = (
        merged_lab_date_calc[["IDRecord", "date_diff"]]
        .groupby("IDRecord")
        .agg([np.nanmean, np.nanmax])
    )
    # Remove the column multiindex
    merged_lab_datediff.columns = [
        "_".join(col) for col in merged_lab_datediff.columns.values
    ]

    # Rename the variables
    merged_lab_datediff = merged_lab_datediff.rename(
        columns={
            "date_diff_nanmean": "date_diff_mean",
            "date_diff_nanmax": "date_diff_max",
        }
    )
    # Convert the values from a date format to number of days
    merged_lab_datediff["date_diff_max"] = merged_lab_datediff["date_diff_max"].dt.days
    merged_lab_datediff["date_diff_mean"] = merged_lab_datediff[
        "date_diff_mean"
    ].dt.days
    # Merge the data together
    preprocessed_labs = preprocessed_labs.merge(
        merged_lab_datediff[["date_diff_mean", "date_diff_max"]].reset_index(),
        how="left",
        on="IDRecord",
    )

    # -----
    # Keyword-related lab name lookup using the disease_tests list

    lab = df.copy()
    df_idrecord = lab.IDRecord.drop_duplicates().to_frame("IDRecord")
    for test in disease_tests:
        df_test_count = (
            lab.loc[
                lab.Nombre.str.contains(test[0], case=False, regex=True),
                ["IDRecord"],
            ]
            .value_counts()
            .to_frame(f"{test[1]}_count")
        )
        df_test_max = (
            lab.loc[
                lab.Nombre.str.contains(test[0], case=False, regex=True),
                ["IDRecord", "Valor"],
            ]
            .groupby("IDRecord")
            .max()
            .reset_index()
            .rename(columns={"Valor": f"{test[1]}_max"})
        )  # .value_counts().to_frame()
        df_idrecord = df_idrecord.merge(df_test_count, on="IDRecord", how="left").merge(
            df_test_max, on="IDRecord", how="left"
        )

    preprocessed_labs = preprocessed_labs.drop(
        columns=df_idrecord.drop(columns=["IDRecord"]).columns, errors="ignore"
    ).merge(df_idrecord, on="IDRecord", how="left")
    for column in df_idrecord.drop(columns=["IDRecord"]).columns:
        preprocessed_labs[column] = preprocessed_labs[column].fillna(0)
    return preprocessed_labs


def clean_labs(df_lab: pd.DataFrame) -> pd.DataFrame:
    lab = df_lab.copy()
    lab["Valor"] = pd.to_numeric(lab.Valor, errors="coerce")
    lab["IDRecord"] = pd.to_numeric(lab.IDRecord, errors="coerce")
    lab["fecha"] = pd.to_datetime(lab["Fecha"])
    lab = lab.dropna(subset=["IDRecord"])

    return lab


def clean_sociodemograficos(df: pd.DataFrame) -> pd.DataFrame:
    demografico = df.copy()
    demografico["IDRecord"] = pd.to_numeric(demografico["IDRecord"], errors="coerce")
    return demografico


def clean_notas(df: pd.DataFrame, apply_lemmatization=True) -> pd.DataFrame:
    notas = df.copy()
    # Dropping null values from IDRecord
    notas.dropna(subset=["IDRecord"], inplace=True)

    # Drop samples where both Code and Name are null
    if "Código" in notas.columns and "Nombre" in notas.columns:
        notas.dropna(how="all", subset=["Código", "Nombre"], inplace=True)

    # Drop bad data form IDRecord
    notas["IDRecord"] = pd.to_numeric(notas["IDRecord"], errors="coerce")
    notas.dropna(subset=["IDRecord"], inplace=True)

    # Remove bad data from Nombre
    if "Nombre" in notas.columns:
        index = notas[notas.Nombre == "Confirmado Repetido"].index
        notas.loc[index, ["Nombre", "Tipo", "Plan"]] = notas.loc[
            index, ["Código", "Nombre", "Tipo"]
        ].to_numpy()
        notas.loc[index, "Código"] = notas[
            notas["Nombre"] == notas.loc[index, "Código"].iat[0]
        ]["Código"].iloc[0]

    # Remove stop words from Plan
    # notas["Plan"] = notas.Plan.astype(str).apply(lambda x: remove_stop_words(x))

    if apply_lemmatization:
        notas["Plan"] = notas["Plan"].astype(str).apply(lemmatize, remove_stopwords=True, remove_punctuation=True)

    # Remove accents from Plan
    notas["Plan"] = notas.Plan.astype(str).apply(strip_accents)

    return notas


def clean_and_preprocess_datasets(data_dict: dict) -> pd.DataFrame:
    if {"df_laboratorios", "df_notas", "df_sociodemograficos"} - set(data_dict.keys()):
        raise ValueError(
            f"data_dict is missing {set(['df_laboratorios', 'df_notas', 'df_sociodemograficos']) - set(data_dict.keys())}"
        )

    df_socio = data_dict["df_sociodemograficos"].copy()
    df_labs = data_dict["df_laboratorios"].copy()
    df_notes = data_dict["df_notas"].copy()

    # Clean the datasets
    df_socio = clean_sociodemograficos(df_socio)
    df_labs = clean_labs(df_labs)
    df_notes = clean_notas(df_notes)

    # Preprocess the datasets, add engineered features
    df_merge = df_socio.merge(df_notes, how="inner", on="IDRecord")

    # Perform word count feature engineering
    df_merge = word_count_feat_engineering(df_merge)

    # Preprocess the lab data and merge it with the sociodemographic data
    df_merge = merge_labs_notas(df_labs, df_merge)

    return df_merge


def preprocess_json(data_dict: dict) -> dict:
    data_dict["IDRecord"] = 0
    df_socio_cols = [
        "IDRecord",
        "Edad",
        "Genero",
        "GrupoEtnico",
        "AreaResidencial",
        "EstadoCivil",
        "TSangre",
    ]
    df_labs_cols = ["IDRecord", "Codigo", "Nombre", "Fecha", "Valor"]
    df_notas_cols = ["IDRecord", "Código", "Nombre", "Tipo", "Plan"]

    socio_dict = {
        key: data_dict[key] for key in data_dict.keys() if key in df_socio_cols
    }
    df_socio = pd.DataFrame(socio_dict, index=[0])

    labs_dict = data_dict["Examenes"]
    labs_dict["IDRecord"] = 0
    df_labs = pd.DataFrame.from_dict(labs_dict)

    notas_dict = {
        key: data_dict[key] for key in data_dict.keys() if key in df_notas_cols
    }
    df_notas = pd.DataFrame(notas_dict, index=[0])

    df_dict = {
        "df_sociodemograficos": df_socio,
        "df_laboratorios": df_labs,
        "df_notas": df_notas,
    }
    return df_dict
