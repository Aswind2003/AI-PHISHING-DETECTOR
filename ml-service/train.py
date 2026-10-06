import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from features import extract_features, FEATURE_NAMES

DATA_PATH = os.path.join("dataset", "urls.csv")
MODEL_DIR = "model"
MODEL_PATH = os.path.join(MODEL_DIR, "phishing_model.joblib")

def main():
    data = pd.read_csv(DATA_PATH)
    if not {"url", "label"}.issubset(data.columns):
        raise ValueError("CSV must contain url,label columns")
    if data["label"].nunique() != 2:
        raise ValueError("Training data must contain both labels 0 and 1")

    X = pd.DataFrame([extract_features(str(u)) for u in data["url"]], columns=FEATURE_NAMES)
    y = data["label"].astype(int)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    model = RandomForestClassifier(
        n_estimators=150, random_state=42, class_weight="balanced"
    )
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    print("Demo dataset accuracy:", round(accuracy_score(y_test, pred), 3))
    print(classification_report(y_test, pred, zero_division=0))
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")
    print("WARNING: tiny synthetic demo dataset; metrics are not evidence of real-world performance.")

if __name__ == "__main__":
    main()
