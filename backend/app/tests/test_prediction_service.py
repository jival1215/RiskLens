from app.services.prediction_service import assign_risk_level, recommendation_for_risk


def test_assign_risk_level_thresholds() -> None:
    assert assign_risk_level(0.19) == "Low Risk"
    assert assign_risk_level(0.20) == "Medium Risk"
    assert assign_risk_level(0.49) == "Medium Risk"
    assert assign_risk_level(0.50) == "High Risk"


def test_recommendation_logic() -> None:
    assert recommendation_for_risk("Low Risk") == "Approve"
    assert recommendation_for_risk("Medium Risk") == "Manual Review"
    assert recommendation_for_risk("High Risk") == "Reject / Additional Review"
