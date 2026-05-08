from io import BytesIO

import pandas as pd
from fastapi import HTTPException, UploadFile, status


# Customize these columns if your trained scikit-learn Pipeline expects a
# different feature schema. Keep applicant_id out of MODEL_FEATURE_COLUMNS.
ID_COLUMN = "applicant_id"
MODEL_FEATURE_COLUMNS = [
    "Time",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
    "V18",
    "V19",
    "V20",
    "V21",
    "V22",
    "V23",
    "V24",
    "V25",
    "V26",
    "V27",
    "V28",
    "Amount",
]
REQUIRED_COLUMNS = MODEL_FEATURE_COLUMNS
NUMERIC_COLUMNS = MODEL_FEATURE_COLUMNS
CATEGORICAL_COLUMNS: list[str] = []

EXPECTED_SCHEMA = {
    "applicant_id": "Optional unique transaction/application identifier used by RiskLens. If omitted, RiskLens creates TXN-000001 style IDs.",
    "Time": "Seconds elapsed between this transaction and the first transaction in the source dataset",
    "V1": "PCA-transformed transaction feature V1",
    "V2": "PCA-transformed transaction feature V2",
    "V3": "PCA-transformed transaction feature V3",
    "V4": "PCA-transformed transaction feature V4",
    "V5": "PCA-transformed transaction feature V5",
    "V6": "PCA-transformed transaction feature V6",
    "V7": "PCA-transformed transaction feature V7",
    "V8": "PCA-transformed transaction feature V8",
    "V9": "PCA-transformed transaction feature V9",
    "V10": "PCA-transformed transaction feature V10",
    "V11": "PCA-transformed transaction feature V11",
    "V12": "PCA-transformed transaction feature V12",
    "V13": "PCA-transformed transaction feature V13",
    "V14": "PCA-transformed transaction feature V14",
    "V15": "PCA-transformed transaction feature V15",
    "V16": "PCA-transformed transaction feature V16",
    "V17": "PCA-transformed transaction feature V17",
    "V18": "PCA-transformed transaction feature V18",
    "V19": "PCA-transformed transaction feature V19",
    "V20": "PCA-transformed transaction feature V20",
    "V21": "PCA-transformed transaction feature V21",
    "V22": "PCA-transformed transaction feature V22",
    "V23": "PCA-transformed transaction feature V23",
    "V24": "PCA-transformed transaction feature V24",
    "V25": "PCA-transformed transaction feature V25",
    "V26": "PCA-transformed transaction feature V26",
    "V27": "PCA-transformed transaction feature V27",
    "V28": "PCA-transformed transaction feature V28",
    "Amount": "Transaction amount",
}


async def read_and_validate_csv(file: UploadFile) -> pd.DataFrame:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a CSV file.",
        )

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded CSV is empty.")

    try:
        df = pd.read_csv(BytesIO(contents))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse CSV: {exc}",
        ) from exc

    validate_dataframe(df)
    return df


def validate_dataframe(df: pd.DataFrame) -> None:
    if df.empty:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV must contain at least one row.")

    missing = [column for column in REQUIRED_COLUMNS if column not in df.columns]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "CSV is missing required columns.",
                "missing_columns": missing,
                "expected_schema": EXPECTED_SCHEMA,
            },
        )

    if ID_COLUMN not in df.columns:
        df.insert(0, ID_COLUMN, [f"TXN-{index + 1:06d}" for index in range(len(df))])

    duplicate_ids = df[ID_COLUMN].astype(str).duplicated()
    if duplicate_ids.any():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="applicant_id values must be unique within an upload.",
        )

    for column in NUMERIC_COLUMNS:
        converted = pd.to_numeric(df[column], errors="coerce")
        if converted.isna().any():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Column '{column}' must contain numeric values only.",
            )
        df[column] = converted

    for column in CATEGORICAL_COLUMNS:
        if df[column].isna().any() or (df[column].astype(str).str.strip() == "").any():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Column '{column}' must not contain blank values.",
            )
