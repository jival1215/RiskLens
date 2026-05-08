from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.prediction import PredictionOut


class UploadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    row_count: int
    created_at: datetime


class UploadResult(UploadOut):
    predictions: list[PredictionOut]
    message: str = ""
