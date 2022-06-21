import logging
import os
import pathlib
from logging import handlers
from typing import Optional

import pandas as pd
import tensorflow as tf
import tensorflow_hub as hub
from keras.callbacks import EarlyStopping, ReduceLROnPlateau
from keras.layers import AlphaDropout, Dense, Dropout
from keras.models import Model, Sequential
from keras.wrappers.scikit_learn import KerasClassifier, KerasRegressor
from sklearn.model_selection import KFold, cross_val_score
from tensorflow.keras import regularizers
from tensorflow.keras.layers import LSTM, Input, SpatialDropout1D, concatenate
from tensorflow.keras.optimizers import Adam


def gpu_model(
    feature_number, dropout, activation, optimizer, learning_rate, class_number
):
    if activation.lower() == "selu":
        dropout_layer = AlphaDropout
        kernel_initializer = "LecunNormalV2"
    else:
        dropout_layer = Dropout
        kernel_initializer = "GlorotNormalV2"

    if optimizer.lower() == "adam":
        optimizer = Adam(lr=learning_rate)
    model = Sequential()
    model.add(
        Dense(
            feature_number,
            input_dim=feature_number,
            kernel_initializer=kernel_initializer,
            activation=activation,
        )
    )
    model.add(dropout_layer(dropout))
    model.add(
        Dense(
            feature_number,
            input_dim=feature_number,
            kernel_initializer=kernel_initializer,
            activation=activation,
        )
    )
    model.add(dropout_layer(dropout))
    model.add(
        Dense(
            feature_number,
            input_dim=feature_number,
            kernel_initializer=kernel_initializer,
            activation=activation,
        )
    )
    model.add(dropout_layer(dropout))
    model.add(
        Dense(
            feature_number,
            input_dim=feature_number,
            kernel_initializer=kernel_initializer,
            activation=activation,
        )
    )
    model.add(dropout_layer(dropout))
    model.add(
        Dense(
            feature_number,
            input_dim=feature_number,
            kernel_initializer=kernel_initializer,
            activation=activation,
        )
    )
    model.add(Dense(class_number))
    model.compile(
        optimizer="adam",
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"],
    )
    return model


def multi_input_embedded_model(
    feature_number, class_number, embedding, activation="relu", dropout=0.5
):
    if embedding == "nnlm-es-dim128":
        embedding = "https://tfhub.dev/google/nnlm-es-dim128/2"
    if embedding == "nnlm-es-dim128-with-normalization":
        embedding = "https://tfhub.dev/google/nnlm-es-dim128-with-normalization/2"

    if activation.lower() == "selu":
        dropout_layer = AlphaDropout
        kernel_initializer = "LecunNormalV2"
    elif activation.lower() == "relu":
        dropout_layer = Dropout
        kernel_initializer = "GlorotNormalV2"
    else:
        raise ValueError

    embed_output = 128
    hub_layer = hub.KerasLayer(
        embedding,
        input_shape=[],
        dtype=tf.string,
        # trainable=True,
        output_shape=[embed_output],
    )

    # Define the inputs
    non_text_input = Input(shape=(feature_number,))  # Categorical and numerical data
    text_input = Input(shape=(), name="Input", dtype=tf.string)  # Text data

    # Branch A works on the non-text data
    x = Dense(64, activation=activation, kernel_initializer=kernel_initializer)(
        non_text_input
    )
    x = dropout_layer(dropout)(x)
    x = Dense(128, activation=activation, kernel_initializer=kernel_initializer)(x)
    x = dropout_layer(dropout)(x)
    x = Dense(64, activation=activation, kernel_initializer=kernel_initializer)(x)
    x = Model(inputs=non_text_input, outputs=x)

    # Branch B works on the text data
    y = hub_layer(text_input)
    y = Dense(embed_output, activation=activation,
            kernel_initializer=kernel_initializer)(y)
    y = Dense(
        embed_output * 2, activation=activation, kernel_initializer=kernel_initializer
    )(y)
    y = dropout_layer(dropout)(y)
    y = Dense(
        embed_output, activation=activation, kernel_initializer=kernel_initializer
    )(y)
    y = Model(inputs=text_input, outputs=y)

    # combine the branches
    combined = concatenate([x.output, y.output])

    z = Dense(64, activation=activation, kernel_initializer=kernel_initializer)(
        combined
    )
    z = dropout_layer(dropout)(z)
    z = Dense(16, activation=activation, kernel_initializer=kernel_initializer)(z)
    z = Dense(class_number, activation="relu")(z)

    model = Model(inputs=[x.input, y.input], outputs=z)

    model.compile(
        optimizer="adam",
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        # metrics=[tf.keras.metrics.AUC()],
        metrics=[tf.keras.metrics.SparseCategoricalCrossentropy(from_logits=True)],
        # metrics=[tf.keras.metrics.SparseCategoricalAccuracy(from_logits=True)],
    )
    return model


