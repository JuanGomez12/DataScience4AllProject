import multiprocessing as mp
import string

import numpy as np
import pandas as pd
import spacy
from sklearn.base import BaseEstimator, TransformerMixin

SPACY_MODEL_DEFAULT = "es_core_news_sm"
# SPACY_MODEL_DEFAULT = "es_core_news_md"
# SPACY_MODEL_DEFAULT = 'es_core_news_lg'
# SPACY_MODEL_DEFAULT = 'es_dep_news_trf'

# Load the default Spacy model
try:
    nlp = spacy.load(SPACY_MODEL_DEFAULT)
except OSError:
    print(
        f"Spacy model {SPACY_MODEL_DEFAULT} not found, downloading from the internet, this might take some time"
    )
    from spacy.cli import download

    download(SPACY_MODEL_DEFAULT)
    nlp = spacy.load(SPACY_MODEL_DEFAULT)


class TextPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self, nlp=nlp, n_jobs=1):
        """
        Text preprocessing transformer includes steps:
            1. Punctuation removal
            2. Stop words removal
            3. Lemmatization

        nlp  - spacy model
        n_jobs - parallel jobs to run
        """
        self.nlp = nlp
        self.n_jobs = n_jobs

    def fit(self, X, y=None):
        return self

    def transform(self, X, *_):
        X_copy = X.copy()

        partitions = 1
        cores = mp.cpu_count()
        if self.n_jobs <= -1:
            partitions = cores
        elif self.n_jobs <= 0:
            return X_copy.apply(self._preprocess_text)
        else:
            partitions = min(self.n_jobs, cores)

        data_split = np.array_split(X_copy, partitions)
        pool = mp.Pool(cores)
        data = pd.concat(pool.map(self._preprocess_part, data_split))
        pool.close()
        pool.join()

        return data

    def _preprocess_part(self, part):
        return part.apply(self._preprocess_text)

    def _preprocess_text(self, text):
        doc = self.nlp(text)
        removed_punct = self._remove_punct(doc)
        removed_stop_words = self._remove_stop_words(removed_punct)
        return self._lemmatize(removed_stop_words)

    def _remove_punct(self, doc):
        return (t for t in doc if t.text not in string.punctuation)

    def _remove_stop_words(self, doc):
        return (t for t in doc if not t.is_stop)

    def _lemmatize(self, doc):
        return " ".join(t.lemma_ for t in doc)
