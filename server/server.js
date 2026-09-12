import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import incidentRoutes from "./routes/incidentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow one or more comma-separated origins (e.g. your Vercel frontend URL)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "SafeRoute API is running" });
});

app.use("/api/incidents", incidentRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
