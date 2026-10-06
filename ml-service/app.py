from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, HttpUrl
from predictor import predict_url

app = FastAPI(title="AI Phishing URL Detector", version="1.0.0")

class ScanRequest(BaseModel):
    url: str = Field(min_length=8, max_length=2048)

@app.get("/")
def root():
    return {"message": "ML service is running"}

@app.post("/predict")
def predict(request: ScanRequest):
    url = request.url.strip()
    try:
        parsed = HttpUrl(url)
    except Exception:
        raise HTTPException(status_code=400, detail="Enter a valid http:// or https:// URL")
    try:
        return predict_url(str(parsed))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=500, detail="Prediction failed")
