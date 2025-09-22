// backend/routers/meetRouter.js (Updated)

import express from "express";
import meetModel from "../Models/meetModel.js";
import { auth } from "../middlewares/auth.js";
import Meeting from "../Models/meetModel.js";

const router = express.Router();

// Route to get all meetings for the logged-in user
router.get("/usermeetings", auth, async (req, res) => {
  try {
    console.log(`Fetching meetings for user: ${req.user._id}`);
    const meetings = await meetModel
      .find({ user: req.user._id })
      .sort({ start: -1 });
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching user meetings:", error.message);
    res.status(500).json({ message: "Server error while fetching meetings" });
  }
});

router.post("/add", (req, res) => {
  console.log(req.body);

  new meetModel(req.body)
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//getall
router.get("/", (req, res) => {
  meetModel
    .find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// : denotes url

router.get("/getbyid/:id", (req, res) => {
  meetModel
    .findById(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
//delete
router.delete("/delete/:id", (req, res) => {
  meetModel
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update
router.put("/update/:id", (req, res) => {
  meetModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.post("/summarize", async (req, res) => {
  const { transcript } = req.body;
  console.log("Transcript received for summarization.");

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required." });
  }

  try {
    const result = await hf.summarization({
      model: "sshleifer/distilbart-cnn-12-6",
      inputs: transcript,
      parameters: {
        min_length: 50,
        max_length: 150,
      },
    });

    const summary = result.summary_text;
    console.log("Summary generated successfully.");
    res.status(200).json({ summary: summary });
  } catch (error) {
    console.error("Error during summarization:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// ======== FIXED UPLOAD ROUTE ========
router.post("/upload", auth, async (req, res) => {
  try {
    // 1. We no longer need userId from the body.
    const { transcript, meetUrl, startTime, endTime } = req.body;

    // 2. The `auth` middleware provides the secure user ID at `req.user._id`.
    //    We use this to create the new meeting.
    const newMeeting = new Meeting({
      user: req.user._id, // 3. Changed 'userId' to 'user' to match the schema.
      transcript,
      meetUrl,
      startTime,
      endTime,
    });

    await newMeeting.save();
    res
      .status(201)
      .json({ message: "Meeting saved successfully", meeting: newMeeting });
  } catch (error) {
    // This is where your original error was being logged. It's now fixed.
    console.error("Error saving meeting:", error);
    res.status(500).json({ message: "Server error while saving meeting" });
  }
});

export default router;