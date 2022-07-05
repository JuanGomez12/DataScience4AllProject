import json
import re
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Optional

import nltk
import numpy as np
import pandas as pd
import spacy
from nltk.corpus import stopwords

SPACY_MODEL_DEFAULT = "es_core_news_sm"
# SPACY_MODEL_DEFAULT = "es_core_news_md"
# SPACY_MODEL_DEFAULT = "es_core_news_lg"
# SPACY_MODEL_DEFAULT = 'es_dep_news_trf'

# Load the default Spacy model
try:
    default_nlp = spacy.load(SPACY_MODEL_DEFAULT)
except OSError:
    print(
        f"Spacy model {SPACY_MODEL_DEFAULT} not found,",
        "downloading from the internet,",
        "this might take some time",
    )
    from spacy.cli import download

    download(SPACY_MODEL_DEFAULT)
    default_nlp = spacy.load(SPACY_MODEL_DEFAULT)

nltk.download("stopwords")


def lemmatize(doc:str, nlp=default_nlp, remove_punctuation:bool=True, remove_stopwords:bool=True)->str:
    """Lemmatizes a string using the selected nlp model

    Args:
        doc (str): Document to lemmatize.
        nlp (_type_, optional): _description_. Defaults to default_nlp model.
        remove_punctuation (bool, optional): If true, removes punctuation from
            the document. Defaults to True.
        remove_stopwords (bool, optional): If true, removes stopwords from the
            document. Defaults to True.

    Returns:
        str: Lemmatized string
    """
    tokens = nlp(doc)

    word_list = [token for token in tokens]
    if remove_punctuation:
        word_list = [token for token in word_list if not token.is_punct]
    if remove_stopwords:
        word_list = [token for token in word_list if not token.is_stop]

    word_list = [token.lemma_ for token in word_list]

    lemmatized_string = " ".join(word_list)

    return lemmatized_string


def remove_stop_words(string_data: str, extra_stop_words: list = []) -> str:
    """Removes stopwords from the string. Case insensitive.

    Args:
        string_data (str): String from which to remove the stopwords.
        extra_stop_words (list, optional): Extra words to remove from the
            string. Defaults to [].

    Returns:
        str: String with the stopwords removed.
    """
    stop_words = stopwords.words("spanish")
    stop_words.extend(extra_stop_words)
    string_data = re.sub(
        r"\b(" + r"|".join(stop_words) + r")\b\s*", "", string_data, flags=re.IGNORECASE
    )
    return string_data


def remove_characters(string_data: str, character_list: list) -> str:
    """Removes any characters passed in the list from the passed string.

    Args:
        string_data (str): String from which to remove the characters.
        character_list (list): List of characters to remove from the string.

    Returns:
        str: String, with the characters removed.
    """
    for character in character_list:
        string_data = string_data.replace(character, "")
    return string_data


def convert_to_long_string(series_data: pd.Series) -> str:
    """Converts the passed series of strings into one long string.
    Additionally, removes stop words and special characters like dashes and
    commas.

    Args:
        series_data (pd.Series): Pandas series from which to extract the strings.

    Returns:
        str: Concatenation of the strings from the pandas series, after cleaning.
    """
    regex_compile = re.compile(r"[^A-Za-z ]")
    string_data = (
        series_data.str.replace(regex_compile, "", regex=True).str.cat(sep=" ").lower()
    )

    string_data = remove_stop_words(string_data)
    string_data = remove_characters(string_data, ["-", ","])
    string_data = re.sub(" {2,}", " ", string_data)
    return string_data


def strip_accents(accented_string: str) -> str:
    """Removes accents, like Á or ó, from the passed string.

    Args:
        accented_string (str): String containing accents.

    Returns:
        str: String without accents.
    """
    # Let's guarantee it's a string
    accented_string = str(accented_string)
    clean_string = (
        unicodedata.normalize("NFD", accented_string)
        .encode("ascii", "ignore")
        .decode("utf-8")
    )
    return clean_string


