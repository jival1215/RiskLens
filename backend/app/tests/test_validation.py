import pandas as pd
import pytest
from fastapi import HTTPException

from app.services.validation_service import REQUIRED_COLUMNS, validate_dataframe


def valid_row() -> dict:
    return {
        "applicant_id": "APP-1001",
        "Time": 0.0,
        **{f"V{i}": 0.0 for i in range(1, 29)},
        "Amount": 120.42,
    }


def test_validate_dataframe_accepts_expected_schema() -> None:
    df = pd.DataFrame([valid_row()])
    validate_dataframe(df)
    assert list(df.columns) == REQUIRED_COLUMNS


def test_validate_dataframe_reports_missing_columns() -> None:
    row = valid_row()
    row.pop("Amount")
    df = pd.DataFrame([row])

    with pytest.raises(HTTPException) as exc:
        validate_dataframe(df)

    assert exc.value.status_code == 422
    assert "Amount" in exc.value.detail["missing_columns"]
