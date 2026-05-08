from sqlalchemy.orm import Session

from app.db.models import Prediction, Upload
from app.services.model_service import ModelNotLoadedError, ModelService


def assign_risk_level(default_probability: float) -> str:
    if default_probability < 0.20:
        return "Low Risk"
    if default_probability < 0.50:
        return "Medium Risk"
    return "High Risk"


def recommendation_for_risk(risk_level: str) -> str:
    recommendations = {
        "Low Risk": "Approve",
        "Medium Risk": "Manual Review",
        "High Risk": "Reject / Additional Review",
    }
    return recommendations[risk_level]


def create_predictions_for_upload(db: Session, upload: Upload, df, model_service: ModelService) -> list[Prediction]:
    try:
        probabilities = model_service.predict_default_probabilities(df)
    except ModelNotLoadedError:
        raise

    predictions: list[Prediction] = []
    for row, probability in zip(df.to_dict(orient="records"), probabilities, strict=True):
        risk_level = assign_risk_level(probability)
        prediction = Prediction(
            upload_id=upload.id,
            applicant_id=str(row["applicant_id"]),
            loan_amnt=float(row["Amount"]),
            annual_inc=0.0,
            default_probability=float(probability),
            risk_level=risk_level,
            recommendation=recommendation_for_risk(risk_level),
        )
        db.add(prediction)
        predictions.append(prediction)

    db.commit()
    for prediction in predictions:
        db.refresh(prediction)
    return predictions


def summarize_predictions(predictions: list[Prediction]) -> dict:
    total = len(predictions)
    if total == 0:
        return {
            "total_applicants": 0,
            "high_risk_applicants": 0,
            "average_default_probability": 0,
            "estimated_approval_rate": 0,
            "risk_distribution": {"Low Risk": 0, "Medium Risk": 0, "High Risk": 0},
        }

    distribution = {"Low Risk": 0, "Medium Risk": 0, "High Risk": 0}
    for prediction in predictions:
        distribution[prediction.risk_level] += 1

    low_count = distribution["Low Risk"]
    return {
        "total_applicants": total,
        "high_risk_applicants": distribution["High Risk"],
        "average_default_probability": sum(p.default_probability for p in predictions) / total,
        "estimated_approval_rate": low_count / total,
        "risk_distribution": distribution,
    }
