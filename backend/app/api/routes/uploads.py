from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Prediction, Upload
from app.schemas.prediction import PredictionOut
from app.schemas.upload import UploadResult
from app.services.model_service import ModelNotLoadedError, ModelService
from app.services.prediction_service import create_predictions_for_upload
from app.services.validation_service import read_and_validate_csv


router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("", response_model=UploadResult, status_code=status.HTTP_201_CREATED)
async def upload_csv(file: UploadFile, db: Session = Depends(get_db)) -> Upload:
    df = await read_and_validate_csv(file)
    upload = Upload(filename=file.filename or "upload.csv", row_count=len(df))
    db.add(upload)
    db.commit()
    db.refresh(upload)

    try:
        predictions = create_predictions_for_upload(db, upload, df, ModelService())
    except ModelNotLoadedError as exc:
        db.delete(upload)
        db.commit()
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    upload.predictions = predictions
    result = UploadResult.model_validate(upload)
    result.message = "Upload processed successfully."
    return result


@router.get("/{upload_id}/predictions", response_model=list[PredictionOut])
def get_upload_predictions(upload_id: int, db: Session = Depends(get_db)) -> list[Prediction]:
    upload = db.get(Upload, upload_id)
    if upload is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload not found.")
    return (
        db.query(Prediction)
        .filter(Prediction.upload_id == upload_id)
        .order_by(Prediction.default_probability.desc())
        .all()
    )
