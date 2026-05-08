# Model Artifact

Place your trained scikit-learn credit risk Pipeline here:

```text
backend/app/artifacts/credit_risk_model.joblib
```

RiskLens currently expects the credit card fraud baseline model from:

```text
/Users/jivalpatel/Downloads/Volunteer Work/Credit_Card_Fraud_Model/creditcard_fraud_baselines.ipynb
```

The artifact must expose `predict_proba(X)` and return the positive-class probability in column index `1`.

The backend selects `Time`, `V1` through `V28`, and `Amount` from uploaded CSVs and passes that DataFrame directly to the Pipeline. Keep `applicant_id` out of the model features; it is only a RiskLens tracking identifier.

You can also override the location with:

```env
MODEL_PATH=/path/to/credit_risk_model.joblib
```
