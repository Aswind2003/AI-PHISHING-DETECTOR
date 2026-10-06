import os
import joblib
import pandas as pd
from features import extract_features, FEATURE_NAMES

MODEL_PATH = os.path.join("model", "phishing_model.joblib")

def predict_url(url: str) -> dict:
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError("Model not found. Run `python train.py` inside ml-service first.")
    model = joblib.load(MODEL_PATH)
    features = extract_features(url)
    row = pd.DataFrame([[features[k] for k in FEATURE_NAMES]], columns=FEATURE_NAMES)
    prediction = int(model.predict(row)[0])
    probabilities = model.predict_proba(row)[0]
    phishing_index = list(model.classes_).index(1)
    score = round(float(probabilities[phishing_index]) * 100, 1)

    reasons = []
    if features["has_ip"]: reasons.append("The hostname is an IP address")
    if not features["https"]: reasons.append("The URL does not use HTTPS")
    if features["suspicious_words"]: reasons.append("URL contains security-sensitive words")
    if features["at_symbol"]: reasons.append("URL contains an @ symbol")
    if features["subdomains"] > 2: reasons.append("URL has many subdomain labels")
    if features["url_length"] > 75: reasons.append("URL is unusually long")
    if not reasons: reasons.append("No listed URL heuristic was triggered")

    return {
        "url": url,
        "prediction": "POTENTIAL PHISHING" if prediction == 1 else "LIKELY LEGITIMATE",
        "riskScore": score,
        "reasons": reasons,
        "features": features,
        "disclaimer": "Model output is an estimate, not a safety guarantee. Do not enter credentials based only on this result."
    }
