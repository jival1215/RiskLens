from pathlib import Path
from typing import Protocol

import joblib
import numpy as np
import pandas as pd

from app.core.config import get_settings
from app.services.validation_service import MODEL_FEATURE_COLUMNS


class SupportsPredictProba(Protocol):
    def predict_proba(self, data: pd.DataFrame) -> np.ndarray:
        ...


class ModelNotLoadedError(RuntimeError):
    pass


class MissingModel:
    def __init__(self, model_path: str):
        self.model_path = model_path

    def predict_proba(self, data: pd.DataFrame) -> np.ndarray:
        raise ModelNotLoadedError(
            "RiskLens could not load a credit risk model. Place your trained joblib "
            f"Pipeline at {self.model_path} or set MODEL_PATH in backend/.env."
        )


class ModelService:
    def __init__(self, model_path: str | None = None):
        settings = get_settings()
        self.model_path = model_path or settings.model_path
        self.model: SupportsPredictProba | MissingModel = self._load_model()

    def _load_model(self) -> SupportsPredictProba | MissingModel:
        path = Path(self.model_path)
        if not path.exists() or path.stat().st_size == 0:
            return MissingModel(self.model_path)

        try:
            return joblib.load(path)
        except Exception:
            return MissingModel(self.model_path)

    def predict_default_probabilities(self, df: pd.DataFrame) -> list[float]:
        # The saved estimator should be a full scikit-learn Pipeline that handles
        # preprocessing for these feature names. Change MODEL_FEATURE_COLUMNS if
        # your real model was trained on a different schema.
        features = df[MODEL_FEATURE_COLUMNS]
        probabilities = self.model.predict_proba(features)
        return probabilities[:, 1].astype(float).tolist()