def gpu_model_hub(class_number, embedding, dropout=0.5):
    if embedding == "nnlm-es-dim128":
        embedding = "https://tfhub.dev/google/nnlm-es-dim128/2"
    if embedding == "nnlm-es-dim128-with-normalization":
        embedding = "https://tfhub.dev/google/nnlm-es-dim128-with-normalization/2"
    if embedding == "universal":
        embedding = "https://tfhub.dev/google/universal-sentence-encoder-multilingual/3"

    hub_layer = hub.KerasLayer(
        embedding,
        input_shape=[],
        dtype=tf.string,
        # trainable=True,
        output_shape=[128],
    )
    model = tf.keras.Sequential()
    model.add(hub_layer)
    model.add(
        tf.keras.layers.Dense(
            128, activation="relu", kernel_regularizer=regularizers.l2(0.001)
        )
    )
    model.add(Dropout(dropout))
    model.add(
        tf.keras.layers.Dense(
            1024, activation="relu", kernel_regularizer=regularizers.l2(0.001)
        )
    )
    model.add(Dropout(dropout))
    model.add(
        tf.keras.layers.Dense(
            512, activation="relu", kernel_regularizer=regularizers.l2(0.001)
        )
    )
    model.add(Dropout(dropout))
    model.add(
        tf.keras.layers.Dense(
            256, activation="relu", kernel_regularizer=regularizers.l2(0.001)
        )
    )
    model.add(Dropout(dropout))
    model.add(
        tf.keras.layers.Dense(
            128, activation="relu", kernel_regularizer=regularizers.l2(0.001)
        )
    )
    model.add(Dropout(dropout))
    model.add(
        tf.keras.layers.Dense(
            64, activation="relu", kernel_regularizer=regularizers.l2(0.001)
        )
    )
    model.add(Dropout(dropout))
    model.add(tf.keras.layers.Dense(class_number, activation="relu"))
    model.compile(
        optimizer="adam",
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        # metrics=[tf.keras.metrics.AUC()],
        metrics=[tf.keras.metrics.SparseCategoricalCrossentropy(from_logits=True)],
        # metrics=[tf.keras.metrics.SparseCategoricalAccuracy(from_logits=True)],
    )
    return model


logging.root.handlers = []


def get_logger(save_to_file=os.path.join("logs", f"{pathlib.Path(__file__).stem}.log")):
    log = logging.getLogger("myLogger")
    if len(log.handlers) == 0:
        log.setLevel(logging.INFO)
        format = logging.Formatter(
            "[%(asctime)s - %(filename)s:%(lineno)s - %(funcName)s() - %(levelname)s] %(message)s"
        )

        ch = logging.StreamHandler()
        ch.setFormatter(format)
        log.addHandler(ch)

        if isinstance(save_to_file, str):
            pathlib.Path(save_to_file).parent.mkdir(parents=True, exist_ok=True)
            fh = handlers.RotatingFileHandler(
                save_to_file, maxBytes=(1048576 * 5), backupCount=7
            )
            fh.setFormatter(format)
            log.addHandler(fh)
        elif save_to_file is not None:
            raise TypeError("save_to_file needs to be of type string")
    return log


# Set loggers for the script
logger = get_logger()
logger.handlers = []
logger = get_logger()


class KerasRegressorModel(KerasRegressor):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model_history = {}
        verbose = kwargs.get("verbose", 0)
        self.verbose = verbose

    def fit(
        self,
        X,
        Y,
        min_delta: float = 0,
        patience: int = 30,
        monitor: str = "val_loss",
        restore_best_weights: bool = True,
        *args,
        **kwargs,
    ):
        # Verbose config
        verbose = kwargs.get("verbose", self.verbose)
        callbacks = []

        early_stop = EarlyStopping(
            min_delta=min_delta,
            monitor=monitor,
            patience=patience,
            verbose=verbose,
            restore_best_weights=restore_best_weights,
        )
        callbacks.append(early_stop)
        # mcp_save = ModelCheckpoint('.mdl_wts.hdf5', save_best_only=True, monitor='val_loss', mode='min')
        reduce_lr = ReduceLROnPlateau(
            monitor=monitor,
            factor=0.2,
            patience=int(patience / 3),
            verbose=verbose,
            min_lr=0.0005,
            cooldown=10,
        )
        callbacks.append(reduce_lr)

        history = super().fit(
            X, Y, validation_split=0.2, callbacks=callbacks, *args, **kwargs
        )
        self.model_history = history
        return history

    def plot_learning_curves(
        self, save_path: Optional[pathlib.Path] = None, figsize=(10, 8)
    ):
        import matplotlib.pyplot as plt

        if self.model_history:
            if save_path is not None:
                save_path = pathlib.Path(save_path)
                save_path.mkdir(parents=True, exist_ok=True)
            history = self.model_history
            # list all data in history
            plots_available = [
                key for key in history.history.keys() if not key.startswith("val")
            ]

            for plot in plots_available:
                f, ax = plt.subplots(figsize=figsize, dpi=400)
                plt.plot(history.history[plot])
                legends = ["training"]
                if f"val_{plot}" in history.history.keys():
                    plt.plot(history.history[f"val_{plot}"])
                    legends.append("validation")
                plot_string = str(plot).replace("_", " ").title()
                plt.title(f"Model {plot_string}, {save_path.name}")
                plt.ylabel(f"{plot_string}")
                plt.xlabel("Epoch")
                plt.legend(legends, loc="upper left")
                plt.show()
                if save_path is not None:
                    plt.savefig(f"{save_path / plot}_{save_path.name}.png")


