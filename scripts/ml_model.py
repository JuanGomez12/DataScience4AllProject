import nltk
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import (
    CountVectorizer,
    TfidfTransformer,
    TfidfVectorizer,
)
from sklearn.feature_selection import SelectFromModel
from sklearn.impute import KNNImputer, SimpleImputer
from sklearn.linear_model import ElasticNet, Ridge, Lasso
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
    PowerTransformer,
    RobustScaler,
    StandardScaler,
)

# Download the NLTK stopwords
nltk.download("stopwords")


class PipelineManager:
    def __init__(self, estimator: str):
        # estimator should be regressor or classifier
        if estimator.lower() not in ["regressor", "classifier"]:
            raise ValueError(
                f"Estimator should be regressor or classifier, got: {estimator}"
            )
        self.estimator = estimator.lower()
        self.pipeline = None
        self.cat_features = []
        self.num_features = []
        self.text_features = []
        self.param_grids = []
        self.best_estimator = None

    def set_categorical_features(self, cat_features: list):
        self.cat_features = cat_features

    def set_numerical_features(self, num_features: list):
        self.num_features = num_features

    def set_text_features(self, text_features: list):
        self.text_features = text_features

    def set_basic_pipeline(self):
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

        text_preprocessor = Pipeline(
            [
                (
                    "vectorizer",
                    CountVectorizer(
                        strip_accents="unicode",
                        stop_words=nltk.corpus.stopwords.words("spanish"),
                    ),
                ),
                ("tfidf", TfidfTransformer()),
            ]
        )

        preprocessor = ColumnTransformer(
            [
                ("categorical", categorical_preprocessor, self.cat_features),
                ("numerical", numeric_preprocessor, self.num_features),
                ("text", text_preprocessor, self.text_features),
            ]
        )

        self.pipeline = Pipeline(
            [
                ("preprocessor", preprocessor),
                ("feature_selector", SelectFromModel(RandomForestRegressor())),
                ("estimator", base_estimator),
            ]
        )

    def get_default_param_grid(self):
        param_grid = {
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
            "feature_selector": [
                SelectFromModel(Lasso()),
                SelectFromModel(ElasticNet()),
                SelectFromModel(Ridge()),
            ],
            "preprocessor_text_vectorizer": [
                CountVectorizer(
                    strip_accents="unicode",
                    stop_words=nltk.corpus.stopwords.words("spanish"),
                    ngram_range=(1, 1),
                ),
                CountVectorizer(
                    strip_accents="unicode",
                    stop_words=nltk.corpus.stopwords.words("spanish"),
                    ngram_range=(1, 2),
                ),
                CountVectorizer(
                    strip_accents="unicode",
                    stop_words=nltk.corpus.stopwords.words("spanish"),
                    ngram_range=(1, 3),
                ),
                CountVectorizer(
                    strip_accents="unicode",
                    stop_words=nltk.corpus.stopwords.words("spanish"),
                    ngram_range=(2, 2),
                ),
                CountVectorizer(
                    strip_accents="unicode",
                    stop_words=nltk.corpus.stopwords.words("spanish"),
                    ngram_range=(2, 3),
                ),
                CountVectorizer(
                    strip_accents="unicode",
                    stop_words=nltk.corpus.stopwords.words("spanish"),
                    ngram_range=(3, 3),
                ),
            ],
        }
        return param_grid

    @staticmethod
    def convert_dict_names(param_grid):
        return {
            f"estimator__{key}": value
            for key, value in param_grid.items()
            if "__" not in key
        }

    def add_estimator(self, estimator, param_grid: dict):
        param_dict = {}
        param_dict.update(self.get_default_param_grid())
        param_dict.update(self.convert_dict_names(param_grid))
        param_dict.update({"estimator": [estimator]})
        self.param_grids.append(param_dict)

    def find_best_model(self, X, y, cv=5, n_jobs=-1, n_iter=-1, **kwargs):
        if self.pipeline is None:
            self.set_basic_pipeline()
        param_grids = self.param_grids

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

        self.hyperparameter_tuner.fit(X, y)
        self.cv_results = pd.DataFrame(self.hyperparameter_tuner.cv_results_)

        self.best_estimator = self.hyperparameter_tuner.best_estimator_
        return self.best_estimator

    def score(self, X, y_true, as_frame=True):
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

    # param_grid = {
    #     "n_estimators": np.linspace(1, 100, 10, dtype=int),
    #     "max_depth": list(np.linspace(1, 10, 5, dtype=int)) + [None],
    #     "bootstrap": [True, False],
    #     "learning_rate":[],
    # }
    # estimator = XGBClassifier()
    # pipeline.add_estimator(estimator, param_grid)

    best_model = pipeline.find_best_model(X_train, y_train, cv=2, n_iter=5)
    score = pipeline.score(X_test, y_test)
    print("Done!")
