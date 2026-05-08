from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


APP_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    app_name: str = "RiskLens"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./risklens.db"
    model_path: str = str(APP_DIR / "artifacts" / "credit_risk_model.joblib")
    frontend_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
