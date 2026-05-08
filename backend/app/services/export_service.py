from io import StringIO

import pandas as pd

from app.db.models import Prediction


EXPORT_COLUMNS = [
    "id",
    "upload_id",
    "applicant_id",
    "loan_amnt",
    "annual_inc",
    "default_probability",
    "risk_level",
    "recommendation",
    "review_status",
    "created_at",
]


def predictions_to_csv(predictions: list[Prediction]) -> str:
    rows = [
        {
            "id": prediction.id,
            "upload_id": prediction.upload_id,
            "applicant_id": prediction.applicant_id,
            "loan_amnt": prediction.loan_amnt,
            "annual_inc": prediction.annual_inc,
            "default_probability": prediction.default_probability,
            "risk_level": prediction.risk_level,
            "recommendation": prediction.recommendation,
            "review_status": prediction.review_status,
            "created_at": prediction.created_at.isoformat(),
        }
        for prediction in predictions
    ]
    output = StringIO()
    pd.DataFrame(rows, columns=EXPORT_COLUMNS).to_csv(output, index=False)
    return output.getvalue()
