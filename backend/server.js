import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import authRoutes from "./routes/auth.js";
import { pipeline } from "@xenova/transformers";

dotenv.config();
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

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

// Initialize the Express app and enable CORS

// Use CORS to allow requests from your Chrome extension's origin
app.use(cors());
// Use express.json() to parse JSON request bodies
app.use(express.json());

// A simple variable to hold our summarization pipeline
let summarizer;

// Create a dedicated async function to load the model
async function loadSummarizationModel() {
  try {
    // Load the summarization pipeline.
    // This will download the model on the first run, which may take a moment.
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-6-6");
    console.log("✅ Summarization model loaded successfully.");
  } catch (error) {
    console.error("❌ Failed to load the summarization model:", error);
  }
}

// Define the '/summarize' endpoint
app.post("/summarize", async (req, res) => {
  // Check if the model has been loaded
  if (!summarizer) {
    return res
      .status(503)
      .json({ error: "Summarization model is not ready yet." });
  }

  // Get the transcript from the request body
  const { transcript } = req.body;
  if (!transcript) {
    return res
      .status(400)
      .json({ error: "Missing 'transcript' in request body." });
  }

  console.log(
    `📦 Received transcript with ${transcript.split(" ").length} words.`
  );

  try {
    // Perform the summarization
    const summary = await summarizer(transcript, {
      max_length: 150,
      min_length: 30,
    });

    const summaryText = summary[0].summary_text;
    console.log(`📝 Generated Summary: ${summaryText}`);

    // Send the summary back to the extension
    res.json({ summary: summaryText });
  } catch (error) {
    console.error("❌ Error during summarization:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// Start the server and load the model
app.listen(port, () => {
  console.log(`🟢 Server is running at http://localhost:${port}`);
  // Start loading the model after the server has started
  loadSummarizationModel();
});
