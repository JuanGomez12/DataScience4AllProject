# DS4A-Project
Repository of the final project of Team 24

# Identification of patients with a specific observable feature
- Natural language processing (NLP) code to extract relevant information of the medical notes. 
- Predictive model that gives us an accurate identification of patients with a specific observable feature (certain pathologies or health conditions) 

## Problem Description
Syphilis is a disease which can present a multitude of different symptoms, for which the main indicator (chancres) is only present during the onset of the condition, i.e. Primary syphilis. Each year, 5 million people are diagnosed with this affliction, and its diagnosis can be difficult and can depend on a multitude of factors such as the microbiologist’s experience when analyzing a patient’s sample to the quantity of treponema bacteria present in the lesion during the sampling process. 

Similarly, diabetes is an incurable disease affecting more than 400 million people worldwide, where 25% of the Colombians who are afflicted by it may go undiagnosed until it’s too late. Even though there is no cure for diabetes, it is still a disease which can be managed through the use of clinical treatments as well as diet and exercise, and for which the earlier a diagnosis is done, the better prognosis the patient will have.
Leveraging the use of medical notes taken by multiple examiners, combined with the different laboratory testing performed on a patient, could help raise a flag in order for another medical expert to give their informed second opinion to a prior diagnosis and prevent a further onset of these diseases.

More information about the problem can be found in the [Project Report](Project_Report_Team24.pdf).

## Motivation
Despite the use of diagnostic code related to each health care service, it has been detected that in clinical practice errors can be introduced in said coding. These errors can impact the results obtained in clinical research by having patients that do not correspond to the pathology under study, or on the contrary, failing to identify all relevant patients.

## Technologies Used
The frontend was developed using React, with the backend built in django. The Exploratory Data Analysis (EDA) was done with the help of Jupyter, Pandas, Matplotlib, Seaborn and Plotly. The Machine Learning (ML) pipeline training process was built using the previously mentioned libraries in addition to Scikit-learn, XGBoost, NLTK, Spacy, and imb-learn. The deep learning models use Tensorflow in conunction with the libraries used by the ML proccess.

## Features
- Automatic preprocessor, feature selection and estimator hyperparameter tuning with the possibility of easily adding more parameters or estimators.
- Automatically selects the best performing estimator using the F1-measure to rank the different models and incorporates it into the prediction piepline, to be used directly in any prediction task.

## Installation
The requirements file contains the libraries needed to run the scripts for the ML and Deep Learning training. The resulting pipeline_predictor file, ready to be used to predict results and return the respective prediction code (e.g. A510) will automatically be placed in the correct folder for the backend to load and use to predict values being passed from the frontend. The datasets to train the model need to be placed in a data directory inside of the scripts directory.

## How to use
### Frontend and backend deployment
### EDA and ML training
The scripts and notebooks required to train the ML pipeline can be found inside the [scripts](scripts/) directory. Inside of this directory there is another [README](scripts/README.md) with extra information on how to use the scripts. This step is not necessary as there is already a trained pipeline_predictor located [here](scripts/model/prediction_pipeline.pickle).

## Build Status
Exploratory Data Analysis (EDA)

## Acknowledgements
Many thanks to IQVia for sharing with us the data that allowed us to create this predictive model and Correlation One for teaching us the tools that made it possible  

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
