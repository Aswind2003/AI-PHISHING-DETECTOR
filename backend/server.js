import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import scanRoutes from "./routes/scanRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));
app.get("/", (_req, res) => res.json({ message: "Phishing detector API is running" }));
app.use("/api/scan", scanRoutes);

const PORT = process.env.PORT || 5000;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.warn("MongoDB unavailable; history will not persist:", err.message));
}
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
