from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Prediction
from app.schemas.prediction import PredictionOut, PredictionStatusUpdate


router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.get("", response_model=list[PredictionOut])
def list_predictions(db: Session = Depends(get_db)) -> list[Prediction]:
    return db.query(Prediction).order_by(Prediction.created_at.desc()).limit(1000).all()


@router.patch("/{prediction_id}/status", response_model=PredictionOut)
def update_prediction_status(
    prediction_id: int,
    payload: PredictionStatusUpdate,
    db: Session = Depends(get_db),
) -> Prediction:
    prediction = db.get(Prediction, prediction_id)
    if prediction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found.")

    prediction.review_status = payload.review_status
    db.commit()
    db.refresh(prediction)
    return prediction
