from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load model and pipeline
MODEL_FILE = "drug_model.pkl"
PIPELINE_FILE = "drug_pipeline.pkl"
model = joblib.load(MODEL_FILE)
pipeline = joblib.load(PIPELINE_FILE)

# A simple home route to confirm the server is running
@app.route('/')
def home():
    return "The prediction server is running. Use the /predict endpoint with a POST request.hahaah"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        # Convert JSON to a Pandas DataFrame
        input_df = pd.DataFrame([data])  # Handles a single record per request

        # Safely drop the target column if it exists in the input
        if "LN_IC50" in input_df.columns:
            input_df = input_df.drop("LN_IC50", axis=1)
        
        # Transform the input using the pre-trained pipeline
        transformed_input = pipeline.transform(input_df)
        
        # Make the prediction
        prediction = model.predict(transformed_input)[0]
        
        # Return the prediction as a JSON response
        return jsonify({"Predicted_LN_IC50": float(prediction)})
    
    except Exception as e:
        # Return an error message if something goes wrong
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Run the app. Use debug=False for production.
    app.run(debug=True)