class KerasClassifierModel(KerasClassifier):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model_history = {}
        verbose = kwargs.get("verbose", 0)
        self.verbose = verbose

    def fit(
        self,
        X,
        Y,
        min_delta: float = 0,
        patience: int = 60,
        monitor: str = "val_loss",
        restore_best_weights: bool = True,
        *args,
        **kwargs,
    ):
        # Verbose config
        verbose = kwargs.get("verbose", self.verbose)
        callbacks = []

        early_stop = EarlyStopping(
            min_delta=min_delta,
            monitor=monitor,
            patience=patience,
            verbose=verbose,
            restore_best_weights=restore_best_weights,
        )
        callbacks.append(early_stop)
        # mcp_save = ModelCheckpoint('.mdl_wts.hdf5', save_best_only=True, monitor='val_loss', mode='min')
        reduce_lr = ReduceLROnPlateau(
            monitor=monitor,
            factor=0.2,
            patience=int(patience / 3),
            verbose=verbose,
            min_lr=0.0005,
            cooldown=10,
        )
        callbacks.append(reduce_lr)

        history = super().fit(
            X, Y, validation_split=0.2, callbacks=callbacks, *args, **kwargs
        )
        self.model_history = history
        return history

    def plot_learning_curves(
        self, save_path: Optional[pathlib.Path] = None, figsize=(10, 8)
    ):
        import matplotlib.pyplot as plt

        if self.model_history:
            if save_path is not None:
                save_path = pathlib.Path(save_path)
                save_path.mkdir(parents=True, exist_ok=True)
            history = self.model_history
            # list all data in history
            plots_available = [
                key for key in history.history.keys() if not key.startswith("val")
            ]

            for plot in plots_available:
                f, ax = plt.subplots(figsize=figsize, dpi=400)
                plt.plot(history.history[plot])
                legends = ["training"]
                if f"val_{plot}" in history.history.keys():
                    plt.plot(history.history[f"val_{plot}"])
                    legends.append("validation")
                plot_string = str(plot).replace("_", " ").title()
                plt.title(f"Model {plot_string}, {save_path.name}")
                plt.ylabel(f"{plot_string}")
                plt.xlabel("Epoch")
                plt.legend(legends, loc="upper left")
                plt.show()
                if save_path is not None:
                    plt.savefig(f"{save_path / plot}_{save_path.name}.png")


def baseline_model(feature_number: int):
    # create model
    model = Sequential()
    model.add(
        Dense(
            feature_number,
            input_dim=feature_number,
            kernel_initializer="normal",
            activation="relu",
        )
    )
    model.add(Dense(1, kernel_initializer="normal"))
    # Compile model
    model.compile(loss="mean_squared_error", optimizer="adam")
    return model


def baseline_classifier_model(feature_number: int, class_number: int):
    # create model
    model = Sequential()
    model.add(
        Dense(
            feature_number,
            input_dim=feature_number,
            kernel_initializer="normal",
            activation="relu",
        )
    )
    model.add(Dense(class_number))
    # Compile model
    model.compile(
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        optimizer="adam",
        metrics=["accuracy"],
    )
    return model


def test_gpu_model(**kwargs):
    ## Boton dataset test
    from sklearn.datasets import load_boston

    dataset = load_boston()["data"]
    # split into input (X) and output (Y) variables
    X = load_boston()["data"]
    Y = load_boston()["target"]

    model_function = baseline_model

    clf = KerasRegressorModel(
        build_fn=model_function,
        feature_number=X.shape[1],
        epochs=100,
        batch_size=10,
        verbose=1,
        **kwargs,
    )

    clf.fit(X, Y)
    kfold = KFold(n_splits=10)
    results = cross_val_score(clf, X, Y, cv=kfold)
    print("Results: %.2f (%.2f) MSE" % (results.mean(), results.std()))

    from sklearn.model_selection import GridSearchCV

    clf = GridSearchCV(
        clf,
        param_grid={},
        scoring="neg_root_mean_squared_error",  # List of scoring functions: https://scikit-learn.org/stable/modules/model_evaluation.html
        n_jobs=1,
        verbose=10,
    )
    clf.fit(X, Y)
    optimised_model = clf.best_estimator_


if __name__ == "__main__":
    test_gpu_model()
    print("Done!")
