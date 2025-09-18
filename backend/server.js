import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { pipeline } from "@xenova/transformers";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware Setup (CORRECT ORDER) ---
// These must come BEFORE your API routes to work properly.
// CORS setup to allow all origins (for development/testing only)
app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Explicitly handle preflight OPTIONS requests for all routes
app.options("*", cors({ origin: '*' }));
app.use(express.json({ limit: "50mb" })); // Use express.json() to parse JSON request bodies

// --- AI Model Loading ---
let summarizer;

async function loadSummarizationModel() {
  try {
    console.log("⏳ Loading summarization model...");
    // This will download the model on the first run, which may take time.
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-6-6");
    console.log("✅ Summarization model loaded successfully.");
  } catch (error) {
    console.error("❌ Failed to load the summarization model:", error);
  }
}

// --- API Routes ---

app.post("/summarize", async (req, res) => {
  if (!summarizer) {
    return res
      .status(503)
      .json({
        error:
          "Summarization model is not ready yet. Please try again in a moment.",
      });
  }

  const { transcript } = req.body;
  if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
    return res
      .status(400)
      .json({
        error:
          "Missing or invalid 'transcript' in request body. It must be an array.",
      });
  }

  // Combine the transcript array into a single string for summarization
  const fullTranscript = transcript
    .map((item) => `${item.speaker || "Speaker"}: ${item.text}`)
    .join("\n");

  console.log(
    `📦 Received transcript with ${fullTranscript.split(" ").length} words.`
  );

  try {
    console.log("📝 Generating summary...");
    const summary = await summarizer(fullTranscript, {
      max_length: 200,
      min_length: 40,
    });

    const summaryText = summary[0].summary_text;
    console.log(`✅ Summary Generated: ${summaryText}`);

    // Send the summary back to the extension
    res.json({ summary: summaryText });
  } catch (error) {
    console.error("❌ Error during summarization:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// --- Server and Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
      // Start loading the AI model after the server has started
      loadSummarizationModel();
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
