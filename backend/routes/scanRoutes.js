import express from "express";
import Scan from "../models/Scan.js";

const router = express.Router();
const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

function validHttpUrl(value) {
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

router.post("/", async (req, res) => {
  const url = typeof req.body?.url === "string" ? req.body.url.trim() : "";
  if (!validHttpUrl(url)) {
    return res.status(400).json({ message: "Please provide a valid http:// or https:// URL." });
  }

  try {
    const mlResponse = await fetch(`${ML_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(15000)
    });
    const result = await mlResponse.json();
    if (!mlResponse.ok) return res.status(mlResponse.status).json(result);

    // Persistence is optional: prediction still works if MongoDB is unavailable.
    try {
      await Scan.create({
        url: result.url,
        prediction: result.prediction,
        riskScore: result.riskScore,
        reasons: result.reasons
      });
    } catch (dbError) {
      console.warn("Scan was not saved (database unavailable):", dbError.message);
    }
    res.json(result);
  } catch (error) {
    res.status(503).json({ message: "Could not reach the ML service. Make sure it is running on port 8000." });
  }
});

router.get("/history", async (_req, res) => {
  try {
    const history = await Scan.find().sort({ scannedAt: -1 }).limit(20).lean();
    res.json(history);
  } catch {
    res.json([]);
  }
});

export default router;