def find_top_k_words(string_value: str, k: int = 5) -> list:
    """Finds the k most repeated words in the string.

    Args:
        string_value (str): String from which to obtain the words.
        k (int, optional): Number of words to return. Defaults to 5.

    Returns:
        list: _description_
    """
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
    """Merges ICD-10 code A529 into A539, and A510, A511, and A514 into A51. 
    Additionally, it merges the names of the classes so they are consistent.

    Args:
        df (pd.DataFrame): Pandas dataframe containing a column called 'Código'
            with the ICD10 classes, and a column 'Nombre' with the name of the
            diseases.

    Returns:
        pd.DataFrame: Dataframe with the Merged classes and names.
    """
    notas = df.copy()
    notas.loc[notas.Código == "A529", "Código"] = "A539"
    notas.loc[notas.Código == "A539", "Nombre"] = "SIFILIS, NO ESPECIFICADA"
    notas.loc[notas.Código == "A510", "Código"] = "A51"
    notas.loc[notas.Código == "A511", "Código"] = "A51"
    notas.loc[notas.Código == "A514", "Código"] = "A51"
    notas.loc[notas.Código == "A51", "Nombre"] = "SIFILIS PRECOZ"
    return notas


def word_count_feat_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """Performs the word-count feature engineering on the passed dataframe.
    Expects that the dataframe contains a Plan feature where it will count for
    the specific words.

    Args:
        df (pd.DataFrame): Dataframe containing the Plan feature from which to
            extract information.

    Returns:
        pd.DataFrame: Same input dataframe, with the extra features.
    """
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
    """Preprocesses and merges the lab dataframe to the notas dataframe.
    Converts the time-series format lab dataframe into a one-sample-per row
    format like the notas dataframe, by extracting relevant information from
    the lab dataframe.

    Args:
        df_lab (pd.DataFrame): Laboratory information dataframe
        df_notas (pd.DataFrame): Notas information dataframe.

    Returns:
        pd.DataFrame: Merged dataframe
    """
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
        df_merged["top_lab_max_value"] = df_merged.top_lab_max_value.fillna(0)
        df_merged["top_lab_count"] = df_merged.top_lab_count.fillna("NA")
        df_merged["total_lab_count"] = df_merged.total_lab_count.fillna(0)
    return df_merged


def disease_tests_list()->list:
    """Creates a list with the group of sets of the regex keywords to search for
    in the lab info, and the aggregation name under which to aggregate the
    keywords.

    Returns:
        list: List of sets with the regex keywords and the aggregation name.
    """
    disease_tests = [
        ("hepatitis|hepat|glutamic|bilirrub", "liver_damage"),
        ("hemo|hema", "hematic_info"),
        ("bacilo|bacter|colora", "bacterias"),
        ("tiroi|protro|tirox", "hormones"),
        ("herpes|tuberc", "other_diseases"),
        ("album|creat|ureico|urico|uro|orina", "kidney_damage"),
        ("colest|trigli|plaqu|protrom|trombo", "heart_damage"),
        ("calcio|fofs|pot", "minerals"),
    ]
    # This line will look for tests relating linfo
    # (as in linfocitos/lymphocytes), CD3, CD4, and CD8
    disease_tests.append(
        ("leuco|linfo|cd3|cd4|cd8|anticuerpo|antigen|neutrof", "white_cells")
    )
    # This line will look for tests relating HIV and (immuno)deficiency
    disease_tests.append(("deficiencia|vih|immuno", "vih"))
    # Diabetes related keywords
    disease_tests.append(("ayun|gluco|glico", "diabetes_tests"))
    # Syphilis related keywords
    disease_tests.append(("trepo|anal|virus|viral", "syphilis_tests"))
    return disease_tests


