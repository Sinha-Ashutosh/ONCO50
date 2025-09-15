import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler,OneHotEncoder
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error
#1.load the dataset
prediction=pd.read_csv("drug_new.csv")

#2.Create a stratified test set
prediction['extra_cat'] = pd.cut(prediction["LN_IC50"],
                                 bins=[-np.inf, -6.0, -4.5, -3.0, -1.5, np.inf],
                                 labels=[1,2,3,4,5])

                                 

split_fun=StratifiedShuffleSplit(n_splits=1,test_size=0.2,random_state=42)

for train_index ,test_index in split_fun.split(prediction,prediction['extra_cat']):
    strat_train_set=prediction.loc[train_index].drop("extra_cat",axis=1)
    strat_test_set=prediction.loc[test_index].drop("extra_cat",axis=1)

prediction=strat_train_set.copy()    

# 3.Separate features and labels
drugs_labels=prediction["LN_IC50"].copy()
prediction=prediction.drop("LN_IC50",axis=1)

# print(prediction,drugs_labels)


#4. Separate numerical and categorical columns
num_attribs = prediction.select_dtypes(include=[np.number]).columns.tolist()
cat_attribs = prediction.select_dtypes(exclude=[np.number]).columns.tolist()

#5 . Creating pipeline
num_pipeline = Pipeline([
    ("scaler", StandardScaler())
])

cat_pipeline = Pipeline([
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

full_pipeline = ColumnTransformer([
    ("num", num_pipeline, num_attribs),
    ("cat", cat_pipeline, cat_attribs)
])

#6.transform the data
drugs_prepared = full_pipeline.fit_transform(prediction) 
# print(drugs_prepared)

#7. model
ran_reg = RandomForestRegressor(random_state=42)
ran_reg.fit(drugs_prepared, drugs_labels)
ran_preds = ran_reg.predict(drugs_prepared)
ran_rmse = root_mean_squared_error(drugs_labels, ran_preds)
print(f"The RMSE for Random Forest: {ran_rmse}")

