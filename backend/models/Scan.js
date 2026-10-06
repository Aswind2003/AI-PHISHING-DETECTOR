import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  url: { type: String, required: true },
  prediction: { type: String, required: true },
  riskScore: { type: Number, required: true },
  reasons: [String],
  scannedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Scan", scanSchema);
