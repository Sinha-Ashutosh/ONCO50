import os
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor

# File names for saving model and pipeline
MODEL_FILE = "drug_model.pkl"
PIPELINE_FILE = "drug_pipeline.pkl"

def build_pipeline(num_attribs, cat_attribs):

    num_pipeline = Pipeline([
        ("scaler", StandardScaler())  
    ])
    cat_pipeline = Pipeline([
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ])
    return ColumnTransformer([
        ("num", num_pipeline, num_attribs),
        ("cat", cat_pipeline, cat_attribs)
    ])

if not os.path.exists(MODEL_FILE):
    # TRAINING PHASE
    print("Training model...")
    
    # 1. Load dataset
    prediction = pd.read_csv("drug_new.csv")

    # 2. Create stratified test set based on LN_IC50 distribution
    prediction['extra_cat'] = pd.cut(prediction["LN_IC50"],
                                     bins=[-np.inf, -6.0, -4.5, -3.0, -1.5, np.inf],
                                     labels=[1, 2, 3, 4, 5])

    split = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
    for train_index, test_index in split.split(prediction, prediction['extra_cat']):
        strat_test_set = prediction.loc[test_index].drop("extra_cat", axis=1)
        strat_test_set.to_csv("input.csv", index=False)  # Save test set for inference
        prediction = prediction.loc[train_index].drop("extra_cat", axis=1)

    # 3. Separate features and labels
    drugs_labels = prediction["LN_IC50"].copy()
    drugs_features = prediction.drop("LN_IC50", axis=1)

    # 4. Separate numeric and categorical attributes
    num_attribs = drugs_features.select_dtypes(include=[np.number]).columns.tolist()
    cat_attribs = drugs_features.select_dtypes(exclude=[np.number]).columns.tolist()

    # 5. Build and fit pipeline
    pipeline = build_pipeline(num_attribs, cat_attribs)
    drugs_prepared = pipeline.fit_transform(drugs_features)

    # 6. Train model
    model = RandomForestRegressor(random_state=42)
    model.fit(drugs_prepared, drugs_labels)

    # 7. Save model and pipeline
    joblib.dump(model, MODEL_FILE)
    joblib.dump(pipeline, PIPELINE_FILE)

    print("Model trained and saved as drug_model.pkl and drug_pipeline.pkl.")

else:
    # INFERENCE PHASE
    print(" Running inference...")

    # 1. Load model and pipeline
    model = joblib.load(MODEL_FILE)
    pipeline = joblib.load(PIPELINE_FILE)

    # 2. Load test data
    input_data = pd.read_csv("input.csv")

    # 3. Transform features 
    features = input_data.drop("LN_IC50", axis=1, errors="ignore")
    transformed_input = pipeline.transform(features)

    # 4. Predict
    predictions = model.predict(transformed_input)

    # 5. Save predictions
    input_data["Predicted_LN_IC50"] = predictions
    input_data.to_csv("output.csv", index=False)

    print(" Inference complete. Results saved to output.csv.")