def preprocess_labs(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocesses the labs dataframe

    Args:
        df (pd.DataFrame): Dataframe containing the lab information as it is 
            in the dataset.

    Returns:
        pd.DataFrame: Preprocessed lab data, with each row representing one
        patient worth of data instead of the time series.
    """
    lab = df.copy()

    disease_tests = disease_tests_list()

    # ------
    # Lab count and top lab code
    # Aggregate the data
    lab = lab.groupby(["IDRecord", "Nombre"])
    labs_agg = lab.aggregate({"Valor": [np.nanmean, np.nanmax], "Nombre": "count"})
    labs_agg.columns = ["_".join(col) for col in labs_agg.columns.values]
    labs_agg = labs_agg.rename(
        columns={
            "Nombre_count": "lab_count",
            "Valor_nanmean": "top_lab_avg_value",
            "Valor_nanmax": "top_lab_max_value",
        }
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

    # Merge the data
    preprocessed_labs = top_lab_test_by_patient.merge(
        total_lab_count_by_patient, on="IDRecord"
    )

    # -----
    # Patient's date for first and last exam
    merged_lab_date_calc = df.copy()[["IDRecord", "Fecha"]]
    merged_lab_date_calc["Fecha"] = pd.to_datetime(merged_lab_date_calc["Fecha"], errors='coerce')
    merged_lab_date_calc = merged_lab_date_calc.dropna()
    if len(merged_lab_date_calc["Fecha"])>0:
        lab_date_first = merged_lab_date_calc.groupby(["IDRecord"]).first().reset_index()
        lab_date_first = lab_date_first.rename(columns={"Fecha": "first_lab_date"})

        lab_date_last = merged_lab_date_calc.groupby(["IDRecord"]).last().reset_index()
        lab_date_last = lab_date_last.rename(columns={"Fecha": "last_lab_date"})

        lab_dates = lab_date_first.merge(lab_date_last, on="IDRecord")
        lab_dates["date_diff_first_last"] = abs(
            (lab_dates["last_lab_date"] - lab_dates["first_lab_date"]).dt.days
        )

        # Convert them to Epoch seconds so we can feed them to the model
        lab_dates["first_lab_date"] = lab_dates["first_lab_date"].astype('int64')//1e9
        lab_dates["last_lab_date"] = lab_dates["last_lab_date"].astype('int64')//1e9
    else:
        lab_dates = pd.DataFrame(columns=['IDRecord'], index=[-1])
        lab_dates["first_lab_date"] = 0
        lab_dates["last_lab_date"] = 0
        lab_dates["date_diff_first_last"] = 0


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
    merged_lab_date_calc["Fecha"] = pd.to_datetime(merged_lab_date_calc["Fecha"], errors='coerce')
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


def clean_test_names(test_names: pd.Series) -> pd.Series:
    """
    Input: Series of test names
    Output: Series of standarized test names
    """
    test_names = test_names.fillna('NaN')
    cleaned = (
        test_names.str.lower()
        .str.strip()
        .apply(lambda x: strip_accents(x))
        .str.replace("[", "(", regex=True)
        .str.replace("]", ")", regex=True)
        .str.replace(r"\s(\.+)", "", regex=True)
    )

    return cleaned


def clean_labs(df_lab: pd.DataFrame, name_aggregation_dict:Optional[dict]=None) -> pd.DataFrame:
    """Cleans the laboratory dataframe
    Removes bad names and converting valor and IDRecord to numeric, and fecha to
    datetime. Also drops NaN values from IDRecord.

    Args:
        df_lab (pd.DataFrame): Laboratory dataframe
        name_aggregation_dict (Optional[dict], optional): Dictionary contianing
            the names on which to replace the names found on Nombre in the lab
            dataset, in order to facilitate aggregation. If None, this step is
            skipped. Defaults to None.

    Returns:
        pd.DataFrame: Cleaned laboratory dataframe.
    """
    lab = df_lab.copy()
    if 'Nombre' in lab.columns:
        lab["Nombre"] = clean_test_names(lab.Nombre)
        if name_aggregation_dict is not None:
            lab["Nombre"] = lab.Nombre.replace(name_aggregation_dict)
        else:
            print(
                "lab_test_name_aggregation dictionary not passed,",
                "skipping dictionary aggregation step",
            )
    lab["Valor"] = pd.to_numeric(lab.Valor, errors="coerce")
    lab["IDRecord"] = pd.to_numeric(lab.IDRecord, errors="coerce")
    lab["fecha"] = pd.to_datetime(lab["Fecha"], errors="coerce")
    lab = lab.dropna(subset=["IDRecord"])

    return lab


def clean_sociodemograficos(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans the sociodemografico dataset.
    Converts IDRecord and Edad to numeric.

    Args:
        df (pd.DataFrame): Dataframe containing the sociodemografico information.

    Returns:
        pd.DataFrame: Cleaned dataframe.
    """
    demografico = df.copy()
    demografico["IDRecord"] = pd.to_numeric(demografico["IDRecord"], errors="coerce")
    demografico["Edad"] = pd.to_numeric(demografico["Edad"], errors="coerce")
    return demografico


def clean_notas(df: pd.DataFrame, apply_lemmatization: bool = False) -> pd.DataFrame:
    """Cleans the notas dataframe.
    Drops null data, removes accents from Plan, and can also apply lemmatization
    to it.

    Args:
        df (pd.DataFrame): Notas dataframe
        apply_lemmatization (bool, optional): If true, applies lemmatization to
            Plan. Defaults to False.

    Returns:
        pd.DataFrame: Clean dataset.
    """
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
        notas["Plan"] = (
            notas["Plan"]
            .astype(str)
            .apply(lemmatize, remove_stopwords=True, remove_punctuation=True)
        )

    # Remove accents from Plan
    notas["Plan"] = notas.Plan.astype(str).apply(strip_accents)

    return notas


def clean_and_preprocess_datasets(data_dict: dict) -> pd.DataFrame:
    """Cleans and preprocesses the three datasets.
    Returns one preprocessed dataset where each row represents one sample of
    data, with the engineered features and lab information.
    

    Args:
        data_dict (dict): Dictionary containing three dataframes, each under its
            own key: df_sociodemograficos, df_laboratorios, and df_notas.

    Raises:
        ValueError: If any of the three datasets is missing.

    Returns:
        pd.DataFrame: Merged and cleaned dataframe with engineered features.
    """
    set_comparison = {"df_laboratorios", "df_notas", "df_sociodemograficos"} - set(
        data_dict.keys()
    )
    if set_comparison:
        raise ValueError(f"data_dict is missing {set_comparison}")

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
    """Receives a dictionary formatted as a JSON file and preprocesses so it 
    matches what the prediction_pipeline is expecting.

    Args:
        data_dict (dict): _description_

    Returns:
        dict: Dictionary containing the sample as three separate
        datasets/dataframes, the same way the input data is expected to look
        for the prediction_pipeline.
    """
    # Add an IDRecord on which to merge all the data
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
    df_notas_cols = ["IDRecord", "Tipo", "Plan"]

    missing_cols = [col for col in df_socio_cols+df_notas_cols if col not in data_dict.keys()]

    # Add NA for any missing keys in sociodemografico
    socio_dict = {}
    for key in df_socio_cols:
        socio_dict[key] = data_dict.get(key, 'NA')
    df_socio = pd.DataFrame(socio_dict, index=[0])

    # Take out the examenes dictionary if it's inside of a list
    if isinstance(data_dict["Examenes"], list):
        labs_dict = data_dict["Examenes"][0]
    elif isinstance(data_dict["Examenes"], dict):
        labs_dict = data_dict["Examenes"]
    
    labs_dict["IDRecord"] = 0
    # Add NA for any missing keys in laboratorio
    for key in df_labs_cols:
        if key not in labs_dict:
            labs_dict[key]= {'0': 'NA'}
    df_labs = pd.DataFrame.from_dict(labs_dict)

    # Add NA for any missing keys in notas
    notas_dict = {}
    for key in df_notas_cols:
        notas_dict[key] = data_dict.get(key, 'NA')
    df_notas = pd.DataFrame(notas_dict, index=[0])

    df_dict = {
        "df_sociodemograficos": df_socio,
        "df_laboratorios": df_labs,
        "df_notas": df_notas,
    }
    return df_dict
