from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


RiskLevel = Literal["Low Risk", "Medium Risk", "High Risk"]
ReviewStatus = Literal["Unreviewed", "Reviewed", "Confirmed Risk", "False Positive"]


class PredictionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    prediction_id: int
    upload_id: int
    applicant_id: str
    loan_amnt: float
    annual_inc: float
    default_probability: float
    risk_level: RiskLevel
    recommendation: str
    review_status: ReviewStatus
    created_at: datetime


class PredictionStatusUpdate(BaseModel):
    review_status: ReviewStatus


class PredictionSummary(BaseModel):
    total_applicants: int
    high_risk_applicants: int
    average_default_probability: float
    estimated_approval_rate: float
    risk_distribution: dict[str, int]
