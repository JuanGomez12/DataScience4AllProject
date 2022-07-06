# Scripts directory
The Machine Learning (ML) pipeline scripts as well as the EDA and ML training Python notebooks are located in the script directory. The utils folder inside of this directory contains utility functions used by the notebooks in this section.

# Exploracion_inicial_DS4A Notebook
Because the Exploratory Data Analysis (EDA) was quite extensive, it was decided to divide it into two separate notebooks, the first being the [Initial EDA](scripts/Exploracion_inicial_DS4A.ipynb), which as the name suggests contains the first round of EDA that was performed on the data. This includes the initial missing value replacement, data cleaning, univariate analysis and multivariate analysis with the lab data.

# deep_EDA Notebook
The second EDA round was stored in the [Deep EDA](scripts/deep_EDA.ipynb) notebook. This contains the multivariate analyses of the features against the target feature, including Feature Engineering techniques to help in the ML model training process.

# train_ml Notebook
The train_ml notebook, found [here](scripts/train_ml.ipynb), contains the code required to train and score the Machine Learning pipeline. The second cell of the notebook contains the configuration paramteres that can be set, including how many iterations should the hyperparameter tuner look for, if it should refit the final model with the whole dataset, where to store the resulting model, etc.

# train_deep_ml Notebook
Similar to the [train_ml Notebook](#train_ml_Notebook), the deep learning notebook contains the code required to run the Deep Learning model, including the configuration parameters.