import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// Summarization Route
app.post("/summarize", async (req, res) => {
  try {
    const text = req.body.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Transcript is empty!" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`, // ✅ API key env me rakho
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const result = await response.json();
    res.json({ summary: result[0]?.summary_text || "Summary not available." });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// ✅ Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
