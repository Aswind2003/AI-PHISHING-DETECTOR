# AI Phishing Website & URL Detector

A final-year mini-project prototype using React, Express, Python, FastAPI, scikit-learn, and MongoDB (optional).

## Important limitations
- The included CSV is a tiny **synthetic demonstration dataset**, not a real-world benchmark.
- Model predictions and probability-like scores are not proof that a URL is safe or malicious.
- Do not visit suspicious URLs. This app analyzes URL text only; it does not fetch websites.
- Replace the demo dataset with a properly licensed, labeled dataset and evaluate on a held-out test set before academic submission.

## Requirements
- Node.js 18+
- Python 3.10+
- MongoDB (optional; without it, scans still work but are not saved)

## 1. Run the Python ML service
```bash
cd ml-service
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
python train.py
uvicorn app:app --reload --port 8000
```
API docs: http://127.0.0.1:8000/docs

## 2. Run the Node API
In a second terminal:
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```
On macOS/Linux use `cp .env.example .env`.
Backend: http://localhost:5000

MongoDB is optional. Set `MONGODB_URI` in `.env` to persist scans.

## 3. Run the React frontend
In a third terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in terminal (usually http://localhost:5173).

## API
`POST http://localhost:5000/api/scan`
```json
{"url":"https://example.com"}
```
`GET http://localhost:5000/api/history`

## Project structure
- `frontend/`: React user interface
- `backend/`: Express API and optional MongoDB history
- `ml-service/`: URL feature extraction, Random Forest training and FastAPI inference
