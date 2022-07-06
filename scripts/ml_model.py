import unicodedata
from typing import Any, Union

import nltk
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.feature_selection import SelectFromModel, VarianceThreshold
from sklearn.impute import KNNImputer, SimpleImputer
from sklearn.linear_model import ElasticNet, Lasso, Ridge
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    mean_squared_error,
    r2_score,
    roc_auc_score,
)
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import (
    MinMaxScaler,
    Normalizer,
    OneHotEncoder,
    RobustScaler,
    StandardScaler,
)

from utils.text_preprocessor import TextPreprocessor

# Download the NLTK stopwords
nltk.download("stopwords")


def strip_accents(accented_string: str) -> str:
    """Strips the accents of letters from a document, e.g. converts Á to A.

    Args:
        accented_string (str): String with accents

    Returns:
        str: String with letters converted to their accent-less version.
    """
    clean_string = (
        unicodedata.normalize("NFD", accented_string)
        .encode("ascii", "ignore")
        .decode("utf-8")
    )
    return clean_string


spanish_stop_words = [
    strip_accents(word) for word in nltk.corpus.stopwords.words("spanish")
]


class PredictionPipeline:
    def __init__(self, estimator, preprocessing_fn=None, label_encoder=None):
        self.preprocessing_fn = preprocessing_fn
        self.label_encoder = label_encoder
        self.estimator = estimator

    def preprocess_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Preprocesses the data according to the preprocessing function set
        when initializing the function.

        Args:
            data (pd.DataFrame): Datafrmae with the data to preprocess

        Returns:
            pd.DataFrame: Dataframe with the preprocessed data.
        """
        if self.preprocessing_fn is not None:
            return self.preprocessing_fn(data)
        else:
            return data

    def predict(
        self, X: pd.DataFrame, preprocess_data: bool = True, **kwargs
    ) -> np.array:
        """Predicts labels for the samples passed into the function.

        Args:
            X (pd.DataFrame): Dataframe containing the data to predict on.
            preprocess_data (bool, optional): If True, the data will be
                preprocessed using preprocess_data before trying to predict on
                it. Defaults to True.

        Returns:
            np.array: Array containing the labels for the predicted class of
            each of the samples.
        """
        if preprocess_data:
            preprocessed_X = self.preprocess_data(X)
        else:
            preprocessed_X = X
        prediction = self.estimator.predict(preprocessed_X, **kwargs)
        if self.label_encoder is not None:
            prediction = self.label_encoder.inverse_transform(prediction)
        return prediction


class PipelineManager:
    def __init__(
        self,
        estimator: str,
        use_feature_selector: bool = True,
        use_text_preprocessor: bool = False,
    ):
        """_summary_

        Args:
            estimator (str): Type of estimator to use. Either regressor or
                classifier
            use_feature_selector (bool, optional): If true, adds a feature
                selection step to the pipeline. Defaults to True.
            use_text_preprocessor (bool, optional): If true, adds a text
                preprocessing transformer to the pipeline. Defaults to False.

        Raises:
            ValueError: _description_
        """
        # estimator should be regressor or classifier
        if estimator.lower() not in ["regressor", "classifier"]:
            raise ValueError(
                f"Estimator should be regressor or classifier, got: {estimator}"
            )
        self.estimator = estimator.lower()
        self.pipeline = None
        self.cat_features = []
        self.num_features = []
        self.text_features = None
        self.param_grids = []
        self.best_estimator = None
        self.use_feature_selector = use_feature_selector
        self.use_text_preprocessor = use_text_preprocessor

    def set_categorical_features(self, cat_features: list):
        """Sets the categorical features that can be used by the ML model.

        Args:
            cat_features (list): List of categorical features to be passed to
            the model.
        """
        self.cat_features = cat_features

    def set_numerical_features(self, num_features: list):
        """Sets the numerical features that can be used by the ML model.

        Args:
            num_features (list): List of numerical features to be passed to the
            model.
        """
        self.num_features = num_features

    def set_text_feature(self, text_features: str):
        """Sets the text feature that will be used by the ML model

        Args:
            text_features (str): Name of the feature contianing the corpus.
        """
        self.text_features = text_features

    def set_basic_pipeline(self):
        """Defines the pipeline that will be used as the base on which to build
        the rest of the pipeline parameters.

        Raises:
            ValueError: If the estimator, when the class was initialized, was
            not regressor nor classifier.
        """
        if self.estimator == "regressor":
            base_estimator = RandomForestRegressor()
        elif self.estimator == "classifier":
            base_estimator = RandomForestClassifier()
        else:
            raise ValueError(
                f"Estimator should be regressor or classifier, got: {self.estimator}"
            )

        numeric_preprocessor = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(missing_values=np.nan, strategy="mean"),
                ),
                ("scaler", StandardScaler()),
            ]
        )

        categorical_preprocessor = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(fill_value="missing", strategy="constant"),
                ),
                ("encoder", OneHotEncoder(handle_unknown="ignore")),
            ]
        )

        # Build text preprocessor steps, with optional extra TextPreprocessor
        text_steps = []
        if self.use_text_preprocessor:
            text_steps.append(("normalizer", TextPreprocessor(n_jobs=-1)))
        text_steps.append(
            (
                "vectorizer",
                CountVectorizer(strip_accents="unicode", stop_words=spanish_stop_words),
            )
        )
        text_steps.append(("tfidf", TfidfTransformer()))
        text_preprocessor = Pipeline(steps=text_steps)

        preprocessor_list = []
        if self.cat_features:
            # Add categorical features preprocessor
            preprocessor_list.append(
                ("categorical", categorical_preprocessor, self.cat_features)
            )
        if self.num_features:
            # Add numerical features preprocessor
            preprocessor_list.append(
                ("numerical", numeric_preprocessor, self.num_features)
            )
        if self.text_features is not None:
            # Add the textual feature preprocessor
            preprocessor_list.append(("text", text_preprocessor, self.text_features))
        preprocessor = ColumnTransformer(preprocessor_list)

        pipeline_list = []
        pipeline_list.append(("preprocessor", preprocessor))
        if self.use_feature_selector:
            pipeline_list.append(
                ("feature_selector", SelectFromModel(RandomForestRegressor()))
            )
        pipeline_list.append(("estimator", base_estimator))

        self.pipeline = Pipeline(pipeline_list)

    def get_categorical_features(self) ->list:
        """Returns the categorical features of the pipeline

        Returns:
            list: Categorical features.
        """
        return self.cat_features.copy()

    def get_numerical_features(self)->list:
        """Returns the numerical features of the pipeline

        Returns:
            list: numerical features.
        """
        return self.num_features.copy()

    def get_text_features(self)->list:
        """Returns the text feature of the pipeline

        Returns:
            list: Text feature.
        """
        return [] if self.text_features is None else [self.text_features]

    def get_features(self)->list:
        """Returns the features of the pipeline

        Returns:
            list: List containing all the features in the pipeline.
        """
        features_list = (
            self.get_categorical_features()
            + self.get_numerical_features()
            + self.get_text_features()
        )
        return features_list

    def get_default_param_grid(self) -> dict:
        """Creates the default parameter grid for the pipeline manager.

        This default parameter grid contains the base hyperparameters to tune.

        Returns:
            dict: Dictionary containing the different named steps as the keys
            and their respective tune values/methods.
        """
        param_grid = {}
        if self.cat_features:
            # Add categorical parameters
            categorical_params = {
                "preprocessor__categorical__imputer": [
                    SimpleImputer(missing_values=np.nan, strategy="most_frequent"),
                    # KNNImputer(n_neighbors=1),
                ],
            }
            param_grid.update(categorical_params)

        if self.num_features:
            # Add numerical parameters
            numerical_params = {
                "preprocessor__numerical__imputer": [
                    SimpleImputer(missing_values=np.nan, strategy="mean"),
                    SimpleImputer(missing_values=np.nan, strategy="median"),
                    SimpleImputer(missing_values=np.nan, strategy="most_frequent"),
                    KNNImputer(),
                ],
                "preprocessor__numerical__scaler": [
                    StandardScaler(),
                    RobustScaler(),
                    MinMaxScaler(),
                    Normalizer(),
                    # PowerTransformer(),
                ],
            }
            param_grid.update(numerical_params)

        if self.text_features is not None:
            # Add textual parameters
            text_param = {
                "preprocessor__text__vectorizer": [
                    CountVectorizer(
                        strip_accents="unicode",
                        ngram_range=(1, 1),
                        stop_words=spanish_stop_words,
                    ),
                    CountVectorizer(
                        strip_accents="unicode",
                        stop_words=spanish_stop_words,
                        ngram_range=(1, 2),
                    ),
                    CountVectorizer(
                        strip_accents="unicode",
                        stop_words=spanish_stop_words,
                        ngram_range=(1, 3),
                    ),
                    CountVectorizer(
                        strip_accents="unicode",
                        stop_words=spanish_stop_words,
                        ngram_range=(2, 2),
                    ),
                    CountVectorizer(
                        strip_accents="unicode",
                        stop_words=spanish_stop_words,
                        ngram_range=(2, 3),
                    ),
                    CountVectorizer(
                        strip_accents="unicode",
                        stop_words=spanish_stop_words,
                        ngram_range=(3, 3),
                    ),
                    CountVectorizer(
                        strip_accents="unicode",
                        stop_words=spanish_stop_words,
                        ngram_range=(4, 4),
                    ),
                ],
                "preprocessor__text__tfidf": [
                    TfidfTransformer(norm="l2", sublinear_tf=True),
                    TfidfTransformer(norm="l2", sublinear_tf=False),
                    TfidfTransformer(norm="l1", sublinear_tf=False),
                    TfidfTransformer(norm="l1", sublinear_tf=True),
                ],
            }
            param_grid.update(text_param)

        if self.use_feature_selector:
            feature_selector_params = {
                "feature_selector": [
                    # SelectFromModel(Lasso()),
                    SelectFromModel(ElasticNet()),
                    SelectFromModel(Ridge()),
                    VarianceThreshold(),
                ],
            }
            param_grid.update(feature_selector_params)

        return param_grid

    @staticmethod
    def convert_dict_names(param_grid: dict) -> dict:
        """Converts the dictionary keys into the named_steps format

        Converts the keys of the passed dictionary into the named_steps format,
        assuming that any key in the dictionary that does not contain a double
        underscore ('__') is a parameter to be passed to the estimator. If the
        key already contains a double score, it is left untouched assuming it
        already is in the named steps format required for hyperparameter tuning.

        Args:
            param_grid (dict): Dictionary with the extra hyperparameters to add
            to the default hyperparameter grid.

        Returns:
            dict: A copy of the modified keys in the named steps format.
        """
        return {
            f"estimator__{key}": value
            for key, value in param_grid.items()
            if "__" not in key
        }

    def add_estimator(self, estimator: BaseEstimator, param_grid: dict):
        """Adds the estimator and its parameter grid to the list of estimators.

        The keys of the param_grid dictionary will be converted into the
        named_steps format, assuming that any key in the dictionary that does
        not contain a double underscore ('__') is a parameter to be passed to
        the estimator. If the key already contains a double score, it is left
        untouched assuming it already is in the named steps format required for
        hyperparameter tuning.

        Args:
            estimator (BaseEstimator): Estimator to be used as a
                classifier/regressor.
            param_grid (dict): Hyperparameter dictionary.
        """
        param_dict = {}
        param_dict.update(self.get_default_param_grid())
        param_dict.update(self.convert_dict_names(param_grid))
        param_dict.update({"estimator": [estimator]})
        self.param_grids.append(param_dict)

    def find_best_model(
        self, X: Any, y: Any, cv: int = 5, n_jobs: int = -1, n_iter: int = -1, **kwargs
    ) -> BaseEstimator:
        """Finds the best estimator from the previousl passed hyperparameter space.

        This function will run a full GridSearch or a RandomizedSearch, based on
        the n_iter parameter, to find the best performing estimator from the
        default hyperparameter space it has and any extra parameters passed when
        adding estimators.

        Args:
            X (Any): {array-like, sparse matrix} of shape
                (n_samples, n_features). Data to be used for training.
            y (Any): array-like of shape (n_samples,). Data containing the
                target values/classes.
            cv (int, optional): Number of folds for the K-fold cross validation.
                Defaults to 5.
            n_jobs (int, optional): Number of workers to use for parallelization.
                A negative value indicates an all but #, e.g. -1 means all
                processors, -2 means all but 1 processor, etc. Defaults to -1.
            n_iter (int, optional): Number of combinations to try for the
                hyperparameter tuning. A value 0f -1 indicates that ALL of the
                hyperparameter feature space will be tested. Defaults to -1.

        Returns:
            BaseEstimator: Best pipeline with the tuned hyperparameters.
        """
        if self.pipeline is None:
            self.set_basic_pipeline()
        param_grids = self.param_grids

        if kwargs.get("fit_params"):
            fit_params = kwargs.get("fit_params")
            del kwargs["fit_params"]
        else:
            fit_params = {}

        if n_iter == -1:
            # Do a full search of the feature space
            self.hyperparameter_tuner = GridSearchCV(
                self.pipeline,
                param_grids,
                cv=cv,
                n_jobs=n_jobs,
                **kwargs,
            )
        else:
            # Do a randomized search of the feature space, looking for n_iter combinations
            self.hyperparameter_tuner = RandomizedSearchCV(
                self.pipeline,
                param_grids,
                n_iter=n_iter,
                cv=cv,
                n_jobs=n_jobs,
                **kwargs,
            )

        self.hyperparameter_tuner.fit(X, y, **fit_params)
        self.cv_results = pd.DataFrame(self.hyperparameter_tuner.cv_results_)

        self.best_estimator = self.hyperparameter_tuner.best_estimator_
        return self.best_estimator

    def score(
        self, X: Any, y_true: Any, as_frame: bool = True
    ) -> Union[dict, pd.DataFrame]:
        """Runs different metrics through the model to test its performance.

        The metrics are defined based on if the model is a classifier or a
        regressor. returns a DataFrame if as_frame is True, else it returns a
        dictionary.

        Args:
            X (Any): {array-like, sparse matrix} of shape
                (n_samples, n_features). Data to be used for predicting results.
            y_true (Any): array-like of shape (n_samples,). Response data for
                the passed X.
            as_frame (bool, optional): If True, the return of the function will
                be a DataFrame instead of a dictionary. Defaults to True.

        Raises:
            ValueError: If the pipeline has not been fitted, i.e. if
                find_best_model() has not been run.

        Returns:
            Union[dict, pd.DataFrame]: Dictionary or DataFrame containing the
                results of running the different metrics.
        """

        if self.best_estimator is None:
            raise ValueError("Pipeline has not been fitted")
        score = {}
        y_score = self.best_estimator.predict(X)
        if self.estimator == "classifier":
            try:
                score["ROC_AUC"] = roc_auc_score(
                    y_true, self.best_estimator.predict_proba(X), multi_class="ovo"
                )
            except:
                score["ROC_AUC"] = "NA"
            score["accuracy"] = accuracy_score(y_true, y_score)
            score["balanced_accuracy"] = balanced_accuracy_score(y_true, y_score)
            for measurement in ["micro", "macro", "weighted"]:
                score[f"{measurement}_f1_score"] = f1_score(
                    y_true, y_score, average=measurement
                )
            try:
                score["confusion_matrix"] = confusion_matrix(y_true, y_score)
            except:
                score["confusion_matrix"] = "NA"
            try:
                score["confusion_matrix_normalized"] = confusion_matrix(
                    y_true, y_score, normalize="all"
                )
            except:
                score["confusion_matrix_normalized"] = "NA"
            try:
                score["classification_report"] = pd.DataFrame(
                    classification_report(y_true, y_score, output_dict=True)
                ).transpose()
            except:
                score["classification_report"] = "NA"

        elif self.estimator == "regressor":
            score["R2"] = r2_score(y_true, y_score)
            score["MSE"] = mean_squared_error(y_true, y_score)
            score["RMSE"] = mean_squared_error(y_true, y_score, squared=False)

        if as_frame:
            score = pd.DataFrame.from_dict(score, orient="index").T
        return score


if __name__ == "__main__":
    # Example usage of the pipeline for a classification problem
    from sklearn.datasets import load_digits
    from sklearn.model_selection import train_test_split
    from sklearn.neighbors import KNeighborsClassifier
    from xgboost import XGBClassifier

    X, y = load_digits(return_X_y=True, as_frame=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, train_size=0.2, random_state=42
    )
    pipeline = PipelineManager(estimator="classifier")
    pipeline.set_numerical_features(X_train.columns)

    param_grid = {
        "n_neighbors": np.arange(3, 15, 2, dtype=int),
        "p": np.linspace(1, 10, 5, dtype=int),
        "weights": ["uniform", "distance"],
    }
    estimator = KNeighborsClassifier()
    pipeline.add_estimator(estimator, param_grid)

    param_grid = {
        "n_estimators": np.linspace(1, 100, 10, dtype=int),
        "max_depth": list(np.linspace(1, 10, 5, dtype=int)) + [None],
        "bootstrap": [True, False],
    }
    estimator = RandomForestClassifier()
    pipeline.add_estimator(estimator, param_grid)

    param_grid = {
        "n_estimators": np.linspace(1, 100, 10, dtype=int),
        "max_depth": list(np.linspace(1, 10, 5, dtype=int)) + [None],
        "bootstrap": [True, False],
    }
    estimator = XGBClassifier()
    pipeline.add_estimator(estimator, param_grid)

    best_model = pipeline.find_best_model(X_train, y_train, cv=2, n_iter=5)
    score = pipeline.score(X_test, y_test)
    print("Done!")
