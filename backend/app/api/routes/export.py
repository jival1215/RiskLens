from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Prediction, Upload
from app.services.export_service import predictions_to_csv


router = APIRouter(prefix="/uploads", tags=["export"])


@router.get("/{upload_id}/export")
def export_predictions(
    upload_id: int,
    scope: str = Query(default="all", pattern="^(all|high-risk)$"),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    upload = db.get(Upload, upload_id)
    if upload is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload not found.")

    query = db.query(Prediction).filter(Prediction.upload_id == upload_id)
    if scope == "high-risk":
        query = query.filter(Prediction.risk_level == "High Risk")

    csv_data = predictions_to_csv(query.order_by(Prediction.default_probability.desc()).all())
    filename = f"risklens_upload_{upload_id}_{scope}.csv"
    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
