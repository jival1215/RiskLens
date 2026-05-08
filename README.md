# RiskLens

RiskLens is a production-style full-stack ML risk monitoring dashboard. It wraps an existing scikit-learn credit card fraud baseline model in a real web application where users can upload transaction CSV files, run positive-class risk scoring, review high-risk cases, and export analyst-ready reports.

## Why I Built It

Risk models are most useful when analysts can actually operate them. RiskLens turns a trained fraud/default prediction model into a working application with validation, persistence, dashboards, review status tracking, and reporting.

## Features

- Upload CSV files of transactions or applicants
- Validate required model columns with clear error messages
- Load a saved scikit-learn `joblib` Pipeline and call `predict_proba`
- Assign Low, Medium, and High Risk bands
- Persist upload metadata and prediction results in PostgreSQL
- Review cases as Unreviewed, Reviewed, Confirmed Risk, or False Positive
- Dashboard cards for total applicants, high-risk count, average default probability, and estimated approval rate
- Recharts risk distribution and risk score histogram
- Sortable, searchable, filterable applicant table
- Export all results or high-risk results as CSV
- Docker Compose stack for frontend, backend, and database

## Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, Axios

Backend: FastAPI, pandas, scikit-learn, joblib, SQLAlchemy, Pydantic, PostgreSQL, pytest

Infrastructure: Docker, Docker Compose, `.env` support

## Architecture

```text
User
  |
  v
React + TypeScript frontend
  |
  | REST API
  v
FastAPI backend
  |
  | validates CSV with pandas
  | loads scikit-learn Pipeline with joblib
  | writes upload and prediction rows
  v
PostgreSQL
```

## Screenshots

Add screenshots here after running the app:

- Upload page
- Dashboard summary
- Risk charts
- Applicant review table

## Model Integration

The current artifact is wired from:

```text
/Users/jivalpatel/Downloads/Volunteer Work/Credit_Card_Fraud_Model/creditcard_fraud_baselines.ipynb
```

The notebook trains a Logistic Regression baseline pipeline:

```python
Pipeline([
    ("scaler", StandardScaler(with_mean=False)),
    ("clf", LogisticRegression(max_iter=1000, class_weight="balanced", solver="lbfgs")),
])
```

The saved model lives here:

```text
backend/app/artifacts/credit_risk_model.joblib
```

RiskLens expects a full scikit-learn Pipeline with:

```python
pipeline.predict_proba(feature_dataframe)
```

The backend uses column index `1` as the positive-class probability. `applicant_id` is kept for tracking and is not passed into the model.

If your real model uses different feature names, edit:

```text
backend/app/services/validation_service.py
```

Update `MODEL_FEATURE_COLUMNS`, `REQUIRED_COLUMNS`, and the validation lists.

If the model artifact is missing or invalid, the API still starts. Prediction attempts return a clear `503` error explaining where to place the real `credit_risk_model.joblib`.

## Environment Variables

Backend:

```env
DATABASE_URL=postgresql+psycopg2://risklens:risklens@postgres:5432/risklens
MODEL_PATH=/app/app/artifacts/credit_risk_model.joblib
FRONTEND_ORIGIN=http://localhost:5173
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Examples are included in:

- `backend/.env.example`
- `frontend/.env.example`

## Run With Docker

From the repository root:

```bash
docker compose up --build
```

Open:

```text
http://localhost:5173
```

API docs:

```text
http://localhost:8000/docs
```

## Run Locally Without Docker

Start PostgreSQL locally or temporarily use SQLite by leaving `DATABASE_URL` unset.

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

```text
GET    /api/health
POST   /api/uploads
GET    /api/predictions
GET    /api/uploads/{upload_id}/predictions
PATCH  /api/predictions/{prediction_id}/status
GET    /api/uploads/{upload_id}/export?scope=all
GET    /api/uploads/{upload_id}/export?scope=high-risk
```

## Example CSV Format

Use the included sample:

```text
backend/sample_creditcard_transactions.csv
```

Expected columns:

```csv
applicant_id,Time,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12,V13,V14,V15,V16,V17,V18,V19,V20,V21,V22,V23,V24,V25,V26,V27,V28,Amount
TXN-1001,0.0,-1.3598071336738,-0.0727811733098497,2.53634673796914,1.37815522427443,-0.338320769942518,0.462387777762292,0.239598554061257,0.0986979012610507,0.363786969611213,0.0907941719789316,-0.551599533260813,-0.617800855762348,-0.991389847235408,-0.311169353699879,1.46817697209427,-0.470400525259478,0.207971241929242,0.0257905801985591,0.403992960255733,0.251412098239705,-0.018306777944153,0.277837575558899,-0.110473910188767,0.0669280749146731,0.128539358273528,-0.189114843888824,0.133558376740387,-0.0210530534538215,149.62
```

## Tests

Backend tests:

```bash
cd backend
pytest
```

The tests cover the health endpoint, CSV validation, risk threshold assignment, and recommendation logic.

## Future Improvements

- Authentication and role-based access for analysts and admins
- Batch history page for comparing uploads
- Model versioning and drift monitoring
- SHAP explanations for individual applicants
- Background jobs for large CSV uploads
- PDF report generation
- Audit log for review status changes

## Resume Bullet

Built RiskLens, a full-stack ML credit risk monitoring dashboard using React, FastAPI, PostgreSQL, and scikit-learn, turning a 0.87 ROC-AUC default prediction model into an interactive application for applicant risk scoring, case review, and analyst-ready reporting.
