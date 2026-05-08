# RiskLens

**RiskLens** is a full-stack machine learning risk monitoring dashboard that turns a trained scikit-learn model into an interactive web application for risk scoring, case review, and analyst-ready reporting.

The application allows users to upload CSV files, generate positive-class risk probabilities, classify records into Low, Medium, and High Risk bands, review flagged cases, and export results for further analysis.

---

## Overview

Machine learning models are most valuable when they can be used in real workflows. RiskLens bridges the gap between a trained model and an operational analytics tool by combining model inference, CSV validation, database persistence, dashboard visualizations, and review status tracking in one full-stack application.

This project was built to demonstrate how a machine learning model can be deployed into a production-style web application using a modern frontend, API backend, and relational database.

---

## Features

- Upload transaction or applicant CSV files
- Validate required model columns before prediction
- Load a saved scikit-learn `joblib` pipeline
- Generate positive-class risk probabilities using `predict_proba`
- Assign Low, Medium, and High Risk categories
- Store upload metadata and prediction results in PostgreSQL
- Review cases as:
  - Unreviewed
  - Reviewed
  - Confirmed Risk
  - False Positive
- View dashboard summary metrics:
  - Total records
  - High-risk count
  - Average risk score
  - Estimated approval rate
- Visualize risk distribution with Recharts
- Search, sort, and filter prediction results
- Export all results or only high-risk cases as CSV
- Run the full stack with Docker Compose

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Axios

### Backend
- FastAPI
- Python
- pandas
- scikit-learn
- joblib
- SQLAlchemy
- Pydantic
- pytest

### Database & Infrastructure
- PostgreSQL
- Docker
- Docker Compose
- Environment-based configuration

---

## Architecture

```text
User
  |
  v
React + TypeScript Frontend
  |
  | REST API
  v
FastAPI Backend
  |
  | CSV validation
  | Model inference with scikit-learn
  | Prediction persistence
  v
PostgreSQL Database
