import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';
import UserRouter from './routers/userRouter.js';
import meetRouter from './routers/meetRouter.js';
import meetModel from './Models/meetModel.js';

let summarizer;
let lastReportedPercent = -1; // Variable to track progress

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "chrome-extension://*",
      "https://meet.google.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json({ limit: "50mb" }));

app.use("/user", UserRouter);
app.use("/meetings", meetRouter);

async function loadSummarizationModel() {
  try {
    console.log("⏳ Loading summarization model...");
    // Let's try a smaller model to isolate if this is a memory issue.
    summarizer = await pipeline("summarization", "Xenova/t5-small", {
      quantized: true, // Use quantized model for better performance
      progress_callback: (status) => {
        if (status.status === 'progress' && typeof status.progress === 'number') {
          const percent = Math.round(status.progress);
          // Only log the progress if it has changed to avoid spamming the console
          if (percent > lastReportedPercent) {
            console.log(`Download progress: ${percent}%`);
            lastReportedPercent = percent;
          }
        }
      }
    });
    console.log("✅ Summarization model loaded successfully.");
    return true;
  } catch (error) {
    console.error("❌ Failed to load the summarization model:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

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

    // --- SAVE TO DATABASE ---
    try {
      console.log('💾 Saving summary and transcript to database...');
      const newMeeting = new meetModel({
        name: `Meeting Summary - ${new Date().toLocaleString()}`,
        description: fullTranscript,
        summary: summaryText,
        code: `MEET-${Date.now()}`,
        start: new Date(),
        end: new Date(),
      });
      await newMeeting.save();
      console.log('✅ Meeting saved successfully to database.');
    } catch (dbError) {
      console.error('❌ Database save error:', dbError.message);
      // Decide if you want to throw an error back to the client if DB save fails
      // For now, we'll log it and still return the summary
    }
    // --- END SAVE TO DATABASE ---

    // Send the summary back to the extension
    res.json({ summary: summaryText });
  } catch (error) {
    console.error("❌ Error during summarization:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging, throwing an error, or other logic here
  process.exit(1); // It is advisable to exit the process after an uncaught exception
});

// Initialize the model and start server
async function startServer() {
  try {
    // Load the model before server starts
    const modelLoaded = await loadSummarizationModel();
    if (!modelLoaded) {
      console.log("⚠️ Server will continue running but summarization feature may not work.");
    }

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
